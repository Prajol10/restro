import { useState, useEffect, useRef } from 'react';
import { useTenant } from '../../context/TenantContext';
import Layout from '../../components/public/Layout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

const MenuPage = () => {
  const { restaurant, menuItems, menuCategories } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderForm, setOrderForm] = useState({ customerName:'', customerPhone:'', notes:'' });
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? {...c, qty: c.qty+1} : c);
      return [...prev, {...item, qty:1}];
    });
    setShowCart(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(c => c.id === id ? {...c, qty} : c));
  };

  const cartTotal = cart.reduce((sum, c) => sum + (parseFloat(c.price) * c.qty), 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setOrderPlacing(true);
    setOrderError('');
    try {
      const items = cart.map(c => ({ id:c.id, name:c.name, price:c.price, qty:c.qty }));
      const res = await fetch(`${API}/Restaurant/${restaurant.subdomain}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: orderForm.customerName,
          customerPhone: orderForm.customerPhone,
          notes: orderForm.notes,
          items: JSON.stringify(items),
          totalAmount: cartTotal,
          status: 'Pending'
        })
      });
      if (!res.ok) throw new Error('Failed to place order');
      setOrderSuccess(true);
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      setOrderForm({ customerName:'', customerPhone:'', notes:'' });
      setTimeout(() => setOrderSuccess(false), 6000);
    } catch(err) {
      setOrderError('Failed to place order. Please try again or call us.');
    } finally {
      setOrderPlacing(false);
    }
  };

  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';

  const S = {
    page: { backgroundColor: bg, minHeight: '100vh' },
    section: { padding: '100px 0', backgroundColor: bg },
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
      backgroundColor: isDownloading ? '#888' : accent,
      color: '#000',
      border: 'none',
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      cursor: isDownloading ? 'not-allowed' : 'pointer',
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
    activeTab: { backgroundColor: accent, color: '#000', border: '1px solid ' + accent },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '48px' },
    card: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
    image: { width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' },
    specialImage: { border: `3px solid ${accent}` },
    itemName: { fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
    subtitle: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', fontStyle: 'italic' },
    price: { fontSize: '1rem', color: accent, fontWeight: 700, marginBottom: '12px' },
    description: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '16px' },
    noResults: { textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }
  };

  useEffect(() => {
    let result = menuItems || [];
    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.categoryId === parseInt(selectedCategory));
    }
    setFilteredItems(result);
  }, [searchTerm, selectedCategory, menuItems]);

  const groupedItems = menuCategories?.map(category => ({
    ...category,
    items: filteredItems.filter(item => item.categoryId === category.id)
  })).filter(category => category.items.length > 0) || [];

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const element = printRef.current;
      // Temporarily show the element for capture
      element.style.display = 'block';
      element.style.position = 'fixed';
      element.style.top = '-9999px';
      element.style.left = '0';
      element.style.width = '794px'; // A4 width in px at 96dpi
      element.style.zIndex = '-1';

      await new Promise(r => setTimeout(r, 300)); // wait for render

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794,
      });

      // Hide again
      element.style.display = 'none';
      element.style.position = '';
      element.style.top = '';
      element.style.left = '';
      element.style.zIndex = '';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const totalPdfHeight = imgHeight * ratio;

      let heightLeft = totalPdfHeight;
      let position = 0;
      const pageHeightPx = pdfHeight / ratio;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;

      // Add more pages if content overflows
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${restaurant?.name || 'menu'}-menu.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
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

                <button onClick={handleDownloadPDF} style={S.pdfButton} disabled={isDownloading}>
                  {isDownloading ? 'Generating PDF...' : 'Download Menu PDF'}
                </button>
              </div>
            </div>

            <div style={S.categoryTabs}>
              <button
                onClick={() => setSelectedCategory('all')}
                style={{ ...S.categoryTab, ...(selectedCategory === 'all' ? S.activeTab : {}) }}
              >
                All Items
              </button>
              {menuCategories?.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  style={{ ...S.categoryTab, ...(selectedCategory === category.id.toString() ? S.activeTab : {}) }}
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
                        style={{ ...S.image, ...(item.isSpecial ? S.specialImage : {}) }}
                      />
                    )}
                    <h3 style={S.itemName}>{item.name}</h3>
                    {item.subtitle && <p style={S.subtitle}>{item.subtitle}</p>}
                    <p style={S.price}>Rs. {item.price}</p>
                    <p style={S.description}>{item.description}</p>
                    {item.isAvailable && (()=>{
                      const cartItem = cart.find(c => c.id === item.id);
                      return cartItem ? (
                        <div style={{display:'flex',alignItems:'center',gap:'12px',marginTop:'12px'}}>
                          <button onClick={()=>updateQty(item.id, cartItem.qty-1)} style={{width:'32px',height:'32px',borderRadius:'50%',border:`1px solid ${accent}`,backgroundColor:'transparent',color:accent,fontSize:'18px',cursor:'pointer',fontWeight:700}}>−</button>
                          <span style={{color:'#fff',fontWeight:800,fontSize:'16px',minWidth:'24px',textAlign:'center'}}>{cartItem.qty}</span>
                          <button onClick={()=>updateQty(item.id, cartItem.qty+1)} style={{width:'32px',height:'32px',borderRadius:'50%',border:'none',backgroundColor:accent,color:'#000',fontSize:'18px',cursor:'pointer',fontWeight:700}}>+</button>
                        </div>
                      ) : (
                        <button onClick={()=>addToCart(item)} style={{marginTop:'8px',padding:'10px 24px',backgroundColor:accent,color:'#000',border:'none',borderRadius:'4px',fontWeight:700,fontSize:'0.8rem',textTransform:'uppercase',letterSpacing:'0.08em',cursor:'pointer'}}>
                          + Add to Order
                        </button>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Hidden PDF template - rendered off-screen when downloading */}
        <div ref={printRef} style={{ display: 'none' }}>
          <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#000', backgroundColor: '#fff', width: '794px' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', textAlign: 'center', marginBottom: '10px', color: '#000' }}>
              {restaurant.name} — Menu
            </h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '8px', fontSize: '0.95rem' }}>
              {restaurant.address}
            </p>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '0.95rem' }}>
              {restaurant.phone && `📞 ${restaurant.phone}`}
            </p>
            <hr style={{ border: 'none', borderTop: '2px solid #333', marginBottom: '40px' }} />

            {groupedItems.length > 0 ? groupedItems.map(category => (
              <div key={category.id} style={{ marginBottom: '40px' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', borderBottom: '2px solid #333', paddingBottom: '8px', marginBottom: '20px', color: '#000' }}>
                  {category.name}
                </h2>
                {category.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed #ddd' }}>
                    <div style={{ flex: 1, paddingRight: '20px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: '#000' }}>{item.name}</h3>
                      {item.subtitle && <p style={{ fontSize: '0.85rem', color: '#555', fontStyle: 'italic', marginBottom: '4px' }}>{item.subtitle}</p>}
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>{item.description}</p>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#000', whiteSpace: 'nowrap' }}>
                      Rs. {item.price}
                    </div>
                  </div>
                ))}
              </div>
            )) : (
              // Fallback: show all items ungrouped
              filteredItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed #ddd' }}>
                  <div style={{ flex: 1, paddingRight: '20px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: '#000' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>{item.description}</p>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#000', whiteSpace: 'nowrap' }}>
                    Rs. {item.price}
                  </div>
                </div>
              ))
            )}

            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ccc', fontSize: '0.85rem', color: '#888' }}>
              <p>Thank you for dining with us!</p>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Cart Button */}
      {cartCount > 0 && !showCart && (
        <button onClick={() => setShowCart(true)} style={{ position:'fixed', bottom:'32px', right:'32px', backgroundColor:accent, color:'#000', border:'none', borderRadius:'50px', padding:'16px 28px', fontWeight:800, fontSize:'14px', cursor:'pointer', boxShadow:'0 8px 32px rgba(0,0,0,0.4)', zIndex:1000, display:'flex', alignItems:'center', gap:'10px' }}>
          🛒 {cartCount} item{cartCount>1?'s':''} — Rs. {cartTotal.toFixed(0)}
        </button>
      )}

      {/* Order Success Banner */}
      {orderSuccess && (
        <div style={{ position:'fixed', top:'24px', left:'50%', transform:'translateX(-50%)', backgroundColor:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.4)', color:'#4ade80', padding:'16px 32px', borderRadius:'8px', fontWeight:700, fontSize:'14px', zIndex:2000, textAlign:'center' }}>
          ✅ Order placed successfully! We will call you to confirm.
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div style={{ position:'fixed', inset:0, zIndex:1000 }}>
          <div onClick={() => setShowCart(false)} style={{ position:'absolute', inset:0, backgroundColor:'rgba(0,0,0,0.6)' }} />
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'420px', maxWidth:'100vw', backgroundColor:'#111', borderLeft:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', padding:'32px 24px', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <h2 style={{ color:'#fff', fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:900 }}>Your Order</h2>
              <button onClick={() => setShowCart(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'20px', cursor:'pointer' }}>✕</button>
            </div>
            {cart.length === 0 ? (
              <p style={{ color:'rgba(255,255,255,0.4)', textAlign:'center', marginTop:'48px' }}>Your cart is empty</p>
            ) : (
              <>
                <div style={{ flex:1 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                      {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width:'48px', height:'48px', borderRadius:'6px', objectFit:'cover' }} />}
                      <div style={{ flex:1 }}>
                        <p style={{ color:'#fff', fontWeight:600, fontSize:'14px', marginBottom:'4px' }}>{item.name}</p>
                        <p style={{ color:accent, fontSize:'13px', fontWeight:700 }}>Rs. {(parseFloat(item.price) * item.qty).toFixed(0)}</p>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <button onClick={() => updateQty(item.id, item.qty-1)} style={{ width:'28px', height:'28px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)', background:'none', color:'#fff', cursor:'pointer', fontSize:'16px' }}>−</button>
                        <span style={{ color:'#fff', fontSize:'14px', minWidth:'20px', textAlign:'center' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty+1)} style={{ width:'28px', height:'28px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)', background:'none', color:'#fff', cursor:'pointer', fontSize:'16px' }}>+</button>
                        <button onClick={() => removeFromCart(item.id)} style={{ background:'none', border:'none', color:'rgba(239,68,68,0.6)', cursor:'pointer', fontSize:'14px', marginLeft:'4px' }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'20px', marginTop:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
                    <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'15px' }}>Total</span>
                    <span style={{ color:accent, fontWeight:800, fontSize:'18px' }}>Rs. {cartTotal.toFixed(0)}</span>
                  </div>
                  <button onClick={() => { setShowCart(false); setShowCheckout(true); }} style={{ width:'100%', padding:'14px', backgroundColor:accent, color:'#000', border:'none', borderRadius:'6px', fontWeight:800, fontSize:'14px', textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer' }}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div onClick={() => setShowCheckout(false)} style={{ position:'absolute', inset:0, backgroundColor:'rgba(0,0,0,0.7)' }} />
          <div style={{ position:'relative', backgroundColor:'#111', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'40px', width:'100%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <h2 style={{ color:'#fff', fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:900 }}>Complete Your Order</h2>
              <button onClick={() => setShowCheckout(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'20px', cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ backgroundColor:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'16px', marginBottom:'24px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'13px' }}>
                  <span style={{ color:'rgba(255,255,255,0.7)' }}>{item.name} x{item.qty}</span>
                  <span style={{ color:accent, fontWeight:600 }}>Rs. {(parseFloat(item.price)*item.qty).toFixed(0)}</span>
                </div>
              ))}
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'10px', marginTop:'10px', display:'flex', justifyContent:'space-between', fontWeight:800 }}>
                <span style={{ color:'#fff' }}>Total</span>
                <span style={{ color:accent }}>Rs. {cartTotal.toFixed(0)}</span>
              </div>
            </div>
            <form onSubmit={placeOrder}>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:'8px' }}>Full Name *</label>
                <input value={orderForm.customerName} onChange={e=>setOrderForm({...orderForm,customerName:e.target.value})} required placeholder="Your name" style={{ width:'100%', padding:'12px 16px', backgroundColor:'#0d0d0d', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', color:'#fff', fontSize:'14px', boxSizing:'border-box' }} />
              </div>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:'8px' }}>Phone Number *</label>
                <input value={orderForm.customerPhone} onChange={e=>setOrderForm({...orderForm,customerPhone:e.target.value})} required placeholder="98XXXXXXXX" style={{ width:'100%', padding:'12px 16px', backgroundColor:'#0d0d0d', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', color:'#fff', fontSize:'14px', boxSizing:'border-box' }} />
              </div>
              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:'8px' }}>Notes / Delivery Address</label>
                <textarea value={orderForm.notes} onChange={e=>setOrderForm({...orderForm,notes:e.target.value})} placeholder="Delivery address or special instructions..." rows={3} style={{ width:'100%', padding:'12px 16px', backgroundColor:'#0d0d0d', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', color:'#fff', fontSize:'14px', resize:'vertical', boxSizing:'border-box' }} />
              </div>
              {orderError && <p style={{ color:'#f87171', fontSize:'13px', marginBottom:'16px' }}>{orderError}</p>}
              <button type="submit" disabled={orderPlacing} style={{ width:'100%', padding:'14px', backgroundColor:accent, color:'#000', border:'none', borderRadius:'6px', fontWeight:800, fontSize:'14px', textTransform:'uppercase', letterSpacing:'0.08em', cursor:orderPlacing?'not-allowed':'pointer', opacity:orderPlacing?0.7:1 }}>
                {orderPlacing ? 'Placing Order...' : 'Place Order'}
              </button>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', textAlign:'center', marginTop:'12px' }}>We will call you to confirm your order</p>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MenuPage;
