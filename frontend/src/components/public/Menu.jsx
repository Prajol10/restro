import { useState } from 'react';
import { useTenant } from '../../context/TenantContext';

const Menu = ({ onAddToCart }) => {
  const { restaurant, menuCategories, menuItems } = useTenant();
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const accent = restaurant?.accentColor || '#C9A84C';
  const getTC = (bgCol) => {
    if (!bgCol) return '#ffffff';
    const hex = bgCol.replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    return (r*299 + g*587 + b*114) / 1000 > 128 ? '#111111' : '#ffffff';
  };
  const tc = getTC(restaurant?.bgColor);
  const categories = menuCategories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const activeId = activeCategory || categories[0]?.id;
  const filteredItems = menuItems.filter(i => i.isAvailable && (activeId ? i.categoryId === activeId : true)).sort((a, b) => a.sortOrder - b.sortOrder);
  const specialItems = menuItems.filter(i => i.isSpecial && i.isAvailable);

  return (
    <section id="menu" style={{ backgroundColor: restaurant?.bgColor || '#0d0d0d', padding: '100px 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ marginBottom: '64px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' }}>Explore Our Menu</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: tc, marginBottom: '0' }}>What We Serve</h2>
        </div>

        {specialItems.length > 0 && (
          <div style={{ marginBottom: '48px', padding: '32px', border: '1px solid rgba(201,168,76,0.2)', backgroundColor: 'rgba(201,168,76,0.03)', borderRadius: '4px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '24px' }}>⭐ Limited Time Specials</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {specialItems.map(item => (
                <div key={item.id} onClick={() => setSelectedItem(item)} style={{
                  display: 'flex', gap: '16px', backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: '4px', padding: '16px', cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'border-color 0.3s ease'
                }}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h3 style={{ color: tc, fontWeight: 700, fontSize: '14px' }}>{item.name}</h3>
                      <span style={{ color: accent, fontWeight: 800, fontSize: '14px', marginLeft: '8px' }}>${item.price}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginBottom: '8px', lineHeight: 1.5 }}>{item.description}</p>
                    <button onClick={e => { e.stopPropagation(); onAddToCart(item); }} style={{
                      padding: '6px 14px', fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      backgroundColor: 'transparent', color: accent,
                      border: `1px solid ${accent}`, cursor: 'pointer', borderRadius: '2px',
                      transition: 'all 0.3s ease'
                    }}>+ Add</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '8px' }}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                padding: '10px 24px', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
                borderRadius: '2px', transition: 'all 0.3s ease',
                backgroundColor: activeId === cat.id ? accent : 'rgba(255,255,255,0.05)',
                color: activeId === cat.id ? '#000' : 'rgba(255,255,255,0.5)'
              }}>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => setSelectedItem(item)} style={{
              backgroundColor: restaurant?.primaryColor || '#111', border: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer', overflow: 'hidden',
              transition: 'border-color 0.3s ease, transform 0.3s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              {item.imageUrl ? (
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                </div>
              ) : (
                <div style={{ height: '220px', backgroundColor: restaurant?.primaryColor || '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🍽️</div>
              )}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ color: tc, fontWeight: 700, fontSize: '16px', lineHeight: 1.3 }}>{item.name}</h3>
                  <span style={{ color: accent, fontWeight: 900, fontSize: '18px', marginLeft: '12px', flexShrink: 0 }}>${parseFloat(item.price).toFixed(2)}</span>
                </div>
                {item.subtitle && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.subtitle}</p>}
                <p style={{ color: tc === '#111111' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                <button onClick={e => { e.stopPropagation(); onAddToCart(item); }} style={{
                  width: '100%', padding: '12px', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                  backgroundColor: 'transparent', color: tc === '#111111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = accent; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                  + Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.2)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</p>
            <p>No items yet — add menu items from the admin panel</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div onClick={() => setSelectedItem(null)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '24px'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: restaurant?.primaryColor || '#111', maxWidth: '500px', width: '100%',
            border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden'
          }}>
            {selectedItem.imageUrl && <img src={selectedItem.imageUrl} alt={selectedItem.name} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 900, color: tc }}>{selectedItem.name}</h3>
                <span style={{ color: accent, fontWeight: 900, fontSize: '24px' }}>${parseFloat(selectedItem.price).toFixed(2)}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '24px' }}>{selectedItem.description}</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { onAddToCart(selectedItem); setSelectedItem(null); }} style={{
                  flex: 1, padding: '14px', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                  backgroundColor: accent, color: '#000', border: 'none'
                }}>Add to Cart</button>
                <button onClick={() => setSelectedItem(null)} style={{
                  padding: '14px 20px', cursor: 'pointer',
                  backgroundColor: 'transparent', color: tc === '#111111' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Menu;
