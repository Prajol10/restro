import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';

const Hero = ({ onOrderClick, onReserveClick }) => {
  const { restaurant } = useTenant();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const accent = restaurant?.accentColor || '#C9A84C';

  const videoRef1 = React.useRef(null);
  const videoRef2 = React.useRef(null);
  const [activeVideo, setActiveVideo] = React.useState(1);

  React.useEffect(() => {
    if (!restaurant?.videoUrl) return;
    const v1 = videoRef1.current;
    const v2 = videoRef2.current;
    if (!v1 || !v2) return;

    const handleV1End = () => {
      setActiveVideo(2);
      v2.currentTime = 0;
      v2.play();
    };
    const handleV2End = () => {
      setActiveVideo(1);
      v1.currentTime = 0;
      v1.play();
    };

    v1.addEventListener('ended', handleV1End);
    v2.addEventListener('ended', handleV2End);
    return () => {
      v1.removeEventListener('ended', handleV1End);
      v2.removeEventListener('ended', handleV2End);
    };
  }, [restaurant?.videoUrl]);

  const parseBanners = (bannerUrl) => {
    if (!bannerUrl) return [];
    try {
      const parsed = JSON.parse(bannerUrl);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return [bannerUrl];
  };

  const banners = parseBanners(restaurant?.bannerUrl);
  const hasVideo = restaurant?.videoUrl;

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % banners.length), 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const defaultBg = 'linear-gradient(135deg, #1a0a00 0%, #0d0d0d 40%, #1a1a0a 100%)';

  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: '#0d0d0d'
    }}>
      {/* Background */}
      {hasVideo ? (
        <>
          <video ref={videoRef1} autoPlay muted playsInline preload="auto"
            poster={banners[0] || ''}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', filter: 'brightness(0.35)',
              willChange: 'transform', backgroundColor: '#0d0d0d',
              opacity: activeVideo === 1 ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}>
            <source src={restaurant.videoUrl} type="video/webm" />
            <source src={restaurant.videoUrl} type="video/mp4" />
          </video>
          <video ref={videoRef2} muted playsInline preload="auto"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', filter: 'brightness(0.35)',
              willChange: 'transform', backgroundColor: '#0d0d0d',
              opacity: activeVideo === 2 ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}>
            <source src={restaurant.videoUrl} type="video/webm" />
            <source src={restaurant.videoUrl} type="video/mp4" />
          </video>
        </>
      ) : banners.length > 0 ? (
        banners.map((banner, idx) => (
          <div key={idx} style={{
            position: 'absolute', inset: 0,
            opacity: idx === currentSlide ? 1 : 0,
            transition: 'opacity 1s ease'
          }}>
            <img src={banner} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.35)'
            }} />
          </div>
        ))
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: defaultBg }} />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 48px', width: '100%',
        paddingTop: '80px'
      }}>
        <div style={{
          maxWidth: '640px',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 1s ease'
        }}>
          {restaurant?.tagline && (
            <p style={{
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.35em', textTransform: 'uppercase',
              color: accent, marginBottom: '20px'
            }}>
              {restaurant.tagline}
            </p>
          )}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 900, lineHeight: 1.05,
            color: '#ffffff', marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            {restaurant?.heroTitle || restaurant?.name || 'Welcome'}
          </h1>
          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.65)',
            marginBottom: '40px', lineHeight: 1.7, maxWidth: '480px'
          }}>
            {restaurant?.heroSubtitle || 'Experience the finest dining.'}
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={onOrderClick} style={{
              padding: '16px 36px', fontWeight: 700,
              fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', cursor: 'pointer',
              backgroundColor: accent, color: '#000',
              border: 'none', transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}>
              View Menu
            </button>
            <button onClick={onReserveClick} style={{
              padding: '16px 36px', fontWeight: 700,
              fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', cursor: 'pointer',
              backgroundColor: 'transparent', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.6)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#000'; }}
            onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#fff'; }}>
              Reserve a Table
            </button>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {banners.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '32px',
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '8px', zIndex: 20
        }}>
          {banners.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} style={{
              height: '3px', borderRadius: '2px',
              border: 'none', cursor: 'pointer',
              backgroundColor: '#fff',
              width: idx === currentSlide ? '32px' : '8px',
              opacity: idx === currentSlide ? 1 : 0.35,
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '32px', right: '48px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '8px', zIndex: 20
      }}>
        <span style={{
          fontSize: '9px', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
          writingMode: 'vertical-rl'
        }}>Scroll</span>
        <div style={{
          width: '1px', height: '60px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)'
        }} />
      </div>
    </section>
  );
};

export default Hero;