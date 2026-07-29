import { Link } from 'react-router-dom';
import { FiTarget, FiInstagram, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export function ClientFooter() {
  return (
    <footer style={{ width: '100%', background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 20px 24px' }}>
        {/* 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '36px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #e85c0d', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111111', flexShrink: 0 }}>
                <FiTarget size={20} style={{ color: '#e85c0d' }} />
              </div>
              <div>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: '#e85c0d', letterSpacing: '0.2em', display: 'block', lineHeight: 1 }}>HEADSHOT</span>
                <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block' }}>Paintball Viçosa</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              A melhor experiência de paintball de Viçosa-MG.
            </p>
            <a href="https://instagram.com/paintballvicosa" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', marginTop: '12px', padding: '8px', borderRadius: '8px', border: '1px solid #2a2a2a', color: '#94a3b8', textDecoration: 'none' }}>
              <FiInstagram size={16} />
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Navegação</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/', label: 'Início' },
                { to: '/pacotes', label: 'Pacotes e Preços' },
                { to: '/galeria', label: 'Galeria' },
                { to: '/promocoes', label: 'Promoções' },
                { to: '/agendamento', label: 'Fazer Agendamento' },
                { to: '/meus-agendamentos', label: 'Meus Agendamentos' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Contato</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <FiPhone size={14} />, text: '(31) 9xxxx-xxxx' },
                { icon: <FiInstagram size={14} />, text: '@paintballvicosa' },
                { icon: <FiMapPin size={14} />, text: 'Viçosa - MG' },
                { icon: <FiClock size={14} />, text: 'Seg–Sex: 08h–20h | Sáb–Dom: 08h–22h' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#64748b' }}>
                  <span style={{ color: '#e85c0d', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '20px', textAlign: 'center', fontSize: '11px', color: '#3a3a3a' }}>
          © {new Date().getFullYear()} Headshot Paintball Viçosa. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
