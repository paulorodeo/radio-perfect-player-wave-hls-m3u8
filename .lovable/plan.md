# Migração index.html → React + TypeScript (final)

Objetivo: converter a página em componentes React + TS preservando integralmente HTML renderizado, ordem do DOM, CSS original, assets, URLs, APIs e comportamentos. Sem redesign, sem novas funcionalidades.

## 1. CSS: ordem e literalidade

Carregado **apenas** no `Route.head()` da rota `/` (nada no `__root`):

1. Bootstrap CSS 5.3.0 (CDN, uma única vez).
2. `src/styles/original-player.css` — extração literal do `<style>` do `index.html`, importado depois do Bootstrap.

Bootstrap JS bundle 5.3.0 também no `head()` da rota, com `defer`, uma única vez:
- `https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js`

Regras:
- Não importar `src/styles.css` (template) na página `/`. Se regras globais do template ainda interferirem (`body`, `button`, `img`, `canvas`, `a`, `input`, tokens), neutralizar dentro do próprio `original-player.css` — nunca reescrevendo layout.
- Sem CSS Modules. `className` literal: `bg-blur`, `bg-overlay`, `main-container`, `side-column`, `player-card`, `logo-interna`, `live-tag`, `album-container`, `album-art`, `btn-control`, `volume-aside`, `vol-slider`, `info`, `history-item`, `playing-glow`, `hide-ui`, etc.
- Verificar em Network que cada arquivo Bootstrap é solicitado uma única vez.

## 2. Rota e head

- Substituir `src/routes/index.tsx` pelo player (é a home).
- `head()`:
  - `title`: `Country Hits Nashville Radio | 100% Commercial Free` (apenas isto — sem description/OG/Twitter novos).
  - `links` (ordem):
    1. `rel="stylesheet"` Bootstrap CSS.
    2. `rel="stylesheet"` `original-player.css` (import via `?url`).
    3. `rel="preload" as="image"` para:
       - `https://country.fazenda.rodeo/player/logo.webp`
       - `https://country.fazenda.rodeo/player/play.webp`
       - `https://country.fazenda.rodeo/player/pause.webp`
  - `scripts`: Bootstrap bundle JS com `defer`.
- Todas as referências a logo/play/pause usam URL absoluta. Sem paths relativos.

## 3. Árvore de componentes (ordem exata do DOM)

```text
RadioProvider  (contexto; renderiza um <audio> desde o SSR)
├── <audio ref={audioRef} crossOrigin="anonymous" preload="none" />
├── CoverLightbox        // início da página, sem portal
├── DynamicBackground    // .bg-blur + .bg-overlay
├── MobileHeader         // .header-mobile-externo (logo + navbar-toggler data-bs-*)
├── MobileMenu           // .offcanvas + feed Latest News
└── MainContainer (.main-container)
    ├── CountryNews (.side-column esquerda)
    ├── PlayerColumn
    │   ├── DesktopNavigation  // HOME | RADIO | TV | NEWS
    │   └── PlayerCard (.player-card)
    │       ├── StationLogo (.logo-interna)
    │       ├── LiveBadge (.live-tag "LIVE")
    │       ├── AlbumContainer (.album-container)
    │       │   ├── AlbumCover (.album-art)
    │       │   └── PlayPauseButton (.btn-control)
    │       ├── StationTitle   // "Country Hits Radio Nashville"
    │       ├── VerticalVolume (.volume-aside > input.vol-slider)
    │       ├── WaveVisualizer (<canvas id="visualizer">)
    │       ├── TrackInfo (.info)   // título e artista somente
    │       └── PlayerFooter
    └── RecentlyPlayed (.side-column direita)
```

- `StationTitle` sempre antes de volume e canvas.
- `CoverLightbox` inline (sem portal), no topo, mesma posição conceitual do original.

## 4. RadioProvider (singletons)

- Renderiza um único `<audio>` desde o HTML inicial (SSR ok, sem `useHydrated` gate). Só APIs de navegador ficam em effects/handlers.
- Estado exposto: `isPlaying`, `volume`, `nowPlaying`, `history`, `news`, `togglePlay`, `setVolume`, `openLightbox`, `closeLightbox`, `lightboxSrc`, `analyserReady`.
- Refs persistentes com guards: `audioContextRef`, `mediaSourceRef`, `analyserRef`, `hlsRef`, `animationFrameRef`, `idleTimerRef`, `metadataIntervalRef`, `historyIntervalRef`.
- Cada `useEffect` idempotente: cria no máximo uma instância local, e o cleanup destrói exatamente essa instância e zera a ref correspondente. Nunca há duas instâncias simultâneas.
- `createMediaElementSource` é chamado no máximo uma vez para o mesmo `<audio>` (guard por `mediaSourceRef.current`).

## 5. HLS: effect idempotente compatível com Strict Mode

