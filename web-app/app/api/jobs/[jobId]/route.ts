import { ok, serverError } from '@/lib/api/responses';
import { getJobStatus } from '@/lib/jobs/dispatch';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;
    const job = await getJobStatus(jobId);
    return ok(job);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch job status.';
    return serverError(message);
  }
}
