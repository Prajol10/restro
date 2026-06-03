import { useState } from 'react';
import { useTenant } from '../../context/TenantContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

const Cart = ({ items, onClose, onUpdateQuantity, onRemove, onClear }) => {
  const { restaurant, slug } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);

  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/restaurant/${slug}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          notes: form.notes,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
          totalAmount: total
        })
      });
      if (!res.ok) throw new Error('Failed to place order');
      setSuccess(true);
      onClear();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const inputStyle = {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    padding: '12px 14px', color: '#fff', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif"
  };

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)', marginBottom: '8px'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      {/* Panel */}
      <div style={{ position: 'relative', width: '420px', backgroundColor: '#0d0d0d', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.08)', boxShadow: '-20px 0 60px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 900, color: '#fff' }}>
            {success ? 'Order Placed! ��' : step === 'cart' ? 'Your Cart' : 'Place Order'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '20px', padding: '4px', lineHeight: 1 }}>✕</button>
        </div>

        {success ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Thank You!</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', lineHeight: 1.6 }}>Your order has been received. We'll contact you shortly.</p>
            <button onClick={onClose} style={{ padding: '14px 32px', backgroundColor: accent, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Continue Browsing
            </button>
          </div>
        ) : step === 'cart' ? (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {items.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '14px', backgroundColor: '#111', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <p style={{ fontWeight: 700, color: '#fff', fontSize: '14px', lineHeight: 1.3 }}>{item.name}</p>
                          <button onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', fontSize: '16px', padding: '0 0 0 8px', lineHeight: 1, flexShrink: 0 }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                            <button onClick={() => onUpdateQuantity(item.id, item.qty - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px', width: '28px', textAlign: 'center' }}>{item.qty}</span>
                            <button onClick={() => onUpdateQuantity(item.id, item.qty + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                          </div>
                          <span style={{ fontWeight: 900, fontSize: '16px', color: accent }}>${(parseFloat(item.price) * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 500 }}>Total</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#fff' }}>${total.toFixed(2)}</span>
                </div>
                <button onClick={() => setStep('checkout')} style={{ width: '100%', padding: '16px', backgroundColor: accent, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Proceed to Order →
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleOrder} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Order Summary */}
              <div style={{ backgroundColor: '#111', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>Order Summary</p>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{i.name} × {i.qty}</span>
                    <span style={{ color: accent, fontSize: '13px', fontWeight: 600 }}>${(parseFloat(i.price) * i.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>Total</span>
                  <span style={{ color: accent, fontWeight: 900, fontSize: '16px' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Your Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+977 98XXXXXXXX" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Special Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any special requests..." style={{ ...inputStyle, resize: 'none' }} />
              </div>
              {error && <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>}
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setStep('cart')} style={{ padding: '14px 20px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                ← Back
              </button>
              <button type="submit" disabled={submitting} style={{ flex: 1, padding: '14px', backgroundColor: accent, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Cart;
