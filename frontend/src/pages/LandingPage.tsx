import { ArrowRight, BookOpen, Globe, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { AuroraBackground } from '../components/AuroraBackground';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="max-w-3xl flex-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TourMate Game logo" className="h-16 w-16" />
            <p className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-violet-700 backdrop-blur dark:bg-slate-900/70 dark:text-violet-300">
              TourMate Game
            </p>
          </div>
          <h1 className="mt-6 text-5xl font-black leading-tight text-slate-950 dark:text-white sm:text-6xl">
            Study tourism with a smarter, warmer, more motivating workspace.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            TourMate helps BS Tourism Management students learn lessons, take notes, review
            flashcards, play study games, explore the world map, and ask a supportive AI tutor for
            help — earning XP and badges along the way.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register">
              <Button className="px-6 py-3 text-base">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-6 py-3 text-base">
                Log In
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="font-semibold text-violet-600 underline dark:text-violet-400">
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-semibold text-violet-600 underline dark:text-violet-400">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="grid flex-1 gap-5">
          <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 text-white">
            <BookOpen className="h-10 w-10" />
            <h2 className="mt-6 text-2xl font-bold text-white">Lessons and review paths</h2>
            <p className="mt-3 text-sm leading-6 text-violet-50">
              Study Tourism, Airline Management, MICE, language basics, and more with guided
              lessons and summaries.
            </p>
          </Card>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <MessageCircle className="h-8 w-8 text-amber-500" />
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">AI Tutor</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Beginner-friendly support for explanations, study plans, and review.
              </p>
            </Card>
            <Card>
              <Globe className="h-8 w-8 text-blue-600" />
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">Maps and flags</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Practice countries, capitals, destinations, and airport codes.
              </p>
            </Card>
          </div>
        </div>
      </section>
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        <span className="mx-2">·</span>
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
      </footer>
    </div>
  );
}
