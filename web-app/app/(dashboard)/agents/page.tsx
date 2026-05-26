'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AgentsModule } from '@/components/agents/agents-module';

function AgentsPageContent() {
  const searchParams = useSearchParams();
  const [initialTab, setInitialTab] = useState<string>('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      const tabMap: Record<string, string> = {
        'agent-details': 'details',
        'contracts': 'contracts',
        'cv-pipeline': 'pipeline',
        'financials': 'financials',
        'in-country': 'staff',
        'training-support': 'training',
      };
      if (tabMap[tab]) {
        setInitialTab(tabMap[tab]);
      }
    }
  }, [searchParams]);

  return <AgentsModule initialTab={initialTab} />;
}

export default function Page() {
  return (
    <Suspense fallback={<AgentsModule initialTab="overview" />}>
      <AgentsPageContent />
    </Suspense>
  );
}