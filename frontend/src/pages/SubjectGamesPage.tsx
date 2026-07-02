import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flashcard as FlashcardComponent } from '../components/Flashcard';
import { GameCard } from '../components/GameCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { flagChoices, matchPairs } from '../lib/static-data';
import { flashcardsService } from '../services/flashcards.service';
import { progressService } from '../services/progress.service';
import { quizzesService } from '../services/quizzes.service';
import type { FlashcardItem, Quiz } from '../types';

export function SubjectGamesPage() {
  const { id = '' } = useParams();
  const [gameAnswers, setGameAnswers] = useState<Record<string, string>>({});
  const [timer, setTimer] = useState(60);
  const [flagChoice, setFlagChoice] = useState('');
  const [flagScore, setFlagScore] = useState<number | null>(null);
  const updateProgress = useMutation({
    mutationFn: (percent: number) =>
      progressService.update({ subjectId: id, category: 'games', percent }),
  });

  const flashcardsQuery = useQuery<FlashcardItem[]>({
    queryKey: ['flashcards', id],
    queryFn: () => flashcardsService.bySubject(id),
  });
  const quizzesQuery = useQuery<Quiz[]>({
    queryKey: ['quiz-subject', id],
    queryFn: () => quizzesService.bySubject(id),
  });

  const quiz = quizzesQuery.data?.[0];
  const timedQuestions = useMemo(() => quiz?.questions.slice(0, 10) ?? [], [quiz]);
  const currentFlag = flagChoices[0];
  const answeredCount = Object.keys(gameAnswers).length;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimer((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (flashcardsQuery.isLoading || quizzesQuery.isLoading) {
    return <LoadingSpinner label="Loading study games..." />;
  }

  return (
    <div className="grid gap-6">
      <GameCard
        title="Flashcard Flip Game"
        description="Click to flip the card, then mark if you learned it or need another review."
      >
        {flashcardsQuery.data?.[0] ? (
          <FlashcardComponent
            card={flashcardsQuery.data[0]}
            onLearned={() => updateProgress.mutate(35)}
            onReviewAgain={() => updateProgress.mutate(15)}
          />
        ) : (
          <Card>No flashcards available for this game.</Card>
        )}
      </GameCard>

      <GameCard
        title="Timed Quiz Game"
        description="Answer 10 questions before time runs out and then compare with the correct answers."
      >
        <p className="text-sm font-semibold text-amber-600">
          Time left: {timer}s | Answers marked: {answeredCount}/{timedQuestions.length}
        </p>
        <div className="grid gap-3">
          {timedQuestions.map((question) => (
            <Card key={question.id} className="bg-slate-50">
              <p className="font-semibold text-slate-900">{question.question}</p>
              <div className="mt-3 grid gap-2">
                {(['A', 'B', 'C', 'D'] as const).map((letter) => (
                  <label key={letter} className="text-sm text-slate-600">
                    <input
                      className="mr-2"
                      type="radio"
                      name={`timed-${question.id}`}
                      onChange={() =>
                        setGameAnswers((current) => ({ ...current, [question.id]: letter }))
                      }
                    />
                    {letter}
                  </label>
                ))}
              </div>
              {timer === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Correct answer: {question.answer} | {question.explanation}
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      </GameCard>

      <GameCard
        title="Match the Term Game"
        description="Read the tourism term and match it with the correct meaning."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {matchPairs.map((pair) => (
            <Card key={pair.term} className="bg-slate-50">
              <p className="font-semibold text-slate-900">{pair.term}</p>
              <p className="mt-2 text-sm text-slate-600">{pair.definition}</p>
            </Card>
          ))}
        </div>
      </GameCard>

      <GameCard
        title="Flag Guessing Game"
        description="Pick the correct country for the flag and see your score immediately."
      >
        <p className="text-6xl">{currentFlag.flag}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {flagChoices.map((choice) => (
            <Button key={choice.country} variant="outline" onClick={() => setFlagChoice(choice.country)}>
              {choice.country}
            </Button>
          ))}
        </div>
        <Button
          onClick={() => {
            const score = flagChoice === currentFlag.country ? 100 : 0;
            setFlagScore(score);
            updateProgress.mutate(score === 100 ? 50 : 20);
          }}
          disabled={!flagChoice}
        >
          Check answer
        </Button>
        {flagScore !== null ? (
          <Card className="bg-slate-50 text-sm text-slate-700">
            {flagChoice === currentFlag.country
              ? 'Correct! Great job identifying the flag.'
              : `Not quite. The correct answer is ${currentFlag.country}.`}
          </Card>
        ) : null}
      </GameCard>
    </div>
  );
}
