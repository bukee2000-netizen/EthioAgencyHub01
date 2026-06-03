import type { PostgrestError } from '@supabase/supabase-js';

interface JobPayload {
  type: string;
  payload: Record<string, unknown>;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export async function dispatchJob(job: JobPayload) {
  const { getJobsClient } = await import('./client');
  const client = getJobsClient();

  const { data, error } = await (client.from('background_jobs') as any)
    .insert({
      type: job.type,
      payload: job.payload,
      status: job.status || 'pending',
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to dispatch job: ${error.message}`);
  return data as { id: string };
}

export async function getJobStatus(jobId: string) {
  const { getJobsClient } = await import('./client');
  const client = getJobsClient();

  const { data, error } = await (client.from('background_jobs') as any)
    .select('id, type, status, result, error, created_at, updated_at')
    .eq('id', jobId)
    .single();

  if (error) throw new Error(`Failed to get job status: ${error.message}`);
  return data;
}
