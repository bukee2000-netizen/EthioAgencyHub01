import { ModulePage } from '@/components/module-page';

export default function Page() {
  return (
    <ModulePage
      title="Document Detail"
      description="View document metadata, status, storage path, and audit trail."
      workflows={['Document preview', 'Verification status', 'Storage path', 'Audit trail']}
      actions={[{ label: 'Open workflow', href: '#' }]}
    />
  );
}