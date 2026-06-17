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
  const [isMobile, setIsMobile] = useState(false);
  const isHomePage = location.pathname === `/${restaurant?.subdomain}` || location.pathname === '/';

  const accent = restaurant?.accentColor || '#C9A84C';
  const bg = restaurant?.bgColor || '#0d0d0d';
  const isLightBg = (() => {
    const hex = (bg || '#0d0d0d').replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    return (r*299 + g*587 + b*114) / 1000 > 128;
  })();
  const navBg = (!isHomePage || isScrolled)
    ? '#111111'
    : 'transparent';
  const navTextColor = '#ffffff';
  const getTextColor = (bgCol) => {
    if (!bgCol) return '#ffffff';
    const hex = bgCol.replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    const brightness = (r*299 + g*587 + b*114) / 1000;
    return brightness > 128 ? '#111111' : '#ffffff';
  };
  const textColor = getTextColor(bg);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === `/${restaurant?.subdomain}` || location.pathname === '/';
    return location.pathname.includes(path);
  };

  const S = {
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      backgroundColor: navBg,
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      padding: isMobile ? '12px 20px' : '16px 48px',
      transition: 'all 0.3s ease',
      borderBottom: (!isHomePage || isScrolled) ? '1px solid rgba(255,255,255,0.1)' : 'none'
    },
    container: { maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '10px' },
    logo: { height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}` },
    restaurantName: { fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: '#ffffff', textDecoration: 'none' },
    navLinks: { display: 'flex', gap: '28px', alignItems: 'center' },
    navLink: { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#ffffff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 0' },
    activeLink: { color: accent },
    dropdown: { position: 'absolute', top: '100%', left: 0, backgroundColor: bg === '#0d0d0d' ? '#1a1a1a' : bg, minWidth: '200px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: '8px', padding: '12px 0', zIndex: 100 },
    dropdownLink: { display: 'block', padding: '10px 20px', color: textColor, textDecoration: 'none', fontSize: '13px' },
    orderButton: { backgroundColor: accent, color: '#000', border: 'none', padding: isMobile ? '10px 16px' : '12px 24px', fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '4px', cursor: 'pointer' },
  };

  return (
    <>
      <nav style={S.nav}>
        <div style={S.container}>
          {/* Logo */}
          <div style={S.logoSection}>
            {restaurant?.logoUrl && <img src={restaurant.logoUrl} alt={restaurant.name} style={S.logo} onError={e=>e.target.style.display='none'} />}
            <Link to={`/${restaurant?.subdomain}`} style={S.restaurantName}>{restaurant?.name}</Link>
          </div>

          {/* Desktop Nav */}
          {!isMobile && (
            <div style={S.navLinks}>
              <Link to={`/${restaurant?.subdomain}`} style={{...S.navLink,...(location.pathname===`/${restaurant?.subdomain}`?S.activeLink:{})}}>HOME</Link>
              <Link to={`/${restaurant?.subdomain}/about`} style={{...S.navLink,...(isActive('/about')?S.activeLink:{})}}>ABOUT US</Link>
              <div style={{position:'relative'}} onMouseEnter={()=>setIsMenuDropdownOpen(true)} onMouseLeave={()=>setIsMenuDropdownOpen(false)}>
                <Link to={`/${restaurant?.subdomain}/menu`} style={{...S.navLink,...(isActive('/menu')?S.activeLink:{})}}>MENU ▼</Link>
                {isMenuDropdownOpen && (
                  <div style={S.dropdown}>
                    {menuCategories?.map(cat=>(
                      <Link key={cat.id} to={`/${restaurant?.subdomain}/menu`} style={S.dropdownLink}
                        onMouseEnter={e=>e.target.style.backgroundColor='rgba(255,255,255,0.05)'}
                        onMouseLeave={e=>e.target.style.backgroundColor='transparent'}>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to={`/${restaurant?.subdomain}/gallery`} style={{...S.navLink,...(isActive('/gallery')?S.activeLink:{})}}>GALLERY</Link>
              <Link to={`/${restaurant?.subdomain}/contact`} style={{...S.navLink,...(isActive('/contact')?S.activeLink:{})}}>CONTACT</Link>
            </div>
          )}

          {/* Right side */}
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            {!isMobile && restaurant?.phone && (
              <a href={`tel:${restaurant.phone}`} style={{fontSize:'13px',color:'#fff',textDecoration:'none',fontWeight:500}}>{restaurant.phone}</a>
            )}
            {!isMobile && (
            restaurant?.restro24Url
              ? <a href={restaurant.restro24Url} target="_blank" rel="noopener noreferrer" style={{...S.orderButton, textDecoration:'none', display:'inline-block'}}>ORDER ONLINE</a>
              : <button style={S.orderButton} onClick={()=>navigate(`/${restaurant?.subdomain}/menu`)}>ORDER ONLINE</button>
          )}
            {isMobile && (
              <button onClick={()=>setIsMenuOpen(!isMenuOpen)} style={{background:'none',border:'none',color:'#ffffff',fontSize:'26px',cursor:'pointer',lineHeight:1,padding:'4px'}}>
                {isMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && isMenuOpen && (
        <div style={{position:'fixed',inset:0,zIndex:999}} onClick={()=>setIsMenuOpen(false)}>
          <div style={{position:'absolute',inset:0,backgroundColor:'rgba(0,0,0,0.7)'}} />
          <div style={{position:'absolute',top:0,right:0,height:'100vh',width:'75%',maxWidth:'300px',backgroundColor:'#111',padding:'80px 32px 32px',display:'flex',flexDirection:'column',gap:'8px'}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setIsMenuOpen(false)} style={{position:'absolute',top:'20px',right:'20px',background:'none',border:'none',color:'rgba(255,255,255,0.6)',fontSize:'24px',cursor:'pointer'}}>✕</button>
            {[
              {to:`/${restaurant?.subdomain}`,label:'Home'},
              {to:`/${restaurant?.subdomain}/about`,label:'About Us'},
              {to:`/${restaurant?.subdomain}/menu`,label:'Menu'},
              {to:`/${restaurant?.subdomain}/gallery`,label:'Gallery'},
              {to:`/${restaurant?.subdomain}/contact`,label:'Contact'},
            ].map(({to,label})=>(
              <Link key={to} to={to} onClick={()=>setIsMenuOpen(false)}
                style={{color:location.pathname===to?accent:'rgba(255,255,255,0.85)',textDecoration:'none',fontSize:'18px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                {label}
              </Link>
            ))}
            <div style={{marginTop:'24px',display:'flex',flexDirection:'column',gap:'12px'}}>
              {restaurant?.phone && <a href={`tel:${restaurant.phone}`} style={{color:'rgba(255,255,255,0.6)',fontSize:'14px',textDecoration:'none'}}>📞 {restaurant.phone}</a>}
              {restaurant?.restro24Url
                ? <a href={restaurant.restro24Url} target="_blank" rel="noopener noreferrer" onClick={()=>setIsMenuOpen(false)} style={{...S.orderButton,width:'100%',padding:'14px',fontSize:'13px',textDecoration:'none',display:'block',textAlign:'center'}}>ORDER ONLINE</a>
                : <button onClick={()=>{navigate(`/${restaurant?.subdomain}/menu`);setIsMenuOpen(false);}} style={{...S.orderButton,width:'100%',padding:'14px',fontSize:'13px'}}>ORDER ONLINE</button>
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
