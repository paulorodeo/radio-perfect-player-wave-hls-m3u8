import { useEffect, useId, useRef, useState } from "react";
import "../../styles/station-selector.css";
import { stations } from "../../data/stations";
import { useRadio } from "../radio/RadioContext";

const GROUP_LABELS: Record<string, string> = {
  "fazenda-rodeo": "Fazenda Rodeo",
  "across-americas": "Across Americas",
};

const GROUP_ORDER = ["fazenda-rodeo", "across-americas"] as const;

export function StationDropdown({ isVisible }: { isVisible: boolean }) {
  const { station, selectedStationId, selectStation } = useRadio();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isVisible) setOpen(false);
  }, [isVisible]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (id: string) => {
    setOpen(false);
    void selectStation(id);
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => {
        const next = e.key === "ArrowDown" ? h + 1 : h - 1;
        return (next + stations.length) % stations.length;
      });
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const target = stations[highlight];
      if (target) choose(target.id);
    }
  };

  return (
    <div className="station-dropdown" ref={rootRef}>
      <button
        type="button"
        className="station-dropdown-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Selecionar rádio. Atual: ${station.fullName}`}
        tabIndex={isVisible ? 0 : -1}
        onClick={() => {
          setOpen((v) => !v);
          setHighlight(Math.max(0, stations.findIndex((s) => s.id === selectedStationId)));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="station-dropdown-toggle-label">{station.shortLabel}</span>
        <span className="station-dropdown-caret" aria-hidden="true">
          ▲
        </span>
      </button>

      {open ? (
        <ul
          className="station-dropdown-menu"
          id={menuId}
          role="listbox"
          aria-label="Rádios disponíveis"
          tabIndex={-1}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          onKeyDown={onListKeyDown}
          ref={(el) => el?.focus()}
        >
          {GROUP_ORDER.map((group) => (
            <li key={group}>
              <div className="station-dropdown-group">{GROUP_LABELS[group]}</div>
              <ul role="presentation" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {stations
                  .filter((s) => s.group === group)
                  .map((s) => {
                    const index = stations.indexOf(s);
                    const active = s.id === selectedStationId;
                    return (
                      <li key={s.id} role="option" aria-selected={active}>
                        <button
                          type="button"
                          className={`station-dropdown-option${active ? " is-active" : ""}${
                            index === highlight ? " is-highlighted" : ""
                          }`}
                          title={s.fullName}
                          onClick={() => choose(s.id)}
                          onMouseEnter={() => setHighlight(index)}
                        >
                          {s.shortLabel}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
