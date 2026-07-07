import type { QuizQuestion } from '../types';
import { Card } from './ui/card';

export function QuizCard({
  question,
  value,
  onChange,
}: {
  question: QuizQuestion;
  value?: string;
  onChange: (answer: string) => void;
}) {
  const options = [
    ['A', question.optionA],
    ['B', question.optionB],
    ['C', question.optionC],
    ['D', question.optionD],
  ] as const;

  return (
    <Card className="space-y-4">
      <p className="font-semibold text-slate-900 dark:text-slate-100">{question.question}</p>
      <div className="grid gap-3">
        {options.map(([key, option]) => (
          <label
            key={key}
            className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition ${
              value === key
                ? 'border-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <input
              className="mr-3"
              type="radio"
              name={question.id}
              checked={value === key}
              onChange={() => onChange(key)}
            />
            {key}. {option}
          </label>
        ))}
      </div>
    </Card>
  );
}

