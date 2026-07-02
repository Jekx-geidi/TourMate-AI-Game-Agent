import { useState } from 'react';
import { Card } from '../components/ui/card';
import { airportCodes, destinationCards, flagChoices } from '../lib/static-data';

export function MapsFlagsPage() {
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState(destinationCards[0]);
  const filteredDestinations =
    selectedContinent === 'All'
      ? destinationCards
      : destinationCards.filter((item) => item.continent === selectedContinent);
  const mapSpan = 0.18;
  const mapBounds = [
    selectedDestination.longitude - mapSpan,
    selectedDestination.latitude - mapSpan,
    selectedDestination.longitude + mapSpan,
    selectedDestination.latitude + mapSpan,
  ].join('%2C');
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds}&layer=mapnik&marker=${selectedDestination.latitude}%2C${selectedDestination.longitude}`;

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h1 className="text-4xl font-black text-slate-950">Maps, Flags, Capitals, and Codes</h1>
        <p className="text-sm leading-6 text-slate-600">
          Practice tourism special topics including country facts, airport codes, and key
          destination memory drills.
        </p>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <iframe
            title={`Map of ${selectedDestination.destination}`}
            src={mapSrc}
            className="h-[420px] w-full"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            Real Map
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {selectedDestination.destination}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {selectedDestination.country} | Capital: {selectedDestination.capital}
          </p>
          <div className="mt-4 grid gap-2">
            {destinationCards.map((item) => (
              <button
                key={item.destination}
                type="button"
                className={`rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                  selectedDestination.destination === item.destination
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setSelectedDestination(item)}
              >
                {item.destination}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Country flashcards</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {flagChoices.map((item) => (
              <Card key={item.country} className="bg-slate-50 text-center">
                <p className="text-5xl">{item.flag}</p>
                <p className="mt-3 font-semibold text-slate-900">{item.country}</p>
              </Card>
            ))}
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Airport code practice</h2>
          <div className="grid gap-3">
            {airportCodes.map((code) => (
              <Card key={code.code} className="bg-slate-50">
                <p className="text-lg font-bold text-teal-700">{code.code}</p>
                <p className="mt-1 text-sm text-slate-600">{code.airport}</p>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Popular destinations</h2>
          <div className="flex gap-2">
            {['All', 'Asia', 'Europe', 'North America'].map((continent) => (
              <button
                key={continent}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  selectedContinent === continent
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
                onClick={() => setSelectedContinent(continent)}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredDestinations.map((item) => (
            <Card key={item.country} className="bg-slate-50">
              <p className="font-semibold text-slate-900">{item.country}</p>
              <p className="mt-2 text-sm text-slate-600">Capital: {item.capital}</p>
              <p className="mt-1 text-sm text-slate-600">Destination: {item.destination}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
