import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ChatBox } from '../components/ChatBox';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useGame } from '../hooks/use-game';
import { DEFAULT_AGENT, SUBJECT_GAMES } from '../lib/subject-games';
import { aiService } from '../services/ai.service';
import { subjectsService } from '../services/subjects.service';
import type { Subject } from '../types';

export function SubjectTutorPage() {
  const { id = '' } = useParams();
  const { recordEvent } = useGame();
  const subjectQuery = useQuery<Subject>({
    queryKey: ['subject', id],
    queryFn: () => subjectsService.get(id),
  });

  if (subjectQuery.isLoading) return <LoadingSpinner label="Waking up your subject agent..." />;
  if (subjectQuery.isError || !subjectQuery.data) {
    return <ErrorMessage message="This subject agent could not be loaded." />;
  }

  const subject = subjectQuery.data;
  const agent = SUBJECT_GAMES[subject.code] ?? DEFAULT_AGENT;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] brand-gradient p-8 text-white shadow-pop">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
            Subject Agent
          </p>
          <h1 className="mt-2 text-3xl font-black">
            {subject.code} {agent.agentName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            A dedicated AI tutor trained on {subject.title}. Ask questions, request quizzes, or get
            simple explanations — every question also counts toward your daily challenges!
          </p>
        </div>
      </div>

      <ChatBox
        title={`${agent.agentName} — ${subject.title}`}
        subtitle="Ask anything about this subject, or tap a suggested question below."
        placeholder={`Ask your ${subject.code} question...`}
        intro={agent.agentIntro}
        suggestions={agent.agentSuggestions}
        onSend={(message) => {
          recordEvent('agent-question');
          return aiService.chat({
            message,
            subjectCode: subject.code,
            subjectId: subject.id,
          });
        }}
      />
    </div>
  );
}
