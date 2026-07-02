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
      <Card className={active ? 'border-teal-300 bg-teal-50/70' : ''}>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          Lesson {lesson.order}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{lesson.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{lesson.summary}</p>
      </Card>
    </button>
  );
}

