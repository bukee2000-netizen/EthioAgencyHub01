'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TravelManagementModule } from '@/components/travel/travel-management-module';

function TravelPageContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  return <TravelManagementModule initialTab={tab as any} />;
}

export default function TravelPage() {
  return (
    <Suspense fallback={<TravelManagementModule />}>
      <TravelPageContent />
    </Suspense>
  );
}
