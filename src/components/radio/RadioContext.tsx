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

const STREAM_URL = "https://live.fazenda.rodeo/hls/country/live.m3u8";
const NOWPLAYING_URL = "https://live.fazenda.rodeo/api/nowplaying/country";
const WP_URL =
  "https://country.fazenda.rodeo/wp-json/wp/v2/posts?_embed&per_page=7&categories=26";

export const LOGO_URL = "https://country.fazenda.rodeo/player/logo.webp";
export const PLAY_URL = "https://country.fazenda.rodeo/player/play.webp";
export const PAUSE_URL = "https://country.fazenda.rodeo/player/pause.webp";

const IDLE_DELAY = 4000;

export type NowPlaying = { title: string; artist: string; art: string };
export type HistoryItem = { song: NowPlaying };
export type NewsItem = { link: string; title: string; thumb: string };

type Ctx = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  volume: number;
  nowPlaying: NowPlaying;
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
};

const RadioCtx = createContext<Ctx | null>(null);

export function useRadio() {
  const c = useContext(RadioCtx);
  if (!c) throw new Error("useRadio outside RadioProvider");
  return c;
}

export function RadioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    title: "Loading...",
    artist: "FAZENDA RODEO",
    art: "",
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsError, setNewsError] = useState(false);
  const [analyserReady, setAnalyserReady] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // --- HLS init (idempotent, Strict-Mode-safe) ---
  useEffect(() => {
    let cancelled = false;
    let instance: Hls | null = null;

    (async () => {
      const mod = await import("hls.js");
      const HlsCtor = mod.default;
      if (cancelled || !audioRef.current) return;
      const audio = audioRef.current;
      audio.crossOrigin = "anonymous";

      if (HlsCtor.isSupported()) {
        instance = new HlsCtor({
          liveDurationInfinity: true,
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = instance;
        instance.loadSource(STREAM_URL);
        instance.attachMedia(audio);
      } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
        audio.src = STREAM_URL;
      }
    })();

    return () => {
      cancelled = true;
      if (instance) {
        instance.destroy();
        if (hlsRef.current === instance) hlsRef.current = null;
      }
    };
  }, []);

  // volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

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

  // --- togglePlay (consolidated) ---
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // init AudioContext + analyser (singleton, gesture)
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

    if (audio.paused) {
      void audio.play();
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
  }, [startIdle]);

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

  // --- Now Playing polling ---
  useEffect(() => {
    let cancelled = false;
    async function loadMeta() {
      try {
        const r = await fetch(NOWPLAYING_URL);
        const data = await r.json();
        if (cancelled) return;
        const s = data.now_playing.song;
        setNowPlaying({ title: s.title, artist: s.artist, art: s.art });
      } catch (e) {
        console.error("Erro metadados:", e);
      }
    }
    loadMeta();
    const id = setInterval(loadMeta, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // --- History polling ---
  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      try {
        const r = await fetch(NOWPLAYING_URL);
        const data = await r.json();
        if (cancelled) return;
        const items: HistoryItem[] = (data.song_history ?? [])
          .slice(0, 7)
          .map((it: { song: NowPlaying }) => ({ song: it.song }));
        setHistory(items);
      } catch (e) {
        console.error("Erro histórico:", e);
      }
    }
    loadHistory();
    const id = setInterval(loadHistory, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

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
  };

  return (
    <RadioCtx.Provider value={value}>
      <audio id="stream" ref={audioRef} crossOrigin="anonymous" preload="none" />
      {children}
    </RadioCtx.Provider>
  );
}
