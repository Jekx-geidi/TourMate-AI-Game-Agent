// Animated aurora backdrop inspired by reactbits.dev/backgrounds/aurora
// (colors: #c167ff / #06B6D4 / #9a39a7), implemented with pure CSS blobs.
export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-1/3 left-[-10%] h-[80vh] w-[70vw] rounded-full opacity-60 blur-3xl dark:opacity-40"
        style={{
          background: 'radial-gradient(closest-side, #c167ff, transparent 70%)',
          animation: 'aurora-drift-1 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-15%] top-[-20%] h-[70vh] w-[60vw] rounded-full opacity-50 blur-3xl dark:opacity-35"
        style={{
          background: 'radial-gradient(closest-side, #06B6D4, transparent 70%)',
          animation: 'aurora-drift-2 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-30%] left-[15%] h-[75vh] w-[65vw] rounded-full opacity-55 blur-3xl dark:opacity-35"
        style={{
          background: 'radial-gradient(closest-side, #9a39a7, transparent 70%)',
          animation: 'aurora-drift-3 16s ease-in-out infinite',
        }}
      />
    </div>
  );
}
