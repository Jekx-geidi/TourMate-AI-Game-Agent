import type { AgentStatus } from '../types';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

function formatProviderName(value: string) {
  return value.toLowerCase() === 'openrouter' ? 'TOURMATE AGENT' : value;
}

export function AgentStatusCard({ status }: { status: AgentStatus }) {
  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Hermes: {status.hermesStatus}</Badge>
        <Badge className="bg-blue-50 text-blue-700">
          TOURMATE AGENT: {status.openRouterStatus}
        </Badge>
        <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
          Provider: {formatProviderName(status.currentProvider)}
        </Badge>
      </div>
      <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{status.message}</p>
      <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-400 md:grid-cols-2">
        <p>Last checked: {status.lastCheckedTime ?? 'Not checked yet'}</p>
        <p>Last response provider: {formatProviderName(status.lastAiResponseProvider)}</p>
        <p className="md:col-span-2">{status.studyActivitySummary}</p>
      </div>
    </Card>
  );
}

