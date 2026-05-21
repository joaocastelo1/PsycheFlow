import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Sidebar } from '@/components/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-background-light">
      <Sidebar />
      <main className="flex-1 pl-64">{children}</main>
    </div>
  );
}