import Nav from '@/components/Nav';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <section className="intro">
          <p className="greeting">Hello</p>
          <p className="tagline">Welcome to my slice of the internet</p>
          <p className="bio">
            I&rsquo;m Tom, a designer working on complex problems where technology, organisations, and public services intersect. I write about design, AI, and how we make better services in practice.
          </p>
        </section>
      </main>
      <footer className="site-footer">
        &copy; {new Date().getFullYear()} tomwm
      </footer>
    </>
  );
}
