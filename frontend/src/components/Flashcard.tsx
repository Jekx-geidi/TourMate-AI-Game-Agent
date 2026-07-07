import { useState } from 'react';
import type { FlashcardItem } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function Flashcard({
  card,
  onLearned,
  onReviewAgain,
}: {
  card: FlashcardItem;
  onLearned?: () => void;
  onReviewAgain?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card className="space-y-5 text-center">
      <button
        type="button"
        className="flex min-h-64 w-full items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-50 dark:from-cyan-950/40 to-cyan-50 dark:to-cyan-950/30 p-8 text-left"
        onClick={() => setFlipped((current) => !current)}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
            {flipped ? 'Answer' : 'Question'}
          </p>
          <p className="mt-4 text-2xl font-bold leading-relaxed text-slate-900 dark:text-slate-100">
            {flipped ? card.back : card.front}
          </p>
        </div>
      </button>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onReviewAgain}>
          Review Again
        </Button>
        <Button variant="primary" onClick={onLearned}>
          Learned
        </Button>
      </div>
    </Card>
  );
}

