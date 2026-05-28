import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentManagementModule } from '@/components/documents/document-management-module';

vi.mock('next/navigation', () => ({
  usePathname: () => '/documents',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
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
    expect(screen.getByText(/document|management/i)).toBeInTheDocument();
  });

  it('renders filter controls', () => {
    render(<DocumentManagementModule />);
    expect(screen.getByText(/all|status|type/i)).toBeInTheDocument();
  });
});
