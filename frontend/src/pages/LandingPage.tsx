import { ArrowRight, Compass, MapPinned, MessageCircle, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { DotGridBackground } from '../components/DotGridBackground';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <DotGridBackground />
      <div className="relative mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200/80 bg-white/90 px-4 py-4 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:rounded-full sm:px-6 sm:py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TourMate AI logo" className="h-12 w-12 rounded-2xl bg-white p-2 shadow-soft" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-cyan-700 dark:text-cyan-300">TourMate AI</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Built for BS Tourism Management students</p>
            </div>
          </div>
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <Link className="w-full sm:w-auto" to="/login">
              <Button variant="outline" className="w-full">
                Log In
              </Button>
            </Link>
            <Link className="w-full sm:w-auto" to="/register">
              <Button className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-6 pb-8 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-16 lg:pt-16">
          <div>
            <p className="inline-flex rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-700 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-cyan-300">
              Interactive study hub
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-7xl">
              Learn tourism in a space that feels like motion, progress, and real direction.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              TourMate AI combines lessons, subject games, map drills, AI tutoring, notes, quizzes,
              and progress tracking into one polished dashboard for tourism students.
            </p>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link className="w-full sm:w-auto" to="/register">
                <Button className="w-full px-6 py-3 text-base">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link className="w-full sm:w-auto" to="/login">
                <Button variant="outline" className="w-full px-6 py-3 text-base">
                  Continue Your Journey
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card className="border border-slate-200/80 bg-white/90 p-5">
                <p className="text-3xl font-black text-cyan-700 dark:text-cyan-300">6</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Core tourism subjects</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  From MICE to airline operations and language basics.
                </p>
              </Card>
              <Card className="border border-slate-200/80 bg-white/90 p-5">
                <p className="text-3xl font-black text-cyan-700 dark:text-cyan-300">AI</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Study help on demand</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Ask for summaries, drills, explanations, and learning support.
                </p>
              </Card>
              <Card className="border border-slate-200/80 bg-white/90 p-5">
                <p className="text-3xl font-black text-cyan-700 dark:text-cyan-300">XP</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Gamified momentum</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Turn consistent review into streaks, badges, and progress gains.
                </p>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-5">
            <Card className="overflow-hidden border border-slate-800/70 brand-gradient p-0 text-white shadow-soft">
              <div className="grid gap-6 p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-8 lg:gap-8 lg:p-9">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">Today in TourMate</p>
                  <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                    Move from quick review to deep understanding without switching tools.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/78">
                    Open a subject, review lessons, test yourself, ask the tutor for help, and finish
                    with a challenge while your progress updates in one place.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-white/20 bg-white/12 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-white/75">Study Flow</p>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">Lesson review</div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">AI tutor explanation</div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">Quiz and flashcards</div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">XP gain and streak progress</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <Card className="border border-slate-200/80 bg-white/90 p-5 sm:p-6">
                <Compass className="h-10 w-10 text-cyan-700 dark:text-cyan-300" />
                <h3 className="mt-5 text-xl font-bold">Tourism-first lessons</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Learn destination development, hospitality, airline systems, and event planning
                  with clearer paths.
                </p>
              </Card>
              <Card className="border border-slate-200/80 bg-white/90 p-5 sm:p-6">
                <MessageCircle className="h-10 w-10 text-cyan-700 dark:text-cyan-300" />
                <h3 className="mt-5 text-xl font-bold">Supportive AI tutoring</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Ask for explanations in simple English and convert notes into quizzes, summaries, or
                  flashcards.
                </p>
              </Card>
              <Card className="border border-slate-200/80 bg-white/90 p-5 sm:p-6">
                <MapPinned className="h-10 w-10 text-cyan-700 dark:text-cyan-300" />
                <h3 className="mt-5 text-xl font-bold">Maps and travel drills</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Practice flags, capitals, destinations, and airport codes in a way that feels close
                  to the field.
                </p>
              </Card>
              <Card className="border border-slate-200/80 bg-white/90 p-5 sm:p-6">
                <Trophy className="h-10 w-10 text-cyan-700 dark:text-cyan-300" />
                <h3 className="mt-5 text-xl font-bold">Challenge-based progress</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Use study streaks, XP, games, and challenge loops to make consistency more visible
                  and rewarding.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="pb-10 sm:pb-12">
          <Card className="flex flex-col gap-6 border border-slate-200/80 bg-white/90 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-700 dark:text-cyan-300">Ready to board?</p>
              <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-slate-50 sm:text-3xl">
                Launch your tourism study system with one login.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Create an account to start lessons, use the AI tutor, and build steady momentum
                across your tourism subjects.
              </p>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Link className="w-full sm:w-auto" to="/register">
                <Button className="w-full">
                  Get Started
                </Button>
              </Link>
              <Link className="w-full sm:w-auto" to="/login">
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        <footer className="pb-8 text-center text-xs text-slate-400 dark:text-slate-500">
          <Link to="/terms" className="hover:text-slate-600 hover:underline dark:hover:text-slate-300">
            Terms & Conditions
          </Link>
          <span className="mx-2">|</span>
          <Link to="/privacy" className="hover:text-slate-600 hover:underline dark:hover:text-slate-300">
            Privacy Policy
          </Link>
          <span className="mx-2">|</span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Built for curious tourism students
          </span>
        </footer>
      </div>
    </div>
  );
}
