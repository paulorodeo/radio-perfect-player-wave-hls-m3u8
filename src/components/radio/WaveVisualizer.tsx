import { useEffect, useRef } from "react";
import { useRadio } from "./RadioContext";

export function WaveVisualizer() {
  const { analyserRef, analyserReady } = useRadio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // resize buffer to match CSS box
  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (!analyserReady) return;
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const sliceWidth = canvas.width / (dataArray.length / 2);

      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, "rgba(99, 75, 42, 0.2)");
      grad.addColorStop(0.5, "#f9e8af");
      grad.addColorStop(1, "rgba(99, 75, 42, 0.2)");

      ctx.shadowBlur = 12;
      ctx.shadowColor = "#c5a059";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = grad;
      ctx.lineCap = "round";

      // upper wave
      ctx.beginPath();
      let x = 0;
      for (let i = 0; i < dataArray.length / 2; i++) {
        const v = dataArray[i] / 128.0;
        const y = centerY - v * centerY * 0.7;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();

      // mirrored lower wave
      x = 0;
      ctx.beginPath();
      for (let i = 0; i < dataArray.length / 2; i++) {
        const v = dataArray[i] / 128.0;
        const y = centerY + v * centerY * 0.7;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    };
    draw();

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [analyserReady, analyserRef]);

  return <canvas id="visualizer" ref={canvasRef} />;
}
