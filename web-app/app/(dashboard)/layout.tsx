import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { SidebarProvider } from '@/components/layout/sidebar-provider';
import { LanguageProvider } from '@/components/layout/language-provider';
import { getSession } from '@/lib/auth/session';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  let session = null;
  try {
    session = getSession();
  } catch {
    // cookies() not available during SSR/build
  }

  return (
    <SidebarProvider>
      <LanguageProvider>
        <AppShell session={session}>{children}</AppShell>
      </LanguageProvider>
    </SidebarProvider>
  );
}
