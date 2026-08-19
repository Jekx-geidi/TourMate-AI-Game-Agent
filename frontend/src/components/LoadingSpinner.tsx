import mascotLoading from '../assets/mascot-loading.png';

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-slate-500 dark:text-slate-400">
      <img src={mascotLoading} alt="" className="h-16 w-16 animate-bounce" />
      <span>{label}</span>
    </div>
  );
}
