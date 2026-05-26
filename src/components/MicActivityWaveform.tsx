import { useEffect, useRef } from "react";

const HEIGHT = 72;
const PAD_X = 6;
const PAD_Y = 8;
/** Dots on the wave — one per entropy field in an impulse (plus trailing samples). */
const SAMPLE_MARKER_FRACS = [0.1, 0.26, 0.42, 0.58, 0.74, 0.9];

interface MicActivityWaveformProps {
  waveformRef: React.RefObject<Uint8Array | null>;
  activity: number;
  gain: number;
  mixingLive: boolean;
  phaseIdle: boolean;
}

interface DrawStyle {
  activity: number;
  gain: number;
  mixingLive: boolean;
  phaseIdle: boolean;
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  midY: number,
): void {
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const y = PAD_Y + ((h - PAD_Y * 2) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(PAD_X, y);
    ctx.lineTo(w - PAD_X, y);
    ctx.stroke();
  }
  const innerW = w - PAD_X * 2;
  const step = Math.max(28, Math.floor(innerW / 8));
  for (let x = PAD_X + step; x < w - PAD_X; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, PAD_Y);
    ctx.lineTo(x, h - PAD_Y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.moveTo(PAD_X, midY);
  ctx.lineTo(w - PAD_X, midY);
  ctx.stroke();
}

export function MicActivityWaveform({
  waveformRef,
  activity,
  gain,
  mixingLive,
  phaseIdle,
}: MicActivityWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: HEIGHT, dpr: 1 });
  const styleRef = useRef<DrawStyle>({
    activity: 0,
    gain: 1,
    mixingLive: false,
    phaseIdle: true,
  });
  const labelRef = useRef<HTMLSpanElement>(null);

  styleRef.current = { activity, gain, mixingLive, phaseIdle };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridCanvas = document.createElement("canvas");
    let gridKey = "";

    const paintGrid = (w: number, h: number, dpr: number) => {
      const key = `${w}x${h}x${dpr}`;
      if (key === gridKey) return;
      gridKey = key;
      gridCanvas.width = Math.floor(w * dpr);
      gridCanvas.height = Math.floor(h * dpr);
      const gctx = gridCanvas.getContext("2d");
      if (!gctx) return;
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.clearRect(0, 0, w, h);
      drawGrid(gctx, w, h, PAD_Y + (h - PAD_Y * 2) / 2);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const cssW = parent?.clientWidth ?? 280;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      sizeRef.current = { w: cssW, h: HEIGHT, dpr };
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(HEIGHT * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${HEIGHT}px`;
      gridKey = "";
      paintGrid(cssW, HEIGHT, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let raf = 0;
    let smoothActivity = 0;
    let smoothLive = 0;
    let labelTick = 0;

    const draw = () => {
      const { w, h, dpr } = sizeRef.current;
      const ctx = canvas.getContext("2d");
      const buf = waveformRef.current;
      const style = styleRef.current;
      if (!ctx || w <= 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      paintGrid(w, h, dpr);

      smoothActivity += (style.activity - smoothActivity) * 0.1;
      const targetLive = style.mixingLive && !style.phaseIdle ? 1 : 0;
      smoothLive += (targetLive - smoothLive) * 0.08;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(gridCanvas, 0, 0, w, h);

      const plotW = w - PAD_X * 2;
      const plotH = h - PAD_Y * 2;
      const midY = PAD_Y + plotH / 2;
      if (buf && buf.length > 1) {
        const n = buf.length;
        const amp = 0.94;
        const liveMix = smoothLive;
        const strokeA = 0.3 + liveMix * 0.45 + amp * 0.25;
        const stroke = liveMix > 0.35
          ? `rgba(34,211,238,${strokeA})`
          : `rgba(148,163,184,${0.22 + amp * 0.28})`;
        const fill = liveMix > 0.35
          ? `rgba(99,102,241,${0.06 + amp * 0.1})`
          : "rgba(148,163,184,0.04)";

        const sampleAt = (px: number) => {
          const idx = Math.min(n - 1, Math.floor((px / plotW) * (n - 1)));
          return (buf[idx]! - 128) / 128;
        };

        ctx.beginPath();
        for (let px = 0; px <= plotW; px++) {
          const y = midY - sampleAt(px) * (plotH / 2) * amp;
          const x = PAD_X + px;
          if (px === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(PAD_X + plotW, midY);
        ctx.lineTo(PAD_X, midY);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();

        ctx.beginPath();
        for (let px = 0; px <= plotW; px++) {
          const y = midY - sampleAt(px) * (plotH / 2) * amp;
          const x = PAD_X + px;
          if (px === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.25 + liveMix * 0.5;
        ctx.lineJoin = "round";
        ctx.stroke();

        const dotR = 2.2 + liveMix * 1.1;
        for (let m = 0; m < SAMPLE_MARKER_FRACS.length; m++) {
          const frac = SAMPLE_MARKER_FRACS[m]!;
          const px = plotW * frac;
          const y = midY - sampleAt(px) * (plotH / 2) * amp;
          const x = PAD_X + px;
          const t = m / Math.max(1, SAMPLE_MARKER_FRACS.length - 1);
          const alpha = 0.35 + liveMix * 0.5 + t * 0.15;

          ctx.strokeStyle =
            liveMix > 0.35
              ? `rgba(251,191,36,${alpha * 0.55})`
              : `rgba(148,163,184,${alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, PAD_Y);
          ctx.lineTo(x, h - PAD_Y);
          ctx.stroke();

          ctx.fillStyle =
            liveMix > 0.35
              ? `rgba(251,191,36,${alpha})`
              : `rgba(148,163,184,${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle =
            liveMix > 0.35
              ? "rgba(34,211,238,0.85)"
              : "rgba(148,163,184,0.55)";
          ctx.beginPath();
          ctx.arc(x, y, Math.max(1, dotR * 0.35), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      labelTick += 1;
      if (labelTick >= 6 && labelRef.current) {
        labelTick = 0;
        const g = styleRef.current.gain;
        labelRef.current.textContent = `${Math.round(smoothActivity)}% · ${g.toFixed(1)}× gain`;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [waveformRef]);

  return (
    <div className="mt-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold tracking-wide text-star/45 uppercase">
          Activity
        </span>
        <span
          ref={labelRef}
          className="font-mono text-xs tabular-nums text-star/70"
        >
          {activity}% · {gain.toFixed(1)}× gain
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="mt-1.5 w-full rounded-lg border border-white/10 bg-void/80"
        role="img"
        aria-label={`Microphone waveform, activity ${activity} percent`}
      />
    </div>
  );
}
