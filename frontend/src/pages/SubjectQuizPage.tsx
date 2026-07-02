import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuizCard } from '../components/QuizCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
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

  const submitMutation = useMutation({
    mutationFn: () =>
      quizzesService.submit(quiz!.id, {
        subjectId: id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
      }),
    onSuccess: (data) => setResult(data),
  });

  if (subjectQuery.isLoading || quizQuery.isLoading) return <LoadingSpinner label="Loading quiz..." />;
  if (subjectQuery.isError || quizQuery.isError || !quiz || !subjectQuery.data) {
    return <ErrorMessage message="We could not load this quiz right now." />;
  }

  const subject = subjectQuery.data;

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
          Practice Mode
        </p>
        <h1 className="text-3xl font-black text-slate-950">{subject.code} Mastery Quiz</h1>
        <p className="text-sm text-slate-600">
          Answer carefully, then review the explanations to deepen your understanding.
        </p>
      </Card>

      <div className="space-y-4">
        {quiz.questions.map((question) => (
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
          <h2 className="text-2xl font-bold text-slate-900">Quiz result</h2>
          <p className="text-lg font-semibold text-teal-700">
            Score: {result.score}/{result.total} ({result.percentage}%)
          </p>
          <p className="text-sm text-slate-600">{result.message}</p>
          <div className="space-y-3">
            {result.results.map((entry) => (
              <Card key={entry.questionId} className="bg-slate-50">
                <p className="font-semibold text-slate-900">{entry.question}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Your answer: {entry.selectedAnswer || 'No answer'} | Correct answer:{' '}
                  {entry.correctAnswer}
                </p>
                <p className="mt-2 text-sm text-slate-600">{entry.explanation}</p>
              </Card>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
