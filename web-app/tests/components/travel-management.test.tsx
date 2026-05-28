import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TravelManagementModule } from '@/components/travel/travel-management-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/travel',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
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
    expect(screen.getByText(/overview|command center/i)).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    render(<TravelManagementModule />);
    expect(screen.getByText(/schedule|tickets|departure|arrival/i)).toBeInTheDocument();
  });

  it('renders search input for filtering', () => {
    render(<TravelManagementModule />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });
});
