import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HajjUmrahManagementModule } from '@/components/hajj-umrah/hajj-umrah-management-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/hajj-umrah',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/components/layout/theme-provider', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => children,
}));

vi.mock('@/components/ui/toast-provider', () => ({
  useToast: () => ({ addToast: vi.fn() }),
  ToastProvider: ({ children }: any) => children,
}));

describe('HajjUmrahManagementModule', () => {
  it('renders the module heading', () => {
    render(<HajjUmrahManagementModule />);
    expect(screen.getByText('Hajj & Umrah Management')).toBeInTheDocument();
  });

  it('renders search/filter controls', () => {
    render(<HajjUmrahManagementModule />);
    expect(screen.getByPlaceholderText('Search pilgrims...')).toBeInTheDocument();
  });

  it('renders pilgrim status filters', () => {
    render(<HajjUmrahManagementModule />);
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });
});