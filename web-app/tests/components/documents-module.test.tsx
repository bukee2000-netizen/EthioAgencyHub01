import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentManagementModule } from '@/components/documents/document-management-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/documents',
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
    return {
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] }),
    } as Response;
  });
});

describe('DocumentManagementModule', () => {
  it('renders document management header', () => {
    render(<DocumentManagementModule />);
    expect(screen.getByText('Document Management')).toBeInTheDocument();
  });

  it('renders filter controls', () => {
    render(<DocumentManagementModule />);
    expect(screen.getByText('All Types')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });
});