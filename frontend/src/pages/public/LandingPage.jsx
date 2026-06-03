import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

export default function LandingPage() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/restaurant/all`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (Array.isArray(data) && data.length > 0) setRestaurants(data); })
      .catch(() => {});
  }, []);

  const parseBanner = (bannerUrl) => {
    try { const p = JSON.parse(bannerUrl || ''); return Array.isArray(p) ? p[0] : bannerUrl; } catch { return bannerUrl; }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', fontSize: '14px' }}>D</div>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>Dailo Technology</span>
        </div>
        <button onClick={() => navigate('/superadmin/login')} style={{
          padding: '10px 24px', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
          backgroundColor: '#C9A84C', color: '#000', border: 'none'
        }}>Admin Login</button>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '100px 48px 80px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>Restaurant Platform</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '24px' }}>
          Premium Restaurant<br />Websites
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '17px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          Powering digital presence for Nepal's finest restaurants and dining experiences.
        </p>
      </div>

      {/* Restaurants */}
      {restaurants.length > 0 && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px 80px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '32px', textAlign: 'center' }}>Our Partner Restaurants</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {restaurants.map(r => (
              <div key={r.id} onClick={() => navigate(`/${r.subdomain}`)} style={{
                backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer', overflow: 'hidden',
                transition: 'border-color 0.3s ease, transform 0.3s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {parseBanner(r.bannerUrl) ? (
                  <img src={parseBanner(r.bannerUrl)} alt={r.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '200px', backgroundColor: r.primaryColor || '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🍽️</div>
                )}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    {r.logoUrl ? (
                      <img src={r.logoUrl} alt={r.name} style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: r.accentColor || '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000', fontSize: '14px' }}>{r.name[0]}</div>
                    )}
                    <h3 style={{ fontWeight: 800, color: '#fff', fontSize: '16px' }}>{r.name}</h3>
                  </div>
                  {r.tagline && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '16px' }}>{r.tagline}</p>}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '11px', padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>View Menu</span>
                    <span style={{ fontSize: '11px', padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Reserve</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
