import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Link from 'next/link';
import { sql, Post } from '@/lib/db';

async function getPost(slug: string): Promise<Post | null> {
  try {
    const rows = await sql`
      SELECT * FROM posts
      WHERE slug = ${slug} AND status = 'published'
      LIMIT 1
    `;
    return (rows[0] as unknown as Post) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not found — tomwm' };
  return {
    title: `${post.title} — tomwm`,
    description: post.subtitle || undefined,
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function WritingPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main>
        <Link href="/writing" className="back-link">
          &larr; Writing
        </Link>

        <article>
          <div className="post-header">
            <h1>{post.title}</h1>
            {post.subtitle && (
              <p className="post-subtitle">{post.subtitle}</p>
            )}
            <div className="post-meta">
              <span>{formatDate(post.published_at || post.created_at)}</span>
              {post.tags && post.tags.trim() && (
                <div className="post-tags">
                  {post.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="post-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {post.content && (
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </article>
      </main>
      <footer className="site-footer">
        &copy; {new Date().getFullYear()} tomwm
      </footer>
    </>
  );
}
