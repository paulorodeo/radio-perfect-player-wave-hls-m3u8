import { useEffect, useState } from "react";
import "../../styles/sticky-player.css";
import { LOGO_URL, PAUSE_URL, PLAY_URL, useRadio } from "../radio/RadioContext";

export function StickyPlayer() {
  const { nowPlaying, isPlaying, togglePlay, lightboxSrc } = useRadio();
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const player = document.querySelector(".player-card");
    if (!player) return;

    const observer = new IntersectionObserver(([entry]) => {
      const playerPassedAbove =
        !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      setStickyVisible(playerPassedAbove);
    });

    observer.observe(player);
    return () => observer.disconnect();
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
        <img className="sticky-radio-art" src={art} alt="" />
        <div className="sticky-radio-info">
          <p className="sticky-radio-title">{nowPlaying.title}</p>
          <p className="sticky-radio-artist">{nowPlaying.artist}</p>
        </div>
      </div>

      <div className="sticky-radio-station">
        <span className="sticky-radio-status">ON AIR</span>
        <span className="sticky-radio-station-name">COUNTRY HITS</span>
      </div>

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
