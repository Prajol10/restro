import { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import Layout from '../../components/public/Layout';

const GalleryPage = () => {
  const { restaurant, gallery } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') setCurrentImageIndex(i => (i + 1) % filteredGallery.length);
      if (e.key === 'ArrowLeft') setCurrentImageIndex(i => (i - 1 + filteredGallery.length) % filteredGallery.length);
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen]);

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
  const borderColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
  const container = { maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 64px', width: '100%', boxSizing: 'border-box' };

  const filteredGallery = gallery ? gallery.filter(i => !i.isArchived) : [];

  const openLightbox = (idx) => { setCurrentImageIndex(idx); setLightboxOpen(true); document.body.style.overflow = 'hidden'; };
  const closeLightbox = () => { setLightboxOpen(false); document.body.style.overflow = ''; };

  if (!restaurant) return null;

  return (
    <Layout>
      <div style={{ backgroundColor: bg, minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ paddingTop: isMobile ? '100px' : '140px', paddingBottom: isMobile ? '48px' : '80px', textAlign: 'center', backgroundColor: bg, borderBottom: `1px solid ${borderColor}` }}>
          <div style={container}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '14px' }}>GALLERY</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: 900, color: textColor, marginBottom: '20px', lineHeight: 1.0 }}>{restaurant.name} Gallery</h1>
            <div style={{ width: '48px', height: '2px', backgroundColor: accent, margin: '0 auto 20px' }} />
            <p style={{ fontSize: '1rem', color: isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)', maxWidth: '480px', margin: '0 auto' }}>
              A glimpse into our world — our space, our food, our story.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <section style={{ padding: isMobile ? '48px 0 80px' : '80px 0 120px', backgroundColor: bg }}>
          <div style={container}>
            {filteredGallery.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</p>
                <p style={{ fontSize: '16px' }}>No gallery images yet</p>
              </div>
            ) : (
              <>
                {/* Masonry-style grid */}
                <div style={{ columns: isMobile ? 2 : 3, columnGap: '16px' }}>
                  {filteredGallery.map((image, idx) => (
                    <div key={image.id}
                      style={{ breakInside: 'avoid', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                      onClick={() => openLightbox(idx)}
                    >
                      <img src={image.imageUrl} alt={image.caption || ''} style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.parentElement.style.boxShadow = '0 16px 40px rgba(0,0,0,0.2)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.parentElement.style.boxShadow = 'none'; }}
                      />
                      {image.caption && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', opacity: 0, transition: 'opacity 0.3s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                        >
                          <p style={{ color: '#fff', fontSize: '13px', margin: 0 }}>{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ textAlign: 'center', marginTop: '48px', color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
                  {filteredGallery.length} photos • Click any image to view full size
                </p>
              </>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {lightboxOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={closeLightbox}>
            <button onClick={closeLightbox} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i - 1 + filteredGallery.length) % filteredGallery.length); }}
              style={{ position: 'absolute', left: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>‹</button>
            <img src={filteredGallery[currentImageIndex]?.imageUrl} alt="" onClick={e => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }} />
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i + 1) % filteredGallery.length); }}
              style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>›</button>
            <p style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              {currentImageIndex + 1} / {filteredGallery.length}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GalleryPage;
