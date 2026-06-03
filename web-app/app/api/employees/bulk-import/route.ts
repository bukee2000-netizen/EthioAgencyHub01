import { created, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { dispatchJob } from '@/lib/jobs/dispatch';

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return validationError('CSV file is required.');
    }

    if (!file.name.endsWith('.csv')) {
      return validationError('Only CSV files are accepted.');
    }

    const text = await file.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      return validationError('CSV file must have a header row and at least one data row.');
    }

    const job = await dispatchJob({
      type: 'bulk-import-employees',
      payload: {
        agencyId: session.agencyId,
        filename: file.name,
        rowCount: lines.length - 1,
        rawData: text,
      },
    });

    return created({ jobId: job.id, totalRows: lines.length - 1 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bulk import failed.';
    return serverError(message);
  }
}
