export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent" />
        <p className="text-sm text-gray-400 dark:text-slate-500">Loading dashboard...</p>
      </div>
    </div>
  );
}
