import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiCalendar, FiTarget, FiShield } from 'react-icons/fi';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/pacotes', label: 'Preços' },
  { to: '/galeria', label: 'Galeria' },
  { to: '/promocoes', label: 'Promoções' },
  { to: '/meus-agendamentos', label: 'Agendamentos' },
];

export function ClientNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (to) => location.pathname === to;

  return (
    <>
      {/* Header fixo */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(8,8,8,0.96)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}>
        <div style={{
          width: '100%', maxWidth: '1200px', margin: '0 auto',
          padding: '0 20px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '64px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(232,92,13,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(232,92,13,0.1)', flexShrink: 0 }}>
              <FiTarget size={16} style={{ color: '#e85c0d' }} />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#e85c0d', letterSpacing: '0.2em', display: 'block' }}>HEADSHOT</span>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block' }}>Paintball · Viçosa</span>
            </div>
          </Link>

          {/* Desktop Nav — só aparece em telas grandes */}
          {isDesktop && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive(link.to) ? '#e85c0d' : 'rgba(255,255,255,0.6)',
                  background: isActive(link.to) ? 'rgba(232,92,13,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                }}>{link.label}</Link>
              ))}
            </nav>
          )}

          {/* Direita: botão agendar + hambúrguer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isDesktop && (
              <Link to="/agendamento" style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                background: '#e85c0d', color: 'white', fontWeight: 700, fontSize: '14px',
                borderRadius: '10px', textDecoration: 'none', boxShadow: '0 0 20px rgba(232,92,13,0.3)',
              }}>
                <FiCalendar size={14} /> Agendar
              </Link>
            )}

            {/* Botão hambúrguer — só aparece em mobile */}
            {!isDesktop && (
              <button
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Menu"
                style={{
                  width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer',
                }}
              >
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      {menuOpen && !isDesktop && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, paddingTop: '64px', display: 'flex', flexDirection: 'column' }}>
          {/* Overlay escuro */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(12px)' }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu */}
          <nav style={{ position: 'relative', zIndex: 10, padding: '20px 16px 32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px', borderRadius: '14px', fontSize: '18px', fontWeight: 600,
                textDecoration: 'none',
                color: isActive(link.to) ? '#e85c0d' : 'rgba(255,255,255,0.75)',
                background: isActive(link.to) ? 'rgba(232,92,13,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive(link.to) ? 'rgba(232,92,13,0.25)' : 'rgba(255,255,255,0.06)'}`,
              }}>
                {link.label}
                {isActive(link.to) && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e85c0d' }} />}
              </Link>
            ))}

            {/* Botão agendar no mobile */}
            <Link to="/agendamento" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              marginTop: '12px', padding: '18px', background: '#e85c0d', color: 'white',
              fontWeight: 700, fontSize: '17px', borderRadius: '16px', textDecoration: 'none',
              boxShadow: '0 0 30px rgba(232,92,13,0.4)',
            }}>
              <FiCalendar size={20} /> Agendar Agora
            </Link>

            {/* Link Admin — sutil, no final */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '16px', paddingTop: '16px' }}>
              <Link to="/admin/login" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <FiShield size={14} /> Acesso Administrativo
              </Link>
            </div>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '12px' }}>
              @paintballvicosa · Viçosa · MG
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
