import type { Metadata } from 'next';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'About — tomwm',
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <div className="page-header">
          <h1>About Me</h1>
        </div>

        <p>
          I work on complex problems where technology, organisations, and public services intersect.
        </p>

        <p>
          Most of time has been spent inside large institutions, particularly in the public sector, where change is rarely clean or linear and is never fully within anyone&rsquo;s control. I pay attention to how systems actually behave in practice: how decisions get made, how work really flows, and how services feel when they meet people&rsquo;s lives.
        </p>

        <p>
          My route into this work wasn&rsquo;t linear. I started in fine art and moved through interaction and speculative design, design research, and service design. That path has left me less concerned with disciplinary boundaries and more focused on how different ways of seeing can be combined to make sense of complex systems, especially those that have grown over time.
        </p>

        <p>
          In recent years, much of my thinking has focused on AI. I see it less as a promise of efficiency or a category of products and more as a new material that reshapes time, judgement, and responsibility inside organisations. I&rsquo;m drawn to what gets lost when services become too smooth and frictionless, and how we deliberately design limits, edges, and accountability back into them.
        </p>

        <p>
          I&rsquo;m based in the UK and currently work at the Government Digital Service. I write here as a way of thinking in public, about service design, AI, organisational change, and the ongoing work of making better services.
        </p>
      </main>
      <footer className="site-footer">
        &copy; {new Date().getFullYear()} tomwm
      </footer>
    </>
  );
}
