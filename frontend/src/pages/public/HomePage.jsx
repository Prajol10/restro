import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import Layout from '../../components/public/Layout';
import WhyChooseUs from '../../components/public/WhyChooseUs';
import Hero from '../../components/public/Hero';

const HomePage = () => {
  const { restaurant, menuItems, gallery, reviews } = useTenant();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [previewGallery, setPreviewGallery] = useState([]);
  const [previewReviews, setPreviewReviews] = useState([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (menuItems) setFeaturedItems(menuItems.filter(i => i.isSpecial && i.isAvailable).slice(0, 6));
  }, [menuItems]);

  useEffect(() => {
    if (gallery) setPreviewGallery(gallery.filter(i => !i.isArchived).slice(0, 6));
  }, [gallery]);

  useEffect(() => {
    if (reviews) setPreviewReviews(reviews.filter(r => r.isApproved).slice(0, 3));
  }, [reviews]);

  if (!restaurant) return null;

  const accent = restaurant.accentColor || '#C9A84C';
  const bg = restaurant.bgColor || '#0d0d0d';
  const primary = restaurant.primaryColor || '#1a1a1a';
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

  const averageRating = previewReviews.length > 0
    ? (previewReviews.reduce((sum, r) => sum + r.rating, 0) / previewReviews.length).toFixed(1)
    : 0;

  const sectionPad = isMobile ? '64px 0' : '112px 0';
  const container = { maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 64px' };

  const SectionLabel = ({ children }) => (
    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '14px' }}>{children}</p>
  );

  const SectionTitle = ({ children }) => (
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '2rem' : 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, color: textColor, marginBottom: '20px', lineHeight: 1.1 }}>{children}</h2>
  );

  const Divider = ({ mb = '48px' }) => (
    <div style={{ width: '48px', height: '2px', backgroundColor: accent, marginBottom: mb }} />
  );

  return (
    <Layout>
      <Hero
        onOrderClick={() => navigate(`/${slug}/menu`)}
        onReserveClick={() => navigate(`/${slug}/contact`)}
      />

      {/* Featured Menu */}
      {featuredItems.length > 0 && (
        <section style={{ backgroundColor: bg, padding: sectionPad }}>
          <div style={container}>
            <SectionLabel>FROM OUR KITCHEN</SectionLabel>
            <SectionTitle>Featured Menu</SectionTitle>
            <Divider />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: isMobile ? '16px' : '28px' }}>
              {featuredItems.map(item => (
                <div key={item.id}
                  style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.15)`; e.currentTarget.style.borderColor = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = borderColor; }}
                  onClick={() => navigate(`/${slug}/menu`)}
                >
                  {item.imageUrl ? (
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                    </div>
                  ) : (
                    <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', backgroundColor: cardBg }}>🍽️</div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '6px' }}>{item.name}</h3>
                    <p style={{ fontSize: '1rem', color: accent, fontWeight: 700, marginBottom: '8px' }}>Rs. {parseFloat(item.price).toFixed(0)}</p>
                    {item.description && <p style={{ fontSize: '0.8rem', color: subText, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <span onClick={() => navigate(`/${slug}/menu`)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: accent, textDecoration: 'none', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', cursor: 'pointer', borderBottom: `1px solid ${accent}`, paddingBottom: '2px', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >VIEW FULL MENU →</span>
            </div>
          </div>
        </section>
      )}

      {/* About Preview */}
      <section style={{ backgroundColor: bg, padding: sectionPad, borderTop: `1px solid ${borderColor}` }}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: (restaurant.aboutImageUrl && !isMobile) ? '1fr 1fr' : '1fr', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>
            <div>
              <SectionLabel>OUR STORY</SectionLabel>
              <SectionTitle>About Us</SectionTitle>
              <Divider mb="28px" />
              {restaurant.aboutShort && (
                <p style={{ fontSize: '1.15rem', color: isLight ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '20px', borderLeft: `3px solid ${accent}`, paddingLeft: '20px' }}>
                  {restaurant.aboutShort}
                </p>
              )}
              {restaurant.aboutText && (
                <p style={{ fontSize: '0.95rem', color: subText, lineHeight: 2, marginBottom: '32px', whiteSpace: 'pre-line' }}>
                  {restaurant.aboutText.substring(0, 300)}{restaurant.aboutText.length > 300 ? '...' : ''}
                </p>
              )}
              {!restaurant.aboutShort && !restaurant.aboutText && (
                <p style={{ fontSize: '0.95rem', color: subText, lineHeight: 2, marginBottom: '32px' }}>Welcome to our restaurant. We are dedicated to bringing you the finest dining experience.</p>
              )}
              <span onClick={() => navigate(`/${slug}/about`)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: accent, fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', cursor: 'pointer', borderBottom: `1px solid ${accent}`, paddingBottom: '2px' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >LEARN MORE →</span>
            </div>
            {restaurant.aboutImageUrl && (
              <div style={{ position: 'relative' }}>
                <img src={restaurant.aboutImageUrl} alt="About Us" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '500px', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }} />
                <div style={{ position: 'absolute', top: '-16px', left: '-16px', width: '80px', height: '80px', border: `2px solid ${accent}`, borderRadius: '12px', zIndex: -1 }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Reviews */}
      {previewReviews.length > 0 && (
        <section style={{ backgroundColor: bg, padding: sectionPad, borderTop: `1px solid ${borderColor}` }}>
          <div style={container}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}>
              <SectionLabel>TESTIMONIALS</SectionLabel>
              <SectionTitle>What Our Guests Say</SectionTitle>
              <Divider mb="24px" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: accent }}>{averageRating}</span>
                <div>
                  <div style={{ color: accent, fontSize: '1.2rem', letterSpacing: '2px' }}>★★★★★</div>
                  <div style={{ color: subText, fontSize: '12px', marginTop: '4px' }}>Based on {previewReviews.length} reviews</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {previewReviews.map(review => (
                <div key={review.id} style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '32px', position: 'relative' }}>
                  <div style={{ fontSize: '48px', color: accent, opacity: 0.2, position: 'absolute', top: '16px', right: '20px', fontFamily: 'Georgia', lineHeight: 1 }}>"</div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= review.rating ? accent : borderColor, fontSize: '16px' }}>★</span>)}
                  </div>
                  <p style={{ color: isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '20px', fontSize: '0.95rem' }}>"{review.content}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '14px' }}>{review.customerName[0]}</div>
                    <span style={{ fontWeight: 700, color: textColor, fontSize: '14px' }}>{review.customerName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reservation CTA */}
      <section style={{ backgroundColor: primary, padding: isMobile ? '80px 0' : '120px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
        <div style={{ ...container, position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '16px' }}>MAKE A RESERVATION</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#ffffff', marginBottom: '20px', lineHeight: 1.1 }}>Experience the Tradition</h2>
          <div style={{ width: '48px', height: '2px', backgroundColor: accent, margin: '0 auto 32px' }} />
          <p style={{ maxWidth: '560px', margin: '0 auto 48px', color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.8 }}>
            {restaurant.reservationText || 'Book your table today and enjoy an authentic dining experience.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate(`/${slug}/contact`)}
              style={{ padding: '16px 36px', backgroundColor: accent, color: '#000', border: 'none', borderRadius: '4px', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 8px 24px ${accent}44`; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
              Reserve a Table
            </button>
            {restaurant.restro24Url
              ? <a href={restaurant.restro24Url} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '16px 36px', backgroundColor: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '4px', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = '#fff'; }}
                  onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.5)'; }}>
                  Order Online
                </a>
              : <button onClick={() => navigate(`/${slug}/menu`)}
                  style={{ padding: '16px 36px', backgroundColor: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '4px', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}>
                  Order Online
                </button>
            }
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`}
                style={{ padding: '16px 36px', backgroundColor: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '4px', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}>
                Call Now
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {previewGallery.length > 0 && (
        <section style={{ backgroundColor: bg, padding: sectionPad, borderTop: `1px solid ${borderColor}` }}>
          <div style={container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <SectionLabel>GALLERY</SectionLabel>
                <SectionTitle>Our Space</SectionTitle>
                <Divider mb="0" />
              </div>
              <span onClick={() => navigate(`/${slug}/gallery`)}
                style={{ color: accent, fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', cursor: 'pointer', borderBottom: `1px solid ${accent}`, paddingBottom: '2px' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >VIEW ALL →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '12px' }}>
              {previewGallery.slice(0, isMobile ? 4 : 6).map((image, idx) => (
                <div key={image.id} onClick={() => navigate(`/${slug}/gallery`)}
                  style={{ borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', aspectRatio: idx === 0 && !isMobile ? '2/1' : '4/3', gridColumn: idx === 0 && !isMobile ? 'span 2' : 'span 1' }}>
                  <img src={image.imageUrl} alt={image.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default HomePage;
