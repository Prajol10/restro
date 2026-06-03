import { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import Layout from '../../components/public/Layout';

const AboutPage = () => {
  const { restaurant, whyChooseUs } = useTenant();
  
  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';

  // Styles
  const S = {
    page: { backgroundColor: bg, minHeight: '100vh' },
    hero: { 
      height: '60vh', 
      backgroundImage: restaurant?.bannerUrl?.[0] ? `url(${restaurant.bannerUrl[0]})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    heroOverlay: { 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.8)' 
    },
    heroContent: { 
      textAlign: 'center', 
      position: 'relative', 
      zIndex: 2,
      maxWidth: '1280px', 
      padding: '0 48px',
      margin: '0 auto'
    },
    heroTitle: { 
      fontFamily: "'Playfair Display', serif", 
      fontSize: 'clamp(3rem, 6vw, 5rem)', 
      fontWeight: 900, 
      color: '#fff',
      marginBottom: '16px'
    },
    heroSubtitle: { 
      fontSize: '1.25rem', 
      color: 'rgba(255,255,255,0.8)',
      maxWidth: '600px',
      margin: '0 auto'
    },
    section: { padding: '100px 0' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px' },
    sectionLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: '16px' },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' },
    divider: { width: '40px', height: '2px', backgroundColor: accent, marginBottom: '48px' },
    storyContent: { 
      fontSize: '1.125rem', 
      lineHeight: '1.8', 
      color: 'rgba(255,255,255,0.8)',
      maxWidth: '800px',
      margin: '0 auto'
    },
    features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginTop: '48px' },
    featureCard: { 
      backgroundColor: '#111111', 
      border: '1px solid rgba(255,255,255,0.06)', 
      padding: '32px', 
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    featureIcon: { fontSize: '3rem', marginBottom: '20px' },
    featureTitle: { 
      fontSize: '1.25rem', 
      fontWeight: 700, 
      color: '#fff', 
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    featureDescription: { 
      fontSize: '1rem', 
      color: 'rgba(255,255,255,0.7)', 
      lineHeight: '1.6'
    },
    team: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginTop: '48px' },
    teamMember: { textAlign: 'center' },
    teamImage: { 
      width: '200px', 
      height: '200px', 
      borderRadius: '50%', 
      objectFit: 'cover', 
      margin: '0 auto 24px',
      border: `3px solid ${accent}`
    },
    teamName: { 
      fontSize: '1.25rem', 
      fontWeight: 700, 
      color: '#fff', 
      marginBottom: '8px'
    },
    teamTitle: { 
      fontSize: '1rem', 
      color: accent, 
      marginBottom: '16px'
    },
    teamQuote: { 
      fontSize: '1rem', 
      color: 'rgba(255,255,255,0.7)', 
      fontStyle: 'italic',
      padding: '0 20px'
    },
    awards: { marginTop: '48px' },
    award: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '24px', 
      padding: '24px',
      backgroundColor: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
      marginBottom: '16px'
    },
    awardIcon: { fontSize: '2rem', color: accent },
    awardContent: { flex: 1 },
    awardTitle: { 
      fontSize: '1.25rem', 
      fontWeight: 700, 
      color: '#fff', 
      marginBottom: '8px'
    },
    awardDescription: { 
      fontSize: '1rem', 
      color: 'rgba(255,255,255,0.7)'
    },
    ctaSection: { 
      backgroundColor: restaurant?.primaryColor || '#1a1a1a', 
      padding: '80px 0', 
      textAlign: 'center',
      marginTop: '100px'
    },
    ctaTitle: { 
      fontFamily: "'Playfair Display', serif", 
      fontSize: '2.5rem', 
      fontWeight: 900, 
      color: '#fff', 
      marginBottom: '24px'
    },
    ctaDescription: { 
      fontSize: '1.125rem', 
      color: 'rgba(255,255,255,0.8)', 
      maxWidth: '600px', 
      margin: '0 auto 32px'
    },
    ctaButton: { 
      padding: '16px 32px', 
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
      textDecoration: 'none',
      display: 'inline-block'
    }
  };

  if (!restaurant) return null;

  return (
    <Layout>
      <div style={S.page}>
        {/* Hero Section */}
        <div style={S.hero}>
          <div style={S.heroOverlay}></div>
          <div style={S.heroContent}>
            <h1 style={S.heroTitle}>Our Story</h1>
            <p style={S.heroSubtitle}>
              {restaurant.tagline || "Authentic flavors, timeless tradition"}
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <section style={S.section}>
          <div style={S.container}>
            <p style={S.sectionLabel}>OUR JOURNEY</p>
            <h2 style={S.sectionTitle}>Our Story</h2>
            <div style={S.divider} />
            
            <div style={S.storyContent}>
              {restaurant.aboutText ? (
                <div dangerouslySetInnerHTML={{ __html: restaurant.aboutText }} />
              ) : (
                <p>
                  Welcome to {restaurant.name}, where tradition meets innovation. 
                  Our journey began with a passion for authentic flavors and a commitment 
                  to providing an exceptional dining experience. For over [X] years, 
                  we've been serving our community with the finest ingredients, 
                  time-honored recipes, and unparalleled hospitality.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section style={{...S.section, backgroundColor: '#111111'}}>
          <div style={S.container}>
            <p style={S.sectionLabel}>WHY US</p>
            <h2 style={S.sectionTitle}>Why Choose Us</h2>
            <div style={{...S.divider, marginBottom: '48px'}} />
            
            {whyChooseUs && whyChooseUs.length > 0 ? (
              <div style={S.features}>
                {whyChooseUs.map(item => (
                  <div key={item.id} style={S.featureCard}>
                    <div style={S.featureIcon}>{item.icon || '🌟'}</div>
                    <h3 style={S.featureTitle}>{item.title}</h3>
                    <p style={S.featureDescription}>{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={S.features}>
                <div style={S.featureCard}>
                  <div style={S.featureIcon}>🍽</div>
                  <h3 style={S.featureTitle}>Authentic Recipes</h3>
                  <p style={S.featureDescription}>
                    Our dishes are crafted using traditional recipes passed down through generations.
                  </p>
                </div>
                <div style={S.featureCard}>
                  <div style={S.featureIcon}>🌱</div>
                  <h3 style={S.featureTitle}>Fresh Ingredients</h3>
                  <p style={S.featureDescription}>
                    We source the freshest ingredients daily from local farms and suppliers.
                  </p>
                </div>
                <div style={S.featureCard}>
                  <div style={S.featureIcon}>👨‍🍳</div>
                  <h3 style={S.featureTitle}>Expert Chefs</h3>
                  <p style={S.featureDescription}>
                    Our skilled chefs bring years of experience and passion to every dish.
                  </p>
                </div>
                <div style={S.featureCard}>
                  <div style={S.featureIcon}>🍷</div>
                  <h3 style={S.featureTitle}>Premium Experience</h3>
                  <p style={S.featureDescription}>
                    From ambiance to service, we ensure every visit is memorable.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Team/Chef Section */}
        {(restaurant.chefName || restaurant.chefImageUrl) && (
          <section style={S.section}>
            <div style={S.container}>
              <p style={S.sectionLabel}>OUR TEAM</p>
              <h2 style={S.sectionTitle}>Meet Our Chef</h2>
              <div style={{...S.divider, marginBottom: '48px'}} />
              
              <div style={S.team}>
                <div style={S.teamMember}>
                  {restaurant.chefImageUrl && (
                    <img 
                      src={restaurant.chefImageUrl} 
                      alt={restaurant.chefName || "Chef"} 
                      style={S.teamImage} 
                    />
                  )}
                  <h3 style={S.teamName}>{restaurant.chefName || "Head Chef"}</h3>
                  <p style={S.teamTitle}>{restaurant.chefTitle || "Executive Chef"}</p>
                  {restaurant.chefQuote && (
                    <p style={S.teamQuote}>"{restaurant.chefQuote}"</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Awards Section */}
        <section style={{...S.section, backgroundColor: '#111111'}}>
          <div style={S.container}>
            <p style={S.sectionLabel}>RECOGNITION</p>
            <h2 style={S.sectionTitle}>Awards & Recognition</h2>
            <div style={{...S.divider, marginBottom: '48px'}} />
            
            <div style={S.awards}>
              <div style={S.award}>
                <div style={S.awardIcon}>🏆</div>
                <div style={S.awardContent}>
                  <h3 style={S.awardTitle}>Best Traditional Cuisine</h3>
                  <p style={S.awardDescription}>
                    Awarded by the National Restaurant Association for excellence in traditional cooking.
                  </p>
                </div>
              </div>
              <div style={S.award}>
                <div style={S.awardIcon}>⭐</div>
                <div style={S.awardContent}>
                  <h3 style={S.awardTitle}>Customer Choice Award</h3>
                  <p style={S.awardDescription}>
                    Voted #1 restaurant by our loyal customers for three consecutive years.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visit Us CTA */}
        <section style={S.ctaSection}>
          <div style={S.container}>
            <h2 style={S.ctaTitle}>Visit Us Today</h2>
            <p style={S.ctaDescription}>
              Experience the authentic flavors and warm hospitality that make us unique.
            </p>
            <a href={`/${restaurant.subdomain}/contact`} style={S.ctaButton}>
              Get Directions
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;
