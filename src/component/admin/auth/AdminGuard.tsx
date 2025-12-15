'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/admin/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [user, router, loading]);

  if (!user || user.role !== 'ADMIN') return null;

  return <>{children}</>;
}
