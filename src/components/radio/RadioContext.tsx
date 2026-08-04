import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type Hls from "hls.js";
import {
  DEFAULT_STATION_ID,
  getStation,
  stationPlaceholder,
  type StationConfig,
} from "../../data/stations";
import {
  fetchIcyMetadata,
  fetchTritonMetadata,
  resolveArtwork,
} from "../../lib/stationMetadata.functions";

const WP_URL =
  "https://country.fazenda.rodeo/wp-json/wp/v2/posts?_embed&per_page=7&categories=26";

export const LOGO_URL = "https://country.fazenda.rodeo/player/logo.webp";
export const PLAY_URL = "https://country.fazenda.rodeo/player/play.webp";
export const PAUSE_URL = "https://country.fazenda.rodeo/player/pause.webp";

const IDLE_DELAY = 4000;
const STORAGE_KEY = "selectedStationId";
const LIVE_LABEL = "Programação ao vivo";
const UNAVAILABLE_MESSAGE =
  "Esta rádio não está disponível na sua região ou está temporariamente fora do ar.";

export type NowPlaying = { title: string; artist: string; art: string };
export type PlayingNext = {
  title: string;
  artist: string;
  art: string;
  album?: string;
};
export type HistoryItem = { song: NowPlaying };
export type NewsItem = { link: string; title: string; thumb: string };

type Ctx = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  volume: number;
  nowPlaying: NowPlaying;
  playingNext: PlayingNext | null;
  history: HistoryItem[];
  news: NewsItem[];
  newsError: boolean;
  analyserRef: React.RefObject<AnalyserNode | null>;
  analyserReady: boolean;
  hideUI: boolean;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  resetIdle: () => void;
  openLightbox: (src: string) => void;
  closeLightbox: () => void;
  lightboxSrc: string | null;
  station: StationConfig;
  selectedStationId: string;
  selectStation: (stationId: string) => Promise<void>;
  streamError: string | null;
  retryStation: () => void;
  fallbackStationId: string | null;
  goToFallbackStation: () => void;
};

const RadioCtx = createContext<Ctx | null>(null);

export function useRadio() {
  const c = useContext(RadioCtx);
  if (!c) throw new Error("useRadio outside RadioProvider");
  return c;
}

function idleTrack(station: StationConfig): NowPlaying {
  return {
    title: station.fullName,
    artist: LIVE_LABEL,
    art: stationPlaceholder(station),
  };
}

