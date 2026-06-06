import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

export default function SuperAdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Wake up Render backend on mount
  useEffect(() => { fetch(`${API}/Auth/ping`).catch(() => {}); }, []);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.role !== 'SuperAdmin') throw new Error('Access denied');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      navigate('/superadmin/dashboard');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '0 16px',
      backgroundColor: '#0d0d0d'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '12px',
            backgroundColor: '#C9A84C', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 900, color: '#000',
            fontSize: '20px', margin: '0 auto 16px'
          }}>D</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px', fontWeight: 900, color: '#fff', margin: 0
          }}>Dailo Technology</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '8px' }}>
            Super Administrator
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#111', borderRadius: '16px',
          padding: '36px', border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.4)', marginBottom: '8px'
              }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="superadmin@restro.com"
                style={{
                  width: '100%', padding: '12px 16px', boxSizing: 'border-box',
                  backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', color: '#fff', fontSize: '14px',
                  outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.4)', marginBottom: '8px'
              }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 16px', boxSizing: 'border-box',
                  backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', color: '#fff', fontSize: '14px',
                  outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
                backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171', fontSize: '13px'
              }}>{error}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', backgroundColor: '#C9A84C',
                color: '#000', border: 'none', borderRadius: '10px',
                fontWeight: 900, fontSize: '13px', letterSpacing: '0.15em',
                textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
