import { useState } from 'react';
import { Card } from '../components/ui/card';
import { airportCodes, destinationCards, flagChoices } from '../lib/static-data';

export function MapsFlagsPage() {
  const [selectedContinent, setSelectedContinent] = useState('All');
  const filteredDestinations =
    selectedContinent === 'All'
      ? destinationCards
      : destinationCards.filter((item) => item.continent === selectedContinent);

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h1 className="text-4xl font-black text-slate-950">Maps, Flags, Capitals, and Codes</h1>
        <p className="text-sm leading-6 text-slate-600">
          Practice tourism special topics including country facts, airport codes, and key
          destination memory drills.
        </p>
      </Card>

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

