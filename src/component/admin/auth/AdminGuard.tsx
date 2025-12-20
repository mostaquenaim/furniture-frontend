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

    if (user.role !== 'ORDERMANAGER' && user.role !== 'SUPERADMIN' && user.role !== 'PRODUCTMANAGER' && user.role !== 'SUPPORT') {
      router.replace('/');
    }
  }, [user, router, loading]);

  if (!user || user.role !== 'ORDERMANAGER' && user.role !== 'SUPERADMIN' && user.role !== 'PRODUCTMANAGER' && user.role !== 'SUPPORT') return null;

  return <>{children}</>;
}
