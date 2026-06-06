import { useState, useEffect, useRef } from 'react';
import { useTenant } from '../../context/TenantContext';
import Layout from '../../components/public/Layout';

const MenuPage = () => {
  const { restaurant, menuItems, menuCategories } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const printRef = useRef();

  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';

  // Styles
  const S = {
    page: { backgroundColor: bg, minHeight: '100vh' },
    section: { padding: '100px 0' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px' },
    sectionLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' },
    divider: { width: '40px', height: '2px', backgroundColor: accent, marginBottom: '48px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' },
    searchContainer: { position: 'relative', maxWidth: '300px' },
    searchInput: { 
      width: '100%', 
      padding: '12px 20px', 
      backgroundColor: '#0d0d0d', 
      border: '1px solid rgba(255,255,255,0.1)', 
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.875rem'
    },
    searchIcon: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' },
    controls: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' },
    categorySelect: { 
      padding: '12px 20px', 
      backgroundColor: '#0d0d0d', 
      border: '1px solid rgba(255,255,255,0.1)', 
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.875rem'
    },
    pdfButton: { 
      padding: '12px 24px', 
      backgroundColor: accent, 
      color: '#000', 
      border: 'none', 
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.75rem', 
      fontWeight: 700, 
      textTransform: 'uppercase', 
      letterSpacing: '0.1em', 
      cursor: 'pointer',
      borderRadius: '4px'
    },
    categoryTabs: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' },
    categoryTab: { 
      padding: '10px 20px', 
      backgroundColor: 'transparent', 
      border: '1px solid rgba(255,255,255,0.1)', 
      color: 'rgba(255,255,255,0.7)',
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.875rem', 
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeTab: { 
      backgroundColor: accent, 
      color: '#000', 
      border: '1px solid ' + accent 
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '48px' },
    card: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
    image: { width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' },
    specialImage: { border: `3px solid ${accent}` },
    itemName: { fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
    subtitle: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', fontStyle: 'italic' },
    price: { fontSize: '1rem', color: accent, fontWeight: 700, marginBottom: '12px' },
    description: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '16px' },
    printOnly: { display: 'none' },
    noResults: { textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }
  };

  // Filter items based on search and category
  useEffect(() => {
    let result = menuItems || [];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.categoryId === parseInt(selectedCategory));
    }
    
    setFilteredItems(result);
  }, [searchTerm, selectedCategory, menuItems]);

  // Group items by category for print view
  const groupedItems = menuCategories?.map(category => ({
    ...category,
    items: filteredItems.filter(item => item.categoryId === category.id)
  })).filter(category => category.items.length > 0) || [];

  const handlePrint = () => {
    window.print();
  };

  if (!restaurant) return null;

  return (
    <Layout>
      <div style={S.page}>
        <section style={S.section}>
          <div style={S.container}>
            <p style={S.sectionLabel}>OUR MENU</p>
            <h1 style={S.sectionTitle}>{restaurant.name}</h1>
            <div style={S.divider} />
            
            <div style={S.header}>
              <div style={S.searchContainer}>
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={S.searchInput}
                />
                <span style={S.searchIcon}>🔍</span>
              </div>
              
              <div style={S.controls}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={S.categorySelect}
                >
                  <option value="all">All Categories</option>
                  {menuCategories?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <button onClick={handlePrint} style={S.pdfButton}>
                  Download Menu PDF
                </button>
              </div>
            </div>
            
            <div style={S.categoryTabs}>
              <button
                onClick={() => setSelectedCategory('all')}
                style={{
                  ...S.categoryTab,
                  ...(selectedCategory === 'all' ? S.activeTab : {})
                }}
              >
                All Items
              </button>
              {menuCategories?.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  style={{
                    ...S.categoryTab,
                    ...(selectedCategory === category.id.toString() ? S.activeTab : {})
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {filteredItems.length === 0 ? (
              <div style={S.noResults}>
                <h3>No items found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div style={S.grid}>
                {filteredItems.map(item => (
                  <div key={item.id} style={S.card}>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          ...S.image,
                          ...(item.isSpecial ? S.specialImage : {})
                        }}
                      />
                    )}
                    <h3 style={S.itemName}>{item.name}</h3>
                    {item.subtitle && <p style={S.subtitle}>{item.subtitle}</p>}
                    <p style={S.price}>Rs. {item.price}</p>
                    <p style={S.description}>{item.description}</p>
                    <div style={{
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Print-only section */}
        <div ref={printRef} style={{ display: 'none' }}>
          <div style={{ padding: '40px', fontFamily: "'Inter', sans-serif", color: '#000', backgroundColor: '#fff' }}>
            <h1 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: '2.5rem', 
              textAlign: 'center', 
              marginBottom: '10px' 
            }}>
              {restaurant.name} Menu
            </h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
              {restaurant.address}
            </p>
            
            {groupedItems.map(category => (
              <div key={category.id} style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: '1.75rem', 
                  borderBottom: '2px solid #333', 
                  paddingBottom: '10px',
                  marginBottom: '20px'
                }}>
                  {category.name}
                </h2>
                {category.items.map(item => (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px dashed #eee'
                  }} key={item.id}>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        marginBottom: '5px',
                        fontWeight: 600
                      }}>
                        {item.name}
                      </h3>
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: '#666', 
                        marginBottom: '5px' 
                      }}>
                        {item.description}
                      </p>
                    </div>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700,
                      color: '#000'
                    }}>
                      Rs. {item.price}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '40px', 
              paddingTop: '20px', 
              borderTop: '1px solid #ccc',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              <p>Thank you for dining with us!</p>
              <p>{restaurant.phone && `Call us: ${restaurant.phone}`}</p>
            </div>
          </div>
        </div>
        
        {/* Print styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            div[ref="printRef"], div[ref="printRef"] * {
              visibility: visible;
            }
            div[ref="printRef"] {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default MenuPage;
