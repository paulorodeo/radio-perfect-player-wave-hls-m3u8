export type StationCapabilities = {
  nowPlaying: boolean;
  artwork: boolean;
  history: boolean;
  playingNext: boolean;
  visualizer: boolean;
};

export type StationConfig = {
  id: string;
  shortLabel: string;
  fullName: string;
  region: string;
  group: "fazenda-rodeo" | "across-americas";
  streamType: "hls" | "mp3" | "aac";
  streamUrl: string;
  metadataAdapter: "fazenda" | "triton" | "icy";
  metadataUrl?: string;
  mountName?: string;
  featured: boolean;
  capabilities: StationCapabilities;
};

export const stations: StationConfig[] = [
  {
    id: "country",
    shortLabel: "Country",
    fullName: "Country Hits Radio Nashville",
    region: "Nashville · USA",
    group: "fazenda-rodeo",
    streamType: "hls",
    streamUrl: "https://live.fazenda.rodeo/hls/country/live.m3u8",
    metadataAdapter: "fazenda",
    metadataUrl: "https://live.fazenda.rodeo/api/nowplaying/country",
    featured: true,
    // Verified: AzuraCast serves now playing, artwork, history and playing_next.
    capabilities: {
      nowPlaying: true,
      artwork: true,
      history: true,
      playingNext: true,
      visualizer: true,
    },
  },
  {
    id: "agronejo",
    shortLabel: "Agronejo",
    fullName: "Agronejo Fazenda Rodeo Radio",
    region: "Brasil",
    group: "fazenda-rodeo",
    streamType: "hls",
    streamUrl: "https://live.fazenda.rodeo/hls/sertanejo/live.m3u8",
    metadataAdapter: "fazenda",
    metadataUrl: "https://live.fazenda.rodeo/api/nowplaying/sertanejo",
    featured: true,
    // Verified 2026-08-04: stream and metadata endpoints answer 404 (mount not
    // published yet). Capabilities stay false until the mount goes live.
    capabilities: {
      nowPlaying: false,
      artwork: false,
      history: false,
      playingNext: false,
      visualizer: false,
    },
  },
  {
    id: "independentes",
    shortLabel: "Independentes",
    fullName: "Independentes · Parque do Peão de Barretos",
    region: "Barretos · Brasil",
    group: "across-americas",
    streamType: "mp3",
    streamUrl:
      "https://streaming.radioempresabrasil.com.br/proxy/parquedopeaobarretos/stream",
    metadataAdapter: "icy",
    featured: false,
    // Verified: Shoutcast exposes icy-metaint (StreamTitle read server-side).
    // No history, no queue. Artwork only via iTunes resolver. CORS: *
    capabilities: {
      nowPlaying: true,
      artwork: false,
      history: false,
      playingNext: false,
      visualizer: true,
    },
  },
  {
    id: "tmx",
    shortLabel: "TMX Texas Music",
    fullName: "TMX · Texas Music Experience · KUTX HD3",
    region: "Texas · USA",
    group: "across-americas",
    streamType: "mp3",
    streamUrl: "https://streams.kut.org/4430_192.mp3",
    metadataAdapter: "icy",
    featured: false,
    // Verified: icy-metaint present, CORS: *
    capabilities: {
      nowPlaying: true,
      artwork: false,
      history: false,
      playingNext: false,
      visualizer: true,
    },
  },
  {
    id: "kscs",
    shortLabel: "New Country 96.3",
    fullName: "New Country 96.3 · KSCS",
    region: "Dallas–Fort Worth · Texas · USA",
    group: "across-americas",
    streamType: "aac",
    streamUrl:
      "https://playerservices.streamtheworld.com/api/livestream-redirect/KSCSFMAAC_SC",
    metadataAdapter: "triton",
    mountName: "KSCSFMAAC",
    featured: false,
    // Verified: Triton now playing XML returns title/artist + history.
    // No cover art in the feed (iTunes resolver used). CORS: *
    capabilities: {
      nowPlaying: true,
      artwork: false,
      history: true,
      playingNext: false,
      visualizer: true,
    },
  },
  {
    id: "wkdf",
    shortLabel: "103.3 Country",
    fullName: "103.3 Country · WKDF",
    region: "Nashville · Tennessee · USA",
    group: "across-americas",
    streamType: "aac",
    streamUrl:
      "https://playerservices.streamtheworld.com/api/livestream-redirect/WKDFFMAAC.aac",
    metadataAdapter: "triton",
    mountName: "WKDFFMAAC",
    featured: false,
    // Verified: Triton now playing XML returns title/artist + history.
    // No cover art in the feed (iTunes resolver used). CORS: *
    capabilities: {
      nowPlaying: true,
      artwork: false,
      history: true,
      playingNext: false,
      visualizer: true,
    },
  },
];

export const DEFAULT_STATION_ID = "country";

export const featuredStations = stations.filter((s) => s.featured);

export function getStation(id: string): StationConfig {
  return stations.find((s) => s.id === id) ?? stations[0];
}

export function stationPlaceholder(station: StationConfig): string {
  const label = station.shortLabel.toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><defs><radialGradient id="g" cx="50%" cy="40%"><stop offset="0%" stop-color="#2a2118"/><stop offset="100%" stop-color="#0b0805"/></radialGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="300" r="240" fill="none" stroke="#c5a059" stroke-opacity="0.45" stroke-width="3"/><text x="300" y="315" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="#c5a059" letter-spacing="4">${label.replace(/[<>&]/g, "")}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
