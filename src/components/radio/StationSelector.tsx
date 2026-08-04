import "../../styles/station-selector.css";
import { featuredStations } from "../../data/stations";
import { useRadio } from "./RadioContext";

export function StationSegmented() {
  const { selectedStationId, selectStation } = useRadio();

  return (
    <div
      className="station-segmented"
      role="group"
      aria-label="Selecionar canal Fazenda Rodeo"
    >
      {featuredStations.map((s) => {
        const active = s.id === selectedStationId;
        return (
          <button
            key={s.id}
            type="button"
            className={`station-segmented-option${active ? " is-active" : ""}`}
            aria-pressed={active}
            onClick={() => void selectStation(s.id)}
          >
            {s.shortLabel.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export function StationStatus() {
  const { streamError, retryStation, fallbackStationId, goToFallbackStation } =
    useRadio();
  if (!streamError) return null;
  return (
    <div className="station-status" role="status">
      <span>{streamError}</span>
      <div className="station-status-actions">
        <button type="button" onClick={retryStation}>
          Tentar novamente
        </button>
        {fallbackStationId ? (
          <button type="button" onClick={goToFallbackStation}>
            Voltar à anterior
          </button>
        ) : null}
      </div>
    </div>
  );
}
