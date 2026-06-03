import { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import Navbar from '../../components/public/Navbar';
import Hero from '../../components/public/Hero';
import Menu from '../../components/public/Menu';
import Gallery from '../../components/public/Gallery';
import Reviews from '../../components/public/Reviews';
import Reservation from '../../components/public/Reservation';
import Footer from '../../components/public/Footer';
import Cart from '../../components/public/Cart';
import About from '../../components/public/About';

const RestaurantPage = () => {
  const { loading, error, restaurant } = useTenant();
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeItem(id);
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const removeItem = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCartItems([]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d0d' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '2px solid #333', borderTopColor: '#C9A84C',
          animation: 'spin 1s linear infinite', margin: '0 auto 16px'
        }} />
        <p style={{ color: '#666', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d0d', textAlign: 'center' }}>
      <div>
        <p style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#fff', marginBottom: '8px' }}>Restaurant Not Found</h1>
        <p style={{ color: '#666' }}>{error}</p>
      </div>
    </div>
  );

  const bgColor = restaurant?.bgColor || '#0d0d0d';

  return (
    <div style={{ backgroundColor: bgColor, color: '#fff', minHeight: '100vh' }}>
      <Navbar
        cartCount={cartItems.reduce((sum, i) => sum + i.qty, 0)}
        onCartClick={() => setCartOpen(true)}
      />
      <Hero
        onOrderClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
        onReserveClick={() => document.getElementById('reservations')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <Menu onAddToCart={addToCart} />
      <About />
      <Gallery />
      <Reviews />
      <Reservation />
      <Footer />
      {cartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onClear={clearCart}
        />
      )}
    </div>
  );
};

export default RestaurantPage;
