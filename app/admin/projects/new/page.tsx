import AdminHeader from '../../AdminHeader';
import ProjectEditor from '../ProjectEditor';

export default function NewProjectPage() {
  return (
    <>
      <AdminHeader />
      <div className="admin-main">
        <h1 className="admin-page-title">New Project</h1>
        <ProjectEditor />
      </div>
    </>
  );
}
