import type { AgentStatus } from '../types';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

export function AgentStatusCard({ status }: { status: AgentStatus }) {
  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Hermes: {status.hermesStatus}</Badge>
        <Badge className="bg-blue-50 text-blue-700">
          OpenRouter: {status.openRouterStatus}
        </Badge>
        <Badge className="bg-amber-50 text-amber-700">
          Provider: {status.currentProvider}
        </Badge>
      </div>
      <p className="text-sm leading-6 text-slate-700">{status.message}</p>
      <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <p>Last checked: {status.lastCheckedTime ?? 'Not checked yet'}</p>
        <p>Last response provider: {status.lastAiResponseProvider}</p>
        <p className="md:col-span-2">{status.studyActivitySummary}</p>
      </div>
    </Card>
  );
}

