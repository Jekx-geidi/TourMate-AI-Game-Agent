import { LottieLight } from 'lottie-react';
import loadingAnimation from '../assets/loading-animation.json';

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-slate-500 dark:text-slate-400">
      <LottieLight src={loadingAnimation} loop autoplay className="h-16 w-16" />
      <span>{label}</span>
    </div>
  );
}
