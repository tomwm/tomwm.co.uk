import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Link from 'next/link';
import { sql, Post } from '@/lib/db';
import { Suspense } from 'react';
import TagFilter from './TagFilter';

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

function getAllTags(posts: Post[]): string[] {
  const set = new Set<string>();
  posts.forEach((p) => {
    if (p.tags) p.tags.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => set.add(t));
  });
  return Array.from(set).sort();
}

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const params = await searchParams;
  const selected = params.tag
    ? Array.isArray(params.tag) ? params.tag : [params.tag]
    : [];
  const allPosts = await getPosts();
  const tags = getAllTags(allPosts);
  const posts = selected.length > 0
    ? allPosts.filter((p) => {
        const postTags = p.tags?.split(',').map((t) => t.trim()) ?? [];
        return selected.some((t) => postTags.includes(t));
      })
    : allPosts;

  return (
    <>
      <Nav />
      <main>
        <div className="page-header">
          <h1>Through Lines</h1>
          <p className="subtitle">Essays and thoughts on Design, AI and how we create better services and organisations.</p>
        </div>

        <Suspense>
          <TagFilter tags={tags} />
        </Suspense>

        {posts.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif', fontSize: '0.9375rem' }}>
            {selected.length > 0 ? `No posts matching those tags.` : 'Nothing published yet.'}
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
                        {post.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                          <span key={t} className="post-tag">{t}</span>
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
