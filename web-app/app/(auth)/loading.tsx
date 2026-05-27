export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 dark:from-blue-950 to-indigo-100 dark:to-slate-900">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent" />
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
