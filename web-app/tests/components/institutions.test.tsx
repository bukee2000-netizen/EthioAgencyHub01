import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InstitutionManagementModule } from '@/components/institutions/institution-management-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/institutions',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/components/layout/theme-provider', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => children,
}));

describe('InstitutionManagementModule', () => {
  it('renders institution management heading', () => {
    render(<InstitutionManagementModule />);
    expect(screen.getByText('Institutions Network')).toBeInTheDocument();
  });

  it('shows total partners stat', () => {
    render(<InstitutionManagementModule />);
    expect(screen.getByText('Total Partners')).toBeInTheDocument();
  });
});