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

  const S = {
    page: { minHeight: '100vh', display: 'flex', backgroundColor: '#0d0d0d', fontFamily: 'sans-serif', color: '#ccc' },
    sidebar: { width: '240px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', backgroundColor: '#080808', flexShrink: 0 },
    sidebarHeader: { padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '16px' },
    logo: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: '#000', backgroundColor: '#C9A84C' },
    logoText: { color: '#fff', fontWeight: 700, letterSpacing: '0.5px' },
    logoSubtext: { color: '#777', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' },
    nav: { flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' },
    navButton: (active) => ({
      width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
      display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none',
      backgroundColor: active ? 'rgba(255,255,255,0.05)' : 'transparent',
      color: active ? '#fff' : 'rgba(255,255,255,0.5)',
      transition: 'all 0.2s'
    }),
    sidebarFooter: { padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' },
    logoutButton: { width: '100%', padding: '12px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', cursor: 'pointer' },
    main: { flex: 1, overflow: 'auto' },
    fileManagerContainer: { padding: '32px', height: '100%' },
    fileManagerHeader: { fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '32px' },
    fileManagerBox: { height: 'calc(100vh - 160px)', backgroundColor: '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' },
    content: { padding: '32px 48px', maxWidth: '1280px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    pageTitle: { fontSize: '28px', fontWeight: 900, color: '#fff' },
    primaryButton: { padding: '10px 24px', fontSize: '13px', fontWeight: 700, color: '#000', backgroundColor: '#C9A84C', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    message: (success) => ({
      marginBottom: '24px', padding: '14px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
      backgroundColor: success ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
      color: success ? '#4ade80' : '#f87171',
      border: success ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(239,68,68,0.2)'
    }),
    formContainer: { backgroundColor: '#111', borderRadius: '12px', padding: '32px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.06)' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' },
    input: { width: '100%', padding: '12px 16px', backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
    colorInputContainer: { display: 'flex', gap: '12px', alignItems: 'center' },
    colorInput: { width: '44px', height: '44px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: '#0d0d0d', padding: '2px' },
    uploadContainer: { display: 'flex', gap: '12px', alignItems: 'center' },
    uploadButton: { padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' },
    logoPreview: { marginTop: '12px', padding: '12px', backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', display: 'inline-block' },
    logoPreviewImage: { height: '56px', objectFit: 'contain' },
    divider: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '24px 0' },
    bannerItem: { display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px 16px', marginBottom: '8px' },
    bannerImage: { height: '48px', width: '80px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#000' },
    bannerText: { flex: 1, fontSize: '12px', color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    removeButton: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', cursor: 'pointer', fontSize: '14px' },
    uploadArea: { border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)' },
    uploadAreaContent: { display: 'flex', gap: '12px', alignItems: 'center' },
    addButton: { padding: '12px 20px', borderRadius: '8px', fontWeight: 700, color: '#000', backgroundColor: '#C9A84C', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' },
    orText: { color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 4px' },
    hoursGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' },
    hoursItem: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0d0d0d', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' },
    hoursDay: { fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', width: '36px', flexShrink: 0 },
    hoursInput: { flex: 1, backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '13px', outline: 'none' },
    formActions: { display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' },
    submitButton: { padding: '12px 28px', fontWeight: 700, fontSize: '13px', color: '#000', backgroundColor: '#C9A84C', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    cancelButton: { padding: '12px 28px', fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backgroundColor: 'transparent', cursor: 'pointer' },
    loadingContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '128px' },
    spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #C9A84C', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    restaurantsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' },
    restaurantCard: { backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s' },
    cardCover: { width: '100%', height: '140px', position: 'relative' },
    cardCoverImage: { width: '100%', height: '100%', objectFit: 'cover' },
    cardCoverGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111, transparent)' },
    cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 10, marginTop: '-20px' },
    cardHeader: { display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '14px' },
    cardLogo: { width: '48px', height: '48px', objectFit: 'contain', borderRadius: '10px', backgroundColor: '#0d0d0d', border: '3px solid #111' },
    cardLogoText: { width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px', color: '#000', border: '3px solid #111', flexShrink: 0 },
    cardTitle: { paddingBottom: '4px', flex: 1, minWidth: 0 },
    cardName: { fontWeight: 900, color: '#fff', fontSize: '16px', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    cardSubdomain: { fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 },
    cardTagline: { fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '16px', lineHeight: 1.5 },
    cardStatusContainer: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    statusBadge: (active) => ({
      padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
      backgroundColor: active ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
      color: active ? '#4ade80' : '#f87171',
      border: active ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(239,68,68,0.2)'
    }),
    visitButton: { marginLeft: 'auto', padding: '5px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', textDecoration: 'none' },
    cardActions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
    editButton: { padding: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '6px', backgroundColor: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)', cursor: 'pointer' },
    toggleButton: (active) => ({
      padding: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '6px', cursor: 'pointer',
      backgroundColor: active ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)',
      color: active ? '#f87171' : '#4ade80',
      border: active ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(74,222,128,0.2)'
    }),
    adminSection: { paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '14px' },
    adminButton: { width: '100%', padding: '10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '6px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px dashed rgba(255,255,255,0.1)', cursor: 'pointer' },
    adminMessage: (success) => ({
      marginTop: '10px', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
      backgroundColor: success ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
      color: success ? '#4ade80' : '#f87171',
      border: success ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(239,68,68,0.2)'
    }),
    adminForm: { marginTop: '10px', padding: '12px', backgroundColor: '#0d0d0d', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' },
    adminInput: { width: '100%', padding: '10px 12px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' },
    adminSubmit: { width: '100%', marginTop: '4px', padding: '10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000', backgroundColor: '#C9A84C', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  };

  const defaultForm = {
    name: '', subdomain: '', primaryColor: '#1a1a1a', accentColor: '#C9A84C',
    bgColor: '#0d0d0d', tagline: '', heroTitle: '', heroSubtitle: '',
    address: '', phone: '', email: '', logoUrl: '', bannerUrl: '', videoUrl: '',
    facebookUrl: '', instagramUrl: '', tiktokUrl: '', mapEmbedUrl: '',
    restro24Url: '',
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
    e.preventDefault(); setSubmitting(true); setMsg('');
    try {
      const url = editing ? `${API}/SuperAdmin/restaurants/${editing.id}` : `${API}/SuperAdmin/restaurants`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, subdomain: form.subdomain.toLowerCase().replace(/[^a-z0-9]/g, '') })
      });
      if (!res.ok) {
        let errMsg = 'Failed';
        try { const d = await res.json(); errMsg = d.message || errMsg; } catch {}
        throw new Error(errMsg);
      }
      setMsg(editing ? '✅ Restaurant updated!' : '✅ Restaurant created!');
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
      restro24Url: r.restro24Url || '',
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
      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text || 'Server error. Please try again.' }; }
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

  const tabs = [
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'filemanager', label: 'File Manager' },
  ];

  return (
    <div style={S.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

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
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={S.navButton(activeTab === tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={S.sidebarFooter}>
          <button onClick={() => { localStorage.clear(); navigate('/superadmin/login'); }}
            style={S.logoutButton}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
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
            <div style={S.header}>
              <h1 style={S.pageTitle}>
                {showForm ? (editing ? `Edit: ${editing.name}` : 'New Restaurant') : 'All Restaurants'}
              </h1>
              <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(defaultForm); }}
                style={S.primaryButton}>
                {showForm ? '← Back to List' : '+ Add Restaurant'}
              </button>
            </div>

            {msg && <div style={S.message(msg.includes('✅'))}>{msg}</div>}

            {showForm && (
              <div style={S.formContainer}>
                <form onSubmit={handleSubmit}>
                  <div style={S.formGrid}>
                    <div>
                      <label style={S.label}>Restaurant Name *</label>
                      <input value={form.name} required
                        onChange={e => {
                          const name = e.target.value;
                          setForm({ ...form, name, subdomain: editing ? form.subdomain : name.toLowerCase().replace(/[^a-z0-9]/g, '') });
                        }}
                        style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div>
                      <label style={S.label}>
                        Subdomain {editing && <span style={{ color: '#999', fontWeight: 400, textTransform: 'none', marginLeft: '8px' }}>(locked)</span>}
                      </label>
                      <input value={form.subdomain} readOnly={!!editing} required
                        onChange={e => !editing && setForm({ ...form, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                        style={{ ...S.input, ...(editing ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                        onFocus={e => !editing && (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div>
                      <label style={S.label}>Tagline</label>
                      <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                        placeholder="Good Food, Local Love..."
                        style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div>
                      <label style={S.label}>Hero Title</label>
                      <input value={form.heroTitle} onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={S.label}>Hero Subtitle</label>
                      <input value={form.heroSubtitle} onChange={e => setForm({ ...form, heroSubtitle: e.target.value })}
                        style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div>
                      <label style={S.label}>Accent Color</label>
                      <div style={S.colorInputContainer}>
                        <input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })} style={S.colorInput} />
                        <input value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })} style={S.input}
                          onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                      </div>
                    </div>

                    <div>
                      <label style={S.label}>Background Color</label>
                      <div style={S.colorInputContainer}>
                        <input type="color" value={form.bgColor} onChange={e => setForm({ ...form, bgColor: e.target.value })} style={S.colorInput} />
                        <input value={form.bgColor} onChange={e => setForm({ ...form, bgColor: e.target.value })} style={S.input}
                          onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                      </div>
                    </div>

                    <div>
                      <label style={S.label}>Address</label>
                      <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div>
                      <label style={S.label}>Phone</label>
                      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div>
                      <label style={S.label}>Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div>
                      <label style={S.label}>Video URL</label>
                      <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://..." style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={S.label}>Logo URL</label>
                      <div style={S.uploadContainer}>
                        <input value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://..." style={S.input}
                          onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        <label style={S.uploadButton}>
                          📁 Upload
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                            const file = e.target.files[0]; if (!file) return;
                            try { const url = await uploadFile(file, form.subdomain || 'shared', 'logos'); setForm(f => ({ ...f, logoUrl: url })); }
                            catch (err) { alert('Upload failed: ' + err.message); }
                          }} />
                        </label>
                      </div>
                      {form.logoUrl && <div style={S.logoPreview}><img src={form.logoUrl} alt="logo" style={S.logoPreviewImage} /></div>}
                    </div>

                    <div>
                      <label style={S.label}>Facebook URL</label>
                      <input value={form.facebookUrl} onChange={e => setForm({ ...form, facebookUrl: e.target.value })} style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label style={S.label}>Instagram URL</label>
                      <input value={form.instagramUrl} onChange={e => setForm({ ...form, instagramUrl: e.target.value })} style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label style={S.label}>TikTok URL</label>
                      <input value={form.tiktokUrl} onChange={e => setForm({ ...form, tiktokUrl: e.target.value })} style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label style={S.label}>Google Maps Embed URL</label>
                      <input value={form.mapEmbedUrl} onChange={e => setForm({ ...form, mapEmbedUrl: e.target.value })} style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label style={S.label}>Restro24 Order URL</label>
                      <input value={form.restro24Url} onChange={e => setForm({ ...form, restro24Url: e.target.value })} placeholder="https://restro24.com/your-restaurant" style={S.input}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                      <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginTop:'6px'}}>Customers will be redirected here when they click "Order Online"</p>
                    </div>

                  <hr style={S.divider} />
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ ...S.label, marginBottom: '8px' }}>Hero Background Images</label>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>Used as hero background when no video is set. Up to 5 images, auto-slideshow.</p>
                    {banners.map((b, i) => (
                      <div key={i} style={S.bannerItem}>
                        <img src={b} alt="banner" style={S.bannerImage} />
                        <span style={S.bannerText}>Image {i + 1}</span>
                        <button type="button" onClick={() => updateBanners(banners.filter((_, idx) => idx !== i))} style={S.removeButton}>✕</button>
                      </div>
                    ))}
                    {banners.length < 5 && (
                      <div style={S.uploadArea}>
                        <div style={S.uploadAreaContent}>
                          <input type="text" placeholder="Paste image URL..." id="sa-banner-url" style={S.input}
                            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                          <button type="button" onClick={() => { const input = document.getElementById('sa-banner-url'); if (input.value) { updateBanners([...banners, input.value]); input.value = ''; } }} style={S.addButton}>Add</button>
                          <span style={S.orText}>or</span>
                          <label style={S.uploadButton}>📁 Upload
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

                  <hr style={S.divider} />

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ ...S.label, marginBottom: '16px' }}>Opening Hours</label>
                    <div style={S.hoursGrid}>
                      {DAYS.map(day => (
                        <div key={day} style={S.hoursItem}>
                          <span style={S.hoursDay}>{day.substring(0, 3)}</span>
                          <input value={openingHoursObj[day] || ''} onChange={e => updateHours(day, e.target.value)}
                            placeholder="11 AM - 10 PM" style={S.hoursInput} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={S.formActions}>
                    <button type="submit" disabled={submitting}
                      style={{ ...S.submitButton, opacity: submitting ? 0.5 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                      {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Restaurant'}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(defaultForm); }}
                      style={S.cancelButton}>
                      Cancel
                    </button>
                  </div>
                </div>
                </form>
              </div>
            )}

            {loading ? (
              <div style={S.loadingContainer}>
                <div style={S.spinner} />
              </div>
            ) : (
              <div style={S.restaurantsGrid}>
                {restaurants.map(r => (
                  <div key={r.id} style={S.restaurantCard}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>

                    {r.bannerUrl ? (
                      <div style={S.cardCover}>
                        <img src={parseBanners(r.bannerUrl)[0]} alt={r.name} style={S.cardCoverImage} />
                        <div style={S.cardCoverGradient} />
                      </div>
                    ) : (
                      <div style={{ ...S.cardCover, backgroundColor: r.primaryColor || '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                        🍽️
                        <div style={S.cardCoverGradient} />
                      </div>
                    )}

                    <div style={S.cardBody}>
                      <div style={S.cardHeader}>
                        {r.logoUrl ? (
                          <img src={r.logoUrl} alt={r.name} style={S.cardLogo} />
                        ) : (
                          <div style={{ ...S.cardLogoText, backgroundColor: r.accentColor || '#C9A84C' }}>{r.name.charAt(0)}</div>
                        )}
                        <div style={S.cardTitle}>
                          <h3 style={S.cardName}>{r.name}</h3>
                          <p style={S.cardSubdomain}>/{r.subdomain}</p>
                        </div>
                      </div>

                      {r.tagline && <p style={S.cardTagline}>{r.tagline}</p>}

                      <div style={S.cardStatusContainer}>
                        <span style={S.statusBadge(r.isActive)}>{r.isActive ? 'Active' : 'Inactive'}</span>
                        <a href={`/${r.subdomain}`} target="_blank" rel="noopener noreferrer" style={S.visitButton}>↗ Visit Site</a>
                      </div>

                      <div style={S.cardActions}>
                        <button onClick={() => handleEdit(r)} style={S.editButton}>Edit</button>
                        <button onClick={() => handleToggle(r.id)} style={S.toggleButton(r.isActive)}>
                          {r.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>

                      <div style={S.adminSection}>
                        <button
                          onClick={() => setAdminForms(prev => ({ ...prev, [r.id]: prev[r.id] ? null : { email: '', password: '' } }))}
                          style={S.adminButton}>
                          {adminForms[r.id] ? 'Cancel' : '+ Add Admin User'}
                        </button>

                        {adminMessages[r.id] && (
                          <div style={S.adminMessage(adminMessages[r.id].includes('✅'))}>{adminMessages[r.id]}</div>
                        )}

                        {adminForms[r.id] && (
                          <form onSubmit={e => handleCreateAdmin(e, r.id)} style={S.adminForm}>
                            <input type="email" placeholder="Admin email" required
                              value={adminForms[r.id].email}
                              onChange={e => setAdminForms(prev => ({ ...prev, [r.id]: { ...prev[r.id], email: e.target.value } }))}
                              style={S.adminInput} />
                            <input type="password" placeholder="Temporary password" required
                              value={adminForms[r.id].password}
                              onChange={e => setAdminForms(prev => ({ ...prev, [r.id]: { ...prev[r.id], password: e.target.value } }))}
                              style={S.adminInput} />
                            <button type="submit" style={S.adminSubmit}>Save Admin</button>
                          </form>
                        )}
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
