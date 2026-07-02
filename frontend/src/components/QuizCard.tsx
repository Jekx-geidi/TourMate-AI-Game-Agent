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
      <p className="font-semibold text-slate-900">{question.question}</p>
      <div className="grid gap-3">
        {options.map(([key, option]) => (
          <label
            key={key}
            className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition ${
              value === key
                ? 'border-teal-300 bg-teal-50 text-teal-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
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

