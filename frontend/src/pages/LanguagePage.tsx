import { useMemo, useState } from 'react';
import { GraduationCap, Volume2 } from 'lucide-react';
import { ChatBox } from '../components/ChatBox';
import { GameResult } from '../components/games/GameResult';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useGame } from '../hooks/use-game';
import type { LanguagePhrase, TeachableLanguage } from '../lib/language-data';
import { LANGUAGES, speakPhrase } from '../lib/language-data';
import { aiService } from '../services/ai.service';

const TEST_ROUNDS = 5;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function PhraseTest({ language }: { language: TeachableLanguage }) {
  const { addXp, recordEvent } = useGame();
  const [round, setRound] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const rounds = useMemo(
    () =>
      shuffle(language.phrases)
        .slice(0, TEST_ROUNDS)
        .map((phrase) => ({
          phrase,
          options: shuffle([
            phrase.english,
            ...shuffle(language.phrases.filter((p) => p.english !== phrase.english))
              .slice(0, 3)
              .map((p) => p.english),
          ]),
        })),
    [language, gameKey],
  );

  const current = rounds[round];

  const pick = (option: string) => {
    if (picked) return;
    setPicked(option);
    const correct = option === current.phrase.english;
    const finalScore = correct ? score + 1 : score;
    if (correct) setScore(finalScore);
    window.setTimeout(() => {
      if (round + 1 >= rounds.length) {
        setFinished(true);
        addXp(10 + finalScore * 4, `${language.name} phrase test finished`);
        recordEvent('game-completed');
      } else {
        setRound((value) => value + 1);
        setPicked(null);
      }
    }, 1200);
  };

  const reset = () => {
    setGameKey((value) => value + 1);
    setRound(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <GameResult
        mood={score === TEST_ROUNDS ? 'perfect' : score >= 3 ? 'great' : 'study'}
        headline={`${score}/${TEST_ROUNDS} phrases understood!`}
        detail={
          score === TEST_ROUNDS
            ? `Fantastic listening â€” your ${language.name} is taking off!`
            : 'Listen to the phrases again and retake the test to beat your score.'
        }
        xpEarned={10 + score * 4}
        onPlayAgain={reset}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Round {round + 1}/{rounds.length} Â· Score: {score}
      </p>
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5 text-center dark:border-cyan-900/60 dark:bg-cyan-950/40">
        <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
          {current.phrase.translation}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">â€œ{current.phrase.say}â€</p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => speakPhrase(current.phrase.translation, language.locale)}
        >
          <Volume2 className="mr-2 h-4 w-4" />
          Listen
        </Button>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">What does this phrase mean?</p>
      <div className="grid gap-2 md:grid-cols-2">
        {current.options.map((option) => {
          const revealed = picked !== null;
          const isAnswer = option === current.phrase.english;
          const isPicked = picked === option;
          return (
            <button
              key={option}
              type="button"
              disabled={revealed}
              onClick={() => pick(option)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
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
        })}
      </div>
    </div>
  );
}

export function LanguagePage() {
  const [selected, setSelected] = useState<TeachableLanguage>(LANGUAGES[0]);
  const { recordEvent } = useGame();

  const speak = (phrase: LanguagePhrase) => {
    const spoke = speakPhrase(phrase.translation, selected.locale);
    if (!spoke) {
      window.alert('Speech is not supported in this browser.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] brand-gradient p-6 text-white shadow-pop sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
            Language Mode
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Language Teacher</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            Pick a language, tap the speaker to hear every phrase spoken aloud, then let the
            teacher test you. Perfect for welcoming guests from around the world!
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((language) => (
          <button
            key={language.id}
            type="button"
            onClick={() => setSelected(language)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
              selected.id === language.id
                ? 'brand-gradient-r text-white shadow-pop'
                : 'bg-white text-slate-600 ring-1 ring-cyan-100 hover:bg-cyan-50 dark:bg-slate-900 dark:text-slate-400 dark:ring-cyan-900/60 dark:hover:bg-cyan-900/30'
            }`}
          >
            {language.name}
          </button>
        ))}
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {selected.name} survival phrases
          </h2>
          <span className="rounded-full bg-cyan-100 px-4 py-1.5 text-sm font-bold text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
            {selected.hello}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tap the speaker to hear the phrase in {selected.name}.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {selected.phrases.map((phrase) => (
            <div
              key={phrase.english}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {phrase.english}
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {phrase.translation}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">â€œ{phrase.say}â€</p>
              </div>
              <button
                type="button"
                aria-label={`Listen to "${phrase.translation}" in ${selected.name}`}
                onClick={() => speak(phrase)}
                className="shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-500 p-3 text-white shadow-pop transition hover:opacity-90"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-500 p-2.5 text-white shadow-pop">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Teacher's test: {selected.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Listen to the phrase, then pick what it means. Five rounds, XP for every correct
              answer.
            </p>
          </div>
        </div>
        <PhraseTest key={selected.id} language={selected} />
      </Card>

      <ChatBox
        title={`AI Language Teacher â€” ${selected.name}`}
        subtitle="Ask for new phrases, pronunciation tips, or roleplay a guest conversation."
        placeholder={`Ask: How do I say "enjoy your meal" in ${selected.name}?`}
        intro={`${selected.hello} I am your AI language teacher. Ask me anything about ${selected.name} for tourism â€” greetings, hotel phrases, pronunciation, or let's roleplay a check-in conversation!`}
        suggestions={[
          `Teach me 3 more hotel phrases in ${selected.name}.`,
          `How do I pronounce "${selected.phrases[0].translation}" correctly?`,
          `Roleplay: I am a guest checking in, you are the receptionist speaking ${selected.name}.`,
        ]}
        onSend={(message) => {
          recordEvent('agent-question');
          return aiService.chat({
            message: `[Language practice: ${selected.name}] ${message}`,
            subjectCode: 'FOLA01',
          });
        }}
      />
    </div>
  );
}
