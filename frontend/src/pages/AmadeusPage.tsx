import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Terminal } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { amadeusService } from '../services/amadeus.service';
import type { AmadeusCommandResult, AmadeusScenarioSummary, AmadeusSession } from '../types/amadeus';

function newKey() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ScenarioList({ onStart }: { onStart: (session: AmadeusSession) => void }) {
  const { data, isLoading } = useQuery<AmadeusScenarioSummary[]>({
    queryKey: ['amadeus', 'scenarios'],
    queryFn: amadeusService.listScenarios,
  });
  const [starting, setStarting] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner label="Loading Amadeus Practice..." />;

  const start = async (slug: string) => {
    setStarting(slug);
    try {
      const session = await amadeusService.startSession(slug, newKey());
      onStart(session);
    } finally {
      setStarting(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-500 p-2.5 text-white shadow-pop">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Amadeus Practice
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              An educational reservation-console simulator -- not connected to any live airline
              system.
            </p>
          </div>
        </div>
      </Card>
      {(data ?? []).map((scenario) => (
        <Card key={scenario.slug} className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              {scenario.difficulty}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {scenario.title}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {scenario.stepCount} steps
            </p>
          </div>
          <Button disabled={starting === scenario.slug} onClick={() => void start(scenario.slug)}>
            Start
          </Button>
        </Card>
      ))}
    </div>
  );
}

function Console({
  session: initialSession,
  onExit,
}: {
  session: AmadeusSession;
  onExit: () => void;
}) {
  const [session, setSession] = useState(initialSession);
  const [command, setCommand] = useState('');
  const [result, setResult] = useState<AmadeusCommandResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(0);

  const submit = async () => {
    if (!command.trim() || submitting) return;
    setSubmitting(true);
    try {
      const response = await amadeusService.submitCommand(session.id, {
        command: command.trim(),
        requestKey: newKey(),
      });
      setResult(response);
      setCommand('');
      setShowHint(0);
    } finally {
      setSubmitting(false);
    }
  };

  const continueToNext = () => {
    if (!result) return;
    setSession((prev) => ({
      ...prev,
      status: result.sessionStatus,
      combo: result.comboAtAnswer,
      currentStep: result.nextStep,
    }));
    setResult(null);
  };

  if (session.status === 'COMPLETED' && !result) {
    return (
      <Card className="space-y-4 text-center">
        <p className="text-3xl">✅</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Scenario complete!
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {session.scenario.title} -- {session.scenario.difficulty}
        </p>
        <Button onClick={onExit}>Back to Amadeus Practice</Button>
      </Card>
    );
  }

  const step = result ? null : session.currentStep;

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
            {session.scenario.difficulty} -- {session.scenario.title}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Passenger: {session.scenario.brief.passengerName} -- {session.scenario.brief.origin} →{' '}
            {session.scenario.brief.destination} ({session.scenario.brief.travelDate})
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          Combo {session.combo}x
        </span>
      </div>

      {result ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg font-black text-slate-900 dark:text-slate-100">{result.tier}</p>
          {result.xpAwarded > 0 ? (
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
              +{result.xpAwarded} XP
            </p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Not quite -- try this step again.
            </p>
          )}
          <Button onClick={continueToNext}>
            {result.sessionStatus === 'COMPLETED' ? 'See results' : 'Next step'}
          </Button>
        </div>
      ) : step ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/40">
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Step {step.orderIndex + 1} of {session.scenario.stepCount}: {step.title}
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{step.instruction}</p>
          </div>
          {showHint > 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hint: {step.hints[Math.min(showHint - 1, step.hints.length - 1)]}
            </p>
          ) : null}
          <div className="flex gap-3">
            <Input
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void submit();
                }
              }}
              placeholder="Type your command..."
              disabled={submitting}
              className="font-mono"
            />
            <Button variant="outline" onClick={() => setShowHint((v) => Math.min(v + 1, step.hints.length))}>
              Hint
            </Button>
            <Button onClick={() => void submit()} disabled={submitting || !command.trim()}>
              Submit
            </Button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onExit}
        className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        Exit to Amadeus Practice
      </button>
    </Card>
  );
}

export function AmadeusPage() {
  const [session, setSession] = useState<AmadeusSession | null>(null);

  if (session) {
    return <Console session={session} onExit={() => setSession(null)} />;
  }

  return <ScenarioList onStart={setSession} />;
}
