import { useTenant } from '../../context/TenantContext';

const WhyChooseUs = () => {
  const { restaurant, whyChooseUs } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';
  const getTextColor = (bgCol) => {
    if (!bgCol) return '#ffffff';
    const hex = bgCol.replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    const brightness = (r*299 + g*587 + b*114) / 1000;
    return brightness > 128 ? '#111111' : '#ffffff';
  };
  const textColor = getTextColor(restaurant?.bgColor);

  if (!whyChooseUs || whyChooseUs.length === 0) return null;

  return (
    <section style={{ padding: '100px 0', backgroundColor: restaurant?.bgColor || '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: accent, marginBottom: '16px'
        }}>Why Choose Us</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 900, color: textColor,
          lineHeight: 1.1, marginBottom: '24px'
        }}>What Makes Us Different</h2>
        <div style={{ width: '40px', height: '2px', backgroundColor: accent, marginBottom: '56px' }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '32px'
        }}>
          {whyChooseUs.map(item => (
            <div key={item.id} style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '4px',
              padding: '36px 28px',
              transition: 'border-color 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              {item.icon && (
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{item.icon}</div>
              )}
              <div style={{ width: '32px', height: '2px', backgroundColor: accent, marginBottom: '20px' }} />
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.25rem', fontWeight: 700,
                color: textColor, marginBottom: '14px'
              }}>{item.title}</h3>
              <p style={{
                color: textColor === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.55)',
                fontSize: '14px', lineHeight: 1.8
              }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
