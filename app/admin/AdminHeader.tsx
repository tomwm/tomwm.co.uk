'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <span className="admin-header-title">
        <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
          tomwm admin
        </Link>
      </span>
      <nav className="admin-nav">
        <Link href="/admin">Posts</Link>
        <Link href="/admin/projects">Projects</Link>
        <Link href="/" target="_blank">View site</Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: 0,
            fontFamily: 'inherit',
          }}
        >
          Sign out
        </button>
      </nav>
    </header>
  );
}
