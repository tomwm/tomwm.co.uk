import { notFound } from 'next/navigation';
import AdminHeader from '@/app/admin/AdminHeader';
import PostEditor from '../PostEditor';
import Link from 'next/link';
import { sql, Post } from '@/lib/db';

async function getPost(id: string): Promise<Post | null> {
  try {
    const rows = await sql`SELECT * FROM posts WHERE id = ${id} LIMIT 1`;
    return (rows[0] as unknown as Post) || null;
  } catch {
    return null;
  }
}

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

export default async function EditPostPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [post, existingTags] = await Promise.all([getPost(id), getExistingTags()]);
  if (!post) notFound();

  return (
    <>
      <AdminHeader />
      <div className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/admin" className="btn btn-sm">
            &larr; All posts
          </Link>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Edit Post</h1>
          {post.status === 'published' && post.slug && (
            <Link
              href={`/writing/${post.slug}`}
              target="_blank"
              className="btn btn-sm"
              style={{ marginLeft: 'auto' }}
            >
              View post &rarr;
            </Link>
          )}
        </div>
        <PostEditor
          postId={post.id}
          existingTags={existingTags}
          initialPost={{
            title: post.title,
            subtitle: post.subtitle || '',
            slug: post.slug,
            content: post.content || '',
            tags: post.tags || '',
            status: post.status,
            published_at: post.published_at || '',
          }}
        />
      </div>
    </>
  );
}
