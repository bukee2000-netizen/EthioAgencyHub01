import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModulePage } from '@/components/module-page';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('ModulePage', () => {
  it('renders title, actions, and workflows', () => {
    render(
      <ModulePage
        title="Document Management"
        workflows={['Upload documents', 'Cross-match verification']}
        actions={[{ label: 'Upload document', href: '/documents/upload' }]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Document Management' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Upload document' })).toHaveAttribute('href', '/documents/upload');
    expect(screen.getByText('Upload documents')).toBeInTheDocument();
    expect(screen.getByText('Cross-match verification')).toBeInTheDocument();
  });
});