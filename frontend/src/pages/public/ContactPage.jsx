import { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import Layout from '../../components/public/Layout';

const ContactPage = () => {
  const { restaurant } = useTenant();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';
  const primary = restaurant?.primaryColor || '#111111';

  // Styles
  const S = {
    page: { backgroundColor: bg, minHeight: '100vh' },
    section: { padding: isMobile ? '80px 0 60px' : '100px 0' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' },
    sectionLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' },
    divider: { width: '40px', height: '2px', backgroundColor: accent, marginBottom: '48px' },
    content: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '64px', alignItems: 'start' },
    mapContainer: { height: isMobile ? '280px' : '500px', borderRadius: '8px', overflow: 'hidden' },
    map: { width: '100%', height: '100%', border: 'none' },
    contactInfo: { display: 'flex', flexDirection: 'column', gap: '32px' },
    infoCard: { 
      backgroundColor: primary, 
      border: '1px solid rgba(255,255,255,0.06)', 
      padding: '28px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '20px'
    },
    icon: { fontSize: '1.5rem', color: accent, minWidth: '30px' },
    infoContent: { flex: 1 },
    infoTitle: { 
      fontSize: '1.125rem', 
      fontWeight: 700, 
      color: '#fff', 
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    infoText: { 
      fontSize: '1rem', 
      color: 'rgba(255,255,255,0.7)',
      lineHeight: '1.6'
    },
    hours: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    hoursDay: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' },
    hoursTime: { fontSize: '0.875rem', color: '#fff', textAlign: 'right' },
    social: { display: 'flex', gap: '16px', marginTop: '16px' },
    socialLink: { 
      fontSize: '1.5rem', 
      color: 'rgba(255,255,255,0.7)',
      transition: 'color 0.3s ease'
    },
    form: { 
      backgroundColor: primary, 
      border: '1px solid rgba(255,255,255,0.06)', 
      padding: '40px',
      borderRadius: '8px'
    },
    formGroup: { marginBottom: '24px' },
    label: { 
      display: 'block',
      fontSize: '0.875rem', 
      fontWeight: 600, 
      color: '#fff', 
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    input: { 
      width: '100%', 
      padding: '14px 18px', 
      backgroundColor: bg, 
      border: '1px solid rgba(255,255,255,0.1)', 
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      fontSize: '1rem'
    },
    textarea: { 
      width: '100%', 
      padding: '14px 18px', 
      backgroundColor: bg, 
      border: '1px solid rgba(255,255,255,0.1)', 
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical'
    },
    submitButton: { 
      width: '100%', 
      padding: '16px', 
      backgroundColor: accent, 
      color: '#000', 
      border: 'none', 
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.875rem', 
      fontWeight: 700, 
      textTransform: 'uppercase', 
      letterSpacing: '0.1em', 
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'opacity 0.3s ease'
    },
    submitButtonDisabled: { opacity: 0.7, cursor: 'not-allowed' },
    formMessage: { 
      padding: '16px', 
      borderRadius: '4px', 
      marginTop: '24px',
      textAlign: 'center',
      fontWeight: 600
    },
    formSuccess: { backgroundColor: 'rgba(0,255,0,0.1)', color: 'lightgreen' },
    formError: { backgroundColor: 'rgba(255,0,0,0.1)', color: 'orange' },
    openingHoursSection: { marginTop: '64px' }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    // In a real implementation, you would send this to your backend
    // For now, we'll simulate a successful submission
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and show success message
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parse opening hours from JSON
  const openingHours = restaurant?.openingHours ? JSON.parse(restaurant.openingHours) : {};

  if (!restaurant) return null;

  return (
    <Layout>
      <div style={S.page}>
        <section style={S.section}>
          <div style={S.container}>
            <p style={S.sectionLabel}>GET IN TOUCH</p>
            <h1 style={S.sectionTitle}>Contact Us</h1>
            <div style={S.divider} />
            
            <div style={S.content}>
              {/* Map and Contact Info */}
              <div>
                {restaurant.mapEmbedUrl ? (
                  <div style={S.mapContainer}>
                    <iframe 
                      src={restaurant.mapEmbedUrl} 
                      style={S.map}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Restaurant Location"
                    ></iframe>
                  </div>
                ) : (
                  <div style={{...S.mapContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: primary}}>
                    <p style={{color: 'rgba(255,255,255,0.5)'}}>Map not available</p>
                  </div>
                )}
                
                <div style={S.contactInfo}>
                  <div style={S.infoCard}>
                    <div style={S.icon}>📍</div>
                    <div style={S.infoContent}>
                      <h3 style={S.infoTitle}>Address</h3>
                      <p style={S.infoText}>
                        {restaurant.address || 'Restaurant address not available'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={S.infoCard}>
                    <div style={S.icon}>📞</div>
                    <div style={S.infoContent}>
                      <h3 style={S.infoTitle}>Phone</h3>
                      {restaurant.phone ? (
                        <p style={S.infoText}>
                          <a href={`tel:${restaurant.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {restaurant.phone}
                          </a>
                        </p>
                      ) : (
                        <p style={S.infoText}>Phone number not available</p>
                      )}
                    </div>
                  </div>
                  
                  <div style={S.infoCard}>
                    <div style={S.icon}>✉️</div>
                    <div style={S.infoContent}>
                      <h3 style={S.infoTitle}>Email</h3>
                      {restaurant.email ? (
                        <p style={S.infoText}>
                          <a href={`mailto:${restaurant.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {restaurant.email}
                          </a>
                        </p>
                      ) : (
                        <p style={S.infoText}>Email not available</p>
                      )}
                    </div>
                  </div>
                  
                  <div style={S.infoCard}>
                    <div style={S.icon}>🌐</div>
                    <div style={S.infoContent}>
                      <h3 style={S.infoTitle}>Social Media</h3>
                      <div style={S.social}>
                        {restaurant.facebookUrl && (
                          <a href={restaurant.facebookUrl} target="_blank" rel="noopener noreferrer" style={S.socialLink}>
                            f
                          </a>
                        )}
                        {restaurant.instagramUrl && (
                          <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer" style={S.socialLink}>
                            i
                          </a>
                        )}
                        {restaurant.tiktokUrl && (
                          <a href={restaurant.tiktokUrl} target="_blank" rel="noopener noreferrer" style={S.socialLink}>
                            t
                          </a>
                        )}
                        {restaurant.websiteUrl && (
                          <a href={restaurant.websiteUrl} target="_blank" rel="noopener noreferrer" style={S.socialLink}>
                            w
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <div style={S.form}>
                  <h2 style={{...S.sectionTitle, fontSize: '1.75rem', marginBottom: '32px'}}>Send us a message</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div style={S.formGroup}>
                      <label htmlFor="name" style={S.label}>Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={S.input}
                      />
                    </div>
                    
                    <div style={S.formGroup}>
                      <label htmlFor="email" style={S.label}>Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={S.input}
                      />
                    </div>
                    
                    <div style={S.formGroup}>
                      <label htmlFor="phone" style={S.label}>Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={S.input}
                      />
                    </div>
                    
                    <div style={S.formGroup}>
                      <label htmlFor="message" style={S.label}>Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        style={S.textarea}
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{
                        ...S.submitButton,
                        ...(isSubmitting ? S.submitButtonDisabled : {})
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                    
                    {submitSuccess && (
                      <div style={{...S.formMessage, ...S.formSuccess}}>
                        Message sent successfully! We'll get back to you soon.
                      </div>
                    )}
                    
                    {submitError && (
                      <div style={{...S.formMessage, ...S.formError}}>
                        {submitError}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
            
            {/* Opening Hours */}
            <div style={S.openingHoursSection}>
              <div style={{...S.infoCard, maxWidth: '600px', margin: '0 auto'}}>
                <div style={S.icon}>🕐</div>
                <div style={S.infoContent}>
                  <h3 style={S.infoTitle}>Opening Hours</h3>
                  {Object.keys(openingHours).length > 0 ? (
                    <div style={S.hours}>
                      {Object.entries(openingHours).map(([day, hours]) => (
                        <div key={day} style={{ display: 'contents' }}>
                          <div style={S.hoursDay}>{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                          <div style={S.hoursTime}>{hours}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={S.infoText}>Opening hours not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ContactPage;
