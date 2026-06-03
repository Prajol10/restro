import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';

const Navbar = ({ isScrolled }) => {
  const { restaurant, menuCategories } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';
  const text = '#ffffff';

  // Styles
  const S = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: isScrolled ? 'rgba(13, 13, 13, 0.9)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      padding: '16px 48px',
      transition: 'all 0.3s ease',
      borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.08)' : 'none'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logo: {
      height: '40px',
      width: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `2px solid ${accent}`
    },
    restaurantName: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '24px',
      fontWeight: 700,
      color: text,
      textDecoration: 'none'
    },
    navLinks: {
      display: 'flex',
      gap: '32px',
      alignItems: 'center'
    },
    navLink: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: text,
      textDecoration: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      position: 'relative',
      padding: '8px 0'
    },
    activeLink: {
      color: accent
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      backgroundColor: bg,
      minWidth: '200px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      borderRadius: '8px',
      padding: '12px 0',
      display: 'none'
    },
    dropdownOpen: {
      display: 'block'
    },
    dropdownLink: {
      display: 'block',
      padding: '10px 20px',
      color: text,
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'all 0.2s ease'
    },
    dropdownLinkHover: {
      backgroundColor: 'rgba(255,255,255,0.05)'
    },
    contactSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    phone: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      color: text,
      textDecoration: 'none',
      fontWeight: 500
    },
    orderButton: {
      backgroundColor: accent,
      color: '#000',
      border: 'none',
      padding: '12px 24px',
      fontFamily: "'Inter', sans-serif",
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    mobileMenuButton: {
      display: 'none',
      backgroundColor: 'transparent',
      border: 'none',
      color: text,
      fontSize: '24px',
      cursor: 'pointer'
    },
    mobileMenu: {
      display: 'none',
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100vh',
      width: '80%',
      maxWidth: '300px',
      backgroundColor: bg,
      zIndex: 1001,
      padding: '20px',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    },
    mobileMenuOpen: {
      transform: 'translateX(0)'
    },
    mobileNavLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginTop: '40px'
    },
    mobileNavLink: {
      color: text,
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    overlay: {
      display: 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1000
    },
    overlayVisible: {
      display: 'block'
    }
  };

  // Get current path for active link detection
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === `/${restaurant?.subdomain}` || location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav style={S.nav}>
        <div style={S.container}>
          <div style={S.logoSection}>
            {restaurant?.logoUrl && (
              <img 
                src={restaurant.logoUrl} 
                alt={restaurant.name} 
                style={S.logo}
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <Link 
              to={`/${restaurant?.subdomain}`} 
              style={S.restaurantName}
            >
              {restaurant?.name}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={S.navLinks}>
              <Link 
                to={`/${restaurant?.subdomain}`} 
                style={{
                  ...S.navLink,
                  ...(isActive(`/${restaurant?.subdomain}`) && location.pathname === `/${restaurant?.subdomain}` ? S.activeLink : {})
                }}
              >
                HOME
              </Link>
              
              <Link 
                to={`/${restaurant?.subdomain}/about`} 
                style={{
                  ...S.navLink,
                  ...(isActive('/about') ? S.activeLink : {})
                }}
              >
                ABOUT US
              </Link>
              
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setIsMenuDropdownOpen(true)}
                onMouseLeave={() => setIsMenuDropdownOpen(false)}
              >
                <Link 
                  to={`/${restaurant?.subdomain}/menu`} 
                  style={{
                    ...S.navLink,
                    ...(isActive('/menu') ? S.activeLink : {})
                  }}
                >
                  MENU ▼
                </Link>
                
                <div 
                  style={{
                    ...S.dropdown,
                    ...(isMenuDropdownOpen ? S.dropdownOpen : {})
                  }}
                >
                  {menuCategories?.map(category => (
                    <Link
                      key={category.id}
                      to={`/${restaurant?.subdomain}/menu#${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                      style={S.dropdownLink}
                      onMouseEnter={(e) => e.target.style.backgroundColor = S.dropdownLinkHover.backgroundColor}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to={`/${restaurant?.subdomain}/gallery`} 
                style={{
                  ...S.navLink,
                  ...(isActive('/gallery') ? S.activeLink : {})
                }}
              >
                GALLERY
              </Link>
              
              <Link 
                to={`/${restaurant?.subdomain}/contact`} 
                style={{
                  ...S.navLink,
                  ...(isActive('/contact') ? S.activeLink : {})
                }}
              >
                CONTACT
              </Link>
            </div>
          </div>

          <div style={S.contactSection}>
            {restaurant?.phone && (
              <a 
                href={`tel:${restaurant.phone}`} 
                style={S.phone}
              >
                {restaurant.phone}
              </a>
            )}
            
            <button style={S.orderButton} onClick={() => navigate(`/${restaurant?.subdomain}/menu`)}>
              ORDER ONLINE
            </button>
            
            <button 
              style={S.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        style={{
          ...S.mobileMenu,
          ...(isMenuOpen ? S.mobileMenuOpen : {})
        }}
      >
        <div style={S.mobileNavLinks}>
          <Link 
            to={`/${restaurant?.subdomain}`} 
            style={S.mobileNavLink}
            onClick={() => setIsMenuOpen(false)}
          >
            HOME
          </Link>
          
          <Link 
            to={`/${restaurant?.subdomain}/about`} 
            style={S.mobileNavLink}
            onClick={() => setIsMenuOpen(false)}
          >
            ABOUT US
          </Link>
          
          <Link 
            to={`/${restaurant?.subdomain}/menu`} 
            style={S.mobileNavLink}
            onClick={() => setIsMenuOpen(false)}
          >
            MENU
          </Link>
          
          <Link 
            to={`/${restaurant?.subdomain}/gallery`} 
            style={S.mobileNavLink}
            onClick={() => setIsMenuOpen(false)}
          >
            GALLERY
          </Link>
          
          <Link 
            to={`/${restaurant?.subdomain}/contact`} 
            style={S.mobileNavLink}
            onClick={() => setIsMenuOpen(false)}
          >
            CONTACT
          </Link>
        </div>
      </div>

      {/* Overlay */}
      <div 
        style={{
          ...S.overlay,
          ...(isMenuOpen ? S.overlayVisible : {})
        }}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
