'use client';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-red-600">Something went wrong</h2>
      <p className="max-w-md text-center text-sm text-gray-500">{error.message}</p>
      <button onClick={reset} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        Try again
      </button>
    </div>
  );
}
