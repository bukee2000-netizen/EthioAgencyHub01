export async function uploadFile(
  file: File,
  key: string,
  authToken?: string
): Promise<{ key: string; url?: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const presignRes = await fetch('/api/r2/presign', {
    method: 'POST',
    headers,
    body: JSON.stringify({ key, action: 'upload', contentType: file.type }),
  });

  if (!presignRes.ok) {
    const err = await presignRes.json();
    throw new Error(err.error?.message || 'Failed to get presigned upload URL');
  }

  const { url } = await presignRes.json();

  const uploadRes = await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
  if (!uploadRes.ok) throw new Error('Failed to upload file to storage');

  return { key };
}

export function getFileUrl(key: string): string {
  return `/api/r2/presign?key=${encodeURIComponent(key)}`;
}
