import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserMenu } from '@/components/layout/user-menu';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('lucide-react', () => ({
  ChevronDown: () => <span>ChevronDown</span>,
  LogOut: () => <span>LogOut</span>,
  ShieldCheck: () => <span>ShieldCheck</span>,
}));

describe('UserMenu', () => {
  it('shows the user role', () => {
    render(<UserMenu role="AGENCY_ADMIN" email="admin@test.com" />);
    expect(screen.getByText('AGENCY_ADMIN')).toBeInTheDocument();
  });

  it('shows the user email', () => {
    render(<UserMenu role="AGENCY_ADMIN" email="admin@test.com" />);
    expect(screen.getByText('admin@test.com')).toBeInTheDocument();
  });

  it('shows sign out option', () => {
    render(<UserMenu role="AGENCY_ADMIN" email="admin@test.com" />);
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('shows fallback text when no email is provided', () => {
    render(<UserMenu role="AGENT" />);
    expect(screen.getByText('Signed in')).toBeInTheDocument();
  });
});
