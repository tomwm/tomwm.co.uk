import type { Metadata } from 'next';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Contact — tomwm',
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <div className="page-header">
          <h1>Get In Touch</h1>
          <p className="subtitle">
            I&rsquo;m always interested in connecting with people working on similar challenges or themes.
          </p>
        </div>

        <ul className="contact-list">
          <li>
            <span style={{ marginRight: '1rem', color: 'var(--muted)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LinkedIn</span>
            <a href="https://www.linkedin.com/in/tomwm/" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/tomwm
            </a>
          </li>
          <li>
            <span style={{ marginRight: '1rem', color: 'var(--muted)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bluesky</span>
            <a href="https://bsky.app/profile/tomwm.bsky.social" target="_blank" rel="noopener noreferrer">
              @tomwm.bsky.social
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
