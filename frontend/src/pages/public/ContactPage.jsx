import { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import Layout from '../../components/public/Layout';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

const ContactPage = () => {
  const { restaurant } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';
  const primary = restaurant?.primaryColor || '#1a1a1a';
  const getTextColor = (bgCol) => {
    if (!bgCol) return '#ffffff';
    const hex = bgCol.replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    return (r*299 + g*587 + b*114) / 1000 > 128 ? '#111111' : '#ffffff';
  };
  const textColor = getTextColor(bg);
  const isLight = textColor === '#111111';
  const subText = isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)';
  const borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
  const inputBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const container = { maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 64px', width: '100%', boxSizing: 'border-box' };
  const hours = (() => { try { return Object.entries(JSON.parse(restaurant?.openingHours || '{}')); } catch { return []; } })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      setSubmitError('Failed to send. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    backgroundColor: inputBg,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px', color: textColor,
    fontFamily: "'Inter', sans-serif", fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };

  if (!restaurant) return null;

  return (
    <Layout>
      <div style={{ backgroundColor: bg, minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ paddingTop: isMobile ? '100px' : '140px', paddingBottom: isMobile ? '48px' : '80px', textAlign: 'center', backgroundColor: bg, borderBottom: `1px solid ${borderColor}` }}>
          <div style={container}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, marginBottom: '14px' }}>GET IN TOUCH</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: 900, color: textColor, marginBottom: '20px', lineHeight: 1.0 }}>Contact Us</h1>
            <div style={{ width: '48px', height: '2px', backgroundColor: accent, margin: '0 auto 20px' }} />
            <p style={{ fontSize: '1rem', color: subText, maxWidth: '480px', margin: '0 auto' }}>
              We'd love to hear from you. Reach out for reservations, inquiries or just to say hello.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <section style={{ padding: isMobile ? '48px 0' : '80px 0', backgroundColor: bg }}>
          <div style={container}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '16px', marginBottom: isMobile ? '48px' : '80px' }}>
              {[
                { icon: '📍', label: 'Address', value: restaurant.address, href: restaurant.mapEmbedUrl ? null : null },
                { icon: '📞', label: 'Phone', value: restaurant.phone, href: restaurant.phone ? `tel:${restaurant.phone}` : null },
                { icon: '✉️', label: 'Email', value: restaurant.email, href: restaurant.email ? `mailto:${restaurant.email}` : null },
                { icon: '🕐', label: 'Hours', value: hours.length > 0 ? 'See below' : 'Contact us', href: null },
              ].map(({ icon, label, value, href }) => (
                <div key={label}
                  style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '28px 24px', textAlign: 'center', transition: 'all 0.3s', cursor: href ? 'pointer' : 'default' }}
                  onClick={() => href && window.open(href)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{icon}</div>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: accent, marginBottom: '8px' }}>{label}</p>
                  <p style={{ fontSize: '13px', color: subText, lineHeight: 1.5 }}>{value || 'Not available'}</p>
                </div>
              ))}
            </div>

            {/* Map + Form */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '64px', alignItems: 'start' }}>

              {/* Left - Map + Hours */}
              <div>
                {restaurant.mapEmbedUrl ? (
                  <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 16px 40px rgba(0,0,0,0.15)' }}>
                    <iframe src={restaurant.mapEmbedUrl} style={{ width: '100%', height: isMobile ? '240px' : '360px', border: 'none' }} allowFullScreen loading="lazy" title="Location" />
                  </div>
                ) : null}

                {hours.length > 0 && (
                  <div style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '32px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, marginBottom: '20px' }}>Opening Hours</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {hours.map(([day, time]) => (
                        <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: `1px solid ${borderColor}` }}>
                          <span style={{ fontSize: '13px', color: textColor, textTransform: 'capitalize', fontWeight: 500 }}>{day}</span>
                          <span style={{ fontSize: '13px', color: time.toLowerCase() === 'closed' ? 'rgba(239,68,68,0.7)' : accent, fontWeight: 600 }}>{time}</span>
                        </div>
                      ))}
                    </div>
                    {(restaurant.facebookUrl || restaurant.instagramUrl || restaurant.tiktokUrl) && (
                      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        {restaurant.facebookUrl && <a href={restaurant.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, fontSize: '16px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = accent; e.target.style.color = '#000'; }} onMouseLeave={e => { e.target.style.backgroundColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'; e.target.style.color = textColor; }}>f</a>}
                        {restaurant.instagramUrl && <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, fontSize: '16px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = accent; e.target.style.color = '#000'; }} onMouseLeave={e => { e.target.style.backgroundColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'; e.target.style.color = textColor; }}>ig</a>}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right - Contact Form */}
              <div style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: `1px solid ${borderColor}`, borderRadius: '12px', padding: isMobile ? '28px 24px' : '40px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, marginBottom: '8px' }}>Send a Message</p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: textColor, marginBottom: '28px' }}>Get in Touch</h3>

                {submitSuccess ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                    <h4 style={{ color: textColor, fontWeight: 700, marginBottom: '8px' }}>Message Sent!</h4>
                    <p style={{ color: subText, fontSize: '14px' }}>We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Full Name *</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Your name" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = accent}
                        onBlur={e => e.target.style.borderColor = borderColor} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Email Address *</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="your@email.com" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = accent}
                        onBlur={e => e.target.style.borderColor = borderColor} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Phone Number</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="98XXXXXXXX" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = accent}
                        onBlur={e => e.target.style.borderColor = borderColor} />
                    </div>
                    <div style={{ marginBottom: '28px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Message *</label>
                      <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required placeholder="How can we help you?" rows={5} style={{...inputStyle, resize: 'vertical', minHeight: '120px'}}
                        onFocus={e => e.target.style.borderColor = accent}
                        onBlur={e => e.target.style.borderColor = borderColor} />
                    </div>
                    {submitError && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{submitError}</p>}
                    <button type="submit" disabled={isSubmitting}
                      style={{ width: '100%', padding: '16px', backgroundColor: accent, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.3s' }}
                      onMouseEnter={e => { if (!isSubmitting) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 8px 24px ${accent}44`; }}}
                      onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default ContactPage;
