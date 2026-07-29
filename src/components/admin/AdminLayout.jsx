import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { FiBell, FiExternalLink, FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAgendamentos } from '../../contexts/AgendamentosContext';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { getTodayAgendamentos } = useAgendamentos();
  const todayCount = getTodayAgendamentos().length;

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <header className="h-14 bg-[#0d0d0d] border-b border-[#1e1e1e] flex items-center justify-between px-4 sticky top-0 z-20 gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg border border-[#2a2a2a] text-[#94a3b8] hover:text-white hover:border-[#e85c0d] transition-colors flex-shrink-0"
          >
            <FiMenu size={18} />
          </button>

          <h1 className="text-sm text-[#64748b] font-medium truncate hidden sm:block">
            Painel — <span className="text-[#e85c0d]">Headshot Paintball</span>
          </h1>
          <span className="text-sm text-[#e85c0d] font-bold sm:hidden">Admin</span>

          <div className="flex items-center gap-2 ml-auto">
            {todayCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#e85c0d]/10 border border-[#e85c0d]/20 rounded-lg">
                <FiBell size={13} className="text-[#e85c0d]" />
                <span className="text-xs font-bold text-[#e85c0d]">{todayCount} hoje</span>
              </div>
            )}
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#2a2a2a] text-xs text-[#94a3b8] hover:text-white hover:border-[#e85c0d] transition-colors"
            >
              <FiExternalLink size={13} />
              <span className="hidden sm:inline">Ver Site</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
