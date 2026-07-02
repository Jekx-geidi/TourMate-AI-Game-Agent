import { ArrowRight, BookOpen, Globe, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="max-w-3xl flex-1">
          <p className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
            Tourism Learning Companion
          </p>
          <h1 className="mt-6 text-5xl font-black leading-tight text-slate-950 sm:text-6xl">
            Study tourism with a smarter, warmer, more motivating workspace.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            TourMate AI helps BS Tourism Management students learn lessons, take notes,
            review flashcards, play study games, practice maps and flags, and ask a
            supportive AI tutor for help.
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
        </div>
        <div className="grid flex-1 gap-5">
          <Card className="bg-gradient-to-br from-teal-700 to-blue-600 text-white">
            <BookOpen className="h-10 w-10" />
            <h2 className="mt-6 text-2xl font-bold text-white">Lessons and review paths</h2>
            <p className="mt-3 text-sm leading-6 text-teal-50">
              Study Tourism, Airline Management, MICE, language basics, and more with
              guided lessons and summaries.
            </p>
          </Card>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <MessageCircle className="h-8 w-8 text-amber-500" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">AI Tutor</h3>
              <p className="mt-2 text-sm text-slate-600">
                Beginner-friendly support for explanations, study plans, and review.
              </p>
            </Card>
            <Card>
              <Globe className="h-8 w-8 text-blue-600" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">Maps and flags</h3>
              <p className="mt-2 text-sm text-slate-600">
                Practice countries, capitals, destinations, and airport codes.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

