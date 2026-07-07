import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { FloatingTutorButton } from '../components/FloatingTutorButton';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { cn } from '../lib/utils';

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onMenuClick={() => setDrawerOpen(true)} />

      {/* Desktop sidebar pinned to the left wall of the screen */}
      <div className="fixed bottom-0 left-0 top-[88px] z-10 hidden overflow-y-auto lg:block">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          className="h-full rounded-none rounded-r-[1.75rem] border-l-0"
        />
      </div>

      <main
        className={cn(
          'min-w-0 px-3 py-4 transition-all sm:px-6 sm:py-6',
          collapsed ? 'lg:pl-[100px]' : 'lg:pl-[280px]',
        )}
      >
        <div className="mx-auto max-w-6xl space-y-6">
          <Outlet />
        </div>
      </main>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white p-4 shadow-2xl dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                Menu
              </p>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}

      <FloatingTutorButton />
    </div>
  );
}
