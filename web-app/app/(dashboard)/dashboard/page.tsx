'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardTabsModule } from '@/components/dashboard/dashboard-tabs-module';

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  return <DashboardTabsModule initialTab={tab as string} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardTabsModule />}>
      <DashboardPageContent />
    </Suspense>
  );
}
