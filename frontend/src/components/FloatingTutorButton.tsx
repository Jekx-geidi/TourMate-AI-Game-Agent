import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FloatingTutorButton() {
  return (
    <Link
      to="/ai-tutor"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-teal-800"
    >
      <MessageCircle className="h-4 w-4" />
      Ask TourMate AI Tutor
    </Link>
  );
}

