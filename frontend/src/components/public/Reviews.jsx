import { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

const Reviews = () => {
  const { restaurant, reviews, slug } = useTenant();
  const accent = restaurant?.accentColor || '#C9A84C';
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', rating: 5, content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const approved = reviews.filter(r => r.isApproved);

  useEffect(() => {
    if (approved.length <= 1) return;
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % approved.length), 5000);
    return () => clearInterval(interval);
  }, [approved.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API}/restaurant/${slug}/reviews`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setSubmitted(true); setShowForm(false);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  return (
    <section id="reviews" style={{ backgroundColor: '#080808', padding: '100px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 48px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' }}>Testimonials</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', marginBottom: '64px' }}>What People Say</h2>

        {approved.length > 0 && (
          <div style={{ position: 'relative', marginBottom: '48px' }}>
            <div style={{ fontSize: '80px', color: 'rgba(255,255,255,0.05)', lineHeight: 1, marginBottom: '-20px', fontFamily: 'serif' }}>"</div>
            <div style={{ position: 'relative', minHeight: '160px' }}>
              {approved.map((review, idx) => (
                <div key={review.id} style={{
                  position: idx === 0 ? 'relative' : 'absolute',
                  inset: 0, opacity: idx === current ? 1 : 0,
                  transition: 'opacity 0.7s ease'
                }}>
                  <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '32px' }}>
                    {review.content}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= review.rating ? '#FBBF24' : 'rgba(255,255,255,0.15)', fontSize: '16px' }}>★</span>)}
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>{review.customerName}</p>
                    {review.source && <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>via {review.source}</p>}
                  </div>
                </div>
              ))}
            </div>
            {approved.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                {approved.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrent(idx)} style={{
                    height: '3px', border: 'none', cursor: 'pointer',
                    backgroundColor: '#fff', borderRadius: '2px',
                    width: idx === current ? '32px' : '8px',
                    opacity: idx === current ? 1 : 0.25,
                    transition: 'all 0.3s ease'
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '48px' }}>
          {submitted ? (
            <p style={{ color: '#4ade80', fontSize: '14px' }}>Thank you! Your review will appear after approval.</p>
          ) : (
            <button onClick={() => setShowForm(!showForm)} style={{
              padding: '12px 32px', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
              backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
              {showForm ? 'Cancel' : approved.length === 0 ? 'Be the first to review' : 'Leave a Review'}
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{ maxWidth: '480px', margin: '32px auto 0', textAlign: 'left' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Your Name</label>
                <input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required
                  style={{ width: '100%', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1,2,3,4,5].map(i => (
                    <button key={i} type="button" onClick={() => setForm({ ...form, rating: i })}
                      style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer', color: i <= form.rating ? '#FBBF24' : 'rgba(255,255,255,0.15)' }}>★</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Your Review</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={4}
                  style={{ width: '100%', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={submitting} style={{
                width: '100%', padding: '14px', fontWeight: 700, fontSize: '11px',
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                backgroundColor: accent, color: '#000', border: 'none', opacity: submitting ? 0.5 : 1
              }}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
