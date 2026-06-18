import { useTenant } from '../../context/TenantContext';

const WhyChooseUs = () => {
  const { restaurant, whyChooseUs } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';
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
  const cardBg = isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)';

  if (!whyChooseUs || whyChooseUs.length === 0) return null;

  return (
    <section style={{ padding: '112px 0', backgroundColor: bg, borderTop: `1px solid ${borderColor}` }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 64px' }}>
        <div style={{ maxWidth: '560px', marginBottom: '64px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '14px' }}>Why Choose Us</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, color: textColor, lineHeight: 1.1, marginBottom: '20px' }}>What Makes Us Different</h2>
          <div style={{ width: '48px', height: '2px', backgroundColor: accent }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {whyChooseUs.map((item, idx) => (
            <div key={item.id}
              style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '40px 32px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.12)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: accent, transform: 'scaleX(0)', transition: 'transform 0.3s ease', transformOrigin: 'left' }}
                onMouseEnter={e => e.target.style.transform = 'scaleX(1)'}
              />
              <div style={{ fontSize: '2.8rem', marginBottom: '24px', lineHeight: 1 }}>{item.icon || '⭐'}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: textColor, marginBottom: '12px', lineHeight: 1.2 }}>{item.title}</h3>
              <div style={{ width: '32px', height: '2px', backgroundColor: accent, marginBottom: '16px' }} />
              <p style={{ color: subText, fontSize: '0.9rem', lineHeight: 1.85 }}>{item.description}</p>
              <div style={{ position: 'absolute', bottom: '24px', right: '24px', fontSize: '40px', opacity: 0.04, color: textColor, fontWeight: 900, fontFamily: 'Georgia' }}>{idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
