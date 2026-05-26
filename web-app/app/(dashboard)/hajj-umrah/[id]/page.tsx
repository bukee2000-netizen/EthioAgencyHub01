'use client';

import { useParams } from 'next/navigation';
import { HajjUmrahPilgrimDetail } from '@/components/hajj-umrah/hajj-umrah-pilgrim-detail';

export default function Page() {
  const params = useParams();
  return <HajjUmrahPilgrimDetail key={params?.id as string} />;
}
