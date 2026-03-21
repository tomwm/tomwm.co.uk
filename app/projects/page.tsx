import type { Metadata } from 'next';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Projects — tomwm',
};

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main>
        <div className="page-header">
          <h1>Projects</h1>
        </div>

        <ul className="project-list">
          <li>
            <a href="https://ukgov-network-graph.tomwm.co.uk" target="_blank" rel="noopener noreferrer">
              UK government network graph
            </a>
          </li>
        </ul>
      </main>
      <footer className="site-footer">
        &copy; {new Date().getFullYear()} tomwm
      </footer>
    </>
  );
}
