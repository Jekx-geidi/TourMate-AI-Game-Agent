import { useEffect } from 'react';
import { LottieLight } from 'lottie-react';
import doneAnimation from '../assets/done-animation.json';

// The app-wide "done" animation -- use this for save/complete confirmations
// instead of a plain text banner (profile saved, quiz submitted, etc.).
export function SuccessOverlay({
  message,
  onDone,
  durationMs = 1800,
}: {
  message: string;
  onDone?: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    if (!onDone) return;
    const timer = setTimeout(onDone, durationMs);
    return () => clearTimeout(timer);
  }, [onDone, durationMs]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-2 rounded-3xl bg-white px-8 py-8 text-center shadow-2xl dark:bg-slate-900">
        <LottieLight src={doneAnimation} loop={false} autoplay className="h-28 w-28" />
        <p className="text-base font-bold text-slate-900 dark:text-slate-100">{message}</p>
      </div>
    </div>
  );
}
