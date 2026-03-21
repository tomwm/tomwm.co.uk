import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { sql, Post } from '@/lib/db';
import AdminHeader from './AdminHeader';
import AdminPostsTable from './AdminPostsTable';

export const dynamic = 'force-dynamic';

async function getAllPosts(): Promise<Post[]> {
  try {
    const rows = await sql`
      SELECT * FROM posts
      ORDER BY created_at DESC
    `;
    return rows as unknown as Post[];
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const posts = await getAllPosts();

  return (
    <>
      <AdminHeader />
      <div className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Posts</h1>
          <Link href="/admin/posts/new" className="btn btn-primary">
            + New Post
          </Link>
        </div>

        <AdminPostsTable posts={posts} />
      </div>
    </>
  );
}
