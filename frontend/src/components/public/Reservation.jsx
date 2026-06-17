import { useState } from 'react';
import { useTenant } from '../../context/TenantContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

const Reservation = () => {
  const { restaurant, slug } = useTenant();
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
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', partySize: '2', date: '', time: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = ['11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'];



  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}/restaurant/${slug}/reservations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, partySize: parseInt(form.partySize) })
      });
      if (!res.ok) throw new Error('Failed');
      setSuccess(true);
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const inputStyle = {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px',
    color: tc, fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.3s ease'
  };

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)', marginBottom: '8px'
  };

  return (
    <section id="reservations" style={{ backgroundColor: '#0a0a0a', padding: '100px 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' }}>Book a Table</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: tc, marginBottom: '24px' }}>
              Reserve Your Experience
            </h2>
            <div style={{ width: '40px', height: '2px', backgroundColor: accent, marginBottom: '28px' }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '15px', marginBottom: '48px' }}>
              {restaurant?.reservationText || 'Join us for an unforgettable dining experience. We look forward to welcoming you.'}
            </p>

          </div>

          <div style={{ backgroundColor: restaurant?.primaryColor || '#111', padding: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: tc, marginBottom: '12px' }}>Reservation Confirmed!</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>We'll contact you to confirm your booking.</p>
                <button onClick={() => { setSuccess(false); setForm({ customerName: '', customerPhone: '', customerEmail: '', partySize: '2', date: '', time: '', notes: '' }); }}
                  style={{ padding: '12px 32px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', backgroundColor: accent, color: '#000', border: 'none' }}>
                  Make Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required placeholder="John Doe" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Party Size</label>
                    <select value={form.partySize} onChange={e => setForm({ ...form, partySize: e.target.value })} style={{ ...inputStyle, backgroundColor: restaurant?.primaryColor || '#1a1a1a' }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date *</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required min={new Date().toISOString().split('T')[0]} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Time *</label>
                    <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required style={{ ...inputStyle, backgroundColor: restaurant?.primaryColor || '#1a1a1a' }}>
                      <option value="">Select time</option>
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Special Requests</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Allergies, special occasions..." style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                </div>
                {error && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
                <button type="submit" disabled={submitting} style={{
                  width: '100%', padding: '16px', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                  backgroundColor: accent, color: '#000', border: 'none', opacity: submitting ? 0.5 : 1
                }}>
                  {submitting ? 'Reserving...' : 'Reserve Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
