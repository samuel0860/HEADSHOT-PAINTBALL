import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiLock, FiUser, FiTarget, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError('Preencha todos os campos.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const result = login(form.username, form.password);
    if (result.success) {
      toast.success('Bem-vindo ao painel administrativo!');
      navigate('/admin');
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#f1f5f9',
    padding: '12px 12px 12px 40px',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#f1f5f9',
    marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#080808',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      {/* Glow bg */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, rgba(232,92,13,0.08) 0%, transparent 70%)' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: '2px solid #e85c0d', background: '#111111',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px', boxShadow: '0 0 30px rgba(232,92,13,0.3)',
          }}>
            <FiTarget size={36} style={{ color: '#e85c0d' }} />
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'white', letterSpacing: '0.2em', display: 'block' }}>HEADSHOT</h1>
          <p style={{ color: '#94a3b8', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '4px' }}>Painel Administrativo</p>
        </div>

        {/* Card */}
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '20px', color: 'white', marginBottom: '24px' }}>Acesso Restrito</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username */}
            <div>
              <label style={labelStyle}>
                Usuário <span style={{ color: '#e85c0d' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  placeholder="admin"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#e85c0d'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>
                Senha <span style={{ color: '#e85c0d' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#e85c0d'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                >
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', color: '#dc2626', fontSize: '14px' }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px',
                background: loading ? '#c44d0b' : '#e85c0d',
                color: 'white', fontWeight: 700, fontSize: '15px',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', transition: 'background 0.2s',
                boxShadow: '0 0 20px rgba(232,92,13,0.3)',
              }}
            >
              {loading ? '⏳ Entrando...' : 'Entrar no Painel'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: '24px', padding: '14px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Credenciais Demo</p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Usuário: <code style={{ color: '#e85c0d' }}>admin</code> · Senha: <code style={{ color: '#e85c0d' }}>paintball123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
