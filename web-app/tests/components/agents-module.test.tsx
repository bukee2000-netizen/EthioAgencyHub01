import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentsModule } from '@/components/agents/agents-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/agents',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/components/layout/theme-provider', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => children,
}));

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation(async (url: string) => {
    if (url.toString().includes('/api/agents')) {
      return {
        ok: true,
        json: () => Promise.resolve({ success: true, data: [{ id: '1', name: 'Test Agency', status: 'active', createdAt: new Date().toISOString() }] }),
      } as Response;
    }
    return { ok: true, json: () => Promise.resolve({ success: true, data: [] }) } as Response;
  });
});

describe('AgentsModule', () => {
  it('renders module header', () => {
    render(<AgentsModule />);
    expect(screen.getByText('Agent Management')).toBeInTheDocument();
  });

  it('shows country overview cards', () => {
    render(<AgentsModule />);
    // The overview tab shows country stat cards like Kuwait
    expect(screen.getByText('Kuwait')).toBeInTheDocument();
  });
});
