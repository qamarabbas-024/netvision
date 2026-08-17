'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#09090b] text-[#f4f4f5] flex items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-zinc-900/80 border border-red-500/30 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white">Critical Application Error</h2>
          <p className="text-sm text-zinc-400">An unexpected system error occurred.</p>
          <button
            onClick={() => reset()}
            className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-400"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
