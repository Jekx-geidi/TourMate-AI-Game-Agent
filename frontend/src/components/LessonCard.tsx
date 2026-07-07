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
      <Card className={active ? 'border-cyan-300 bg-cyan-50/70' : ''}>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
          Lesson {lesson.order}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{lesson.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{lesson.summary}</p>
      </Card>
    </button>
  );
}

