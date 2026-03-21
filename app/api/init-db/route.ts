import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { initDb } from '@/lib/db';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    return NextResponse.json({ success: true, message: 'Database initialised' });
  } catch (error) {
    console.error('POST /api/init-db error:', error);
    return NextResponse.json({ error: 'Failed to initialise database' }, { status: 500 });
  }
}
