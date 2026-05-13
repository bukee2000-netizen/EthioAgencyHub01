'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CvGenerator } from '@/components/employees/cv-generator';

function CVGeneratorPageContent() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  return <CvGenerator employeeId={employeeId || undefined} />;
}

export default function CVGeneratorPage() {
  return (
    <Suspense fallback={<CvGenerator />}>
      <CVGeneratorPageContent />
    </Suspense>
  );
}
