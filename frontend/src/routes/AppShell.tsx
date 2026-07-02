import { Outlet } from 'react-router-dom';
import { FloatingTutorButton } from '../components/FloatingTutorButton';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Sidebar />
        </div>
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
      <FloatingTutorButton />
    </div>
  );
}

