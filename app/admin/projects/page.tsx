import Link from 'next/link';
import { sql } from '@/lib/db';
import AdminHeader from '../AdminHeader';

export const dynamic = 'force-dynamic';

interface Project {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  sort_order: number;
}

async function getProjects(): Promise<Project[]> {
  try {
    const rows = await sql`SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC`;
    return rows as unknown as Project[];
  } catch {
    return [];
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <AdminHeader />
      <div className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Projects</h1>
          <Link href="/admin/projects/new" className="btn btn-primary">+ New Project</Link>
        </div>

        {projects.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>No projects yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{p.url || '—'}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{p.sort_order}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/admin/projects/${p.id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
