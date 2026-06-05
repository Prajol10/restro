import { useState } from 'react';
import { useTenant } from '../../context/TenantContext';

const Gallery = () => {
  const { restaurant, gallery } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';
  const [selected, setSelected] = useState(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" style={{ padding: '96px 0', backgroundColor: restaurant?.bgColor || '#0d0d0d' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: accent, marginBottom: '12px'
          }}>Our Space</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900, color: '#fff', margin: 0
          }}>Gallery</h2>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {gallery.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelected(img)}
              style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', cursor: 'pointer', aspectRatio: '1' }}
              onMouseEnter={e => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
                e.currentTarget.querySelector('.overlay').style.backgroundColor = 'rgba(0,0,0,0.45)';
                e.currentTarget.querySelector('.zoom').style.opacity = '1';
                if (e.currentTarget.querySelector('.caption')) e.currentTarget.querySelector('.caption').style.transform = 'translateY(0)';
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                e.currentTarget.querySelector('.overlay').style.backgroundColor = 'rgba(0,0,0,0)';
                e.currentTarget.querySelector('.zoom').style.opacity = '0';
                if (e.currentTarget.querySelector('.caption')) e.currentTarget.querySelector('.caption').style.transform = 'translateY(100%)';
              }}
            >
              <img
                src={img.imageUrl}
                alt={img.caption || ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
              />
              <div className="overlay" style={{
                position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0)',
                transition: 'background-color 0.3s', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <span className="zoom" style={{ fontSize: '24px', opacity: 0, transition: 'opacity 0.3s' }}>🔍</span>
              </div>
              {img.caption && (
                <div className="caption" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  padding: '20px 12px 10px', transform: 'translateY(100%)',
                  transition: 'transform 0.3s'
                }}>
                  <p style={{ color: '#fff', fontSize: '12px', margin: 0 }}>{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            padding: '16px', backgroundColor: 'rgba(0,0,0,0.92)'
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '900px', width: '100%' }}>
            <img
              src={selected.imageUrl}
              alt={selected.caption || ''}
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '10px', display: 'block' }}
            />
            {selected.caption && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '12px', fontSize: '13px' }}>
                {selected.caption}
              </p>
            )}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute', top: '-16px', right: '-16px',
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)', border: 'none',
                color: '#fff', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
