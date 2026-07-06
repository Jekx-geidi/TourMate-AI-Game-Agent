import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flashcard } from '../components/Flashcard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/ui/card';
import { flashcardsService } from '../services/flashcards.service';
import { progressService } from '../services/progress.service';
import type { FlashcardItem } from '../types';

export function SubjectFlashcardsPage() {
  const { id = '' } = useParams();
  const [index, setIndex] = useState(0);
  const { data, isLoading } = useQuery<FlashcardItem[]>({
    queryKey: ['flashcards', id],
    queryFn: () => flashcardsService.bySubject(id),
  });
  const updateProgress = useMutation({
    mutationFn: (percent: number) =>
      progressService.update({ subjectId: id, category: 'flashcards', percent }),
  });

  const cards = useMemo(() => data ?? [], [data]);

  if (isLoading) return <LoadingSpinner label="Loading flashcards..." />;
  if (!cards.length) return <Card>No flashcards found for this subject.</Card>;

  const current = cards[index % cards.length];
  const percent = Math.round(((index + 1) / cards.length) * 100);

  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Flashcard review</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Flip the card, check your memory, and track your progress.
        </p>
      </Card>
      <Flashcard
        card={current}
        onLearned={() => {
          const nextPercent = Math.min(100, percent);
          updateProgress.mutate(nextPercent);
          setIndex((value) => (value + 1) % cards.length);
        }}
        onReviewAgain={() => setIndex((value) => (value + 1) % cards.length)}
      />
      <Card className="text-sm text-slate-600 dark:text-slate-400">Progress in this review set: {percent}%</Card>
    </div>
  );
}

