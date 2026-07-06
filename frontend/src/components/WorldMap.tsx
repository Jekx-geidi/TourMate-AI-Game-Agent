import { useRef, useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldTopology from 'world-atlas/countries-110m.json';
import { useTheme } from '../hooks/use-theme';
import { getCountryById, MAP_MARKERS } from '../lib/country-data';

export type MapCountry = { id: string; name: string };

type WorldFeature = {
  type: 'Feature';
  id: string | number;
  properties: { name: string };
  geometry: unknown;
};

const WIDTH = 960;
const HEIGHT = 500;
const MAX_ZOOM = 8;

const collection = feature(
  worldTopology,
  worldTopology.objects.countries,
) as unknown as { type: 'FeatureCollection'; features: WorldFeature[] };

const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], collection as never);
const pathGenerator = geoPath(projection);

const shapes = collection.features
  .filter((item) => item.properties.name !== 'Antarctica')
  .map((item) => ({
    id: String(item.id).padStart(3, '0'),
    name: item.properties.name,
    d: pathGenerator(item as never) ?? '',
  }));

const markers = MAP_MARKERS.map((country) => {
  const point = projection(country.marker) ?? [0, 0];
  return { id: country.id, name: country.name, x: point[0], y: point[1] };
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function WorldMap({
  selectedId,
  onCountryClick,
  getFill,
  showMarkers = true,
}: {
  selectedId?: string | null;
  onCountryClick: (country: MapCountry) => void;
  getFill?: (id: string) => string | undefined;
  showMarkers?: boolean;
}) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const colors = dark
    ? {
        ocean: '#151022',
        land: '#3b3554',
        curated: '#6d28d9',
        selected: '#c4b5fd',
        stroke: '#0d0818',
      }
    : {
        ocean: '#faf5ff',
        land: '#e2e8f0',
        curated: '#ddd6fe',
        selected: '#7c3aed',
        stroke: '#ffffff',
      };
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const dragState = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewWidth = WIDTH / view.k;
  const viewHeight = HEIGHT / view.k;

  const setZoom = (nextK: number, focusX?: number, focusY?: number) => {
    setView((current) => {
      const k = clamp(nextK, 1, MAX_ZOOM);
      const cx = focusX ?? current.x + WIDTH / current.k / 2;
      const cy = focusY ?? current.y + HEIGHT / current.k / 2;
      const nextWidth = WIDTH / k;
      const nextHeight = HEIGHT / k;
      return {
        k,
        x: clamp(cx - nextWidth / 2, 0, WIDTH - nextWidth),
        y: clamp(cy - nextHeight / 2, 0, HEIGHT - nextHeight),
      };
    });
  };

  const toMapCoords = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: view.x + ((clientX - rect.left) / rect.width) * viewWidth,
      y: view.y + ((clientY - rect.top) / rect.height) * viewHeight,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (view.k === 1) return;
    dragState.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: view.x,
      startY: view.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dxPx = event.clientX - drag.startClientX;
    const dyPx = event.clientY - drag.startClientY;
    if (Math.abs(dxPx) + Math.abs(dyPx) > 6) {
      drag.moved = true;
      suppressClick.current = true;
    }
    setView((current) => ({
      k: current.k,
      x: clamp(drag.startX - (dxPx / rect.width) * (WIDTH / current.k), 0, WIDTH - WIDTH / current.k),
      y: clamp(drag.startY - (dyPx / rect.height) * (HEIGHT / current.k), 0, HEIGHT - HEIGHT / current.k),
    }));
  };

  const handlePointerUp = () => {
    dragState.current = null;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
  };

  const handleCountryClick = (country: MapCountry) => {
    if (suppressClick.current) return;
    onCountryClick(country);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full touch-none"
      onMouseMove={(event) => {
        if (!hovered) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        setHovered((current) =>
          current
            ? { ...current, x: event.clientX - bounds.left, y: event.clientY - bounds.top }
            : current,
        );
      }}
    >
      <svg
        viewBox={`${view.x} ${view.y} ${viewWidth} ${viewHeight}`}
        className={`h-auto w-full select-none ${view.k > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        role="img"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={(event) => {
          const point = toMapCoords(event.clientX, event.clientY);
          setZoom(view.k * 1.8, point.x, point.y);
        }}
      >
        <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill={colors.ocean} rx={16} />
        {shapes.map((shape) => (
          <path
            key={shape.id + shape.name}
            d={shape.d}
            fill={(() => {
              const override = getFill?.(shape.id);
              if (override) return override;
              if (shape.id === selectedId) return colors.selected;
              if (getCountryById(shape.id)) return colors.curated;
              return colors.land;
            })()}
            stroke={colors.stroke}
            strokeWidth={0.6}
            vectorEffect="non-scaling-stroke"
            className="cursor-pointer transition-opacity hover:opacity-75"
            onClick={() => handleCountryClick({ id: shape.id, name: shape.name })}
            onMouseEnter={(event) => {
              const bounds =
                event.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect();
              setHovered({
                name: shape.name,
                x: bounds ? event.clientX - bounds.left : 0,
                y: bounds ? event.clientY - bounds.top : 0,
              });
            }}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {showMarkers
          ? markers.map((marker) => (
              <g
                key={marker.id}
                className="cursor-pointer"
                onClick={() => handleCountryClick({ id: marker.id, name: marker.name })}
                onMouseEnter={() => setHovered({ name: marker.name, x: 0, y: 0 })}
                onMouseLeave={() => setHovered(null)}
              >
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={(selectedId === marker.id ? 7 : 5) / view.k}
                  fill={selectedId === marker.id ? colors.selected : '#f59e0b'}
                  stroke={colors.stroke}
                  strokeWidth={1.5 / view.k}
                />
              </g>
            ))
          : null}
      </svg>

      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button
          type="button"
          aria-label="Zoom in"
          className="rounded-xl bg-white dark:bg-slate-900 p-2 text-violet-700 dark:text-violet-300 shadow-md ring-1 ring-violet-100 dark:ring-violet-900/60 transition hover:bg-violet-50 dark:hover:bg-violet-900/30 disabled:opacity-40"
          disabled={view.k >= MAX_ZOOM}
          onClick={() => setZoom(view.k * 1.5)}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          className="rounded-xl bg-white dark:bg-slate-900 p-2 text-violet-700 dark:text-violet-300 shadow-md ring-1 ring-violet-100 dark:ring-violet-900/60 transition hover:bg-violet-50 dark:hover:bg-violet-900/30 disabled:opacity-40"
          disabled={view.k <= 1}
          onClick={() => setZoom(view.k / 1.5)}
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Reset view"
          className="rounded-xl bg-white dark:bg-slate-900 p-2 text-violet-700 dark:text-violet-300 shadow-md ring-1 ring-violet-100 dark:ring-violet-900/60 transition hover:bg-violet-50 dark:hover:bg-violet-900/30 disabled:opacity-40"
          disabled={view.k === 1}
          onClick={() => setView({ x: 0, y: 0, k: 1 })}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {view.k > 1 ? (
        <p className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 shadow">
          Drag to move around · {view.k.toFixed(1)}x
        </p>
      ) : null}

      {hovered ? (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
          style={{ left: hovered.x + 12, top: hovered.y - 30 }}
        >
          {hovered.name}
        </div>
      ) : null}
    </div>
  );
}
