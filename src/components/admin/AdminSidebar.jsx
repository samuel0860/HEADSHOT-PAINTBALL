import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiTarget, FiCalendar, FiClock, FiImage, FiTag, FiPackage,
  FiUsers, FiLogOut, FiMenu, FiX, FiChevronRight, FiGrid
} from 'react-icons/fi';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { to: '/admin/agendamentos', label: 'Agendamentos', icon: FiCalendar },
  { to: '/admin/horarios', label: 'Horários', icon: FiClock },
  { to: '/admin/banners', label: 'Banners', icon: FiImage },
  { to: '/admin/galeria', label: 'Galeria', icon: FiImage },
  { to: '/admin/promocoes', label: 'Promoções', icon: FiTag },
  { to: '/admin/pacotes', label: 'Pacotes', icon: FiPackage },
  { to: '/admin/clientes', label: 'Clientes', icon: FiUsers },
];

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Mobile: always full width overlay; Desktop: collapsed or full
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-50 flex flex-col
        bg-[#0d0d0d] border-r border-[#1e1e1e]
        transition-all duration-300
        /* Mobile: slide in/out */
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        /* Width */
        w-72 lg:w-auto
        ${!mobileOpen ? '' : ''}
        lg:${collapsed ? 'w-16' : 'w-64'}
      `}
      style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (collapsed ? 64 : 256) : 288 }}
    >
      {/* Header */}
      <div className="flex items-center h-14 border-b border-[#1e1e1e] px-4 gap-3">
        <div className="w-8 h-8 rounded-full border border-[#e85c0d]/60 flex items-center justify-center bg-[#111111] flex-shrink-0">
          <FiTarget size={16} className="text-[#e85c0d]" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <span className="font-display text-base text-[#e85c0d] tracking-widest block truncate">HEADSHOT</span>
            <span className="text-[9px] text-[#64748b] tracking-[0.3em] uppercase block">Admin Panel</span>
          </div>
        )}
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex p-1.5 rounded-lg text-[#64748b] hover:text-white hover:bg-[#1e1e1e] transition-colors flex-shrink-0"
        >
          {collapsed ? <FiMenu size={16} /> : <FiX size={16} />}
        </button>
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:text-white hover:bg-[#1e1e1e] transition-colors flex-shrink-0 ml-auto"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
              ${isActive
                ? 'bg-[#e85c0d]/15 text-[#e85c0d] border border-[#e85c0d]/20'
                : 'text-[#64748b] hover:text-white hover:bg-[#1e1e1e] border border-transparent'
              }
              ${collapsed ? 'justify-center lg:justify-center' : ''}
              `
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="flex-shrink-0" />
                <span className={`text-sm font-semibold tracking-wide ${collapsed ? 'lg:hidden' : ''}`}>{label}</span>
                {!collapsed && isActive && (
                  <FiChevronRight size={13} className="ml-auto opacity-60" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-[#1e1e1e] p-3 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2 bg-[#111111] rounded-xl border border-[#1e1e1e]">
            <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Logado como</p>
            <p className="text-sm font-semibold text-white truncate mt-0.5">{adminUser?.nome}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors border border-transparent hover:border-[#dc2626]/20
            ${collapsed ? 'justify-center lg:justify-center' : ''}
          `}
        >
          <FiLogOut size={17} className="flex-shrink-0" />
          <span className={`text-sm font-semibold ${collapsed ? 'lg:hidden' : ''}`}>Sair</span>
        </button>
      </div>
    </aside>
  );
}
