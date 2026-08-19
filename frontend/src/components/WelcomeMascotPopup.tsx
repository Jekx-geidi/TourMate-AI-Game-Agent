import { useEffect, useState } from 'react';
import mascotWave from '../assets/mascot-wave.png';
import { Button } from './ui/button';
import { Input } from './ui/input';

const SEEN_KEY = 'tourmate_welcome_seen';
export const VISITOR_NAME_KEY = 'tourmate_visitor_name';

// One-time landing-page introduction for anonymous visitors. Purely a local,
// friendly touch -- not tied to a real account (that's the AI tutor's job,
// which uses the actual logged-in user's name instead).
export function WelcomeMascotPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(SEEN_KEY, 'true');
    setOpen(false);
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem(VISITOR_NAME_KEY, trimmed);
    }
    dismiss();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-slate-900">
        <img src={mascotWave} alt="TourMate mascot waving" className="mx-auto h-28 w-28" />
        <div className="mt-3 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-200">
          Hi, I&apos;m TourMate! How can I call you?
        </div>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <Button type="submit" className="w-full rounded-xl">
            Nice to meet you!
          </Button>
        </form>
        <button
          type="button"
          onClick={dismiss}
          className="mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
