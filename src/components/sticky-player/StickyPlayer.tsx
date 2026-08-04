import { useEffect, useState } from "react";
import "../../styles/sticky-player.css";
import { LOGO_URL, PAUSE_URL, PLAY_URL, useRadio } from "../radio/RadioContext";
import { StickyEqualizer } from "./StickyEqualizer";
import { StationDropdown } from "./StationDropdown";

const STICKY_SCROLL_THRESHOLD = 100;

export function StickyPlayer() {
  const { nowPlaying, playingNext, isPlaying, togglePlay, lightboxSrc, openLightbox } = useRadio();
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;

    const updateVisibility = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        setStickyVisible(window.scrollY >= STICKY_SCROLL_THRESHOLD);
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const isVisible = stickyVisible && !lightboxSrc;
  const art = nowPlaying.art || LOGO_URL;

  return (
    <aside
      aria-label="Player da rádio"
      aria-hidden={!isVisible}
      className={`sticky-radio-player${isVisible ? " sticky-radio-player--visible" : ""}`}
    >
      <div className="sticky-radio-track">
        <button
          type="button"
          className="sticky-radio-art-button"
          onClick={() => openLightbox(nowPlaying.art)}
          aria-label="Ampliar capa da música atual"
          tabIndex={isVisible ? 0 : -1}
        >
          <img className="sticky-radio-art" src={art} alt="" />
        </button>
        <div className="sticky-radio-info">
          <p className="sticky-radio-title">{nowPlaying.title}</p>
          <p className="sticky-radio-artist">{nowPlaying.artist}</p>
        </div>
      </div>

      <StickyEqualizer isVisible={isVisible} />

      {playingNext ? (
        <div className="sticky-radio-next" aria-live="polite">
          <span className="sticky-radio-next-label">A SEGUIR</span>
          <div className="sticky-radio-next-body">
            {playingNext.art ? (
              <img className="sticky-radio-next-art" src={playingNext.art} alt="" />
            ) : null}
            <div className="sticky-radio-next-info">
              <p className="sticky-radio-next-title">{playingNext.title}</p>
              <p className="sticky-radio-next-artist">{playingNext.artist}</p>
            </div>
          </div>
        </div>
      ) : null}

      <StationDropdown isVisible={isVisible} />

      <div className="sticky-radio-actions">
        <button
          type="button"
          className="sticky-radio-play"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pausar rádio" : "Tocar rádio"}
          tabIndex={isVisible ? 0 : -1}
        >
          <img src={isPlaying ? PAUSE_URL : PLAY_URL} alt="" />
        </button>
        <button
          type="button"
          className="sticky-radio-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          tabIndex={isVisible ? 0 : -1}
        >
          ↑
        </button>
      </div>
    </aside>
  );
}
