import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileManager from '../../components/filemanager/FileManager';
import { uploadFile } from '../../utils/upload';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function SuperAdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState('restaurants');
  const [adminForms, setAdminForms] = useState({});
  const [adminMessages, setAdminMessages] = useState({});
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Styles
  const S = {
    page: { minHeight: '100vh', display: 'flex', backgroundColor: '#0d0d0d', fontFamily: 'sans-serif', color: '#ccc' },
    sidebar: { width: '256px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', backgroundColor: '#080808', flexShrink: 0 },
    sidebarHeader: { padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '16px' },
    logo: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: '#000', backgroundColor: '#C9A84C', boxShadow: '0 4px 6px rgba(201,168,76,0.2)' },
    logoText: { color: '#fff', fontWeight: 700, letterSpacing: '0.5px' },
    logoSubtext: { color: '#777', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' },
    nav: { flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
    navButton: (active) => ({ 
      width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: 'none',
      backgroundColor: active ? '#C9A84C' : 'transparent', color: active ? '#000' : '#777',
      transition: 'all 0.3s ease'
    }),
    navButtonHover: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' },
    sidebarFooter: { padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' },
    logoutButton: { width: '100%', padding: '12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.1)', cursor: 'pointer' },
    logoutButtonHover: { backgroundColor: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.4)' },
    main: { flex: 1, overflow: 'auto' },
    fileManagerContainer: { padding: '32px', height: '100%' },
    fileManagerHeader: { fontSize: '30px', fontWeight: 900, color: '#fff', marginBottom: '32px', fontFamily: "'Playfair Display', serif" },
    fileManagerBox: { height: 'calc(100vh - 160px)', backgroundColor: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', boxShadow: '0 20px 25px rgba(0,0,0,0.3)' },
    content: { padding: '32px', maxWidth: '1280px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    pageTitle: { fontSize: '30px', fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', serif" },
    primaryButton: { padding: '10px 24px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#000', backgroundColor: '#C9A84C', border: 'none', borderRadius: '12px', cursor: 'pointer' },
    primaryButtonHover: { transform: 'translateY(-2px)', boxShadow: '0 10px 15px rgba(201,168,76,0.2)' },
    message: (success) => ({ 
      marginBottom: '24px', padding: '24px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px',
      backgroundColor: success ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', 
      color: success ? '#4ade80' : '#f87171', 
      border: success ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(239,68,68,0.2)'
    }),
    formContainer: { backgroundColor: '#111', borderRadius: '16px', padding: '32px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 25px rgba(0,0,0,0.3)' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
    formGroup: { marginBottom: '24px' },
    label: { display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', marginBottom: '8px' },
    input: { width: '100%', padding: '12px 16px', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px' },
    inputFocus: { outline: 'none', borderColor: '#C9A84C', boxShadow: '0 0 0 2px rgba(201,168,76,0.2)' },
    colorInputContainer: { display: 'flex', gap: '12px', alignItems: 'center' },
    colorInput: { width: '48px', height: '48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: '#0a0a0a' },
    uploadContainer: { display: 'flex', gap: '12px', alignItems: 'center' },
    uploadButton: { padding: '12px 24px', backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#999', cursor: 'pointer', fontSize: '12px', fontWeight: 600 },
    uploadButtonHover: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
    logoPreview: { marginTop: '16px', padding: '16px', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'inline-block' },
    logoPreviewImage: { height: '64px', objectFit: 'contain' },
    divider: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '24px 0' },
    bannerLabel: { display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', marginBottom: '16px' },
    bannerItem: { display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 16px', transition: 'all 0.3s ease' },
    bannerItemHover: { border: '1px solid rgba(255,255,255,0.2)' },
    bannerImage: { height: '56px', width: '96px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#000' },
    bannerText: { flex: 1, fontSize: '12px', color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    removeButton: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', cursor: 'pointer' },
    removeButtonHover: { backgroundColor: '#ef4444', color: '#fff' },
    uploadArea: { border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)' },
    uploadAreaContent: { display: 'flex', gap: '12px', alignItems: 'center' },
    addButton: { padding: '12px 24px', borderRadius: '12px', fontWeight: 700, color: '#000', backgroundColor: '#C9A84C', border: 'none', cursor: 'pointer' },
    addButtonHover: { opacity: 0.9 },
    orText: { color: '#777', fontWeight: 600, padding: '0 8px' },
    hoursLabel: { display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', marginBottom: '16px' },
    hoursGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
    hoursItem: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0a0a0a', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    hoursDay: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', width: '80px' },
    hoursInput: { flex: 1, backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '12px' },
    formActions: { display: 'flex', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' },
    submitButton: { padding: '14px 32px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#000', backgroundColor: '#C9A84C', border: 'none', borderRadius: '12px', cursor: 'pointer' },
    submitButtonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    submitButtonHover: { transform: 'translateY(-2px)', boxShadow: '0 10px 15px rgba(201,168,76,0.2)' },
    cancelButton: { padding: '14px 32px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backgroundColor: 'transparent', cursor: 'pointer' },
    cancelButtonHover: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
    loadingContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '128px' },
    spinner: { width: '48px', height: '48px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #C9A84C', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    restaurantsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' },
    restaurantCard: { backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' },
    restaurantCardHover: { border: '1px solid rgba(255,255,255,0.2)', transform: 'translateY(-4px)', boxShadow: '0 20px 25px rgba(0,0,0,0.3)' },
    cardCover: { width: '100%', height: '160px', position: 'relative' },
    cardCoverImage: { width: '100%', height: '100%', objectFit: 'cover' },
    cardCoverGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111, transparent)' },
    cardBody: { padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 10, marginTop: '-24px' },
    cardHeader: { display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '16px' },
    cardLogo: { width: '56px', height: '56px', objectFit: 'contain', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '4px solid #111', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
    cardLogoText: { width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '20px', color: '#000', border: '4px solid #111', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
    cardTitle: { paddingBottom: '4px', flex: 1 },
    cardName: { fontWeight: 900, color: '#fff', fontSize: '18px', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    cardSubdomain: { fontSize: '12px', color: '#777', fontWeight: 500 },
    cardTagline: { fontSize: '12px', color: '#999', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    cardStatusContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
    statusBadge: (active) => ({ 
      padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
      backgroundColor: active ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', 
      color: active ? '#4ade80' : '#f87171', 
      border: active ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(239,68,68,0.2)'
    }),
    visitButton: { marginLeft: 'auto', padding: '6px 12px', fontSize: '10px', fontWeight: 700, borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#999', border: 'none', cursor: 'pointer' },
    visitButtonHover: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
    cardActions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' },
    editButton: { padding: '8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '8px', backgroundColor: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)', cursor: 'pointer' },
    editButtonHover: { backgroundColor: 'rgba(234,179,8,0.2)' },
    toggleButton: (active) => ({ 
      padding: '8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '8px', cursor: 'pointer',
      backgroundColor: active ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)', 
      color: active ? '#f87171' : '#4ade80', 
      border: active ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(74,222,128,0.2)'
    }),
    toggleButtonHover: (active) => ({ 
      backgroundColor: active ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.2)' 
    }),
    adminSection: { paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '16px' },
    adminButton: { width: '100%', padding: '10px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '8px', backgroundColor: 'transparent', color: '#777', border: '1px dashed rgba(255,255,255,0.1)', cursor: 'pointer' },
    adminButtonHover: { color: '#fff', border: '1px dashed rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.05)' },
    adminMessage: (success) => ({ 
      marginTop: '12px', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
      backgroundColor: success ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', 
      color: success ? '#4ade80' : '#f87171', 
      border: success ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(239,68,68,0.2)'
    }),
    adminForm: { marginTop: '12px', padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    adminInput: { width: '100%', padding: '8px 12px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px', marginBottom: '8px' },
    adminSubmit: { width: '100%', marginTop: '8px', padding: '10px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#000', backgroundColor: '#C9A84C', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    adminSubmitHover: { opacity: 0.9 }
  };

  const defaultForm = {
    name: '', subdomain: '', primaryColor: '#1a1a1a', accentColor: '#C9A84C',
    bgColor: '#0d0d0d', tagline: '', heroTitle: '', heroSubtitle: '',
    address: '', phone: '', email: '', logoUrl: '', bannerUrl: '', videoUrl: '',
    facebookUrl: '', instagramUrl: '', tiktokUrl: '', mapEmbedUrl: '',
    openingHours: JSON.stringify({ monday: '11:00 AM - 10:00 PM', tuesday: '11:00 AM - 10:00 PM', wednesday: '11:00 AM - 10:00 PM', thursday: '11:00 AM - 10:00 PM', friday: '11:00 AM - 11:00 PM', saturday: '11:00 AM - 11:00 PM', sunday: 'Closed' })
  };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => { fetchRestaurants(); }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API}/SuperAdmin/restaurants`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { navigate('/superadmin/login'); return; }
      setRestaurants(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const url = editing ? `${API}/SuperAdmin/restaurants/${editing.id}` : `${API}/SuperAdmin/restaurants`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, subdomain: form.subdomain.toLowerCase().replace(/[^a-z0-9]/g, '') })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      setMsg(editing ? '✅ Restaurant updated successfully!' : '✅ Restaurant created successfully!');
      setShowForm(false); setEditing(null); setForm(defaultForm);
      fetchRestaurants();
      setTimeout(() => setMsg(''), 4000);
    } catch (e) { setMsg('❌ ' + e.message); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (r) => {
    setEditing(r);
    setForm({
      name: r.name || '', subdomain: r.subdomain || '',
      primaryColor: r.primaryColor || '#1a1a1a', accentColor: r.accentColor || '#C9A84C',
      bgColor: r.bgColor || '#0d0d0d', tagline: r.tagline || '',
      heroTitle: r.heroTitle || '', heroSubtitle: r.heroSubtitle || '',
      address: r.address || '', phone: r.phone || '', email: r.email || '',
      logoUrl: r.logoUrl || '', bannerUrl: r.bannerUrl || '', videoUrl: r.videoUrl || '',
      facebookUrl: r.facebookUrl || '', instagramUrl: r.instagramUrl || '',
      tiktokUrl: r.tiktokUrl || '', mapEmbedUrl: r.mapEmbedUrl || '',
      openingHours: r.openingHours || defaultForm.openingHours
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id) => {
    await fetch(`${API}/SuperAdmin/restaurants/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchRestaurants();
  };

  const handleCreateAdmin = async (e, restaurantId) => {
    e.preventDefault();
    const f = adminForms[restaurantId];
    try {
      const res = await fetch(`${API}/SuperAdmin/restaurants/${restaurantId}/admin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: f.email, password: f.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setAdminMessages(prev => ({ ...prev, [restaurantId]: '✅ Admin created: ' + f.email }));
      setAdminForms(prev => ({ ...prev, [restaurantId]: null }));
    } catch (e) { setAdminMessages(prev => ({ ...prev, [restaurantId]: '❌ ' + e.message })); }
  };

  const parseBanners = (bannerUrl) => {
    try { const p = JSON.parse(bannerUrl || '[]'); return Array.isArray(p) ? p : [bannerUrl]; } catch { return bannerUrl ? [bannerUrl] : []; }
  };

  const updateBanners = (newBanners) => setForm({ ...form, bannerUrl: JSON.stringify(newBanners) });
  const banners = parseBanners(form.bannerUrl);
  const openingHoursObj = (() => { try { return JSON.parse(form.openingHours || '{}'); } catch { return {}; } })();
  const updateHours = (day, val) => setForm({ ...form, openingHours: JSON.stringify({ ...openingHoursObj, [day]: val }) });

  return (
    <div style={S.page}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.sidebarHeader}>
          <div style={S.logoContainer}>
            <div style={S.logo}>D</div>
            <div>
              <p style={S.logoText}>Dailo Tech</p>
              <p style={S.logoSubtext}>Super Admin</p>
            </div>
          </div>
        </div>

        <nav style={S.nav}>
          {[
            { id: 'restaurants', label: 'Restaurants', icon: '🏪' },
            { id: 'filemanager', label: 'File Manager', icon: '📁' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={S.navButton(activeTab === tab.id)}
              onMouseEnter={e => {
                if (activeTab !== tab.id) {
                  e.target.style.backgroundColor = S.navButtonHover.backgroundColor;
                  e.target.style.color = S.navButtonHover.color;
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.id) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#777';
                }
              }}>
              <span style={{ fontSize: '18px' }}>{tab.icon}</span> 
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={S.sidebarFooter}>
          <button onClick={() => { localStorage.clear(); navigate('/superadmin/login'); }}
            style={S.logoutButton}
            onMouseEnter={e => {
              e.target.style.backgroundColor = S.logoutButtonHover.backgroundColor;
              e.target.style.borderColor = S.logoutButtonHover.borderColor;
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = 'rgba(239,68,68,0.1)';
              e.target.style.borderColor = 'rgba(239,68,68,0.2)';
            }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={S.main}>
        {activeTab === 'filemanager' ? (
          <div style={S.fileManagerContainer}>
            <h1 style={S.fileManagerHeader}>File Manager</h1>
            <div style={S.fileManagerBox}>
              <FileManager restaurantSlug="shared" />
            </div>
          </div>
        ) : (
          <div style={S.content}>
            {/* Header */}
            <div style={S.header}>
              <h1 style={S.pageTitle}>
                {showForm ? (editing ? `Edit: ${editing.name}` : 'New Restaurant') : 'All Restaurants'}
              </h1>
              <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(defaultForm); }}
                style={S.primaryButton}
                onMouseEnter={e => {
                  e.target.style.transform = S.primaryButtonHover.transform;
                  e.target.style.boxShadow = S.primaryButtonHover.boxShadow;
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = 'none';
                }}>
                {showForm ? '← Back to List' : '+ Add Restaurant'}
              </button>
            </div>

            {/* Alert Messages */}
            {msg && (
              <div style={S.message(msg.includes('✅'))}>
                {msg}
              </div>
            )}

            {/* Form Section */}
            {showForm && (
              <div style={S.formContainer}>
                <form onSubmit={handleSubmit}>
                  
                  {/* Basic Details Grid */}
                  <div style={S.formGrid}>
                    <div>
                      <label style={S.label}>Restaurant Name *</label>
                      <input value={form.name} required 
                        onChange={e => {
                          const name = e.target.value;
                          setForm({ ...form, name, subdomain: editing ? form.subdomain : name.toLowerCase().replace(/[^a-z0-9]/g, '') });
                        }} 
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    
                    <div>
                      <label style={S.label}>
                        Subdomain {editing && <span style={{ color: '#999', fontWeight: 400, textTransform: 'none', marginLeft: '8px' }}>(locked)</span>}
                      </label>
                      <input value={form.subdomain} readOnly={!!editing} required
                        onChange={e => !editing && setForm({ ...form, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                        style={{ 
                          ...S.input,
                          ...(editing ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#050505' } : {})
                        }}
                        onFocus={e => !editing && (e.target.style.boxShadow = S.inputFocus.boxShadow)}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>

                    <div>
                      <label style={S.label}>Tagline</label>
                      <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                        placeholder="Good Food, Local Love..."
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    
                    <div>
                      <label style={S.label}>Hero Title</label>
                      <input value={form.heroTitle} onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={S.label}>Hero Subtitle</label>
                      <input value={form.heroSubtitle} onChange={e => setForm({ ...form, heroSubtitle: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>

                    {/* Color Pickers */}
                    <div>
                      <label style={S.label}>Accent Color</label>
                      <div style={S.colorInputContainer}>
                        <input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
                          style={S.colorInput} />
                        <input value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
                          style={S.input}
                          onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                          onBlur={e => e.target.style.boxShadow = 'none'} />
                      </div>
                    </div>
                    
                    <div>
                      <label style={S.label}>Background Color</label>
                      <div style={S.colorInputContainer}>
                        <input type="color" value={form.bgColor} onChange={e => setForm({ ...form, bgColor: e.target.value })}
                          style={S.colorInput} />
                        <input value={form.bgColor} onChange={e => setForm({ ...form, bgColor: e.target.value })}
                          style={S.input}
                          onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                          onBlur={e => e.target.style.boxShadow = 'none'} />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <label style={S.label}>Address</label>
                      <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    
                    <div>
                      <label style={S.label}>Phone</label>
                      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    
                    <div>
                      <label style={S.label}>Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    
                    <div>
                      <label style={S.label}>Video URL (Hero Background)</label>
                      <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                        placeholder="https://..."
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>

                    {/* Logo Upload */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={S.label}>Logo URL</label>
                      <div style={S.uploadContainer}>
                        <input value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })}
                          placeholder="https://... or click upload"
                          style={S.input}
                          onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                          onBlur={e => e.target.style.boxShadow = 'none'} />
                        
                        <label style={S.uploadButton}
                          onMouseEnter={e => {
                            e.target.style.color = S.uploadButtonHover.color;
                            e.target.style.backgroundColor = S.uploadButtonHover.backgroundColor;
                          }}
                          onMouseLeave={e => {
                            e.target.style.color = '#999';
                            e.target.style.backgroundColor = '#1a1a1a';
                          }}>
                          📁 Upload Image
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                            const file = e.target.files[0]; if (!file) return;
                            try { const url = await uploadFile(file, form.subdomain || 'shared', 'logos'); setForm(f => ({ ...f, logoUrl: url })); }
                            catch (err) { alert('Upload failed: ' + err.message); }
                          }} />
                        </label>
                      </div>
                      {form.logoUrl && (
                        <div style={S.logoPreview}>
                          <img src={form.logoUrl} alt="logo preview" style={S.logoPreviewImage} />
                        </div>
                      )}
                    </div>

                    {/* Social URLs */}
                    <div>
                      <label style={S.label}>Facebook URL</label>
                      <input value={form.facebookUrl} onChange={e => setForm({ ...form, facebookUrl: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    <div>
                      <label style={S.label}>Instagram URL</label>
                      <input value={form.instagramUrl} onChange={e => setForm({ ...form, instagramUrl: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    <div>
                      <label style={S.label}>TikTok URL</label>
                      <input value={form.tiktokUrl} onChange={e => setForm({ ...form, tiktokUrl: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                    <div>
                      <label style={S.label}>Google Maps Embed URL</label>
                      <input value={form.mapEmbedUrl} onChange={e => setForm({ ...form, mapEmbedUrl: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                        onBlur={e => e.target.style.boxShadow = 'none'} />
                    </div>
                  </div>

                  {/* Divider */}
                  <hr style={S.divider} />

                  {/* Banner Images */}
                  <div>
                    <label style={S.bannerLabel}>Banner Images (up to 5)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {banners.map((b, i) => (
                        <div key={i} style={S.bannerItem}
                          onMouseEnter={e => e.target.style.border = S.bannerItemHover.border}
                          onMouseLeave={e => e.target.style.border = '1px solid rgba(255,255,255,0.05)'}>
                          <img src={b} alt="banner" style={S.bannerImage} />
                          <span style={S.bannerText}>{b}</span>
                          <button type="button" onClick={() => updateBanners(banners.filter((_, idx) => idx !== i))}
                            style={S.removeButton}
                            onMouseEnter={e => {
                              e.target.style.backgroundColor = S.removeButtonHover.backgroundColor;
                              e.target.style.color = S.removeButtonHover.color;
                            }}
                            onMouseLeave={e => {
                              e.target.style.backgroundColor = 'rgba(239,68,68,0.1)';
                              e.target.style.color = '#f87171';
                            }}>✕</button>
                        </div>
                      ))}
                      
                      {banners.length < 5 && (
                        <div style={S.uploadArea}>
                          <div style={S.uploadAreaContent}>
                            <input type="text" placeholder="Paste image URL..." id="sa-banner-url"
                              style={S.input}
                              onFocus={e => e.target.style.boxShadow = S.inputFocus.boxShadow}
                              onBlur={e => e.target.style.boxShadow = 'none'} />
                            
                            <button type="button" onClick={() => {
                              const input = document.getElementById('sa-banner-url');
                              if (input.value) { updateBanners([...banners, input.value]); input.value = ''; }
                            }} style={S.addButton}
                            onMouseEnter={e => e.target.style.opacity = S.addButtonHover.opacity}
                            onMouseLeave={e => e.target.style.opacity = '1'}>Add URL</button>
                            
                            <span style={S.orText}>or</span>
                            
                            <label style={S.uploadButton}
                              onMouseEnter={e => {
                                e.target.style.color = S.uploadButtonHover.color;
                                e.target.style.backgroundColor = S.uploadButtonHover.backgroundColor;
                              }}
                              onMouseLeave={e => {
                                e.target.style.color = '#999';
                                e.target.style.backgroundColor = '#1a1a1a';
                              }}>
                              📁 Upload
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                                const file = e.target.files[0]; if (!file) return;
                                try { const url = await uploadFile(file, form.subdomain || 'shared', 'banners'); updateBanners([...banners, url]); }
                                catch (err) { alert('Upload failed: ' + err.message); }
                              }} />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <hr style={S.divider} />

                  {/* Opening Hours */}
                  <div>
                    <label style={S.hoursLabel}>Opening Hours</label>
                    <div style={S.hoursGrid}>
                      {DAYS.map(day => (
                        <div key={day} style={S.hoursItem}>
                          <span style={S.hoursDay}>{day.substring(0,3)}</span>
                          <input value={openingHoursObj[day] || ''} onChange={e => updateHours(day, e.target.value)}
                            placeholder="11 AM - 10 PM"
                            style={S.hoursInput}
                            onFocus={e => e.target.style.outline = 'none'}
                            onBlur={e => e.target.style.outline = 'none'} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={S.formActions}>
                    <button type="submit" disabled={submitting}
                      style={{ 
                        ...S.submitButton,
                        ...(submitting ? S.submitButtonDisabled : {})
                      }}
                      onMouseEnter={e => {
                        if (!submitting) {
                          e.target.style.transform = S.submitButtonHover.transform;
                          e.target.style.boxShadow = S.submitButtonHover.boxShadow;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!submitting) {
                          e.target.style.transform = 'none';
                          e.target.style.boxShadow = 'none';
                        }
                      }}>
                      {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Restaurant'}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(defaultForm); }}
                      style={S.cancelButton}
                      onMouseEnter={e => {
                        e.target.style.color = S.cancelButtonHover.color;
                        e.target.style.backgroundColor = S.cancelButtonHover.backgroundColor;
                      }}
                      onMouseLeave={e => {
                        e.target.style.color = '#777';
                        e.target.style.backgroundColor = 'transparent';
                      }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Restaurant Cards Grid */}
            {loading ? (
              <div style={S.loadingContainer}>
                <div style={S.spinner}></div>
              </div>
            ) : (
              <div style={S.restaurantsGrid}>
                {restaurants.map(r => (
                  <div key={r.id} style={S.restaurantCard}
                    onMouseEnter={e => {
                      e.target.style.border = S.restaurantCardHover.border;
                      e.target.style.transform = S.restaurantCardHover.transform;
                      e.target.style.boxShadow = S.restaurantCardHover.boxShadow;
                    }}
                    onMouseLeave={e => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.05)';
                      e.target.style.transform = 'none';
                      e.target.style.boxShadow = 'none';
                    }}>
                    
                    {/* Card Cover */}
                    {r.bannerUrl ? (
                      <div style={S.cardCover}>
                        <img src={parseBanners(r.bannerUrl)[0]} alt={r.name} style={S.cardCoverImage} />
                        <div style={S.cardCoverGradient}></div>
                      </div>
                    ) : (
                      <div style={{ ...S.cardCover, backgroundColor: r.primaryColor || '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                        🍽️
                        <div style={S.cardCoverGradient}></div>
                      </div>
                    )}
                    
                    {/* Card Body */}
                    <div style={S.cardBody}>
                      <div style={S.cardHeader}>
                        {r.logoUrl ? (
                          <img src={r.logoUrl} alt={r.name} style={S.cardLogo} />
                        ) : (
                          <div style={{ 
                            ...S.cardLogoText,
                            backgroundColor: r.accentColor || '#C9A84C'
                          }}>{r.name.charAt(0)}</div>
                        )}
                        <div style={S.cardTitle}>
                          <h3 style={S.cardName}>{r.name}</h3>
                          <p style={S.cardSubdomain}>/{r.subdomain}</p>
                        </div>
                      </div>

                      {r.tagline && <p style={S.cardTagline}>{r.tagline}</p>}

                      <div>
                        {/* Status & Links */}
                        <div style={S.cardStatusContainer}>
                           <span style={S.statusBadge(r.isActive)}>
                            {r.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <a href={`/${r.subdomain}`} target="_blank" rel="noopener noreferrer"
                            style={S.visitButton}
                            onMouseEnter={e => {
                              e.target.style.color = S.visitButtonHover.color;
                              e.target.style.backgroundColor = S.visitButtonHover.backgroundColor;
                            }}
                            onMouseLeave={e => {
                              e.target.style.color = '#999';
                              e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            }}>
                            ↗ Visit Site
                          </a>
                        </div>

                        {/* Actions */}
                        <div style={S.cardActions}>
                          <button onClick={() => handleEdit(r)}
                            style={S.editButton}
                            onMouseEnter={e => {
                              e.target.style.backgroundColor = S.editButtonHover.backgroundColor;
                            }}
                            onMouseLeave={e => {
                              e.target.style.backgroundColor = 'rgba(234,179,8,0.1)';
                            }}>
                            Edit
                          </button>
                          <button onClick={() => handleToggle(r.id)}
                            style={S.toggleButton(r.isActive)}
                            onMouseEnter={e => {
                              e.target.style.backgroundColor = S.toggleButtonHover(r.isActive).backgroundColor;
                            }}
                            onMouseLeave={e => {
                              e.target.style.backgroundColor = r.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)';
                            }}>
                            {r.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>

                        {/* Admin Tools */}
                        <div style={S.adminSection}>
                          <button onClick={() => setAdminForms(prev => ({ ...prev, [r.id]: prev[r.id] ? null : { email: '', password: '' } }))}
                            style={S.adminButton}
                            onMouseEnter={e => {
                              e.target.style.color = S.adminButtonHover.color;
                              e.target.style.border = S.adminButtonHover.border;
                              e.target.style.backgroundColor = S.adminButtonHover.backgroundColor;
                            }}
                            onMouseLeave={e => {
                              e.target.style.color = '#777';
                              e.target.style.border = '1px dashed rgba(255,255,255,0.1)';
                              e.target.style.backgroundColor = 'transparent';
                            }}>
                            {adminForms[r.id] ? 'Cancel Creation' : '+ Add Admin User'}
                          </button>

                          {adminMessages[r.id] && (
                            <div style={S.adminMessage(adminMessages[r.id].includes('✅'))}>
                              {adminMessages[r.id]}
                            </div>
                          )}

                          {adminForms[r.id] && (
                            <form onSubmit={e => handleCreateAdmin(e, r.id)} style={S.adminForm}>
                              <input type="email" placeholder="Admin email" required
                                value={adminForms[r.id].email}
                                onChange={e => setAdminForms(prev => ({ ...prev, [r.id]: { ...prev[r.id], email: e.target.value } }))}
                                style={S.adminInput} />
                              <input type="password" placeholder="Temporary Password" required
                                value={adminForms[r.id].password}
                                onChange={e => setAdminForms(prev => ({ ...prev, [r.id]: { ...prev[r.id], password: e.target.value } }))}
                                style={S.adminInput} />
                              <button type="submit"
                                style={S.adminSubmit}
                                onMouseEnter={e => e.target.style.opacity = S.adminSubmitHover.opacity}
                                onMouseLeave={e => e.target.style.opacity = '1'}>
                                Save Admin
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
