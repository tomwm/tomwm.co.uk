import AdminHeader from '@/app/admin/AdminHeader';
import PostEditor from '../PostEditor';
import Link from 'next/link';

export default function NewPostPage() {
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
        <PostEditor />
      </div>
    </>
  );
}
