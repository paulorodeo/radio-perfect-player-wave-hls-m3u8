import { useEffect, useRef } from "react";
import { useRadio } from "./RadioContext";

export function WaveVisualizer() {
  const { analyserRef, analyserReady } = useRadio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      if (width && height && (canvas.width !== width || canvas.height !== height)) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resizeCanvas);
    resizeObserver?.observe(canvas);
    window.addEventListener("resize", resizeCanvas);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (!analyserReady) return;
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minFrameMs = window.matchMedia("(max-width: 900px)").matches ? 50 : 33;
    let lastFrame = -minFrameMs;
    let inViewport = true;
    let cachedGradientWidth = 0;
    let gradient: CanvasGradient | null = null;

    const canPaint = () => document.visibilityState === "visible" && inViewport;

    const paint = () => {
      if (!canvas.width || !canvas.height) return;
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const sliceWidth = canvas.width / (dataArray.length / 2);
      if (!gradient || cachedGradientWidth !== canvas.width) {
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "rgba(99, 75, 42, 0.2)");
        gradient.addColorStop(0.5, "#f9e8af");
        gradient.addColorStop(1, "rgba(99, 75, 42, 0.2)");
        cachedGradientWidth = canvas.width;
      }

      ctx.shadowBlur = 12;
      ctx.shadowColor = "#c5a059";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = gradient;
      ctx.lineCap = "round";

      // Upper and mirrored lower wave, retaining the original gold visual.
      for (const direction of [-1, 1]) {
        ctx.beginPath();
        for (let i = 0; i < dataArray.length / 2; i++) {
          const amplitude = dataArray[i] / 128.0;
          const x = i * sliceWidth;
          const y = centerY + direction * amplitude * centerY * 0.7;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const draw = (time: number) => {
      rafRef.current = null;
      if (!canPaint()) return;
      if (time - lastFrame >= minFrameMs) {
        paint();
        lastFrame = time;
      }
      if (!reducedMotion) rafRef.current = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const update = () => {
      if (!canPaint()) {
        stop();
      } else if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(draw);
      }
    };

    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      (entries) => {
        inViewport = entries[0]?.isIntersecting ?? false;
        update();
      },
      { threshold: 0.01 }
    );
    observer?.observe(canvas);
    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [analyserReady, analyserRef]);

  return <canvas id="visualizer" ref={canvasRef} />;
}
