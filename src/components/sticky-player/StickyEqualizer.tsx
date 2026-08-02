import { useEffect, useRef } from "react";
import { useRadio } from "../radio/RadioContext";

type StickyEqualizerProps = {
  isVisible: boolean;
};

export function StickyEqualizer({ isVisible }: StickyEqualizerProps) {
  const { analyserRef, analyserReady, isPlaying } = useRadio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const smoothRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(canvas.offsetWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.offsetHeight * dpr));
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    const ctx = canvas.getContext("2d");

    const barCount = () => (canvas.offsetWidth < 80 ? 10 : 14);

    const paint = (values: number[]) => {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const count = values.length;
      const gap = w / count / 3;
      const barWidth = (w - gap * (count - 1)) / count;
      const radius = Math.min(barWidth / 2, 2 * (window.devicePixelRatio || 1));

      const grad = ctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, "#C6A04B");
      grad.addColorStop(1, "#E5CB84");
      ctx.fillStyle = grad;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(197, 160, 89, 0.55)";

      for (let i = 0; i < count; i++) {
        const min = h * 0.12;
        const barHeight = Math.max(min, values[i] * h);
        const x = i * (barWidth + gap);
        const y = h - barHeight;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, barWidth, barHeight, radius);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }
    };

    const active = isVisible && isPlaying && analyserReady;

    if (!active) {
      smoothRef.current = [];
      paint(new Array(barCount()).fill(0));
      return () => {
        window.removeEventListener("resize", sizeCanvas);
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      };
    }

    const analyser = analyserRef.current;
    if (!analyser) {
      return () => {
        window.removeEventListener("resize", sizeCanvas);
      };
    }
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const count = barCount();
      if (smoothRef.current.length !== count) {
        smoothRef.current = new Array(count).fill(0);
      }
      const usable = Math.floor(dataArray.length * 0.75);
      const chunk = Math.max(1, Math.floor(usable / count));
      const values: number[] = [];
      for (let i = 0; i < count; i++) {
        let sum = 0;
        for (let j = 0; j < chunk; j++) {
          sum += dataArray[i * chunk + j] ?? 0;
        }
        const normalized = sum / chunk / 255;
        const prev = smoothRef.current[i] ?? 0;
        const next = prev * 0.6 + normalized * 0.4;
        smoothRef.current[i] = next;
        values.push(next);
      }
      paint(values);
    };
    draw();

    return () => {
      window.removeEventListener("resize", sizeCanvas);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [analyserRef, analyserReady, isPlaying, isVisible]);

  return (
    <canvas ref={canvasRef} className="sticky-radio-eq" aria-hidden="true" role="presentation" />
  );
}
