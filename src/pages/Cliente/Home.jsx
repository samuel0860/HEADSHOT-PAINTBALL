import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGaleria } from '../../contexts/GaleriaContext';
import { usePacotes } from '../../contexts/PacotesContext';
import { formatCurrency } from '../../utils/formatters';
import { ClientNavbar } from '../../components/client/ClientNavbar';
import { ClientFooter } from '../../components/client/ClientFooter';
import {
  FiCalendar, FiShield, FiUsers, FiTarget, FiArrowRight,
  FiCheck, FiChevronLeft, FiChevronRight, FiClock
} from 'react-icons/fi';

function HeroBanner({ banners }) {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(p => (p + 1) % (banners.length || 1)), [banners.length]);
  const prev = useCallback(() => setCurrent(p => (p - 1 + banners.length) % (banners.length || 1)), [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, banners.length]);

  const b = banners[current];
  const cor = b?.cor || '#e85c0d';

  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#080808' }}>
      
      {/* Vídeo de fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: b?.imagem ? 0 : 0.6, // Se tiver banner, esconde o vídeo
          transition: 'opacity 0.5s ease'
        }}
      >
        <source src="/HEADSHOT-PAINTBALL/video-anuncio.mp4" type="video/mp4" />
      </video>

      {/* Imagem do banner por cima do vídeo (se houver) */}
      {b?.imagem && (
        <img 
          src={b.imagem} 
          alt="" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      )}
      
      {/* Overlay gradiente para escurecer */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 60%, rgba(8,8,8,0.85) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '800px', margin: '0 auto', padding: '5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', marginBottom: '24px' }}>
          <FiTarget size={14} style={{ color: cor }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Viçosa · MG</span>
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em', lineHeight: 1, marginBottom: '16px' }}>
          <span style={{ display: 'block', fontSize: 'clamp(4rem, 15vw, 9rem)', color: cor }}> HEADSHOT</span>
          <span style={{ display: 'block', fontSize: 'clamp(1.2rem, 4vw, 2.5rem)', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.3em', fontWeight: 300, marginTop: '4px' }}>PAINTBALL</span>
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          {b?.subtitulo || 'Adrenalina e diversão para toda a turma!'}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', width: '100%', maxWidth: '360px' }}>
          <Link to="/agendamento" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', color: 'white', background: cor, textDecoration: 'none' }}>
            <FiCalendar size={18} /> Agendar
          </Link>
          <Link to="/pacotes" style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', textDecoration: 'none' }}>
            Pacotes <FiArrowRight size={14} />
          </Link>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={prev} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, padding: '10px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', cursor: 'pointer' }}><FiChevronLeft size={18} /></button>
          <button onClick={next} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, padding: '10px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', cursor: 'pointer' }}><FiChevronRight size={18} /></button>
        </>
      )}
    </section>
  );
}

function QuickInfoStrip() {
  const items = [
    { icon: <FiClock size={15} />, text: 'Aberto Todos os Dias' },
    { icon: <FiShield size={15} />, text: 'Equipamentos Inclusos' },
    { icon: <FiUsers size={15} />, text: '2 a 24 Jogadores' },
  ];
  return (
    <div style={{ width: '100%', background: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            <span style={{ color: '#e85c0d' }}>{item.icon}</span> {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function PacotesSection({ pacotes }) {
  const ativos = pacotes.filter(p => p.ativo);
  if (!ativos.length) return null;

  return (
    <section style={{ width: '100%', padding: '64px 0', background: '#080808' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#e85c0d', fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Tabela de Valores</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', color: 'white', letterSpacing: '0.05em' }}>NOSSOS PACOTES</h2>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', justifyContent: 'center' }}>
          {ativos.map(pacote => (
            <div key={pacote.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              background: '#111111', borderRadius: '16px', padding: '24px',
              border: `2px solid ${pacote.popular ? (pacote.cor || '#e85c0d') : '#1e1e1e'}`,
              boxShadow: pacote.popular ? `0 0 30px ${pacote.cor || '#e85c0d'}25` : 'none',
              position: 'relative', transition: 'border-color 0.2s',
            }}>
              {pacote.popular && (
                <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: pacote.cor || '#e85c0d', color: 'white', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 14px', borderRadius: '0 0 8px 8px' }}>Popular</span>
              )}
              <span style={{ marginTop: pacote.popular ? '14px' : '0', fontSize: '11px', fontWeight: 700, color: pacote.cor || '#e85c0d', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{pacote.qtdBolas} Bolas</span>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'white', letterSpacing: '0.05em', margin: '4px 0 12px' }}>{pacote.nome}</h3>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', lineHeight: 1, color: pacote.cor || '#e85c0d' }}>{formatCurrency(pacote.preco)}</span>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>por jogador</p>
              </div>

              {pacote.incluso?.filter(Boolean).length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {pacote.incluso.filter(Boolean).map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      <FiCheck size={12} style={{ color: '#22c55e', flexShrink: 0 }} />{item}
                    </li>
                  ))}
                </ul>
              )}

              <Link to="/agendamento" style={{
                width: '100%', marginTop: 'auto', padding: '10px 0', borderRadius: '10px',
                fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: pacote.popular ? (pacote.cor || '#e85c0d') : 'transparent',
                border: `1.5px solid ${pacote.cor || '#e85c0d'}`,
                color: pacote.popular ? 'white' : (pacote.cor || '#e85c0d'),
              }}>Agendar Agora</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ width: '100%', padding: '56px 20px', background: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'white', letterSpacing: '0.05em', lineHeight: 1 }}>PRONTO PARA JOGAR?</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', maxWidth: '320px' }}>Agende online em menos de 2 minutos.</p>
      <Link to="/agendamento" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', color: 'white', background: '#e85c0d', textDecoration: 'none', boxShadow: '0 0 25px rgba(232,92,13,0.3)' }}>
        <FiCalendar size={18} /> AGENDAR AGORA
      </Link>
    </section>
  );
}

export default function Home() {
  const { getBannersAtivos } = useGaleria();
  const { getPacotesAtivos } = usePacotes();

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      <ClientNavbar />
      <HeroBanner banners={getBannersAtivos()} />
      <QuickInfoStrip />
      <PacotesSection pacotes={getPacotesAtivos()} />
      <FinalCTA />
      <ClientFooter />
    </div>
  );
}
