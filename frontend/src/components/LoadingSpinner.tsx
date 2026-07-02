export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
      <span>{label}</span>
    </div>
  );
}

