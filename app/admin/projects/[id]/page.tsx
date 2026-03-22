import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import AdminHeader from '../../AdminHeader';
import ProjectEditor from '../ProjectEditor';

interface Project {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  sort_order: number;
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const rows = await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
    return rows.length > 0 ? rows[0] as unknown as Project : null;
  } catch {
    return null;
  }
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <>
      <AdminHeader />
      <div className="admin-main">
        <h1 className="admin-page-title">Edit Project</h1>
        <ProjectEditor
          projectId={project.id}
          initialProject={{
            title: project.title,
            description: project.description || '',
            url: project.url || '',
            image_url: project.image_url || '',
            sort_order: project.sort_order,
          }}
        />
      </div>
    </>
  );
}
