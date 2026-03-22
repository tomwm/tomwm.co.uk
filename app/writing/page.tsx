import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Link from 'next/link';
import { sql, Post } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Through Lines — tomwm',
};

export const dynamic = 'force-dynamic';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

async function getPosts(): Promise<Post[]> {
  try {
    const rows = await sql`
      SELECT * FROM posts
      WHERE status = 'published'
      ORDER BY published_at DESC, created_at DESC
    `;
    return rows as unknown as Post[];
  } catch {
    return [];
  }
}

export default async function WritingPage() {
  const posts = await getPosts();

  return (
    <>
      <Nav />
      <main>
        <div className="page-header">
          <h1>Through Lines</h1>
          <p className="subtitle">Essays and thoughts on Design, AI and how we create better services and organisations.</p>
        </div>

        {posts.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif', fontSize: '0.9375rem' }}>
            Nothing published yet.
          </p>
        ) : (
          <ul className="writing-list">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/writing/${post.slug}`}>
                  <p className="post-title">{post.title}</p>
                  {post.subtitle && (
                    <p className="post-subtitle">{post.subtitle}</p>
                  )}
                  <div className="post-meta">
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                    {post.tags && post.tags.trim() && (
                      <div className="post-tags">
                        {post.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                          <span key={tag} className="post-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer className="site-footer">
        &copy; {new Date().getFullYear()} tomwm
      </footer>
    </>
  );
}
