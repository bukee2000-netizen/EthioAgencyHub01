'use client';

export default function AuthError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <h2 className="text-xl font-semibold text-red-600">Authentication Error</h2>
      <p className="max-w-md text-center text-sm text-gray-500">{error.message}</p>
      <button onClick={reset} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        Try again
      </button>
    </div>
  );
}
