import { useMemo, useState } from 'react';
import { Check, ClipboardList, X } from 'lucide-react';
import { GameResult } from '../components/games/GameResult';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useGame } from '../hooks/use-game';
import type { BankQuestion, QuizMethod } from '../lib/question-bank';
import { buildQuiz, QUESTION_BANK, QUIZ_METHODS, QUIZ_TOPICS } from '../lib/question-bank';

const COUNT_OPTIONS = [5, 10, 15, 20, 30];

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
}

export function QuizStudioPage() {
  const { addXp, recordEvent } = useGame();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [method, setMethod] = useState<QuizMethod | 'mixed'>('mixed');
  const [count, setCount] = useState(10);
  const [quiz, setQuiz] = useState<BankQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const availableCount = useMemo(
    () =>
      QUESTION_BANK.filter(
        (q) =>
          (selectedTopics.length === 0 || selectedTopics.includes(q.topic)) &&
          (method === 'mixed' || q.type === method),
      ).length,
    [selectedTopics, method],
  );

  const start = () => {
    setQuiz(buildQuiz(selectedTopics, method, count));
    setIndex(0);
    setPicked(null);
    setTyped('');
    setCorrectCount(0);
    setFinished(false);
  };

  const question = quiz?.[index];
  const answered = picked !== null;
  const isCorrect =
    question && picked !== null
      ? question.type === 'identification'
        ? normalize(picked) === normalize(question.answer)
        : picked === question.answer
      : false;

  const submitAnswer = (value: string) => {
    if (!question || answered) return;
    setPicked(value);
    const correct =
      question.type === 'identification'
        ? normalize(value) === normalize(question.answer)
        : value === question.answer;
    if (correct) setCorrectCount((current) => current + 1);
  };

  const next = () => {
    if (!quiz) return;
    if (index + 1 >= quiz.length) {
      setFinished(true);
      const percent = Math.round((correctCount / quiz.length) * 100);
      addXp(10 + correctCount * 2, `Quiz Studio: ${correctCount}/${quiz.length}`);
      recordEvent('quiz-completed');
      if (percent === 100) recordEvent('perfect-score');
      return;
    }
    setIndex((current) => current + 1);
    setPicked(null);
    setTyped('');
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] brand-gradient p-6 text-white shadow-pop sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
            Practice Mode
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Quiz Studio</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            Build your own quiz: pick your topics, choose the question style, set how many items â€”
            every quiz is freshly shuffled from a bank of {QUESTION_BANK.length.toLocaleString()}{' '}
            questions.
          </p>
        </div>
      </div>

      {!quiz || finished ? (
        <>
          {finished && quiz ? (
            <GameResult
              mood={
                correctCount === quiz.length
                  ? 'perfect'
                  : correctCount / quiz.length >= 0.7
                    ? 'great'
                    : 'study'
              }
              headline={`${correctCount}/${quiz.length} correct (${Math.round((correctCount / quiz.length) * 100)}%)`}
              detail="Adjust your topics and method below, then run another shuffled round."
              xpEarned={10 + correctCount * 2}
              onPlayAgain={start}
            />
          ) : null}

          <Card className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                1 Â· Choose your topics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Leave everything unselected to draw from the whole bank.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUIZ_TOPICS.map(({ topic, count: topicCount }) => {
                  const active = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() =>
                        setSelectedTopics((current) =>
                          active
                            ? current.filter((item) => item !== topic)
                            : [...current, topic],
                        )
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? 'brand-gradient-r text-white shadow-pop'
                          : 'bg-white text-slate-600 ring-1 ring-cyan-100 hover:bg-cyan-50 dark:bg-slate-900 dark:text-slate-400 dark:ring-cyan-900/60 dark:hover:bg-cyan-900/30'
                      }`}
                    >
                      {active ? <Check className="h-3.5 w-3.5" /> : null}
                      {topic}
                      <span className={active ? 'text-white/70' : 'text-slate-400'}>
                        {topicCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                2 Â· Choose the method
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {QUIZ_METHODS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id)}
                    className={`rounded-2xl border p-3 text-left transition ${
                      method === item.id
                        ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-300 dark:bg-cyan-950/40 dark:ring-cyan-700'
                        : 'border-slate-200 bg-white hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-900'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                3 Â· How many items?
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {COUNT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCount(option)}
                    className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                      count === option
                        ? 'brand-gradient-r text-white shadow-pop'
                        : 'bg-white text-slate-600 ring-1 ring-cyan-100 hover:bg-cyan-50 dark:bg-slate-900 dark:text-slate-400 dark:ring-cyan-900/60 dark:hover:bg-cyan-900/30'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={start} disabled={availableCount === 0}>
                <ClipboardList className="mr-2 h-4 w-4" />
                Start shuffled quiz
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {availableCount.toLocaleString()} questions match your selection.
              </p>
            </div>
          </Card>
        </>
      ) : question ? (
        <Card className="space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span>
              Question {index + 1}/{quiz.length} Â· {question.topic}
            </span>
            <span>Correct: {correctCount}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-500 transition-all"
              style={{ width: `${(index / quiz.length) * 100}%` }}
            />
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {question.prompt}
          </p>

          {question.type === 'identification' ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={typed}
                  onChange={(event) => setTyped(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && typed.trim() && !answered) {
                      submitAnswer(typed);
                    }
                  }}
                  placeholder="Type your answer..."
                  disabled={answered}
                />
                <Button onClick={() => submitAnswer(typed)} disabled={!typed.trim() || answered}>
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              {(question.type === 'truefalse' ? ['True', 'False'] : question.options ?? []).map(
                (option) => {
                  const revealed = answered;
                  const isAnswer = option === question.answer;
                  const isPicked = picked === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={revealed}
                      onClick={() => submitAnswer(option)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        revealed && isAnswer
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : revealed && isPicked
                            ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'border-slate-200 bg-white text-slate-700 enabled:hover:border-cyan-300 enabled:hover:bg-cyan-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  );
                },
              )}
            </div>
          )}

          {answered ? (
            <div className="space-y-3">
              <p
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                  isCorrect
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                }`}
              >
                {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {isCorrect ? 'Correct!' : `Not quite â€” the answer is "${question.answer}".`}
              </p>
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                {question.explanation}
              </p>
              <div className="flex gap-3">
                <Button onClick={next}>
                  {index + 1 >= quiz.length ? 'Finish quiz' : 'Next question'}
                </Button>
                <Button variant="ghost" onClick={() => setQuiz(null)}>
                  Quit
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setQuiz(null)}>
              Quit quiz
            </Button>
          )}
        </Card>
      ) : null}
    </div>
  );
}
