import { createServerFn } from "@tanstack/react-start";

type Track = { title: string | null; artist: string | null; art: string | null };

type ProviderResult = {
  title: string | null;
  artist: string | null;
  album: string | null;
  artwork: string | null;
  history: Track[];
};

const cache = new Map<string, { at: number; value: unknown }>();

function readCache<T>(key: string, ttlMs: number): T | null {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
  return null;
}

function writeCache(key: string, value: unknown) {
  cache.set(key, { at: Date.now(), value });
  if (cache.size > 200) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) cache.delete(oldest[0]);
  }
}

function decodeCdata(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseTritonXml(xml: string): ProviderResult {
  const blocks = xml.match(/<nowplaying-info\b[\s\S]*?<\/nowplaying-info>/g) ?? [];
  const tracks: Track[] = [];
  for (const block of blocks) {
    const props: Record<string, string> = {};
    const re = /<property\s+name="([^"]+)"\s*>([\s\S]*?)<\/property>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(block))) props[m[1]] = decodeCdata(m[2]);
    const title = props["cue_title"] || null;
    const artist = props["track_artist_name"] || null;
    if (!title && !artist) continue;
    tracks.push({ title, artist, art: props["track_cover_url"] || null });
  }
  const current = tracks[0];
  return {
    title: current?.title ?? null,
    artist: current?.artist ?? null,
    album: null,
    artwork: current?.art ?? null,
    history: tracks.slice(1, 8),
  };
}

export const fetchTritonMetadata = createServerFn({ method: "GET" })
  .inputValidator((data: { mountName: string }) => {
    if (!/^[A-Za-z0-9_-]{2,40}$/.test(data.mountName)) throw new Error("bad mount");
    return data;
  })
  .handler(async ({ data }): Promise<ProviderResult> => {
    const key = `triton:${data.mountName}`;
    const cached = readCache<ProviderResult>(key, 15000);
    if (cached) return cached;

    const url = `https://np.tritondigital.com/public/nowplaying?mountName=${encodeURIComponent(
      data.mountName,
    )}&numberToFetch=7&eventType=track`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`triton ${res.status}`);
      const value = parseTritonXml(await res.text());
      writeCache(key, value);
      return value;
    } catch {
      return { title: null, artist: null, album: null, artwork: null, history: [] };
    } finally {
      clearTimeout(timer);
    }
  });

const ALLOWED_ICY_HOSTS = new Set([
  "streaming.radioempresabrasil.com.br",
  "streams.kut.org",
]);

function splitStreamTitle(raw: string): { artist: string | null; title: string | null } {
  const value = raw.trim();
  if (!value) return { artist: null, title: null };
  const idx = value.indexOf(" - ");
  if (idx > 0 && idx < value.length - 3) {
    return {
      artist: value.slice(0, idx).trim() || null,
      title: value.slice(idx + 3).trim() || null,
    };
  }
  return { artist: null, title: value };
}

export const fetchIcyMetadata = createServerFn({ method: "GET" })
  .inputValidator((data: { streamUrl: string }) => {
    const url = new URL(data.streamUrl);
    if (url.protocol !== "https:" || !ALLOWED_ICY_HOSTS.has(url.hostname)) {
      throw new Error("stream not allowed");
    }
    return { streamUrl: url.toString() };
  })
  .handler(async ({ data }): Promise<ProviderResult> => {
    const key = `icy:${data.streamUrl}`;
    const cached = readCache<ProviderResult>(key, 12000);
    if (cached) return cached;

    const empty: ProviderResult = {
      title: null,
      artist: null,
      album: null,
      artwork: null,
      history: [],
    };

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    try {
      const res = await fetch(data.streamUrl, {
        headers: { "Icy-MetaData": "1" },
        signal: ctrl.signal,
      });
      const metaint = Number(res.headers.get("icy-metaint") ?? "0");
      if (!res.ok || !metaint || !res.body) {
        await res.body?.cancel();
        return empty;
      }

      const reader = res.body.getReader();
      let skipped = 0;
      let pending = new Uint8Array(0);

      const pull = async (): Promise<Uint8Array | null> => {
        const { value, done } = await reader.read();
        return done ? null : (value ?? new Uint8Array(0));
      };

      // skip audio payload up to the first metadata block
      while (skipped < metaint) {
        const chunk = await pull();
        if (!chunk) {
          await reader.cancel();
          return empty;
        }
        const need = metaint - skipped;
        if (chunk.length > need) {
          pending = chunk.slice(need);
          skipped = metaint;
        } else {
          skipped += chunk.length;
        }
      }

      while (pending.length < 1) {
        const chunk = await pull();
        if (!chunk) {
          await reader.cancel();
          return empty;
        }
        pending = chunk;
      }

      const blockLength = pending[0] * 16;
      let meta = pending.slice(1);
      while (meta.length < blockLength) {
        const chunk = await pull();
        if (!chunk) break;
        const merged = new Uint8Array(meta.length + chunk.length);
        merged.set(meta);
        merged.set(chunk, meta.length);
        meta = merged;
      }
      await reader.cancel();

      const text = new TextDecoder("utf-8", { fatal: false }).decode(
        meta.slice(0, blockLength),
      );
      const match = text.match(/StreamTitle='([^']*)'/);
      if (!match) return empty;
      const parsed = splitStreamTitle(match[1]);
      const value: ProviderResult = {
        title: parsed.title,
        artist: parsed.artist,
        album: null,
        artwork: null,
        history: [],
      };
      writeCache(key, value);
      return value;
    } catch {
      return empty;
    } finally {
      clearTimeout(timer);
    }
  });

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(.*?\)|\[.*?\]/g, " ")
    .replace(/\b(feat|ft|featuring|with)\b.*$/i, " ")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export const resolveArtwork = createServerFn({ method: "GET" })
  .inputValidator((data: { artist: string; title: string }) => ({
    artist: String(data.artist ?? "").slice(0, 120),
    title: String(data.title ?? "").slice(0, 120),
  }))
  .handler(async ({ data }): Promise<{ artwork: string | null }> => {
    const artist = normalizeText(data.artist);
    const title = normalizeText(data.title);
    if (!title) return { artwork: null };

    const key = `art:${artist}|${title}`;
    const cached = readCache<{ artwork: string | null }>(key, 24 * 60 * 60 * 1000);
    if (cached) return cached;

    const term = encodeURIComponent(`${artist} ${title}`.trim());
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${term}&entity=song&limit=5`,
        { signal: ctrl.signal },
      );
      if (!res.ok) throw new Error(`itunes ${res.status}`);
      const json = (await res.json()) as {
        results?: Array<{
          artistName?: string;
          trackName?: string;
          artworkUrl100?: string;
        }>;
      };
      const match = (json.results ?? []).find((r) => {
        const rTitle = normalizeText(r.trackName ?? "");
        const rArtist = normalizeText(r.artistName ?? "");
        const titleOk = rTitle && (rTitle === title || rTitle.includes(title) || title.includes(rTitle));
        const artistOk = !artist || (rArtist && (rArtist.includes(artist) || artist.includes(rArtist)));
        return Boolean(titleOk && artistOk && r.artworkUrl100);
      });
      const artwork = match?.artworkUrl100
        ? match.artworkUrl100.replace("100x100bb", "600x600bb")
        : null;
      const value = { artwork };
      writeCache(key, value);
      return value;
    } catch {
      return { artwork: null };
    } finally {
      clearTimeout(timer);
    }
  });
