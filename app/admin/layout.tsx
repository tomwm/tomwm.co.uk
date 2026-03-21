import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import SessionProvider from './SessionProvider';

export const metadata: Metadata = {
  title: 'Admin — tomwm',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <SessionProvider session={session}>
      <div className="admin-body">
        {children}
      </div>
    </SessionProvider>
  );
}
