import { useEffect, useRef } from 'react';

type DotGridBackgroundProps = {
  className?: string;
  baseColor?: string;
  dotSize?: number;
  gap?: number;
  shockRadius?: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
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

export function DotGridBackground({
  className = '',
  baseColor = '#151a66',
  dotSize = 4,
  gap = 28,
  shockRadius = 120,
}: DotGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const container = canvas.parentElement;
    if (!container) return;

    const rgb = hexToRgb(baseColor);
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

    const updatePointer = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
        active: true,
      };
    };

    const clearPointer = () => {
      pointerRef.current.active = false;
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;
      const wave = time * 0.0011;

      for (let y = gap / 2; y < height + gap; y += gap) {
        for (let x = gap / 2; x < width + gap; x += gap) {
          const driftX = Math.sin(wave + y * 0.014) * 1.4;
          const driftY = Math.cos(wave + x * 0.012) * 1.2;
          const dotX = x + driftX;
          const dotY = y + driftY;

          let intensity = 0;
          if (pointer.active) {
            const dx = dotX - pointer.x;
            const dy = dotY - pointer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            intensity = Math.max(0, 1 - distance / shockRadius);
          }

          const radius = dotSize / 2 + intensity * dotSize * 0.9;
          const alpha = 0.14 + intensity * 0.58;

          context.beginPath();
          context.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          context.arc(dotX, dotY, radius, 0, Math.PI * 2);
          context.fill();

          if (intensity > 0.2) {
            context.beginPath();
            context.fillStyle = `rgba(96, 165, 250, ${intensity * 0.16})`;
            context.arc(dotX, dotY, radius * 2.8, 0, Math.PI * 2);
            context.fill();
          }
        }
      }

      frameId = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    window.addEventListener('pointermove', updatePointer);
    window.addEventListener('pointerleave', clearPointer);
    frameId = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', clearPointer);
      window.cancelAnimationFrame(frameId);
    };
  }, [baseColor, dotSize, gap, shockRadius]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(247,249,255,0.86)_44%,rgba(236,242,255,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(21,26,102,0.18),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(45,212,191,0.10),transparent_30%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
