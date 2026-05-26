import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '@/components/layout/app-shell';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/components/layout/sidebar-provider', () => ({
  useSidebar: () => ({
    isOpen: true,
    toggle: vi.fn(),
    close: vi.fn(),
    open: vi.fn(),
    isHovering: false,
    setIsHovering: vi.fn(),
  }),
}));

vi.mock('@/components/layout/language-provider', () => ({
  useLanguage: () => ({
    language: 'en' as const,
    dict: {
      common: {
        dashboard: 'Dashboard', employees: 'Employees', documents: 'Documents',
        travel: 'Travel', hajjUmrah: 'Hajj & Umrah', institutions: 'Institutions',
        agents: 'Agents', administration: 'Administration', reporting: 'Reporting',
        settings: 'Settings', signIn: 'Sign in', signOut: 'Sign out',
        language: 'Language', billing: 'Billing', register: 'Register',
        search: 'Search', save: 'Save', cancel: 'Cancel', delete: 'Delete',
        edit: 'Edit', view: 'View', download: 'Download', upload: 'Upload',
        export: 'Export', filter: 'Filter', status: 'Status', type: 'Type',
        date: 'Date', actions: 'Actions', all: 'All', active: 'Active',
        pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
        submit: 'Submit', confirm: 'Confirm', back: 'Back', next: 'Next',
        close: 'Close',
      },
      travel: {} as any,
      documents: {} as any,
      agents: {} as any,
      billing: {} as any,
    },
    setLanguage: vi.fn(),
  }),
}));

vi.mock('@/components/layout/sidebar', () => ({
  Sidebar: () => <nav data-testid="sidebar">Sidebar</nav>,
}));

vi.mock('@/components/layout/user-menu', () => ({
  UserMenu: ({ role, email }: { role: string; email?: string }) => (
    <div data-testid="user-menu">{role} - {email}</div>
  ),
}));

vi.mock('@/components/layout/language-selector', () => ({
  LanguageSelector: () => <div data-testid="language-selector">Language</div>,
}));

const mockSession = {
  userId: '1',
  role: 'AGENCY_ADMIN' as const,
  email: 'admin@example.com',
  agencyId: 'agency-001',
  expiresAt: new Date(Date.now() + 86400000),
};

describe('AppShell', () => {
  it('renders the header with title and subtitle', () => {
    render(
      <AppShell session={mockSession}>
        <div>Main Content</div>
      </AppShell>
    );
    expect(screen.getByText('Foreign Employment Operations')).toBeInTheDocument();
    expect(screen.getByText('Multi-tenant command center')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <AppShell session={mockSession}>
        <div>Main Content</div>
      </AppShell>
    );
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(
      <AppShell session={mockSession}>
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByPlaceholderText('Search modules, pages...')).toBeInTheDocument();
  });

  it('renders the notification bell button', () => {
    render(
      <AppShell session={mockSession}>
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('renders the sidebar component', () => {
    render(
      <AppShell session={mockSession}>
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders the user menu and language selector', () => {
    render(
      <AppShell session={mockSession}>
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('filters navigation items when typing in the search box', async () => {
    const user = userEvent.setup();
    render(
      <AppShell session={mockSession}>
        <div>Content</div>
      </AppShell>
    );
    const searchInput = screen.getByPlaceholderText('Search modules, pages...');
    await user.type(searchInput, 'Dashboard');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows "No results found" for unmatched search queries', async () => {
    const user = userEvent.setup();
    render(
      <AppShell session={mockSession}>
        <div>Content</div>
      </AppShell>
    );
    const searchInput = screen.getByPlaceholderText('Search modules, pages...');
    await user.type(searchInput, 'xyznonexistent');
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders with a null session gracefully', () => {
    render(
      <AppShell session={null}>
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByText('Foreign Employment Operations')).toBeInTheDocument();
  });
});
