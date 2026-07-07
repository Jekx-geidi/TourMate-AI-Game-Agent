import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Compass, Crosshair, Expand, Flag, Globe2, Plane, X } from 'lucide-react';
import { CountryPanel } from '../components/CountryPanel';
import { FindCountryGame } from '../components/games/FindCountryGame';
import { FlagQuizGame } from '../components/games/FlagQuizGame';
import { MatchingGame } from '../components/games/MatchingGame';
import { WorldMap } from '../components/WorldMap';
import type { MapCountry } from '../components/WorldMap';
import { Card } from '../components/ui/card';
import { useGame } from '../hooks/use-game';
import { ALL_AIRPORTS, COUNTRIES, getCountryById } from '../lib/country-data';

type Tab = 'explore' | 'find' | 'flags' | 'airports';

const TABS: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
  { id: 'explore', label: 'World Explorer', icon: Globe2 },
  { id: 'find', label: 'Map Challenge', icon: Crosshair },
  { id: 'flags', label: 'Flag Quiz', icon: Flag },
  { id: 'airports', label: 'Airport Codes', icon: Plane },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function MapsFlagsPage() {
  const { addXp, recordEvent, stats } = useGame();
  const [tab, setTab] = useState<Tab>('explore');
  const [selected, setSelected] = useState<MapCountry | null>(null);
  const [airportRound, setAirportRound] = useState(0);
  const [mapExpanded, setMapExpanded] = useState(false);

  const airportPairs = useMemo(
    () =>
      shuffle(ALL_AIRPORTS)
        .slice(0, 6)
        .map((airport) => ({
          left: airport.code,
          right: `${airport.name} (${airport.country})`,
        })),
    [airportRound],
  );

  const selectedProfile = getCountryById(selected?.id);

  const handleExploreClick = (country: MapCountry) => {
    setSelected(country);
    if (getCountryById(country.id)) {
      recordEvent('country-explored', { countryId: country.id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] brand-gradient p-6 text-white shadow-pop sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
            Tourism Special Mode
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">World Explorer</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            Tap any country on the interactive map to discover its flag, capital, culture, food,
            destinations, and airport codes â€” then test yourself in the map, flag, and airport
            challenges to earn XP!
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur">
            <Compass className="h-4 w-4" />
            Countries explored: {stats.countriesExplored.length}/{COUNTRIES.length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition sm:px-5 ${
              tab === item.id
                ? 'brand-gradient-r text-white shadow-pop'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 ring-1 ring-cyan-100 dark:ring-cyan-900/60 hover:bg-cyan-50 dark:hover:bg-cyan-900/30'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'explore' ? (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-100 dark:border-cyan-900/60 bg-white dark:bg-slate-900 p-2 shadow-soft">
            <WorldMap selectedId={selected?.id} onCountryClick={handleExploreClick} />
            <button
              type="button"
              onClick={() => setMapExpanded(true)}
              className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 shadow-md ring-1 ring-cyan-100 dark:ring-cyan-900/60 transition hover:bg-cyan-50 dark:hover:bg-cyan-900/30"
            >
              <Expand className="h-4 w-4" />
              Expand map
            </button>
            <p className="px-3 pb-2 pt-1 text-xs text-slate-400">
              Highlighted countries have full profiles Â· Orange dots are small island/city destinations
              Â· Use the buttons or double-click to zoom
            </p>
          </div>
          <Card className="max-h-[560px] overflow-y-auto">
            <CountryPanel country={selectedProfile} fallbackName={selected?.name} />
          </Card>
        </section>
      ) : null}

      {mapExpanded ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900 p-3 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 sm:text-2xl">
              {selected?.name ?? 'World map'}
            </h2>
            <button
              type="button"
              aria-label="Close full map"
              onClick={() => setMapExpanded(false)}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-50 dark:bg-cyan-950/40 px-4 py-2 text-sm font-bold text-cyan-700 dark:text-cyan-300 transition hover:bg-cyan-100 dark:hover:bg-cyan-900/40"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
              <div className="rounded-2xl border border-cyan-100 dark:border-cyan-900/60 p-2">
                <WorldMap selectedId={selected?.id} onCountryClick={handleExploreClick} />
              </div>
              <div className="rounded-2xl border border-cyan-100 dark:border-cyan-900/60 p-4">
                <CountryPanel country={selectedProfile} fallbackName={selected?.name} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'find' ? (
        <Card>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Map Challenge</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            We name a country â€” you find it on the map. Five rounds, three tries each.
          </p>
          <div className="mt-4">
            <FindCountryGame />
          </div>
        </Card>
      ) : null}

      {tab === 'flags' ? (
        <Card>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Flag Quiz</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Ten flags, four choices each. Answer 5 correctly to complete todayâ€™s flag challenge!
          </p>
          <div className="mt-4">
            <FlagQuizGame />
          </div>
        </Card>
      ) : null}

      {tab === 'airports' ? (
        <Card>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Airport Code Match</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Match each IATA code with its airport. New random airports every round.
          </p>
          <div className="mt-4">
            <MatchingGame
              key={airportRound}
              pairs={airportPairs}
              xpReward={20}
              onFinish={() => {
                addXp(20, 'Airport Code Match finished');
                recordEvent('game-completed');
                recordEvent('match-completed');
                window.setTimeout(() => setAirportRound((value) => value + 1), 4000);
              }}
            />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
