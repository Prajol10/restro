import { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import Layout from '../../components/public/Layout';

const GalleryPage = () => {
  const { restaurant, gallery } = useTenant();
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';

  // Styles
  const S = {
    page: { backgroundColor: bg, minHeight: '100vh' },
    section: { padding: '100px 0' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' },
    sectionLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' },
    divider: { width: '40px', height: '2px', backgroundColor: accent, marginBottom: '48px' },
    controls: { display: 'flex', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '12px' },
    categoryButton: { 
      padding: '10px 20px', 
      backgroundColor: 'transparent', 
      border: '1px solid rgba(255,255,255,0.1)', 
      color: 'rgba(255,255,255,0.7)',
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.875rem', 
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeCategory: { 
      backgroundColor: accent, 
      color: '#000', 
      border: '1px solid ' + accent 
    },
    gallery: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))', 
      gap: '16px' 
    },
    galleryItem: { 
      position: 'relative', 
      overflow: 'hidden', 
      borderRadius: '8px',
      cursor: 'pointer',
      aspectRatio: '4/3'
    },
    galleryImage: { 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover', 
      transition: 'transform 0.3s ease',
      display: 'block'
    },
    galleryItemHover: { transform: 'scale(1.05)' },
    imageInfo: { 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', 
      padding: '20px 15px 10px',
      color: '#fff',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    galleryItemHoverInfo: { opacity: 1 },
    imageCaption: { 
      fontSize: '0.875rem', 
      fontWeight: 600,
      marginBottom: '5px'
    },
    imageCategory: { 
      fontSize: '0.75rem', 
      color: accent 
    },
    lightbox: { 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.95)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 2000,
      padding: '20px'
    },
    lightboxContent: { 
      position: 'relative', 
      maxWidth: '90%', 
      maxHeight: '90%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    lightboxImage: { 
      maxWidth: '100%', 
      maxHeight: '80vh', 
      objectFit: 'contain',
      borderRadius: '4px'
    },
    lightboxClose: { 
      position: 'absolute', 
      top: '-40px', 
      right: '0', 
      background: 'none', 
      border: 'none', 
      color: '#fff', 
      fontSize: '2rem', 
      cursor: 'pointer'
    },
    lightboxNav: { 
      position: 'absolute', 
      top: '50%', 
      transform: 'translateY(-50%)', 
      background: 'rgba(0,0,0,0.5)', 
      border: 'none', 
      color: '#fff', 
      fontSize: '2rem', 
      cursor: 'pointer',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%'
    },
    lightboxPrev: { left: '-60px' },
    lightboxNext: { right: '-60px' },
    lightboxInfo: { 
      color: '#fff', 
      textAlign: 'center', 
      marginTop: '20px',
      maxWidth: '600px'
    },
    lightboxCaption: { 
      fontSize: '1.25rem', 
      fontWeight: 700, 
      marginBottom: '10px'
    },
    lightboxDescription: { 
      fontSize: '1rem', 
      color: 'rgba(255,255,255,0.7)'
    },
    downloadButton: { 
      marginTop: '15px', 
      padding: '8px 16px', 
      backgroundColor: accent, 
      color: '#000', 
      border: 'none', 
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.875rem', 
      fontWeight: 700, 
      textTransform: 'uppercase', 
      letterSpacing: '0.1em', 
      cursor: 'pointer',
      borderRadius: '4px'
    }
  };

  // Filter gallery by category
  useEffect(() => {
    if (!gallery) return;
    
    const activeImages = gallery.filter(img => img.isActive && !img.isArchived);
    
    if (selectedCategory === 'all') {
      setFilteredGallery(activeImages);
    } else {
      setFilteredGallery(
        activeImages.filter(img => img.category === selectedCategory)
      );
    }
  }, [selectedCategory, gallery]);

  // Get unique categories
  const categories = [...new Set(gallery?.filter(img => img.isActive && !img.isArchived && img.category).map(img => img.category) || [])];

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === filteredGallery.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? filteredGallery.length - 1 : prev - 1
      );
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (!restaurant) return null;

  return (
    <Layout>
      <div style={S.page}>
        <section style={S.section}>
          <div style={S.container}>
            <p style={S.sectionLabel}>GALLERY</p>
            <h1 style={S.sectionTitle}>{restaurant.name} Gallery</h1>
            <div style={S.divider} />
            
            {/* Category Filters */}
            {categories.length > 0 && (
              <div style={S.controls}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    ...S.categoryButton,
                    ...(selectedCategory === 'all' ? S.activeCategory : {})
                  }}
                >
                  All Photos
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      ...S.categoryButton,
                      ...(selectedCategory === category ? S.activeCategory : {})
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
            
            {/* Gallery Grid */}
            <div style={S.gallery}>
              {filteredGallery.map((image, index) => (
                <div 
                  key={image.id} 
                  style={S.galleryItem}
                  onClick={() => openLightbox(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = S.galleryItemHover.transform;
                    e.currentTarget.querySelector('img').style.transform = S.galleryItemHoverInfo.transform;
                    e.currentTarget.querySelector('.image-info').style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.querySelector('img').style.transform = 'none';
                    e.currentTarget.querySelector('.image-info').style.opacity = '0';
                  }}
                >
                  <img 
                    src={image.imageUrl} 
                    alt={image.caption || 'Gallery image'} 
                    style={S.galleryImage}
                  />
                  <div className="image-info" style={S.imageInfo}>
                    {image.caption && (
                      <div style={S.imageCaption}>{image.caption}</div>
                    )}
                    {image.category && (
                      <div style={S.imageCategory}>{image.category}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredGallery.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }}>
                <h3>No images found</h3>
                <p>Check back later for updates to our gallery</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Lightbox */}
        {lightboxOpen && filteredGallery.length > 0 && (
          <div style={S.lightbox} onClick={closeLightbox}>
            <div style={S.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <button style={S.lightboxClose} onClick={closeLightbox}>
                ×
              </button>
              
              <button 
                style={{...S.lightboxNav, ...S.lightboxPrev}} 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('prev');
                }}
              >
                ←
              </button>
              
              <img 
                src={filteredGallery[currentImageIndex]?.imageUrl} 
                alt={filteredGallery[currentImageIndex]?.caption || 'Gallery image'} 
                style={S.lightboxImage}
              />
              
              <button 
                style={{...S.lightboxNav, ...S.lightboxNext}} 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('next');
                }}
              >
                →
              </button>
              
              <div style={S.lightboxInfo}>
                {filteredGallery[currentImageIndex]?.caption && (
                  <div style={S.lightboxCaption}>
                    {filteredGallery[currentImageIndex].caption}
                  </div>
                )}
                {filteredGallery[currentImageIndex]?.description && (
                  <div style={S.lightboxDescription}>
                    {filteredGallery[currentImageIndex].description}
                  </div>
                )}
                <button 
                  style={S.downloadButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(filteredGallery[currentImageIndex].imageUrl, '_blank');
                  }}
                >
                  Download Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GalleryPage;
