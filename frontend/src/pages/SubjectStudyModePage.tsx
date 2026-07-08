import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  Flame,
  Gamepad2,
  Layers,
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useGame } from '../hooks/use-game';
import { progressService } from '../services/progress.service';
import { subjectsService } from '../services/subjects.service';
import type { Lesson, Subject } from '../types';

const FOCUS_OPTIONS = [10, 15, 25, 45];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function SubjectStudyModePage() {
  const { id = '' } = useParams();
  const { addXp, recordEvent } = useGame();
  const [focusMinutes, setFocusMinutes] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeQuest, setActiveQuest] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const subjectQuery = useQuery<Subject>({
    queryKey: ['subject', id],
    queryFn: () => subjectsService.get(id),
  });
  const lessonsQuery = useQuery<Lesson[]>({
    queryKey: ['subject-lessons', id],
    queryFn: () => subjectsService.lessons(id),
  });
  const updateProgress = useMutation({
    mutationFn: (percent: number) =>
      progressService.update({ subjectId: id, category: 'study', percent }),
  });

  const lessons = lessonsQuery.data ?? [];
  const quests = useMemo(
    () => [
      {
        id: 'read',
        icon: BookOpen,
        title: 'Read one lesson',
        detail: lessons[activeQuest % Math.max(lessons.length, 1)]?.title ?? 'Pick any lesson',
        href: `/subjects/${id}/lessons`,
      },
      {
        id: 'notes',
        icon: FileText,
        title: 'Write three recall notes',
        detail: 'Capture terms, examples, and one tourism application.',
        href: `/subjects/${id}/notes`,
      },
      {
        id: 'cards',
        icon: Layers,
        title: 'Flip five flashcards',
        detail: 'Say the answer before opening each card.',
        href: `/subjects/${id}/flashcards`,
      },
      {
        id: 'check',
        icon: ClipboardList,
        title: 'Take a checkpoint quiz',
        detail: 'Use mistakes as your next review list.',
        href: `/subjects/${id}/quiz`,
      },
    ],
    [activeQuest, id, lessons],
  );

  useEffect(() => {
    if (!timerRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setTimerRunning(false);
          addXp(20, 'Study focus round finished');
          recordEvent('game-completed');
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [addXp, recordEvent, timerRunning]);

  if (subjectQuery.isLoading || lessonsQuery.isLoading) {
    return <LoadingSpinner label="Loading Study Mode..." />;
  }
  if (subjectQuery.isError || lessonsQuery.isError || !subjectQuery.data) {
    return <ErrorMessage message="We could not load Study Mode for this subject." />;
  }

  const subject = subjectQuery.data;
  const progress = Math.round((completedQuests.length / quests.length) * 100);

  const selectFocus = (minutes: number) => {
    setFocusMinutes(minutes);
    setSecondsLeft(minutes * 60);
    setTimerRunning(false);
  };

  const completeQuest = (questId: string) => {
    if (completedQuests.includes(questId)) return;
    const next = [...completedQuests, questId];
    setCompletedQuests(next);
    const nextProgress = Math.round((next.length / quests.length) * 100);
    updateProgress.mutate(nextProgress);
    addXp(10, 'Study quest cleared');
    if (nextProgress >= 100) recordEvent('game-completed');
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#19053B] via-[#49316B] to-[#00C9A9] p-6 text-white shadow-pop sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
              Study Mode
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{subject.code} Study Board</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
              Turn this subject into a quick game loop: focus, clear quests, earn XP, and jump
              into the exact learning tool you need next.
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Study progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FBEAFF] to-[#00C9A9] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Card className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[#FBEAFF] p-2.5 text-[#49316B] ring-1 ring-[#49316B]/15 dark:bg-white/10 dark:text-[#FBEAFF] dark:ring-white/10">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Focus Round
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pick a sprint and start the timer.
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-mono text-5xl font-black text-[#19053B] dark:text-white">
              {formatTime(secondsLeft)}
            </p>
            <p className="mt-2 text-sm font-semibold text-[#49316B] dark:text-[#FBEAFF]">
              {focusMinutes}-minute study sprint
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {FOCUS_OPTIONS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => selectFocus(minutes)}
                className={`rounded-xl border px-2 py-2 text-sm font-bold transition ${
                  focusMinutes === minutes
                    ? 'border-[#00C9A9] bg-[#FBEAFF] text-[#19053B] ring-2 ring-[#00C9A9]/25 dark:bg-white/10 dark:text-[#FBEAFF]'
                    : 'border-[#49316B]/15 bg-white text-[#49316B] hover:border-[#00C9A9] dark:border-white/10 dark:bg-[#19053B] dark:text-[#FBEAFF]'
                }`}
              >
                {minutes}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setTimerRunning(true)}>
              <Play className="mr-2 h-4 w-4" />
              {timerRunning ? 'Running' : 'Start'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTimerRunning(false);
                setSecondsLeft(focusMinutes * 60);
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {quests.map((quest, index) => {
            const Icon = quest.icon;
            const done = completedQuests.includes(quest.id);
            return (
              <Card
                key={quest.id}
                className={`space-y-4 transition ${
                  activeQuest === index ? 'ring-2 ring-[#00C9A9]/60' : ''
                }`}
                onMouseEnter={() => setActiveQuest(index)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-gradient-to-br from-[#49316B] to-[#00C9A9] p-2.5 text-white shadow-pop">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {quest.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {quest.detail}
                      </p>
                    </div>
                  </div>
                  {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={quest.href}>
                    <Button variant={done ? 'outline' : 'primary'}>Open</Button>
                  </Link>
                  <Button variant="ghost" onClick={() => completeQuest(quest.id)}>
                    Mark done
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 text-[#00C9A9]" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Clear all four quests for a full study cycle.
          </p>
        </div>
        <Link to={`/subjects/${id}/games`}>
          <Button variant="secondary" className="w-full">
            <Gamepad2 className="mr-2 h-4 w-4" />
            Play subject games
          </Button>
        </Link>
        <Link to={`/subjects/${id}/tutor`}>
          <Button variant="outline" className="w-full">
            Ask Subject Agent
          </Button>
        </Link>
      </Card>
    </div>
  );
}
