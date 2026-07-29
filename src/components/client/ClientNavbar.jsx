import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiCalendar, FiTarget } from 'react-icons/fi';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/pacotes', label: 'Preços' },
  { to: '/galeria', label: 'Galeria' },
  { to: '/promocoes', label: 'Promoções' },
  { to: '/meus-agendamentos', label: 'Meus Agendamentos' },
];

export function ClientNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (to) => location.pathname === to;

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 50,
    transition: 'all 0.3s',
    background: scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
  };

  const innerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={innerStyle}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(232,92,13,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(232,92,13,0.1)' }}>
              <FiTarget size={16} style={{ color: '#e85c0d' }} />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#e85c0d', letterSpacing: '0.2em', display: 'block' }}>HEADSHOT</span>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.35em', textTransform: 'uppercase', display: 'block' }}>Paintball · Viçosa</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden lg:flex">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                color: isActive(link.to) ? '#e85c0d' : 'rgba(255,255,255,0.5)',
                background: isActive(link.to) ? 'rgba(232,92,13,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/agendamento" className="hidden sm:flex" style={{
              alignItems: 'center', gap: '6px', padding: '8px 16px',
              background: '#e85c0d', color: 'white', fontWeight: 700,
              fontSize: '14px', borderRadius: '10px', textDecoration: 'none',
              boxShadow: '0 0 20px rgba(232,92,13,0.3)',
            }}>
              <FiCalendar size={14} /> Agendar
            </Link>

            <button
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden"
              style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', background: 'transparent', cursor: 'pointer' }}
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', paddingTop: '64px' }} className="lg:hidden">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(12px)' }} onClick={() => setMenuOpen(false)} />
          <nav style={{ position: 'relative', zIndex: 10, padding: '24px 16px 32px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive(link.to) ? '#e85c0d' : 'rgba(255,255,255,0.7)',
                  background: isActive(link.to) ? 'rgba(232,92,13,0.1)' : 'transparent',
                  border: isActive(link.to) ? '1px solid rgba(232,92,13,0.2)' : '1px solid transparent',
                }}>
                  {link.label}
                  {isActive(link.to) && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e85c0d' }} />}
                </Link>
              ))}
            </div>
            <Link to="/agendamento" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '16px', background: '#e85c0d', color: 'white',
              fontWeight: 700, fontSize: '16px', borderRadius: '16px', textDecoration: 'none',
              boxShadow: '0 0 30px rgba(232,92,13,0.4)',
            }}>
              <FiCalendar size={18} /> Agendar Agora
            </Link>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '16px' }}>
              @paintballvicosa · Viçosa · MG
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
