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

  if (!restaurant) return null;

  const S = {
    page: { backgroundColor: bg, minHeight: '100vh' },
    section: { padding: '100px 0' },
    darkSection: { padding: '100px 0', backgroundColor: restaurant?.bgColor || '#0d0d0d' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' },
    label: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' },
    title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' },
    divider: { width: '40px', height: '2px', backgroundColor: accent, marginBottom: '48px' },
  };

  return (
    <Layout>
      <div style={S.page}>

        {/* Hero */}
        <div style={{
          height: '60vh', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: restaurant?.bgColor || '#0d0d0d',
          backgroundImage: restaurant.aboutImageUrl ? `url(${restaurant.aboutImageUrl})` : 'none',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 48px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' }}>Our Story</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
              About Us
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
              {restaurant.tagline || 'Authentic flavors, timeless tradition'}
            </p>
          </div>
        </div>

        {/* Our Story */}
        <section style={S.section}>
          <div style={S.container}>
            <div style={{ display: 'grid', gridTemplateColumns: restaurant.aboutImageUrl ? '1fr 1fr' : '1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <p style={S.label}>Our Journey</p>
                <h2 style={S.title}>{restaurant.name}</h2>
                <div style={S.divider} />
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, marginBottom: '16px' }}>
                  {restaurant.aboutText || restaurant.aboutShort || `Welcome to ${restaurant.name}, where tradition meets innovation. Our journey began with a passion for authentic flavors and a commitment to providing an exceptional dining experience.`}
                </p>
              </div>
              {restaurant.aboutImageUrl && (
                <div style={{ position: 'relative' }}>
                  <img src={restaurant.aboutImageUrl} alt="About" style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', border: `2px solid ${accent}`, borderRadius: '4px', zIndex: -1 }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section style={S.darkSection}>
          <div style={S.container}>
            <p style={S.label}>Why Us</p>
            <h2 style={S.title}>Why Choose Us</h2>
            <div style={S.divider} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
              {whyChooseUs && whyChooseUs.length > 0 ? whyChooseUs.map(item => (
                <div key={item.id} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '32px', textAlign: 'center', borderRadius: '4px' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                  {item.icon && <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>}
                  <div style={{ width: '32px', height: '2px', backgroundColor: accent, margin: '0 auto 16px' }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>{item.description}</p>
                </div>
              )) : (
                [{ icon: '🍽', title: 'Authentic Recipes', desc: 'Our dishes are crafted using traditional recipes passed down through generations.' },
                 { icon: '🌱', title: 'Fresh Ingredients', desc: 'We source the freshest ingredients daily from local farms and suppliers.' },
                 { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Our skilled chefs bring years of experience and passion to every dish.' },
                 { icon: '🍷', title: 'Premium Experience', desc: 'From ambiance to service, we ensure every visit is memorable.' }
                ].map((item, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '32px', textAlign: 'center', borderRadius: '4px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
                    <div style={{ width: '32px', height: '2px', backgroundColor: accent, margin: '0 auto 16px' }} />
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>{item.desc}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: restaurant?.primaryColor || '#1a1a1a', padding: '80px 0', textAlign: 'center', color: '#fff' }}>
          <div style={S.container}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '24px' }}>
              Visit Us Today
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 32px' }}>
              {restaurant.reservationText || 'Experience the authentic flavors and warm hospitality that make us unique.'}
            </p>
            <a href={`/${restaurant.subdomain}/contact`} style={{ padding: '16px 32px', backgroundColor: accent, color: '#000', border: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>
              Get Directions
            </a>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default AboutPage;
