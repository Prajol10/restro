import { useTenant } from '../../context/TenantContext';
import { useState, useEffect } from 'react';
import Layout from '../../components/public/Layout';

const AboutPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { restaurant, whyChooseUs } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';
  const primary = restaurant?.primaryColor || '#1a1a1a';
  const getTextColor = (bgCol) => {
    if (!bgCol) return '#ffffff';
    const hex = bgCol.replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    return (r*299 + g*587 + b*114) / 1000 > 128 ? '#111111' : '#ffffff';
  };
  const textColor = getTextColor(bg);
  const isLight = textColor === '#111111';
  const subText = isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)';
  const borderColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
  const cardBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)';
  const container = { maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 64px', width: '100%', boxSizing: 'border-box' };
  const sectionPad = isMobile ? '40px 0' : '112px 0';

  if (!restaurant) return null;

  return (
    <Layout>
      <div style={{ backgroundColor: bg, minHeight: '100vh' }}>

        {/* Hero Banner */}
        <div style={{ height: isMobile ? '50vh' : '65vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {restaurant.aboutImageUrl ? (
            <img src={restaurant.aboutImageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: primary }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: isMobile ? '0 24px' : '0 64px', maxWidth: '800px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '16px' }}>Our Story</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '3rem' : '5rem', fontWeight: 900, color: '#ffffff', marginBottom: '20px', lineHeight: 1.0 }}>About Us</h1>
            <div style={{ width: '48px', height: '2px', backgroundColor: accent, margin: '0 auto 20px' }} />
            <p style={{ fontSize: isMobile ? '1rem' : '1.15rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
              {restaurant.tagline || 'Authentic flavors, timeless tradition'}
            </p>
          </div>
        </div>

        {/* Our Story */}
        <section style={{ padding: sectionPad, backgroundColor: bg }}>
          <div style={container}>
            <div style={{ display: 'grid', gridTemplateColumns: (restaurant.aboutImageUrl && !isMobile) ? '55% 45%' : '1fr', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '14px' }}>Our Journey</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '2rem' : 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, color: textColor, marginBottom: '20px', lineHeight: 1.1 }}>{restaurant.name}</h2>
                <div style={{ width: '48px', height: '2px', backgroundColor: accent, marginBottom: '32px' }} />
                {restaurant.aboutShort && (
                  <p style={{ fontSize: '1.1rem', color: isLight ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.85)', lineHeight: 1.85, fontStyle: 'italic', marginBottom: '24px', borderLeft: `3px solid ${accent}`, paddingLeft: '20px' }}>
                    {restaurant.aboutShort}
                  </p>
                )}
                <p style={{ fontSize: '0.95rem', color: subText, lineHeight: 2 }}>
                  {restaurant.aboutText || `Welcome to ${restaurant.name}, where tradition meets innovation. Our journey began with a passion for authentic flavors and a commitment to providing an exceptional dining experience.`}
                </p>
              </div>
              {restaurant.aboutImageUrl && !isMobile && (
                <div style={{ position: 'relative' }}>
                  <img src={restaurant.aboutImageUrl} alt="About" style={{ width: '100%', height: '520px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 32px 64px rgba(0,0,0,0.25)' }} />
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', border: `2px solid ${accent}`, borderRadius: '12px', zIndex: -1 }} />
                  <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', backgroundColor: accent, opacity: 0.15, borderRadius: '8px', zIndex: -1 }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        {whyChooseUs && whyChooseUs.length > 0 && (
          <section style={{ padding: sectionPad, backgroundColor: bg, borderTop: `1px solid ${borderColor}` }}>
            <div style={container}>
              <div style={{ maxWidth: '560px', marginBottom: '56px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '14px' }}>Why Us</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '2rem' : 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, color: textColor, marginBottom: '20px', lineHeight: 1.1 }}>Why Choose Us</h2>
                <div style={{ width: '48px', height: '2px', backgroundColor: accent }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                {whyChooseUs.map((item, idx) => (
                  <div key={item.id}
                    style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, padding: '36px 28px', borderRadius: '12px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{item.icon || '⭐'}</div>
                    <div style={{ width: '32px', height: '2px', backgroundColor: accent, marginBottom: '16px' }} />
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '12px' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: subText, lineHeight: 1.85 }}>{item.description}</p>
                    <div style={{ position: 'absolute', bottom: '16px', right: '20px', fontSize: '36px', opacity: 0.04, color: textColor, fontWeight: 900 }}>{idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ backgroundColor: primary, padding: isMobile ? '80px 0' : '112px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
          <div style={{ ...container, position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '16px' }}>VISIT US</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#ffffff', marginBottom: '20px', lineHeight: 1.1 }}>Visit Us Today</h2>
            <div style={{ width: '48px', height: '2px', backgroundColor: accent, margin: '0 auto 28px' }} />
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.8 }}>
              {restaurant.reservationText || 'Experience the authentic flavors and warm hospitality that make us unique.'}
            </p>
            <a href={`/${restaurant.subdomain}/contact`}
              style={{ padding: '16px 40px', backgroundColor: accent, color: '#000', border: 'none', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', borderRadius: '4px', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 8px 24px ${accent}44`; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
              Get Directions
            </a>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default AboutPage;
