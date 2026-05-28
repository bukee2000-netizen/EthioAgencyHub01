import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InstitutionManagementModule } from '@/components/institutions/institution-management-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/institutions',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation(async (url: string) => {
    return {
      ok: true,
      json: () => Promise.resolve({ success: true, data: [], total: 0 }),
    } as Response;
  });
});

describe('InstitutionManagementModule', () => {
  it('renders institution management heading', () => {
    render(<InstitutionManagementModule />);
    expect(screen.getByText(/institution|partner/i)).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<InstitutionManagementModule />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('renders add institution button', () => {
    render(<InstitutionManagementModule />);
    expect(screen.getByText(/add|register|create/i)).toBeInTheDocument();
  });
});
