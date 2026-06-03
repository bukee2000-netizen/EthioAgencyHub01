import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TravelManagementModule } from '@/components/travel/travel-management-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/travel',
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

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation(async (url: string) => {
    if (url.toString().includes('/api/travel')) {
      return {
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      } as Response;
    }
    return { ok: true, json: () => Promise.resolve({ success: true, data: [] }) } as Response;
  });
});

describe('TravelManagementModule', () => {
  it('renders overview tab by default', () => {
    render(<TravelManagementModule />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    render(<TravelManagementModule />);
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Tickets')).toBeInTheDocument();
    expect(screen.getByText("Today's Departures")).toBeInTheDocument();
    expect(screen.getByText('Departure Prep')).toBeInTheDocument();
    expect(screen.getByText('Arrival')).toBeInTheDocument();
  });
});