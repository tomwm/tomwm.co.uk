import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import { sql } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Projects — tomwm',
};

export const dynamic = 'force-dynamic';

interface Project {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
}

async function getProjects(): Promise<Project[]> {
  try {
    const rows = await sql`SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC`;
    return rows as unknown as Project[];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <main>
        <div className="page-header">
          <h1>Projects</h1>
          <p className="subtitle">Experiments, prototypes and propositions to explore, design and test ideas.</p>
        </div>

        {projects.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif', fontSize: '0.9375rem' }}>
            Nothing here yet.
          </p>
        ) : (
          <ul className="project-list">
            {projects.map((p) => (
              <li key={p.id} className="project-card">
                <div className="project-body">
                  <h2 className="project-title">
                    {p.url ? (
                      <a href={/^https?:\/\//.test(p.url) ? p.url : `https://${p.url}`} target="_blank" rel="noopener noreferrer">{p.title}</a>
                    ) : p.title}
                  </h2>
                  {p.description && <p className="project-description">{p.description}</p>}
                </div>
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.title} className="project-image" />
                )}
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
