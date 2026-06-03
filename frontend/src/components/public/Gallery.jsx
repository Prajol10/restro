import { useState } from 'react';
import { useTenant } from '../../context/TenantContext';

const Gallery = () => {
  const { restaurant, gallery } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';
  const [selected, setSelected] = useState(null);

  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>Our Space</p>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Gallery
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {gallery.map((img, idx) => (
            <div key={img.id}
              onClick={() => setSelected(img)}
              className={`relative overflow-hidden cursor-pointer group rounded-xl ${idx % 7 === 0 ? 'col-span-2 row-span-2' : ''}`}
              style={{ aspectRatio: idx % 7 === 0 ? '1' : '1' }}>
              <img src={img.imageUrl} alt={img.caption || ''}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300">🔍</span>
              </div>
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelected(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selected.imageUrl} alt={selected.caption || ''} className="w-full max-h-[80vh] object-contain rounded-xl" />
            {selected.caption && <p className="text-center text-gray-400 mt-3 text-sm">{selected.caption}</p>}
            <button onClick={() => setSelected(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full text-white transition flex items-center justify-center">✕</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
