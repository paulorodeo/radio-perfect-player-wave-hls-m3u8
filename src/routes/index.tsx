import { createFileRoute } from "@tanstack/react-router";
import playerCss from "../styles/original-player.css?url";

const BOOTSTRAP_CSS =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
import { RadioProvider } from "../components/radio/RadioContext";
import {
  CountryNews,
  CoverLightbox,
  DesktopNavigation,
  DynamicBackground,
  MobileHeader,
  MobileMenu,
  PlayerCard,
  RecentlyPlayed,
} from "../components/radio/PlayerPieces";
import { MagazineSection } from "../components/magazine/MagazineSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "I Love Sertanejo | 100% Commercial Free Radio" },
    ],
    links: [
      { rel: "stylesheet", href: BOOTSTRAP_CSS },
      { rel: "stylesheet", href: playerCss },
      {
        rel: "preload",
        as: "image",
        href: "https://country.fazenda.rodeo/player/logo.webp",
      },
      {
        rel: "preload",
        as: "image",
        href: "https://country.fazenda.rodeo/player/play.webp",
      },
      {
        rel: "preload",
        as: "image",
        href: "https://country.fazenda.rodeo/player/pause.webp",
      },
    ],
    scripts: [
      {
        src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
        defer: true,
      },
    ],
  }),
  component: RadioPage,
});

function RadioPage() {
  return (
    <RadioProvider>
      <CoverLightbox />
      <DynamicBackground />
      <MobileHeader />
      <MobileMenu />
      <div className="main-container">
        <CountryNews />
        <div
          className="side-column"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <DesktopNavigation />
          <PlayerCard />
        </div>
        <RecentlyPlayed />
      </div>
      <MagazineSection />
    </RadioProvider>
  );
}
