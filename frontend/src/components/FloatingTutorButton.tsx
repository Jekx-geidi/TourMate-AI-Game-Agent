import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatBox } from './ChatBox';
import { aiService } from '../services/ai.service';

export function FloatingTutorButton() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-40" ref={panelRef}>
      {open ? (
        <div className="absolute bottom-full right-0 mb-3 max-h-[80vh] w-96 max-w-[90vw] overflow-y-auto">
          <ChatBox
            title="TourMate AI Tutor"
            placeholder="Ask: Explain MICE in simple terms..."
            onSend={(message) => aiService.chat({ message })}
          />
        </div>
      ) : null}

      <button
        type="button"
        aria-label={open ? 'Close TourMate AI Tutor chat' : 'Open TourMate AI Tutor chat'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-slate-950 to-cyan-700 text-white shadow-pop transition hover:from-slate-900 hover:to-cyan-600 sm:h-auto sm:w-auto sm:px-5 sm:py-3"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5 sm:h-4 sm:w-4" />}
        <span className="hidden text-sm font-semibold sm:inline">
          {open ? 'Close chat' : 'Ask TourMate AI Tutor'}
        </span>
      </button>
    </div>
  );
}
