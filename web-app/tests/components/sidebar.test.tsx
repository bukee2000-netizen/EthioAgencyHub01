import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/layout/sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/components/layout/sidebar-provider', () => ({
  useSidebar: () => ({ isOpen: true, toggle: vi.fn(), isHovering: false, setIsHovering: vi.fn() }),
}));

vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span>ChevronLeft</span>,
  ChevronRight: () => <span>ChevronRight</span>,
  ChevronDown: () => <span>ChevronDown</span>,
  Globe2: () => <span>Globe2</span>,
  LayoutDashboard: () => <span>LayoutDashboard</span>,
  X: () => <span>X</span>,
  PlusCircle: () => <span>PlusCircle</span>,
  FileText: () => <span>FileText</span>,
  Plane: () => <span>Plane</span>,
  Ticket: () => <span>Ticket</span>,
}));

const mockDict: any = {
  common: { dashboard: 'Dashboard', register: 'Register', registerNewEmployee: 'Register New Employee', travel: 'Travel', documents: 'Documents' },
};

describe('Sidebar', () => {
  it('renders the app name', () => {
    render(<Sidebar dict={mockDict} />);
    expect(screen.getByText('Ethio Agency Hub')).toBeInTheDocument();
  });

  it('renders dashboard link', () => {
    render(<Sidebar dict={mockDict} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders module navigation items', () => {
    render(<Sidebar dict={mockDict} />);
    expect(screen.getByText('Employee Management')).toBeInTheDocument();
  });
});
