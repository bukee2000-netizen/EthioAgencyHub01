import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HajjUmrahManagementModule } from '@/components/hajj-umrah/hajj-umrah-management-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/hajj-umrah',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('HajjUmrahManagementModule', () => {
  it('renders the module heading', () => {
    render(<HajjUmrahManagementModule />);
    expect(screen.getByText(/hajj|umrah|pilgrim/i)).toBeInTheDocument();
  });

  it('renders search/filter controls', () => {
    render(<HajjUmrahManagementModule />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('renders pilgrim status filters', () => {
    render(<HajjUmrahManagementModule />);
    expect(screen.getByText(/all|registered|deployed/i)).toBeInTheDocument();
  });
});
