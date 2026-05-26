import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ModulePage } from '@/components/module-page';

describe('ModulePage', () => {
  it('renders title, description, actions, and workflows', () => {
    render(
      <ModulePage
        title="Document Management"
        description="Manage employee documents."
        workflows={['Upload documents', 'Cross-match verification']}
        actions={[{ label: 'Upload document', href: '/documents/upload' }]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Document Management' })).toBeInTheDocument();
    expect(screen.getByText('Manage employee documents.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Upload document' })).toHaveAttribute('href', '/documents/upload');
    expect(screen.getByText('Upload documents')).toBeInTheDocument();
    expect(screen.getByText('Cross-match verification')).toBeInTheDocument();
  });
});