export function RadioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generationRef = useRef(0);
  const lastWorkingRef = useRef<string>(DEFAULT_STATION_ID);

  const [selectedStationId, setSelectedStationId] = useState(DEFAULT_STATION_ID);
  const station = getStation(selectedStationId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    title: "Loading...",
    artist: "FAZENDA RODEO",
    art: "",
  });
  const [playingNext, setPlayingNext] = useState<PlayingNext | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsError, setNewsError] = useState(false);
  const [analyserReady, setAnalyserReady] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [fallbackStationId, setFallbackStationId] = useState<string | null>(null);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // --- idle timer ---
  const startIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setHideUI(true), IDLE_DELAY);
  }, []);

  const resetIdle = useCallback(() => {
    setHideUI(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isPlayingRef.current) startIdle();
  }, [startIdle]);

  // --- single audio graph: attaches a station stream to the one <audio> ---
  const attachStream = useCallback(
    async (target: StationConfig, generation: number, autoplay: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.crossOrigin = "anonymous";
      let ready: Promise<void> = Promise.resolve();

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      audio.removeAttribute("src");
      audio.load();

      if (target.streamType === "hls") {
        const mod = await import("hls.js");
        if (generationRef.current !== generation) return;
        const HlsCtor = mod.default;
        if (HlsCtor.isSupported()) {
          const instance = new HlsCtor({
            liveDurationInfinity: true,
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsRef.current = instance;
          instance.on(HlsCtor.Events.ERROR, (_e, dataErr) => {
            if (!dataErr.fatal) return;
            if (generationRef.current !== generation) return;
            instance.destroy();
            if (hlsRef.current === instance) hlsRef.current = null;
            setStreamError(UNAVAILABLE_MESSAGE);
            setIsPlaying(false);
            isPlayingRef.current = false;
          });
          ready = new Promise<void>((resolve) => {
            instance.on(HlsCtor.Events.MANIFEST_PARSED, () => resolve());
            setTimeout(resolve, 6000);
          });
          instance.loadSource(target.streamUrl);
          instance.attachMedia(audio);
        } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
          audio.src = target.streamUrl;
          audio.load();
        } else {
          setStreamError(UNAVAILABLE_MESSAGE);
          return;
        }
      } else {
        audio.src = target.streamUrl;
        audio.load();
      }

      if (!autoplay) return;
      await ready;
      if (generationRef.current !== generation) return;
      try {
        await audio.play();
        if (generationRef.current !== generation) return;
        setIsPlaying(true);
        isPlayingRef.current = true;
        lastWorkingRef.current = target.id;
        startIdle();
      } catch {
        if (generationRef.current !== generation) return;
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    },
    [startIdle],
  );

  // --- initial mount: restore selection, never autoplay ---
  useEffect(() => {
    const generation = ++generationRef.current;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    const initial = stored && getStation(stored).id === stored ? stored : DEFAULT_STATION_ID;
    const target = getStation(initial);
    setSelectedStationId(initial);
    lastWorkingRef.current = initial;
    void attachStream(target, generation, false);

    return () => {
      generationRef.current++;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [attachStream]);

  // --- audio element errors ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onError = () => {
      // ignore the synthetic error fired when we clear the src during a switch
      if (!audio.currentSrc && !audio.getAttribute("src")) return;
      if (audio.error?.code === MediaError.MEDIA_ERR_ABORTED) return;
      setStreamError(UNAVAILABLE_MESSAGE);
      setIsPlaying(false);
      isPlayingRef.current = false;
    };

    audio.addEventListener("error", onError);
    return () => audio.removeEventListener("error", onError);
  }, []);

  // volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // window listeners for interactions
  useEffect(() => {
    const onEv = () => resetIdle();
    window.addEventListener("mousemove", onEv);
    window.addEventListener("touchstart", onEv);
    window.addEventListener("scroll", onEv);
    return () => {
      window.removeEventListener("mousemove", onEv);
      window.removeEventListener("touchstart", onEv);
      window.removeEventListener("scroll", onEv);
    };
  }, [resetIdle]);

  const ensureAudioGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioContextRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ac = new AC();
      audioContextRef.current = ac;
      if (!mediaSourceRef.current) {
        mediaSourceRef.current = ac.createMediaElementSource(audio);
      }
      const analyser = ac.createAnalyser();
      analyser.fftSize = 128;
      mediaSourceRef.current.connect(analyser);
      analyser.connect(ac.destination);
      analyserRef.current = analyser;
      setAnalyserReady(true);
    }
    const ac = audioContextRef.current;
    if (ac && ac.state === "suspended") void ac.resume();
  }, []);

  // --- togglePlay ---
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureAudioGraph();

    if (audio.paused) {
      setStreamError(null);
      void audio.play().then(
        () => {
          lastWorkingRef.current = selectedStationId;
        },
        () => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        },
      );
      setIsPlaying(true);
      isPlayingRef.current = true;
      startIdle();
    } else {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setHideUI(false);
    }
  }, [ensureAudioGraph, selectedStationId, startIdle]);

  // --- station switching (single source of truth) ---
  const selectStation = useCallback(
    async (stationId: string) => {
      const target = getStation(stationId);
      if (!target) return;

      const generation = ++generationRef.current;
      const audio = audioRef.current;

      if (audio && !audio.paused) audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;

      setSelectedStationId(target.id);
      setStreamError(null);
      setFallbackStationId(
        lastWorkingRef.current !== target.id ? lastWorkingRef.current : null,
      );
      setPlayingNext(null);
      setHistory([]);
      setNowPlaying(idleTrack(target));

      try {
        window.localStorage.setItem(STORAGE_KEY, target.id);
      } catch {
        /* storage unavailable */
      }

      ensureAudioGraph();
      await attachStream(target, generation, true);
    },
    [attachStream, ensureAudioGraph],
  );

  const retryStation = useCallback(() => {
    void selectStation(selectedStationId);
  }, [selectStation, selectedStationId]);

  const goToFallbackStation = useCallback(() => {
    void selectStation(fallbackStationId ?? DEFAULT_STATION_ID);
  }, [fallbackStationId, selectStation]);

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v);
      resetIdle();
    },
    [resetIdle],
  );

  const openLightbox = useCallback((src: string) => {
    if (!src) return;
    setLightboxSrc(src);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null);
    document.body.style.overflow = "auto";
  }, []);

  // --- metadata polling, scoped to the selected station ---
  useEffect(() => {
    const target = getStation(selectedStationId);
    const generation = generationRef.current;
    let cancelled = false;
    let controller: AbortController | null = null;
    const stale = () => cancelled || generationRef.current !== generation;

    async function loadFazenda() {
      if (!target.metadataUrl) return;
      controller?.abort();
      controller = new AbortController();
      try {
        const r = await fetch(target.metadataUrl, { signal: controller.signal });
        if (!r.ok) throw new Error(String(r.status));
        const data = await r.json();
        if (stale()) return;
        const s = data.now_playing.song;
        setNowPlaying({
          title: s.title || target.fullName,
          artist: s.artist || LIVE_LABEL,
          art: s.art || stationPlaceholder(target),
        });
        const nextSong = data.playing_next?.song;
        setPlayingNext(
          nextSong?.title
            ? {
                title: nextSong.title,
                artist: nextSong.artist,
                art: nextSong.art,
                album: nextSong.album,
              }
            : null,
        );
        const items: HistoryItem[] = (data.song_history ?? [])
          .slice(0, 7)
          .map((it: { song: NowPlaying }) => ({ song: it.song }));
        setHistory(items);
      } catch {
        if (!stale()) setNowPlaying((prev) => (prev.title ? prev : idleTrack(target)));
      }
    }

    async function withArtwork(
      artist: string | null,
      title: string | null,
      provided: string | null,
    ): Promise<string> {
      if (provided) return provided;
      if (artist && title) {
        try {
          const res = await resolveArtwork({ data: { artist, title } });
          if (res.artwork) return res.artwork;
        } catch {
          /* resolver unavailable */
        }
      }
      return stationPlaceholder(target);
    }

    async function loadExternal() {
      try {
        const result =
          target.metadataAdapter === "triton"
            ? await fetchTritonMetadata({ data: { mountName: target.mountName ?? "" } })
            : await fetchIcyMetadata({ data: { streamUrl: target.streamUrl } });
        if (stale()) return;

        if (!result.title && !result.artist) {
          setNowPlaying(idleTrack(target));
          setHistory([]);
          setPlayingNext(null);
          return;
        }

        const art = await withArtwork(result.artist, result.title, result.artwork);
        if (stale()) return;
        setNowPlaying({
          title: result.title ?? target.fullName,
          artist: result.artist ?? LIVE_LABEL,
          art,
        });
        setPlayingNext(null);

        const items = await Promise.all(
          result.history.slice(0, 7).map(async (track) => ({
            song: {
              title: track.title ?? target.fullName,
              artist: track.artist ?? LIVE_LABEL,
              art: await withArtwork(track.artist, track.title, track.art),
            },
          })),
        );
        if (stale()) return;
        setHistory(items);
      } catch {
        if (!stale()) setNowPlaying(idleTrack(target));
      }
    }

    const load = target.metadataAdapter === "fazenda" ? loadFazenda : loadExternal;
    void load();
    const id = setInterval(() => void load(), 15000);

    return () => {
      cancelled = true;
      controller?.abort();
      clearInterval(id);
    };
  }, [selectedStationId]);

  // --- WordPress news (once) ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(WP_URL);
        const posts = await r.json();
        if (cancelled) return;
        const items: NewsItem[] = posts.map(
          (post: {
            link: string;
            title: { rendered: string };
            _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
          }) => ({
            link: post.link,
            title: post.title.rendered,
            thumb:
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
              "https://via.placeholder.com/60?text=News",
          }),
        );
        setNews(items);
        setNewsError(false);
      } catch {
        if (!cancelled) setNewsError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value: Ctx = {
    audioRef,
    isPlaying,
    volume,
    nowPlaying,
    playingNext,
    history,
    news,
    newsError,
    analyserRef,
    analyserReady,
    hideUI,
    togglePlay,
    setVolume,
    resetIdle,
    openLightbox,
    closeLightbox,
    lightboxSrc,
    station,
    selectedStationId,
    selectStation,
    streamError,
    retryStation,
    fallbackStationId,
    goToFallbackStation,
  };

  return (
    <RadioCtx.Provider value={value}>
      {children}
      <audio id="stream" ref={audioRef} crossOrigin="anonymous" preload="none" />
    </RadioCtx.Provider>
  );
}
