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

        <div className="two-col">
          <section className="section">
            <h2>About Me</h2>
            <p>
              Designer working at the intersection of technology, organisations, and public services. Based in the UK, currently at the Government Digital Service.
            </p>
          </section>

          <section className="section">
            <h2>Currently using</h2>
            <p>Figma, Miro, VS Code, Claude</p>
          </section>
        </div>
      </main>
      <footer className="site-footer">
        &copy; {new Date().getFullYear()} tomwm
      </footer>
    </>
  );
}
