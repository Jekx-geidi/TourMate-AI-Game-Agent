import { ArrowRight, Compass, MapPinned, MessageCircle, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { DotGridBackground } from '../components/DotGridBackground';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f8ff] text-slate-950">
      <DotGridBackground />
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/80 bg-white/78 px-5 py-3 shadow-soft backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TourMate AI logo" className="h-12 w-12 rounded-2xl bg-white p-2 shadow-soft" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-[#151a66]/70">TourMate AI</p>
              <p className="text-sm text-slate-500">Built for BS Tourism Management students</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="border-[#151a66]/20 text-[#151a66]">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#151a66] text-white hover:bg-[#0f1451]">
                Create Account
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-10 pb-10 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-16 lg:pt-16">
          <div>
            <p className="inline-flex rounded-full border border-[#151a66]/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#151a66] shadow-soft backdrop-blur">
              Interactive study hub
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl">
              Learn tourism in a space that feels like motion, progress, and real direction.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              TourMate AI combines lessons, subject games, map drills, AI tutoring, notes, quizzes,
              and progress tracking into one polished dashboard for tourism students.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register">
                <Button className="bg-[#151a66] px-6 py-3 text-base text-white hover:bg-[#0f1451]">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-[#151a66]/20 px-6 py-3 text-base text-[#151a66]">
                  Continue Your Journey
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Card className="border border-white/90 bg-white/78 p-5">
                <p className="text-3xl font-black text-[#151a66]">6</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Core tourism subjects</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  From MICE to airline operations and language basics.
                </p>
              </Card>
              <Card className="border border-white/90 bg-white/78 p-5">
                <p className="text-3xl font-black text-sky-600">AI</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Study help on demand</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ask for summaries, drills, explanations, and learning support.
                </p>
              </Card>
              <Card className="border border-white/90 bg-white/78 p-5">
                <p className="text-3xl font-black text-emerald-600">XP</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Gamified momentum</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Turn consistent review into streaks, badges, and progress gains.
                </p>
              </Card>
            </div>
          </div>

          <div className="grid gap-5">
            <Card className="overflow-hidden border border-[#151a66]/10 bg-[linear-gradient(135deg,rgba(21,26,102,0.98),rgba(32,85,176,0.94))] p-0 text-white shadow-[0_35px_90px_-35px_rgba(21,26,102,0.75)]">
              <div className="grid gap-8 p-8 sm:grid-cols-[1.1fr_0.9fr] sm:p-9">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">Today in TourMate</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight">
                    Move from quick review to deep understanding without switching tools.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/78">
                    Open a subject, review lessons, test yourself, ask the tutor for help, and finish
                    with a challenge while your progress updates in one place.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
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

            <div className="grid gap-5 sm:grid-cols-2">
              <Card className="border border-white/90 bg-white/80 p-6">
                <Compass className="h-10 w-10 text-[#151a66]" />
                <h3 className="mt-5 text-xl font-bold">Tourism-first lessons</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Learn destination development, hospitality, airline systems, and event planning
                  with clearer paths.
                </p>
              </Card>
              <Card className="border border-white/90 bg-white/80 p-6">
                <MessageCircle className="h-10 w-10 text-sky-600" />
                <h3 className="mt-5 text-xl font-bold">Supportive AI tutoring</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Ask for explanations in simple English and convert notes into quizzes, summaries, or
                  flashcards.
                </p>
              </Card>
              <Card className="border border-white/90 bg-white/80 p-6">
                <MapPinned className="h-10 w-10 text-emerald-600" />
                <h3 className="mt-5 text-xl font-bold">Maps and travel drills</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Practice flags, capitals, destinations, and airport codes in a way that feels close
                  to the field.
                </p>
              </Card>
              <Card className="border border-white/90 bg-white/80 p-6">
                <Trophy className="h-10 w-10 text-amber-500" />
                <h3 className="mt-5 text-xl font-bold">Challenge-based progress</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Use study streaks, XP, games, and challenge loops to make consistency more visible
                  and rewarding.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <Card className="flex flex-col gap-6 border border-white/90 bg-white/82 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#151a66]">Ready to board?</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Launch your tourism study system with one login.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Create an account to start lessons, use the AI tutor, and build steady momentum
                across your tourism subjects.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button className="bg-[#151a66] text-white hover:bg-[#0f1451]">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-[#151a66]/20 text-[#151a66]">
                  Log In
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        <footer className="pb-8 text-center text-xs text-slate-400">
          <Link to="/terms" className="hover:text-slate-600 hover:underline">
            Terms & Conditions
          </Link>
          <span className="mx-2">·</span>
          <Link to="/privacy" className="hover:text-slate-600 hover:underline">
            Privacy Policy
          </Link>
          <span className="mx-2">·</span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Built for curious tourism students
          </span>
        </footer>
      </div>
    </div>
  );
}
