'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/db';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminPostsTable({ posts }: { posts: Post[] }) {
  const router = useRouter();

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Failed to delete post.');
    }
  }

  if (posts.length === 0) {
    return (
      <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>
        No posts yet. <Link href="/admin/posts/new">Create your first post</Link>.
      </p>
    );
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Date</th>
          <th>Tags</th>
          <th style={{ textAlign: 'right' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>
              <strong style={{ fontSize: '0.9375rem' }}>{post.title}</strong>
              {post.subtitle && (
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {post.subtitle}
                </div>
              )}
            </td>
            <td>
              <span className={`status-badge ${post.status}`}>
                {post.status}
              </span>
            </td>
            <td style={{ color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              {formatDate(post.status === 'published' && post.published_at ? post.published_at : post.created_at)}
            </td>
            <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
              {post.tags || '—'}
            </td>
            <td>
              <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                <Link href={`/admin/posts/${post.id}`} className="btn btn-sm">
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(post.id, post.title)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
