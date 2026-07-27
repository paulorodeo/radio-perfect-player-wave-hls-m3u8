import { LOGO_URL, PAUSE_URL, PLAY_URL, useRadio } from "./RadioContext";
import { WaveVisualizer } from "./WaveVisualizer";

export function DynamicBackground() {
  const { nowPlaying } = useRadio();
  return (
    <>
      <div
        id="bg-blur"
        className="bg-blur"
        style={
          nowPlaying.art
            ? { backgroundImage: `url(${nowPlaying.art})` }
            : undefined
        }
      />
      <div className="bg-overlay" />
    </>
  );
}

export function CoverLightbox() {
  const { lightboxSrc, closeLightbox } = useRadio();
  return (
    <div
      id="lightbox"
      className={`lightbox-overlay${lightboxSrc ? " open" : ""}`}
      onClick={closeLightbox}
    >
      <span className="close-lightbox">×</span>
      <img id="lightbox-img" src={lightboxSrc ?? ""} alt="Ampliação" />
    </div>
  );
}

export function MobileHeader() {
  return (
    <header className="header-mobile-externo">
      <img src={LOGO_URL} alt="Rodeo Country Hits Nashville" />
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
      >
        <span className="menu-icon-gold">☰</span>
      </button>
    </header>
  );
}

export function MobileMenu() {
  const { news, newsError } = useRadio();
  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="offcanvasNavbar"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">MENU</h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
        />
      </div>
      <div className="offcanvas-body">
        <ul className="navbar-nav pe-3">
          <li className="nav-item">
            <a
              className="nav-link nav-link-custom"
              href="https://country.fazenda.rodeo/"
            >
              Home
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link nav-link-custom"
              href="https://country.fazenda.rodeo/station/radio-country/"
            >
              Stream
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link nav-link-custom"
              href="https://tv.fazenda.rodeo/"
            >
              TV
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link nav-link-custom"
              href="https://country.fazenda.rodeo/news/"
            >
              News
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link nav-link-custom"
              href="https://instagram.com/radiofazendarodeo"
              target="_blank"
              rel="noreferrer"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="news-feed-container">
          <div className="news-header">Latest News</div>
          <div id="wp-news-feed">
            <NewsList news={news} error={newsError} loading={!newsError && news.length === 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsList({
  news,
  error,
  loading,
}: {
  news: import("./RadioContext").NewsItem[];
  error: boolean;
  loading: boolean;
}) {
  if (loading) {
    return (
      <p style={{ fontSize: "12px", color: "#666" }}>Loading country news...</p>
    );
  }
  if (error) {
    return (
      <p style={{ fontSize: "11px", color: "#c5a05955" }}>
        Country news temporarily unavailable.
      </p>
    );
  }
  return (
    <>
      {news.map((post, i) => (
        <a
          key={post.link}
          href={post.link}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none", display: "block" }}
        >
          <div
            className="history-item"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <img src={post.thumb} className="history-art" alt="News" />
            <div className="history-info">
              <h4
                style={{ fontSize: "14px", lineHeight: 1.2 }}
                dangerouslySetInnerHTML={{ __html: post.title }}
              />
              <p>READ MORE</p>
            </div>
          </div>
        </a>
      ))}
    </>
  );
}

export function CountryNews() {
  const { news, newsError } = useRadio();
  return (
    <div className="side-column news-desktop">
      <h2 className="column-title">Country News</h2>
      <div id="news-list-desktop">
        <NewsList
          news={news}
          error={newsError}
          loading={!newsError && news.length === 0}
        />
      </div>
    </div>
  );
}

export function DesktopNavigation() {
  return (
    <div
      className="menu-topo-desktop"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginBottom: "25px",
        width: "100%",
      }}
    >
      <a href="https://country.fazenda.rodeo/" className="nav-link-item">
        Home
      </a>
      <span className="nav-spacer">|</span>
      <a
        href="https://country.fazenda.rodeo/station/radio-country/"
        className="nav-link-item"
      >
        Radio
      </a>
      <span className="nav-spacer">|</span>
      <a href="https://tv.fazenda.rodeo/" className="nav-link-item">
        TV
      </a>
      <span className="nav-spacer">|</span>
      <a href="https://country.fazenda.rodeo/news/" className="nav-link-item">
        News
      </a>
    </div>
  );
}

export function PlayerCard() {
  const {
    nowPlaying,
    isPlaying,
    hideUI,
    volume,
    togglePlay,
    setVolume,
    openLightbox,
  } = useRadio();

  return (
    <div
      className={`player-card${isPlaying ? " playing-glow" : ""}`}
      style={{ marginTop: 0 }}
    >
      <img src={LOGO_URL} className="logo-interna" alt="" />
      <div className="live-tag">LIVE</div>

      <div className="album-container">
        <img
          id="capa"
          src={nowPlaying.art}
          className="album-art"
          onClick={() => openLightbox(nowPlaying.art)}
          alt=""
        />
        <img
          id="btn-play-pause"
          src={isPlaying ? PAUSE_URL : PLAY_URL}
          className={`btn-control${hideUI ? " hide-ui" : ""}`}
          onClick={togglePlay}
          alt=""
        />
      </div>

      <h1 className="seo-h1">
        <a href="https://country.fazenda.rodeo">Country Hits Radio Nashville</a>
      </h1>

      <div
        className={`volume-aside${hideUI ? " hide-ui" : ""}`}
        id="vol-ui"
      >
        <span
          style={{
            fontSize: "10px",
            color: "#c5a059",
            marginBottom: "12px",
            fontWeight: "bold",
          }}
        >
          VOL
        </span>
        <input
          type="range"
          className="vol-slider"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onInput={(e) => setVolume(parseFloat(e.currentTarget.value))}
          onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
        />
      </div>

      <WaveVisualizer />

      <div className="info">
        <h2 id="titulo">{nowPlaying.title}</h2>
        <p id="artista">{nowPlaying.artist}</p>
      </div>

      <footer>© 2026 - BY PAULO RODEO</footer>
    </div>
  );
}

export function RecentlyPlayed() {
  const { history, openLightbox } = useRadio();
  return (
    <div className="side-column">
      <h2 className="column-title">Recently Played</h2>
      <div id="historico-country">
        {history.map((item, i) => (
          <div
            key={`${item.song.title}-${i}`}
            className="history-item"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <img
              src={item.song.art}
              className="history-art"
              onClick={() => openLightbox(item.song.art)}
              alt=""
            />
            <div className="history-info">
              <h4>{item.song.title}</h4>
              <p>{item.song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