```ts
useEffect(() => {
  let cancelled = false;
  let instance: Hls | null = null;

  async function initializeHls() {
    const module = await import('hls.js');
    const Hls = module.default;
    if (cancelled || !audioRef.current) return;

    const audio = audioRef.current;
    audio.crossOrigin = 'anonymous';

    if (Hls.isSupported()) {
      instance = new Hls({
        liveDurationInfinity: true,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = instance;
      instance.loadSource('https://live.fazenda.rodeo/hls/country/live.m3u8');
      instance.attachMedia(audio);
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = 'https://live.fazenda.rodeo/hls/country/live.m3u8';
    }
  }

  initializeHls();

  return () => {
    cancelled = true;
    if (instance) {
      instance.destroy();
      if (hlsRef.current === instance) hlsRef.current = null;
    }
  };
}, []);
```

## 6. Áudio, AudioContext e visualizador

- `AudioContext` + `MediaElementSource` + `AnalyserNode` (`fftSize = 128`) criados no primeiro `togglePlay` (gesto do usuário); `resume()` se `suspended`. Guards por ref evitam duplicação.
- Ao criar o analyser, setar `analyserReady = true`; `WaveVisualizer` observa esse sinal para iniciar `requestAnimationFrame`.
- `drawWave()` portado literalmente:
  ```ts
  analyser.fftSize = 128;
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#c5a059';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  grad.addColorStop(0, 'rgba(99, 75, 42, 0.2)');
  grad.addColorStop(0.5, '#f9e8af');
  grad.addColorStop(1, 'rgba(99, 75, 42, 0.2)');
  ```
- `togglePlay()` único: play/pause do `<audio>`, troca `play.webp` ↔ `pause.webp`, aplica/remove `playing-glow`, dispara/pausa auto-hide, inicia AudioContext/analyser no primeiro play.

## 7. WaveVisualizer: resize obrigatório do buffer interno

```ts
function resizeCanvas() {
  const canvas = canvasRef.current;
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

useEffect(() => {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  return () => window.removeEventListener('resize', resizeCanvas);
}, []);
```

CSS do canvas preservado literalmente:
```css
#visualizer { width: 100%; height: 120px; margin: 10px 0; pointer-events: none; }
```

Sem SVG, barras, ou biblioteca externa.

## 8. Auto-hide

- `IDLE_DELAY = 4000`.
- Ativo somente enquanto tocando; ao pausar, cancelar timer e reexibir controles.
- Reexibir em `mousemove`, `touchstart`, `scroll`, interação com player, mudança de volume.
- Elementos ocultos: classe `hide-ui` (CSS original) com `pointer-events: none`.
- Capa central continua visível quando o botão some.

## 9. Now Playing e histórico

- Fetch `https://live.fazenda.rodeo/api/nowplaying/country`.
- `data.now_playing.song` → `{title, artist, art}` atualiza capa central, background e lightbox.
- Intervalos: metadata ~15s; histórico ~60s (até 7 itens de `data.song_history`).

## 10. WordPress News

- Fetch único: `https://country.fazenda.rodeo/wp-json/wp/v2/posts?_embed&per_page=7&categories=26`.
- Renderiza cards em `CountryNews` e feed `Latest News` no `MobileMenu`.
- Erro → mensagem de indisponibilidade (mesma do original).

## 11. Menus

- Desktop: HOME / RADIO / TV / NEWS com hrefs exatos do original.
- Mobile: offcanvas Bootstrap via `data-bs-toggle`/`data-bs-target` (sem inicialização manual). Links: HOME, STREAM, TV, NEWS, CONTACT — URLs originais.

## 12. Lightbox

- Abre em clique na capa central e nas capas do histórico.
- Overlay escuro, blur, borda dourada, botão fechar preservados.
- Bloqueia scroll (`document.body.style.overflow = 'hidden'`) e restaura ao fechar.

## 13. Dependências

- Adicionar `hls.js` (tipos próprios; não instalar `@types/hls.js` a menos que o compilador exija).
- Bootstrap apenas via CDN (CSS + JS), sem npm.

## 14. SSR e execução

- `<audio>` renderizado desde o HTML inicial (sem gate de hidratação).
- Toda lógica de `window`/`document`/`AudioContext`/HLS/Bootstrap fica em `useEffect` ou handlers.
- HLS.js importado dinamicamente no cliente.

## 15. Validação

- `tsgo` limpo; build de produção concluído.
- Console sem erros graves.
- Network: Bootstrap CSS e JS solicitados uma única vez cada; play/pause/logo carregam do domínio original.
- Playwright headless na viewport da captura fornecida:
  - screenshot do `index.html` original;
  - screenshot da rota `/` React;
  - overlay 50% para conferir ordem vertical, StationTitle, altura/posição do canvas, volume vertical, logo, capa, botão, colunas, cards, background.
- Checklist completo dos critérios do pedido verificado no relatório final.

## Fora de escopo

Sem shadcn, Lucide, novos gradientes, Tailwind na página, novas seções, novos textos/links, mocks, description/OG/Twitter novos, portais desnecessários, refactors além do mínimo técnico.
