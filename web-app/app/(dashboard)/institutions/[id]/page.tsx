'use client';

import { useParams } from 'next/navigation';
import { InstitutionDetail } from '@/components/institutions/institutions-detail';

export default function Page() {
  const params = useParams();
  return <InstitutionDetail key={params?.id as string} />;
}
