import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all');

  try {
    if (all && session) {
      const rows = await sql`
        SELECT * FROM posts ORDER BY created_at DESC
      `;
      return NextResponse.json(rows);
    } else {
      const rows = await sql`
        SELECT * FROM posts
        WHERE status = 'published'
        ORDER BY published_at DESC, created_at DESC
      `;
      return NextResponse.json(rows);
    }
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, subtitle, slug, content, tags, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const publishedAt = status === 'published' ? now : null;

    const rows = await sql`
      INSERT INTO posts (title, subtitle, slug, content, tags, status, published_at, updated_at)
      VALUES (
        ${title},
        ${subtitle || null},
        ${slug},
        ${content || null},
        ${tags || ''},
        ${status || 'draft'},
        ${publishedAt},
        ${now}
      )
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/posts error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create post';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'A post with that slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
