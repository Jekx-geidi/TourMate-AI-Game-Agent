import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuizCard } from '../components/QuizCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useGame } from '../hooks/use-game';
import { quizzesService } from '../services/quizzes.service';
import { subjectsService } from '../services/subjects.service';
import type { Quiz, Subject } from '../types';

type QuizResultView = {
  score: number;
  total: number;
  percentage: number;
  message: string;
  results: Array<{
    questionId: string;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    explanation: string;
  }>;
};

export function SubjectQuizPage() {
  const { id = '' } = useParams();
  const { addXp, recordEvent } = useGame();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResultView | null>(null);

  const subjectQuery = useQuery<Subject>({
    queryKey: ['subject', id],
    queryFn: () => subjectsService.get(id),
  });
  const quizQuery = useQuery<Quiz[]>({
    queryKey: ['quiz-subject', id],
    queryFn: () => quizzesService.bySubject(id),
  });

  const quiz = useMemo(() => quizQuery.data?.[0], [quizQuery.data]);
  // Shuffle the question order on every visit so the quiz never feels memorized.
  const shuffledQuestions = useMemo(() => {
    const questions = [...(quiz?.questions ?? [])];
    for (let i = questions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }, [quiz]);

  const submitMutation = useMutation({
    mutationFn: () =>
      quizzesService.submit(quiz!.id, {
        subjectId: id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
      }),
    onSuccess: (data) => {
      setResult(data);
      recordEvent('quiz-completed');
      if (data.percentage === 100) recordEvent('perfect-score');
      addXp(
        10 + Math.round(data.percentage / 5),
        `Quiz finished with ${data.percentage}%`,
      );
    },
  });

  if (subjectQuery.isLoading || quizQuery.isLoading) return <LoadingSpinner label="Loading quiz..." />;
  if (subjectQuery.isError || quizQuery.isError || !quiz || !subjectQuery.data) {
    return <ErrorMessage message="We could not load this quiz right now." />;
  }

  const subject = subjectQuery.data;

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-300">
          Practice Mode
        </p>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">{subject.code} Mastery Quiz</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Answer carefully, then review the explanations to deepen your understanding. Questions
          are shuffled every time. Want to pick topics and question styles?{' '}
          <Link to="/quiz-studio" className="font-semibold text-violet-600 dark:text-violet-400">
            Open the Quiz Studio
          </Link>
          .
        </p>
      </Card>

      <div className="space-y-4">
        {shuffledQuestions.map((question) => (
          <QuizCard
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(answer) => setAnswers((current) => ({ ...current, [question.id]: answer }))}
          />
        ))}
      </div>

      <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
        {submitMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
      </Button>

      {result ? (
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Quiz result</h2>
          <p className="text-lg font-semibold text-violet-700 dark:text-violet-300">
            Score: {result.score}/{result.total} ({result.percentage}%)
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{result.message}</p>
          <div className="space-y-3">
            {result.results.map((entry) => (
              <Card key={entry.questionId} className="bg-slate-50 dark:bg-slate-800/60">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{entry.question}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Your answer: {entry.selectedAnswer || 'No answer'} | Correct answer:{' '}
                  {entry.correctAnswer}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{entry.explanation}</p>
              </Card>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
