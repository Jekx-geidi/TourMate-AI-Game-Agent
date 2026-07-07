import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { Button } from '../ui/button';
import { GameResult } from './GameResult';
import type { QuizQuestion } from '../../types';

export function TimedQuizGame({
  questions,
  secondsPerQuestion = 15,
  onFinish,
  xpReward = 40,
}: {
  questions: QuizQuestion[];
  secondsPerQuestion?: number;
  onFinish: (result: { correct: number; total: number }) => void;
  xpReward?: number;
}) {
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(secondsPerQuestion);
  const [picked, setPicked] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const answered = picked !== null || timedOut;

  useEffect(() => {
    if (answered || finished) return;
    if (timeLeft <= 0) {
      setTimedOut(true);
      setStreak(0);
      return;
    }
    const timeout = window.setTimeout(() => setTimeLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [timeLeft, answered, finished]);

  if (!question) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No quiz questions available yet for this subject.</p>;
  }

  const options = [
    ['A', question.optionA],
    ['B', question.optionB],
    ['C', question.optionC],
    ['D', question.optionD],
  ] as const;

  const pick = (letter: string) => {
    if (answered) return;
    setPicked(letter);
    if (letter === question.answer) {
      setCorrectCount((current) => current + 1);
      setStreak((current) => current + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
      onFinish({ correct: correctCount, total: questions.length });
      return;
    }
    setIndex((current) => current + 1);
    setPicked(null);
    setTimedOut(false);
    setTimeLeft(secondsPerQuestion);
  };

  const reset = () => {
    setIndex(0);
    setTimeLeft(secondsPerQuestion);
    setPicked(null);
    setTimedOut(false);
    setCorrectCount(0);
    setStreak(0);
    setFinished(false);
  };

  if (finished) {
    const percent = Math.round((correctCount / questions.length) * 100);
    return (
      <GameResult
        mood={percent === 100 ? 'perfect' : percent >= 70 ? 'great' : 'study'}
        headline={`${correctCount}/${questions.length} correct (${percent}%)`}
        detail={
          percent === 100
            ? 'Perfect score under pressure â€” incredible!'
            : percent >= 70
              ? 'Strong performance! Review the ones you missed and go for 100%.'
              : 'Nice try! Study the lessons and beat your score next round.'
        }
        xpEarned={xpReward}
        onPlayAgain={reset}
      />
    );
  }

  const timerPercent = (timeLeft / secondsPerQuestion) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-slate-500 dark:text-slate-400">
          Question {index + 1}/{questions.length}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          Correct: {correctCount}
          {streak >= 2 ? (
            <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
              <Flame className="h-3.5 w-3.5" /> {streak} streak
            </span>
          ) : null}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            timerPercent > 50 ? 'bg-cyan-500' : timerPercent > 25 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${answered ? 100 : timerPercent}%` }}
        />
      </div>
      <p className="text-xs font-semibold text-slate-400">
        {answered ? (timedOut ? "Time's up!" : 'Answered!') : `${timeLeft}s remaining`}
      </p>
      <p className="font-semibold text-slate-900 dark:text-slate-100">{question.question}</p>
      <div className="grid gap-2">
        {options.map(([letter, text]) => {
          const isCorrectAnswer = letter === question.answer;
          const isPicked = picked === letter;
          return (
            <button
              key={letter}
              type="button"
              disabled={answered}
              onClick={() => pick(letter)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                answered && isCorrectAnswer
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : answered && isPicked
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 enabled:hover:border-cyan-300 enabled:hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20'
              }`}
            >
              <span className="font-bold">{letter}.</span> {text}
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className="space-y-3">
          <p className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-sm text-slate-600 dark:text-slate-400">
            {question.explanation}
          </p>
          <Button onClick={next}>
            {index + 1 >= questions.length ? 'Finish game' : 'Next question'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
