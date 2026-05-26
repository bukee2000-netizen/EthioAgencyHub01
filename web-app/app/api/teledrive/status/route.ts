export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${process.env.TELEDRIVE_API_URL}/api/sync/status`, {
      headers: { Authorization: `Bearer ${process.env.TELEDRIVE_API_KEY}` },
      next: { revalidate: 10 }
    });
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch sync status' }, { status: 500 });
  }
}