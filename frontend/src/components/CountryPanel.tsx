import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { CountryProfile } from '../lib/country-data';
import { aiService } from '../services/ai.service';
import { Button } from './ui/button';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{label}</p>
      <div className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  );
}

export function CountryPanel({
  country,
  fallbackName,
}: {
  country?: CountryProfile;
  fallbackName?: string;
}) {
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const askAi = async (name: string) => {
    setIsAsking(true);
    setAiReply(null);
    try {
      const response = await aiService.chat({
        message: `Tell me about ${name} as a tourism destination: its culture, must-see attractions, and one travel tip for tourism students. Keep it short and fun.`,
      });
      setAiReply(response.reply);
    } catch {
      setAiReply('The AI tutor is unavailable right now â€” please try again in a moment.');
    } finally {
      setIsAsking(false);
    }
  };

  if (!country) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{fallbackName ?? 'Pick a country'}</h2>
        {fallbackName ? (
          <>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              We do not have a detailed profile for {fallbackName} yet â€” but the AI tutor knows it!
            </p>
            <Button onClick={() => void askAi(fallbackName)} disabled={isAsking}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isAsking ? 'Asking TourMate AI...' : `Ask AI about ${fallbackName}`}
            </Button>
          </>
        ) : (
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Click any country on the map to see its flag, capital, culture, food, destinations, and
            airport codes. Teal countries have full profiles!
          </p>
        )}
        {aiReply ? (
          <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {aiReply}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-5xl">{country.flag}</span>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{country.name}</h2>
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
            {country.continent} Â· Capital: {country.capital}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-sm font-semibold text-amber-800 dark:text-amber-300">
        Say it like a local: â€œ{country.greeting}â€
      </div>

      <Section label="Culture">{country.culture}</Section>
      <Section label="Languages">{country.languages}</Section>
      <Section label="Currency">{country.currency}</Section>
      <Section label="Must-try food">
        <ul className="list-inside list-disc">
          {country.food.map((dish) => (
            <li key={dish}>{dish}</li>
          ))}
        </ul>
      </Section>
      <Section label="Top destinations">
        <ul className="list-inside list-disc">
          {country.destinations.map((place) => (
            <li key={place}>{place}</li>
          ))}
        </ul>
      </Section>
      <Section label="Airport codes">
        {country.airports.map((airport) => (
          <p key={airport.code}>
            <span className="font-bold text-cyan-700 dark:text-cyan-300">{airport.code}</span> â€” {airport.name}
          </p>
        ))}
      </Section>
      <div className="rounded-2xl bg-sky-50 dark:bg-sky-950/40 px-4 py-3 text-sm text-sky-900 dark:text-sky-200">
        <span className="font-bold">Fun fact:</span> {country.funFact}
      </div>

      <Button onClick={() => void askAi(country.name)} disabled={isAsking} variant="outline">
        <Sparkles className="mr-2 h-4 w-4" />
        {isAsking ? 'Asking TourMate AI...' : `Ask AI more about ${country.name}`}
      </Button>
      {aiReply ? (
        <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {aiReply}
        </p>
      ) : null}
    </div>
  );
}
