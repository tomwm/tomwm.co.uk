import AdminHeader from '@/app/admin/AdminHeader';
import PostEditor from '../PostEditor';
import Link from 'next/link';
import { sql } from '@/lib/db';

async function getExistingTags(): Promise<string[]> {
  try {
    const rows = await sql`SELECT tags FROM posts WHERE tags IS NOT NULL AND tags != ''`;
    const set = new Set<string>();
    (rows as { tags: string }[]).forEach((r) =>
      r.tags.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => set.add(t))
    );
    return Array.from(set).sort();
  } catch {
    return [];
  }
}

export default async function NewPostPage() {
  const existingTags = await getExistingTags();
  return (
    <>
      <AdminHeader />
      <div className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/admin" className="btn btn-sm">
            &larr; All posts
          </Link>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>New Post</h1>
        </div>
        <PostEditor existingTags={existingTags} />
      </div>
    </>
  );
}
