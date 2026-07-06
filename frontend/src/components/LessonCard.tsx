import type { Lesson } from '../types';
import { Card } from './ui/card';

export function LessonCard({
  lesson,
  active,
  onClick,
}: {
  lesson: Lesson;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" className="w-full text-left" onClick={onClick}>
      <Card className={active ? 'border-violet-300 bg-violet-50/70' : ''}>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-300">
          Lesson {lesson.order}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{lesson.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{lesson.summary}</p>
      </Card>
    </button>
  );
}

