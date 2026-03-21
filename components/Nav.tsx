'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: '/about', label: 'About' },
    { href: '/writing', label: 'Writing' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="site-header">
      <Link href="/" className="site-title">tomwm</Link>
      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href || pathname.startsWith(link.href + '/') ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
