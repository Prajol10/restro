import { useTenant } from '../../context/TenantContext';

const About = () => {
  const { restaurant } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';

  if (!restaurant?.aboutText && !restaurant?.aboutShort) return null;

  return (
    <section id="about" style={{
      padding: '120px 0',
      backgroundColor: '#080808'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: accent, marginBottom: '20px'
            }}>Our Story</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 900, color: '#fff',
              lineHeight: 1.1, marginBottom: '24px'
            }}>
              {restaurant?.name}
            </h2>
            <div style={{ width: '48px', height: '2px', backgroundColor: accent, marginBottom: '32px' }} />
            <p style={{
              color: 'rgba(255,255,255,0.6)', lineHeight: 1.9,
              fontSize: '16px', marginBottom: '16px'
            }}>
              {restaurant?.aboutText || restaurant?.aboutShort}
            </p>
          </div>
          {restaurant?.aboutImageUrl ? (
            <div style={{ position: 'relative' }}>
              <img src={restaurant.aboutImageUrl} alt="About" style={{
                width: '100%', height: '500px', objectFit: 'cover',
                borderRadius: '4px'
              }} />
              <div style={{
                position: 'absolute', bottom: '-20px', right: '-20px',
                width: '120px', height: '120px',
                border: `2px solid ${accent}`,
                borderRadius: '4px', zIndex: -1
              }} />
            </div>
          ) : (
            <div style={{
              height: '400px', backgroundColor: '#111',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '80px', borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>🍽️</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
