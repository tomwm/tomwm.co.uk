import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, url, image_url, sort_order } = body;
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const now = new Date().toISOString();
    const rows = await sql`
      INSERT INTO projects (title, description, url, image_url, sort_order, updated_at)
      VALUES (${title}, ${description || null}, ${url || null}, ${image_url || null}, ${sort_order ?? 0}, ${now})
      RETURNING *
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
