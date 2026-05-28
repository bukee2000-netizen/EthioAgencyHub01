import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { SidebarProvider } from '@/components/layout/sidebar-provider';
import { LanguageProvider } from '@/components/layout/language-provider';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { getSession } from '@/lib/auth/session';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  let session = null;
  try {
    session = getSession();
  } catch {
    // cookies() not available during SSR/build
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <LanguageProvider>
          <ToastProvider>
            <AppShell session={session}>{children}</AppShell>
          </ToastProvider>
        </LanguageProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
