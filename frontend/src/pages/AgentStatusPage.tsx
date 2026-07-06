import { useQuery } from '@tanstack/react-query';
import { AgentStatusCard } from '../components/AgentStatusCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { agentService } from '../services/agent.service';
import type { AgentStatus } from '../types';

export function AgentStatusPage() {
  const { data, isLoading, isError } = useQuery<AgentStatus>({
    queryKey: ['agent-status'],
    queryFn: agentService.status,
  });

  if (isLoading) return <LoadingSpinner label="Checking AI providers..." />;
  if (isError || !data) return <ErrorMessage message="We could not check the agent status right now." />;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">AI provider status</h1>
      <AgentStatusCard status={data} />
    </div>
  );
}

