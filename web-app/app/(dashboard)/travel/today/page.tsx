'use client';

import { Suspense } from 'react';
import { TravelManagementModule } from '@/components/travel/travel-management-module';

export default function Page() {
  return (
    <Suspense fallback={<TravelManagementModule initialTab="departure" />}>
      <TravelManagementModule initialTab="departure" />
    </Suspense>
  );
}
