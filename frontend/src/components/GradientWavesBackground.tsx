import { useEffect, useRef } from 'react';

type GradientWavesBackgroundProps = {
  className?: string;
  waveColor?: string;
  horizonColor?: string;
  bandCount?: number;
  speed?: number;
};

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const safe =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const value = Number.parseInt(safe, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Layered sine-wave bands receding toward a horizon, colored from waveColor
// (nearest) to horizonColor (furthest) -- an original implementation inspired
// by the "Gradient Waves" background concept, not a copy of any licensed source.
export function GradientWavesBackground({
  className = '',
  waveColor = '#bc20b6',
  horizonColor = '#27c3ff',
  bandCount = 6,
  speed = 0.00035,
}: GradientWavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const container = canvas.parentElement;
    if (!container) return;

    const near = hexToRgb(waveColor);
    const far = hexToRgb(horizonColor);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frameId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawBand = (index: number, time: number) => {
      const depth = bandCount === 1 ? 0 : index / (bandCount - 1); // 0 = nearest, 1 = furthest
      const baseline = height * (0.3 + depth * 0.62);
      const amplitude = lerp(30, 6, depth) * Math.max(0.6, height / 700);
      const wavelength = lerp(240, 420, depth);
      const phase = time * speed * (1 - depth * 0.5) + index * 1.7;

      const r = lerp(near.r, far.r, depth);
      const g = lerp(near.g, far.g, depth);
      const b = lerp(near.b, far.b, depth);
      const alpha = lerp(0.5, 0.12, depth);

      context.beginPath();
      context.moveTo(0, height);
      context.lineTo(0, baseline);
      for (let x = 0; x <= width; x += 12) {
        const y = baseline + Math.sin(x / wavelength + phase) * amplitude;
        context.lineTo(x, y);
      }
      context.lineTo(width, height);
      context.closePath();

      const gradient = context.createLinearGradient(0, baseline - amplitude, 0, height);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      context.fillStyle = gradient;
      context.fill();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const horizonGlow = context.createLinearGradient(0, 0, 0, height);
      horizonGlow.addColorStop(0, `rgba(${far.r}, ${far.g}, ${far.b}, 0.26)`);
      horizonGlow.addColorStop(1, `rgba(${near.r}, ${near.g}, ${near.b}, 0)`);
      context.fillStyle = horizonGlow;
      context.fillRect(0, 0, width, height);

      for (let i = bandCount - 1; i >= 0; i -= 1) {
        drawBand(i, time);
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (!reduceMotion) {
        frameId = window.requestAnimationFrame(loop);
      }
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    observer.observe(container);
    resize();
    frameId = window.requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [waveColor, horizonColor, bandCount, speed]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
