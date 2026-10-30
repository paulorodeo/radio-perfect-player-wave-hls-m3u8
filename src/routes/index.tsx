import { createFileRoute } from "@tanstack/react-router";
import playerCss from "../styles/original-player.css?url";

import {
  CountryNews,
  DesktopNavigation,
  DynamicBackground,
  MobileNavigation,
  PlayerCard,
  RecentlyPlayed,
} from "../components/radio/PlayerPieces";
import { MagazineSection } from "../components/magazine/MagazineSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fazenda Rodeo Radio | Country Music, 100% Sem comerciais" },
      {
        name: "description",
        content:
          "Ouça Fazenda Rodeo Radio — country music 24h, 100% sem comerciais, com notícias e reportagens do universo country e do rodeio.",
      },
      {
        property: "og:title",
        content: "Fazenda Rodeo Radio | Country Music, 100% Sem comerciais",
      },
      {
        property: "og:description",
        content:
          "Country music 24h, 100% sem comerciais, com notícias do universo country e do rodeio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://radio.fazenda.rodeo/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://radio.fazenda.rodeo/" },
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
    ],
  }),
  component: RadioPage,
});

function RadioPage() {
  return (
    <>
      <DynamicBackground />
      <MobileNavigation />
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
    </>
  );
}
