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
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [previewGallery, setPreviewGallery] = useState([]);
  const [previewReviews, setPreviewReviews] = useState([]);

  useEffect(() => {
    if (menuItems) {
      setFeaturedItems(menuItems.filter(i => i.isSpecial && i.isAvailable).slice(0, 6));
    }
  }, [menuItems]);

  useEffect(() => {
    if (gallery) {
      setPreviewGallery(gallery.filter(i => !i.isArchived).slice(0, 6));
    }
  }, [gallery]);

  useEffect(() => {
    if (reviews) {
      setPreviewReviews(reviews.filter(r => r.isApproved).slice(0, 3));
    }
  }, [reviews]);

  if (!restaurant) return null;
  const accent = restaurant.accentColor || '#C9A84C';
  const averageRating = previewReviews.length > 0
    ? (previewReviews.reduce((sum, r) => sum + r.rating, 0) / previewReviews.length).toFixed(1)
    : 0;

  const S = {
    section: { backgroundColor: restaurant.bgColor || '#0d0d0d', padding: isMobile ? '60px 0' : '100px 0' },
    darkSection: { backgroundColor: restaurant.primaryColor || '#111', padding: isMobile ? '60px 0' : '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' },
    label: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' },
    title: { fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '2rem' : 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' },
    divider: { width: '40px', height: '2px', backgroundColor: accent, marginBottom: '48px' },
    grid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: isMobile ? '24px' : '32px' },
    card: { backgroundColor: restaurant.bgColor || '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', padding: '28px', textAlign: 'center' },
    image: { width: '160px', height: '160px', borderRadius: '50%', border: `3px solid ${accent}`, objectFit: 'cover', marginBottom: '20px' },
    itemName: { fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    price: { fontSize: '1rem', color: accent, fontWeight: 700, marginBottom: '8px' },
    desc: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' },
    link: { color: accent, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', marginTop: '24px', display: 'inline-block', cursor: 'pointer' },
    reviewCard: { backgroundColor: restaurant.bgColor || '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', padding: '28px' },
    ctaSection: { backgroundColor: restaurant.primaryColor || '#1a1a1a', padding: isMobile ? '60px 0' : '100px 0', textAlign: 'center' },
    ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '24px' },
    ctaBtn: { padding: '16px 32px', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
    galleryGrid: { display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' },
    galleryImg: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }
  };

  return (
    <Layout>
      <Hero
        onOrderClick={() => navigate(`/${slug}/menu`)}
        onReserveClick={() => navigate(`/${slug}/contact`)}
      />

      {/* Featured Menu */}
      {featuredItems.length > 0 && (
        <section style={S.section}>
          <div style={S.container}>
            <p style={S.label}>FROM OUR KITCHEN</p>
            <h2 style={S.title}>Featured Menu</h2>
            <div style={S.divider} />
            <div style={S.grid}>
              {featuredItems.map(item => (
                <div key={item.id} style={S.card}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={S.image} />}
                  <h3 style={S.itemName}>{item.name}</h3>
                  <p style={S.price}>Rs. {item.price}</p>
                  <p style={S.desc}>{item.description}</p>
                </div>
              ))}
            </div>
            <span onClick={() => navigate(`/${slug}/menu`)} style={S.link}>View Full Menu →</span>
          </div>
        </section>
      )}

      {/* About Preview */}
      <section style={S.darkSection}>
        <div style={S.container}>
          <p style={S.label}>OUR STORY</p>
          <h2 style={S.title}>About Us</h2>
          <div style={{...S.divider, marginBottom: '32px'}} />
          <div style={{ display: 'grid', gridTemplateColumns: (restaurant.aboutImageUrl && !isMobile) ? '1fr 1fr' : '1fr', gap: isMobile ? '32px' : '64px', alignItems: 'center' }}>
            <div>
              {restaurant.aboutShort && (
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '24px', borderLeft: `3px solid ${accent}`, paddingLeft: '20px' }}>
                  {restaurant.aboutShort}
                </p>
              )}
              {restaurant.aboutText && (
                <p style={{...S.desc, lineHeight: '2', marginBottom: '32px', whiteSpace: 'pre-line'}}>
                  {restaurant.aboutText}
                </p>
              )}
              {!restaurant.aboutShort && !restaurant.aboutText && (
                <p style={{...S.desc, lineHeight: '1.8', marginBottom: '24px'}}>Welcome to our restaurant.</p>
              )}
              <span onClick={() => navigate(`/${slug}/about`)} style={S.link}>Learn More →</span>
            </div>
            {restaurant.aboutImageUrl && (
              <img src={restaurant.aboutImageUrl} alt="About Us" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Reviews */}
      {previewReviews.length > 0 && (
        <section style={S.section}>
          <div style={S.container}>
            <p style={S.label}>TESTIMONIALS</p>
            <h2 style={S.title}>What Our Guests Say</h2>
            <div style={S.divider} />
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: accent }}>{averageRating}</div>
              <div style={{ color: accent, fontSize: '1.5rem', margin: '8px 0' }}>★★★★★</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Based on {previewReviews.length} reviews</div>
            </div>
            <div style={S.grid}>
              {previewReviews.map(review => (
                <div key={review.id} style={S.reviewCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{review.customerName}</span>
                    <span style={{ color: accent }}>{'★'.repeat(review.rating)}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', fontStyle: 'italic' }}>"{review.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reservation CTA */}
      <section style={S.ctaSection}>
        <div style={S.container}>
          <h2 style={S.ctaTitle}>Experience the Tradition</h2>
          <p style={{...S.desc, maxWidth: '600px', margin: '0 auto 32px', textAlign: 'center'}}>
            {restaurant.reservationText || 'Book your table today and enjoy an authentic dining experience.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate(`/${slug}/contact`)} style={{...S.ctaBtn, backgroundColor: accent, color: '#000'}}>
              Reserve a Table
            </button>
            {restaurant.restro24Url
              ? <a href={restaurant.restro24Url} target="_blank" rel="noopener noreferrer" style={{...S.ctaBtn, backgroundColor: 'transparent', border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', textDecoration:'none'}}>Order Online</a>
              : <button onClick={() => navigate(`/${slug}/menu`)} style={{...S.ctaBtn, backgroundColor: 'transparent', border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff'}}>Order Online</button>
            }
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} style={{...S.ctaBtn, backgroundColor: 'transparent', border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff'}}>
                Call Now
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {previewGallery.length > 0 && (
        <section style={S.darkSection}>
          <div style={S.container}>
            <p style={S.label}>GALLERY</p>
            <h2 style={S.title}>Our Space</h2>
            <div style={{...S.divider, marginBottom: '32px'}} />
            <div style={S.galleryGrid}>
              {previewGallery.map(image => (
                <img key={image.id} src={image.imageUrl} alt={image.caption || ''} style={S.galleryImg} />
              ))}
            </div>
            <span onClick={() => navigate(`/${slug}/gallery`)} style={S.link}>View Full Gallery →</span>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default HomePage;
