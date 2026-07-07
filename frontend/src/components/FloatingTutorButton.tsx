import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FloatingTutorButton() {
  return (
    <Link
      to="/ai-tutor"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full bg-gradient-to-r from-slate-950 to-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-pop transition hover:from-slate-900 hover:to-cyan-600"
    >
      <MessageCircle className="h-4 w-4" />
      Ask TourMate AI Tutor
    </Link>
  );
}
