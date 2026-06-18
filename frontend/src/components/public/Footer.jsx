import { useTenant } from '../../context/TenantContext';

const Footer = () => {
  const { restaurant } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';
  const primary = restaurant?.primaryColor || '#111111';
  const footerTextColor = (() => {
    const hex = (primary).replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    return (r*299 + g*587 + b*114) / 1000 > 128 ? '#111111' : '#ffffff';
  })();
  const getTextColor = (bgCol) => {
    if (!bgCol) return '#ffffff';
    const hex = bgCol.replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    const brightness = (r*299 + g*587 + b*114) / 1000;
    return brightness > 128 ? '#111111' : '#ffffff';
  };

  const hours = (() => { try { return Object.entries(JSON.parse(restaurant?.openingHours || '{}')); } catch { return []; } })();

  return (
    <footer id="contact" style={{ backgroundColor: primary, paddingTop: '80px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: typeof window !== 'undefined' && window.innerWidth <= 768 ? '0 16px' : '0 48px', width: '100%', boxSizing: 'border-box' }}>

        {/* Top - Centered Logo with lines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '64px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: footerTextColor === '#111111' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            {restaurant?.logoUrl ? (
              <img src={restaurant.logoUrl} alt={restaurant.name} style={{ height: '64px', objectFit: 'contain' }} />
            ) : (
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', fontWeight: 900, color: footerTextColor, margin: 0 }}>
                {restaurant?.name}
              </h3>
            )}
          </div>
          <div style={{ flex: 1, height: '1px', backgroundColor: footerTextColor === '#111111' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* 3 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth <= 768 ? '1fr' : '1fr 1px 1fr 1px 1fr', gap: '0', marginBottom: '64px' }}>
          {/* Contact */}
          <div style={{ textAlign: 'center', padding: '0 40px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: footerTextColor, marginBottom: '20px' }}>Contact Us</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {restaurant?.phone && <p style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{restaurant.phone}</p>}
              {restaurant?.email && <p style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{restaurant.email}</p>}
            </div>
          </div>

          {/* Divider */}
          <div style={{ backgroundColor: footerTextColor === '#111111' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)', width: '1px' }} />

          {/* Address */}
          <div style={{ textAlign: 'center', padding: '0 40px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: footerTextColor, marginBottom: '20px', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Address</p>
            {restaurant?.address && (
              <p style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.8 }}>
                {restaurant.address.split(',').map((part, i) => (
                  <span key={i}>{part.trim()}{i < restaurant.address.split(',').length - 1 ? <br /> : ''}</span>
                ))}
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ backgroundColor: footerTextColor === '#111111' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)', width: '1px' }} />

          {/* Opening Hours */}
          <div style={{ textAlign: 'center', padding: '0 40px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: footerTextColor, marginBottom: '20px' }}>Opening Hours</p>
            {hours.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {hours.map(([day, time]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                    <span style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontSize: '13px', textTransform: 'capitalize' }}>{day.slice(0,3)}</span>
                    <span style={{ color: time.toLowerCase()==='closed' ? (footerTextColor === '#111111' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)') : (footerTextColor === '#111111' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'), fontSize: '13px', fontWeight: time.toLowerCase()==='closed' ? 400 : 600 }}>{time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Contact us for hours</p>
            )}
          </div>
        </div>

        {/* Social Links */}
        {(restaurant?.facebookUrl || restaurant?.instagramUrl || restaurant?.tiktokUrl) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
            {restaurant?.instagramUrl && (
              <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color=accent} onMouseLeave={e => e.target.style.color=footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {restaurant?.tiktokUrl && (
              <a href={restaurant.tiktokUrl} target="_blank" rel="noopener noreferrer" style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color=accent} onMouseLeave={e => e.target.style.color=footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/></svg>
              </a>
            )}
            {restaurant?.facebookUrl && (
              <a href={restaurant.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color=accent} onMouseLeave={e => e.target.style.color=footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: footerTextColor === '#111111' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.06)', marginBottom: '24px' }} />

        {/* Copyright */}
        <div style={{ paddingBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} {restaurant?.name}. All rights reserved.
          </p>
          <p style={{ color: footerTextColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontSize: '11px' }}>
            Powered by <span style={{ color: accent }}>Dailo Technology</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
