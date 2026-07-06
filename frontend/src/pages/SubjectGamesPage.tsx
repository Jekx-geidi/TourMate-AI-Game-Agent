import { useMutation, useQuery } from '@tanstack/react-query';
import { Bot, Layers, Puzzle, Star, Timer } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flashcard as FlashcardComponent } from '../components/Flashcard';
import { GameCard } from '../components/GameCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MatchingGame } from '../components/games/MatchingGame';
import { ScenarioGame } from '../components/games/ScenarioGame';
import { SequenceGame } from '../components/games/SequenceGame';
import { TimedQuizGame } from '../components/games/TimedQuizGame';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useGame } from '../hooks/use-game';
import { SUBJECT_GAMES } from '../lib/subject-games';
import { flashcardsService } from '../services/flashcards.service';
import { progressService } from '../services/progress.service';
import { quizzesService } from '../services/quizzes.service';
import { subjectsService } from '../services/subjects.service';
import type { FlashcardItem, Quiz, Subject } from '../types';

export function SubjectGamesPage() {
  const { id = '' } = useParams();
  const { addXp, recordEvent } = useGame();
  const [cardIndex, setCardIndex] = useState(0);

  const updateProgress = useMutation({
    mutationFn: (percent: number) =>
      progressService.update({ subjectId: id, category: 'games', percent }),
  });

  const subjectQuery = useQuery<Subject>({
    queryKey: ['subject', id],
    queryFn: () => subjectsService.get(id),
  });
  const flashcardsQuery = useQuery<FlashcardItem[]>({
    queryKey: ['flashcards', id],
    queryFn: () => flashcardsService.bySubject(id),
  });
  const quizzesQuery = useQuery<Quiz[]>({
    queryKey: ['quiz-subject', id],
    queryFn: () => quizzesService.bySubject(id),
  });

  if (subjectQuery.isLoading || flashcardsQuery.isLoading || quizzesQuery.isLoading) {
    return <LoadingSpinner label="Loading the game arcade..." />;
  }

  const subject = subjectQuery.data;
  const config = subject ? SUBJECT_GAMES[subject.code] : undefined;
  const quiz = quizzesQuery.data?.[0];
  const timedQuestions = quiz?.questions.slice(0, 8) ?? [];
  const flashcards = flashcardsQuery.data ?? [];
  const currentCard = flashcards.length > 0 ? flashcards[cardIndex % flashcards.length] : null;

  const finishGame = (xp: number, reason: string, progressPercent: number) => {
    addXp(xp, reason);
    recordEvent('game-completed');
    updateProgress.mutate(progressPercent);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] brand-gradient p-8 text-white shadow-pop">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
            Game Mode
          </p>
          <h1 className="mt-2 text-4xl font-black">
            {subject ? `${subject.code} Arcade` : 'Subject Arcade'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            Every game earns XP toward your level and daily challenges. Beat the signature
            challenge, master the matching game, and survive the timed quiz!
          </p>
        </div>
      </div>

      {config ? (
        <GameCard
          title={config.signature.title}
          description={config.signature.description}
          icon={<Star className="h-5 w-5" />}
        >
          {config.signature.type === 'scenario' ? (
            <ScenarioGame
              scenarios={config.signature.scenarios}
              role={config.signature.role}
              onFinish={({ score, max }) =>
                finishGame(
                  35,
                  `${config.signature.title} finished`,
                  Math.max(30, Math.round((score / max) * 100)),
                )
              }
            />
          ) : (
            <SequenceGame
              steps={config.signature.steps}
              prompt={config.signature.prompt}
              onFinish={({ strikes }) =>
                finishGame(
                  30,
                  `${config.signature.title} finished`,
                  Math.max(30, 100 - strikes * 10),
                )
              }
            />
          )}
        </GameCard>
      ) : null}

      {config ? (
        <GameCard
          title={config.matchTitle}
          description={config.matchDescription}
          icon={<Puzzle className="h-5 w-5" />}
        >
          <MatchingGame
            pairs={config.matchPairs}
            onFinish={({ misses }) => {
              finishGame(25, `${config.matchTitle} finished`, Math.max(30, 100 - misses * 10));
              recordEvent('match-completed');
            }}
          />
        </GameCard>
      ) : null}

      <GameCard
        title="Timed Quiz Rush"
        icon={<Timer className="h-5 w-5" />}
        description="One question at a time, 15 seconds each. Build a streak and beat the clock!"
      >
        {timedQuestions.length > 0 ? (
          <TimedQuizGame
            questions={timedQuestions}
            onFinish={({ correct, total }) => {
              finishGame(
                40,
                'Timed Quiz Rush finished',
                Math.max(30, Math.round((correct / total) * 100)),
              );
              if (correct === total) recordEvent('perfect-score');
            }}
          />
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No quiz questions available for this subject yet.</p>
        )}
      </GameCard>

      <GameCard
        title="Flashcard Warm-up"
        icon={<Layers className="h-5 w-5" />}
        description="Flip the card, test yourself, then move to the next one."
      >
        {currentCard ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Card {(cardIndex % flashcards.length) + 1} of {flashcards.length}
            </p>
            <FlashcardComponent
              card={currentCard}
              onLearned={() => {
                addXp(5, 'Flashcard learned');
                setCardIndex((current) => current + 1);
              }}
              onReviewAgain={() => setCardIndex((current) => current + 1)}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No flashcards available for this subject yet.</p>
        )}
      </GameCard>

      {subject ? (
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Stuck on a game question? Your {config?.agentName ?? 'subject agent'} can explain it.
          </p>
          <Link to={`/subjects/${subject.id}/tutor`}>
            <Button variant="outline">
              <Bot className="mr-2 h-4 w-4" />
              Ask the {config?.agentName ?? 'Subject Agent'}
            </Button>
          </Link>
        </Card>
      ) : null}
    </div>
  );
}
