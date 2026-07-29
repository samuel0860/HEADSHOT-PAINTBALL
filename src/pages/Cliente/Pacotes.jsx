import { usePacotes } from '../../contexts/PacotesContext';
import { ClientNavbar } from '../../components/client/ClientNavbar';
import { ClientFooter } from '../../components/client/ClientFooter';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { FiCheck, FiTarget, FiCalendar } from 'react-icons/fi';

export default function Pacotes() {
  const { getPacotesAtivos } = usePacotes();
  const pacotes = getPacotesAtivos();

  const tipos = ['inicial', 'recarga', 'promocional'];
  const tipoLabels = { inicial: 'Pacotes Iniciais', recarga: 'Recargas', promocional: 'Pacote Promocional' };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      <ClientNavbar />
      
      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(232,92,13,0.1)', border: '1px solid rgba(232,92,13,0.3)', borderRadius: '999px', marginBottom: '12px' }}>
              <FiTarget size={13} style={{ color: '#e85c0d' }} />
              <span style={{ fontSize: '11px', color: '#e85c0d', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Tabela de Valores</span>
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: 'white', letterSpacing: '0.05em', lineHeight: 1, marginBottom: '12px' }}>
              ESCOLHA SEU PACOTE
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
              Todos os pacotes iniciais incluem máscara e colete de proteção.
            </p>
          </div>

          {tipos.map(tipo => {
            const grupo = pacotes.filter(p => p.tipo === tipo);
            if (!grupo.length) return null;
            return (
              <div key={tipo} style={{ marginBottom: '56px' }}>
                {/* Section divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#e85c0d', letterSpacing: '0.2em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {tipoLabels[tipo]}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
                </div>

                {/* Package cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', justifyContent: 'center' }}>
                  {grupo.map(pacote => (
                    <div key={pacote.id} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                      background: '#111111', borderRadius: '16px', padding: '24px', position: 'relative',
                      border: `2px solid ${pacote.popular ? (pacote.cor || '#e85c0d') : '#1e1e1e'}`,
                      boxShadow: pacote.popular ? `0 0 30px ${pacote.cor || '#e85c0d'}20` : 'none',
                      transition: 'border-color 0.2s',
                    }}>
                      {pacote.popular && (
                        <span style={{
                          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                          background: pacote.cor || '#e85c0d', color: 'white',
                          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          padding: '3px 14px', borderRadius: '0 0 8px 8px',
                        }}>Popular</span>
                      )}

                      <div style={{ marginTop: pacote.popular ? '14px' : '0', marginBottom: '8px', width: '100%' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: pacote.cor || '#e85c0d', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                          {pacote.qtdBolas} Bolinhas
                        </span>
                        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'white', letterSpacing: '0.05em', margin: '4px 0 0' }}>
                          {pacote.nome}
                        </h2>
                      </div>

                      <div style={{ margin: '12px 0' }}>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.2rem', lineHeight: 1, color: pacote.cor || '#e85c0d' }}>
                          {formatCurrency(pacote.preco)}
                        </span>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>por jogador</p>
                      </div>

                      {pacote.descricao && (
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px', lineHeight: 1.5 }}>{pacote.descricao}</p>
                      )}

                      {pacote.incluso?.filter(Boolean).length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {pacote.incluso.filter(Boolean).map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                              <FiCheck size={12} style={{ color: '#22c55e', flexShrink: 0 }} /> {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      <Link to="/agendamento" style={{
                        width: '100%', marginTop: 'auto', padding: '11px 0', borderRadius: '10px',
                        fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        background: pacote.popular ? (pacote.cor || '#e85c0d') : 'transparent',
                        border: `1.5px solid ${pacote.cor || '#e85c0d'}`,
                        color: pacote.popular ? 'white' : (pacote.cor || '#e85c0d'),
                      }}>
                        <FiCalendar size={14} /> Agendar
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Note */}
          <div style={{ marginTop: '16px', padding: '16px 20px', background: '#111111', border: '1px solid rgba(232,92,13,0.2)', borderRadius: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              💡 <strong style={{ color: 'white' }}>Nota:</strong> Equipamentos (máscara e colete) inclusos apenas nos Pacotes Iniciais.
            </p>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
