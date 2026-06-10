import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import FileManager from '../../components/filemanager/FileManager';
import FilePicker from '../../components/filemanager/FilePicker';
import { uploadFile } from '../../utils/upload';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { restaurant: restaurantContext } = useTenant();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [msg, setMsg] = useState('');
  const [slug, setSlug] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const token = localStorage.getItem('token');

  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [archivedGallery, setArchivedGallery] = useState([]);
  const [archivedItems, setArchivedItems] = useState([]);
  const [whyChooseUs, setWhyChooseUs] = useState([]);
  const [awards, setAwards] = useState([]);

  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ name:'', description:'', sortOrder:0 });

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({ categoryId:'', name:'', subtitle:'', description:'', price:'', imageUrl:'', isSpecial:false, isAvailable:true, sortOrder:0 });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ customerName:'', rating:5, content:'', source:'Google' });

  const [infoForm, setInfoForm] = useState(null);
  const [editingInfo, setEditingInfo] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [filePicker, setFilePicker] = useState(null);

  const [showWhyChooseUsForm, setShowWhyChooseUsForm] = useState(false);
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [awardForm, setAwardForm] = useState({ icon:"🏆", title:"", organization:"", year:"", description:"", sortOrder:0 });
  const [editingWhyChooseUs, setEditingWhyChooseUs] = useState(null);
  const [whyChooseUsForm, setWhyChooseUsForm] = useState({ icon:'', title:'', description:'', sortOrder:0 });

  const [aboutForm, setAboutForm] = useState(null);
  const [editingAbout, setEditingAbout] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);

  const [stats, setStats] = useState({ totalOrders:0, pendingOrders:0, todayReservations:0, totalReviews:0 });
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reservationStatusFilter, setReservationStatusFilter] = useState('all');

  const accent = restaurant?.accentColor || '#C9A84C';
  // Admin always uses dark theme regardless of restaurant colors
  const adminBg = '#000';
  const adminSidebarBg = '#0d0d0d';
  const adminCardBg = '#111';
  const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';
  const STATUS_BADGE = {
    Pending: ['#fbbf24', 'rgba(251,191,36,0.15)'],
    Confirmed: ['#60a5fa', 'rgba(96,165,250,0.15)'],
    Completed: ['#4ade80', 'rgba(74,222,128,0.15)'],
    Cancelled: ['#f87171', 'rgba(248,113,113,0.15)']
  };

  const S = {
    page: { display:'flex', minHeight:'100vh', backgroundColor:'#000 !important' },
    sidebar: { width:'240px', backgroundColor:'#0d0d0d', borderRight:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', padding:'24px 16px', flexShrink:0 },
    sidebarTop: { marginBottom:'32px', textAlign:'center' },
    sidebarName: { color:'#fff', fontSize:'16px', fontWeight:700, marginTop:'12px' },
    sidebarRole: { color:'rgba(255,255,255,0.4)', fontSize:'12px', marginTop:'4px' },
    nav: { flex:1 },
    navBtn: (active) => ({
      width:'100%', display:'flex', alignItems:'center', padding:'10px 16px',
      backgroundColor: active ? 'rgba(255,255,255,0.05)' : 'transparent',
      border:'none', borderRadius:'8px', color: active ? '#fff' : 'rgba(255,255,255,0.5)',
      cursor:'pointer', fontSize:'13px', fontWeight:600, marginBottom:'2px',
      transition:'all 0.2s', textAlign:'left'
    }),
    navSection: {
      fontSize:'10px', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
      color:'rgba(255,255,255,0.2)', padding:'14px 16px 4px', marginTop:'4px'
    },
    sidebarBottom: { marginTop:'auto' },
    main: { flex:1, padding:'32px 48px', overflowY:'auto' },
    msg: (success) => ({ position:'fixed', top:'20px', right:'20px', zIndex:1000, padding:'14px 24px', borderRadius:'8px', fontWeight:600, backgroundColor: success ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', color: success ? '#4ade80' : '#f87171', border:'1px solid '+(success ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)') }),
    pageTitle: { color:'#fff', fontSize:'28px', fontWeight:900, marginBottom:'24px' },
    card: { backgroundColor:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px', padding:'24px', marginBottom:'16px' },
    empty: { textAlign:'center', padding:'48px 24px', color:'rgba(255,255,255,0.3)', fontSize:'14px' },
    grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
    label: { display:'block', color:'rgba(255,255,255,0.5)', fontSize:'12px', fontWeight:600, marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.05em' },
    input: { width:'100%', padding:'12px 16px', backgroundColor:'#0d0d0d', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#fff', fontSize:'14px' },
    select: { width:'100%', padding:'12px 16px', backgroundColor:'#0d0d0d', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#fff', fontSize:'14px' },
    textarea: { width:'100%', padding:'12px 16px', backgroundColor:'#0d0d0d', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#fff', fontSize:'14px', minHeight:'100px' },
    btnPrimary: (accent) => ({ padding:'10px 20px', backgroundColor:accent, color:'#000', border:'none', borderRadius:'8px', fontWeight:700, fontSize:'13px', cursor:'pointer', transition:'opacity 0.2s' }),
    btnOutline: { padding:'10px 20px', backgroundColor:'transparent', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', fontWeight:700, fontSize:'13px', cursor:'pointer' },
    btnSuccess: { padding:'8px 16px', backgroundColor:'rgba(74,222,128,0.15)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.3)', borderRadius:'6px', fontWeight:600, fontSize:'12px', cursor:'pointer' },
    btnDanger: { padding:'8px 16px', backgroundColor:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'6px', fontWeight:600, fontSize:'12px', cursor:'pointer' },
    uploadBtn: { padding:'10px 16px', backgroundColor:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', fontWeight:700, fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' },
    badge: (color, bg) => ({ padding:'4px 10px', backgroundColor:bg, color:color, borderRadius:'20px', fontSize:'11px', fontWeight:700 }),
    statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'20px', marginBottom:'32px' },
    statCard: { backgroundColor:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px', padding:'24px', textAlign:'center' },
    statValue: { fontSize:'2.5rem', fontWeight:900, color:'#fff', margin:'10px 0' },
    statLabel: { fontSize:'0.875rem', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.05em' },
    tableContainer: { overflowX:'auto' },
    table: { width:'100%', borderCollapse:'collapse' },
    th: { textAlign:'left', padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em' },
    td: { padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.7)' },
    tr: { transition:'background-color 0.2s' },
    trHover: { backgroundColor:'rgba(255,255,255,0.02)' },
    tabs: { display:'flex', gap:'8px', marginBottom:'24px' },
    tab: (active, accent) => ({ padding:'8px 16px', backgroundColor: active ? accent : 'transparent', color: active ? '#000' : 'rgba(255,255,255,0.5)', border:'none', borderRadius:'6px', fontWeight:600, fontSize:'13px', cursor:'pointer', transition:'all 0.2s' }),
    menuTableContainer: { overflowX:'auto' },
    menuTable: { width:'100%', borderCollapse:'collapse' },
    menuTh: { textAlign:'left', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.75)', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:700 },
    menuTd: { padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.92)', fontWeight:500 },
    menuTr: { transition:'background-color 0.2s' },
    menuTrHover: { backgroundColor:'rgba(255,255,255,0.02)' },
    menuImage: { width:'40px', height:'40px', borderRadius:'6px', objectFit:'cover' },
    toggleButton: { padding:'4px 8px', borderRadius:'4px', border:'none', cursor:'pointer', fontSize:'12px' },
    toggleOn: { backgroundColor:'rgba(74,222,128,0.15)', color:'#4ade80' },
    toggleOff: { backgroundColor:'rgba(239,68,68,0.15)', color:'#f87171' }
  };

  const navSections = [
    { label:'Overview', tabs:[{ id:'dashboard', label:'Dashboard' }] },
    { label:'Restaurant Management', tabs:[{ id:'orders', label:'Orders' }, { id:'reservations', label:'Reservations' }, { id:'reviews', label:'Reviews' }] },
    { label:'Menu Management', tabs:[{ id:'menu', label:'Menu' }] },
    { label:'CMS Content', tabs:[{ id:'about-us', label:'About Us' }, { id:'why-choose-us', label:'Why Choose Us' }, { id:'awards', label:'Awards & Recognition' }, { id:'gallery', label:'Gallery' }] },
    { label:'Site Management', tabs:[{ id:'info', label:'Restaurant Info' }, { id:'filemanager', label:'Files' }, { id:'archive', label:'Archive' }] },
  ];

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    setSlug(pathParts[1]);
    if (restaurantContext) setRestaurant(restaurantContext);
  }, [restaurantContext]);

  useEffect(() => {
    if (activeTab==='dashboard') { fetchStats(); fetchOrders(); fetchReservations(); }
    else if (activeTab==='orders') fetchOrders();
    else if (activeTab==='reservations') fetchReservations();
    else if (activeTab==='reviews') fetchReviews();
    else if (activeTab==='menu') { fetchCategories(); fetchMenuItems(); }
    else if (activeTab==='gallery') fetchGallery();
    else if (activeTab==='archive') { fetchArchivedGallery(); fetchArchivedItems(); }
    else if (activeTab==='why-choose-us') fetchWhyChooseUs();
    else if (activeTab==='awards') fetchAwards();
    else if (activeTab==='awards') fetchAwards();
    else if (activeTab==='about-us' && restaurant) { setAboutForm({ aboutText:restaurant.aboutText||'', aboutShort:restaurant.aboutShort||'', aboutImageUrl:restaurant.aboutImageUrl||'' }); setEditingAbout(false); }
    else if (activeTab==='info' && restaurant) { const h=(()=>{try{return JSON.parse(restaurant.openingHours||'{}');}catch{return {};}})(); setInfoForm({...restaurant,openingHoursObj:h}); }
  }, [activeTab, restaurant]);

  const authFetch = async (url, opts={}) => {
    const res = await fetch(url, {...opts, headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...opts.headers}});
    if (res.status === 401) { localStorage.clear(); navigate(`/${slug}/admin`); return res; }
    return res;
  };
  const showMsg = (m) => { setMsg(m); setTimeout(()=>setMsg(''), 3000); };

  const fetchStats = async () => {
    try {
      const [oRes, rRes, rvRes] = await Promise.all([authFetch(`${API}/Admin/orders`), authFetch(`${API}/Admin/reservations`), authFetch(`${API}/Admin/reviews`)]);
      const [o, r, rv] = await Promise.all([oRes.json(), rRes.json(), rvRes.json()]);
      const today = new Date().toISOString().split('T')[0];
      setStats({ totalOrders:o.length, pendingOrders:o.filter(x=>x.status==='Pending').length, todayReservations:r.filter(x=>x.date===today).length, totalReviews:rv.length });
    } catch(e) { console.error(e); }
  };

  const fetchOrders = async () => { try { const r=await authFetch(`${API}/Admin/orders`); const d=await r.json(); setOrders(Array.isArray(d)?d:[]); } catch(e){} };
  const fetchReservations = async () => { try { const r=await authFetch(`${API}/Admin/reservations`); const d=await r.json(); setReservations(Array.isArray(d)?d:[]); } catch(e){} };
  const fetchReviews = async () => { try { const r=await authFetch(`${API}/Admin/reviews`); const d=await r.json(); setReviews(Array.isArray(d)?d:[]); } catch(e){} };
  const fetchCategories = async () => { try { const r=await authFetch(`${API}/Admin/menu-categories`); const d=await r.json(); setCategories(Array.isArray(d)?d:[]); } catch(e){} };
  const fetchMenuItems = async () => { try { const r=await authFetch(`${API}/Admin/menu-items`); const d=await r.json(); setMenuItems(Array.isArray(d)?d:[]); } catch(e){} };
  const fetchGallery = async () => { try { const r=await authFetch(`${API}/Admin/gallery`); const d=await r.json(); setGallery(Array.isArray(d)?d:[]); } catch(e){} };
  const fetchAwards = async () => { try { const r=await authFetch(`${API}/Admin/awards`); const d=await r.json(); setAwards(Array.isArray(d)?d:[]); } catch(e){} };
    const fetchWhyChooseUs = async () => { try { const r=await authFetch(`${API}/Admin/why-choose-us`); const d=await r.json(); setWhyChooseUs(Array.isArray(d)?d:[]); } catch(e){} };
  const fetchArchivedGallery = async () => { try { const r=await authFetch(`${API}/Admin/gallery/archived`); const d=await r.json(); setArchivedGallery(Array.isArray(d)?d:[]); } catch(e){} };
  const fetchArchivedItems = async () => { try { const r=await authFetch(`${API}/Admin/menu-items`); const all=await r.json(); setArchivedItems(all.filter(i=>i.isArchived)); } catch(e){} };

  const archiveGalleryImage = async (id) => { await authFetch(`${API}/Admin/gallery/${id}/archive`,{method:'PUT'}); fetchGallery(); showMsg('✅ Archived!'); };
  const archiveMenuItem = async (id) => { await authFetch(`${API}/Admin/menu-items/${id}/archive`,{method:'PUT'}); fetchMenuItems(); showMsg('✅ Archived!'); };
  const restoreGalleryImage = async (id) => { await authFetch(`${API}/Admin/gallery/${id}/archive`,{method:'PUT'}); fetchArchivedGallery(); showMsg('✅ Restored!'); };
  const restoreMenuItem = async (id) => { await authFetch(`${API}/Admin/menu-items/${id}/archive`,{method:'PUT'}); fetchArchivedItems(); showMsg('✅ Restored!'); };

  const saveCategory = async (e) => {
    e.preventDefault();
    const url = editingCat ? `${API}/Admin/menu-categories/${editingCat.id}` : `${API}/Admin/menu-categories`;
    await authFetch(url, {method:editingCat?'PUT':'POST', body:JSON.stringify(catForm)});
    setShowCatForm(false); setEditingCat(null); setCatForm({name:'',description:'',sortOrder:0});
    fetchCategories(); showMsg('✅ Category saved!');
  };

  const deleteCategory = async (id) => { if(!confirm('Delete category?'))return; await authFetch(`${API}/Admin/menu-categories/${id}`,{method:'DELETE'}); fetchCategories(); showMsg('✅ Deleted!'); };

  const saveItem = async (e) => {
    e.preventDefault();
    const url = editingItem ? `${API}/Admin/menu-items/${editingItem.id}` : `${API}/Admin/menu-items`;
    await authFetch(url, {method:editingItem?'PUT':'POST', body:JSON.stringify({...itemForm,categoryId:parseInt(itemForm.categoryId),price:parseFloat(itemForm.price)})});
    setShowItemForm(false); setEditingItem(null);
    setItemForm({categoryId:'',name:'',subtitle:'',description:'',price:'',imageUrl:'',isSpecial:false,isAvailable:true,sortOrder:0});
    fetchMenuItems(); showMsg('✅ Item saved!');
  };

  const deleteItem = async (id) => { if(!confirm('Delete item?'))return; await authFetch(`${API}/Admin/menu-items/${id}`,{method:'DELETE'}); fetchMenuItems(); showMsg('✅ Deleted!'); };
  const updateOrderStatus = async (id, status) => { await authFetch(`${API}/Admin/orders/${id}/status`,{method:'PUT',body:JSON.stringify({status})}); fetchOrders(); };
  const updateReservationStatus = async (id, status) => { await authFetch(`${API}/Admin/reservations/${id}/status`,{method:'PUT',body:JSON.stringify({status})}); fetchReservations(); };

  const saveReview = async (e) => {
    e.preventDefault();
    await authFetch(`${API}/Admin/reviews`,{method:'POST',body:JSON.stringify(reviewForm)});
    setShowReviewForm(false); setReviewForm({customerName:'',rating:5,content:'',source:'Google'});
    fetchReviews(); showMsg('✅ Review added!');
  };

  const toggleApprove = async (id) => { await authFetch(`${API}/Admin/reviews/${id}/approve`,{method:'PUT'}); fetchReviews(); };
  const deleteReview = async (id) => { if(!confirm('Delete?'))return; await authFetch(`${API}/Admin/reviews/${id}`,{method:'DELETE'}); fetchReviews(); };
  const addGalleryImage = async (url) => { await authFetch(`${API}/Admin/gallery`,{method:'POST',body:JSON.stringify({imageUrl:url,caption:'',sortOrder:0})}); fetchGallery(); showMsg('✅ Image added!'); };
  const deleteGalleryImage = async (id) => { if(!confirm('Delete?'))return; await authFetch(`${API}/Admin/gallery/${id}`,{method:'DELETE'}); fetchGallery(); };

  const saveInfo = async (e) => {
    e.preventDefault(); setSavingInfo(true);
    try {
      const payload = {...infoForm, openingHours:JSON.stringify(infoForm.openingHoursObj)};
      delete payload.openingHoursObj;
      const res = await authFetch(`${API}/Admin/restaurant`,{method:'PUT',body:JSON.stringify(payload)});
      if(!res.ok) throw new Error('Failed');
      showMsg('✅ Saved!'); setEditingInfo(false);
      const d = await (await authFetch(`${API}/Admin/restaurant`)).json();
      setRestaurant(d);
    } catch(e) { showMsg('❌ '+e.message); }
    finally { setSavingInfo(false); }
  };

  const saveAbout = async (e) => {
    e.preventDefault(); setSavingAbout(true);
    try {
      const res = await authFetch(`${API}/Admin/restaurant`,{method:'PUT',body:JSON.stringify(aboutForm)});
      if(!res.ok) throw new Error('Failed');
      showMsg('✅ About Us saved!'); setEditingAbout(false);
      const d = await (await authFetch(`${API}/Admin/restaurant`)).json();
      setRestaurant(d);
      setAboutForm({aboutText:d.aboutText||'',aboutShort:d.aboutShort||'',aboutImageUrl:d.aboutImageUrl||''});
    } catch(e) { showMsg('❌ '+e.message); }
    finally { setSavingAbout(false); }
  };

  const toggleMenuItemAvailability = async (id, isAvailable) => {
    try { await authFetch(`${API}/Admin/menu-items/${id}`,{method:'PUT',body:JSON.stringify({isAvailable:!isAvailable})}); fetchMenuItems(); showMsg(`✅ ${!isAvailable?'Available':'Unavailable'}`); }
    catch(e) { showMsg('❌ Failed to update'); }
  };

  const toggleMenuItemSpecial = async (id, isSpecial) => {
    try { await authFetch(`${API}/Admin/menu-items/${id}`,{method:'PUT',body:JSON.stringify({isSpecial:!isSpecial})}); fetchMenuItems(); showMsg(`✅ ${!isSpecial?'Marked as Special':'Unmarked as Special'}`); }
    catch(e) { showMsg('❌ Failed to update'); }
  };

  const saveAward = async (e) => {
    e.preventDefault();
    const url = editingAward ? `${API}/Admin/awards/${editingAward.id}` : `${API}/Admin/awards`;
    await authFetch(url, {method:editingAward?'PUT':'POST', body:JSON.stringify(awardForm)});
    setShowAwardForm(false); setEditingAward(null);
    setAwardForm({icon:'🏆',title:'',organization:'',year:'',description:'',sortOrder:0});
    fetchAwards(); showMsg('✅ Award saved!');
  };

  const deleteAward = async (awardId) => {
    if(!window.confirm('Delete award?')) return;
    await authFetch(`${API}/Admin/awards/${awardId}`,{method:'DELETE'});
    fetchAwards(); showMsg('✅ Deleted!');
  };

  const saveWhyChooseUs = async (e) => {
    e.preventDefault();
    const url = editingWhyChooseUs ? `${API}/Admin/why-choose-us/${editingWhyChooseUs.id}` : `${API}/Admin/why-choose-us`;
    await authFetch(url, {method:editingWhyChooseUs?'PUT':'POST', body:JSON.stringify(whyChooseUsForm)});
    setShowWhyChooseUsForm(false); setEditingWhyChooseUs(null);
    setWhyChooseUsForm({icon:'',title:'',description:'',sortOrder:0});
    fetchWhyChooseUs(); showMsg('✅ Why Choose Us item saved!');
  };

  const deleteWhyChooseUs = async (id) => { if(!confirm('Delete item?'))return; await authFetch(`${API}/Admin/why-choose-us/${id}`,{method:'DELETE'}); fetchWhyChooseUs(); showMsg('✅ Deleted!'); };
  const archiveWhyChooseUs = async (id) => { await authFetch(`${API}/Admin/why-choose-us/${id}/archive`,{method:'PUT'}); fetchWhyChooseUs(); showMsg('✅ Archived!'); };

  return (
    <div style={S.page}>
      <div style={S.sidebar}>
        <div style={S.sidebarTop}>
          {restaurant?.logoUrl ? (
            <img src={restaurant.logoUrl} alt="" style={{height:'36px',objectFit:'contain',marginBottom:'10px'}} />
          ) : (
            <div style={{width:'36px',height:'36px',borderRadius:'8px',backgroundColor:accent,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#000',fontSize:'16px',marginBottom:'10px'}}>
              {restaurant?.name?.[0]}
            </div>
          )}
          <div style={S.sidebarName}>{restaurant?.name}</div>
          <div style={S.sidebarRole}>Admin Panel</div>
        </div>

        <div style={S.nav}>
          {navSections.map(section => (
            <div key={section.label}>
              <div style={S.navSection}>{section.label}</div>
              {section.tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={S.navBtn(activeTab===tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={S.sidebarBottom}>
          <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" style={{display:'block',padding:'10px 14px',textAlign:'center',fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.4)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',textDecoration:'none',marginBottom:'8px'}}>
            View Site ↗
          </a>
          <button onClick={() => { localStorage.clear(); navigate(`/${slug}/admin`); }} style={{width:'100%',padding:'10px 14px',backgroundColor:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'8px',fontWeight:600,fontSize:'12px',cursor:'pointer',letterSpacing:'0.05em'}}>
            Logout
          </button>
        </div>
      </div>

      <div style={S.main}>
        {msg && <div style={S.msg(msg.includes('✅'))}>{msg}</div>}

        {activeTab==='dashboard' && (
          <div>
            <h1 style={S.pageTitle}>Dashboard</h1>
            <div style={S.statsGrid}>
              <div style={S.statCard}><div style={S.statValue}>{stats.totalOrders}</div><div style={S.statLabel}>Total Orders</div></div>
              <div style={S.statCard}><div style={S.statValue}>{stats.pendingOrders}</div><div style={S.statLabel}>Pending Orders</div></div>
              <div style={S.statCard}><div style={S.statValue}>{stats.todayReservations}</div><div style={S.statLabel}>Today's Reservations</div></div>
              <div style={S.statCard}><div style={S.statValue}>{stats.totalReviews}</div><div style={S.statLabel}>Total Reviews</div></div>
            </div>
            <div style={{...S.card,marginBottom:'32px'}}>
              <h2 style={{...S.pageTitle,fontSize:'1.5rem',marginBottom:'16px'}}>Recent Orders</h2>
              <div style={S.tableContainer}>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>#</th><th style={S.th}>Customer</th><th style={S.th}>Phone</th><th style={S.th}>Items Ordered</th><th style={S.th}>Total</th><th style={S.th}>Date</th><th style={S.th}>Status</th></tr></thead>
                  <tbody>
                    {orders.slice(0,5).map(order => (
                      <tr key={order.id} style={{...S.tr,cursor:'pointer'}} onClick={()=>setSelectedOrder(order)} onMouseEnter={e=>e.target.closest('tr').style.backgroundColor=S.trHover.backgroundColor} onMouseLeave={e=>e.target.closest('tr').style.backgroundColor='transparent'}>
                        <td style={S.td}>#{order.id}</td><td style={S.td}>{order.customerName}</td><td style={S.td}>{order.customerPhone}</td>
                        <td style={S.td}>{(()=>{try{const i=JSON.parse(order.items);return Array.isArray(i)?i.map(x=>`${x.name} x${x.qty||1}`).join(', '):'1 item';}catch{return order.items||'N/A';}})()}</td>
                        <td style={S.td}>Rs. {parseFloat(order.totalAmount).toFixed(0)}</td><td style={S.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={S.td}><span style={S.badge(...(STATUS_BADGE[order.status]||['#fff','rgba(255,255,255,0.1)']))}>{order.status}</span></td>
                      </tr>
                    ))}
                    {orders.length===0 && <tr><td colSpan="7" style={{...S.td,textAlign:'center',color:'rgba(255,255,255,0.3)'}}>No orders yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={S.card}>
              <h2 style={{...S.pageTitle,fontSize:'1.5rem',marginBottom:'16px'}}>Recent Reservations</h2>
              <div style={S.tableContainer}>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>#</th><th style={S.th}>Customer</th><th style={S.th}>Phone</th><th style={S.th}>Date</th><th style={S.th}>Time</th><th style={S.th}>Party</th><th style={S.th}>Status</th></tr></thead>
                  <tbody>
                    {reservations.slice(0,5).map(res => (
                      <tr key={res.id} style={S.tr} onMouseEnter={e=>e.target.closest('tr').style.backgroundColor=S.trHover.backgroundColor} onMouseLeave={e=>e.target.closest('tr').style.backgroundColor='transparent'}>
                        <td style={S.td}>#{res.id}</td><td style={S.td}>{res.customerName}</td><td style={S.td}>{res.customerPhone}</td>
                        <td style={S.td}>{res.date}</td><td style={S.td}>{res.time}</td><td style={S.td}>{res.partySize} people</td>
                        <td style={S.td}><span style={S.badge(...(STATUS_BADGE[res.status]||['#fff','rgba(255,255,255,0.1)']))}>{res.status}</span></td>
                      </tr>
                    ))}
                    {reservations.length===0 && <tr><td colSpan="7" style={{...S.td,textAlign:'center',color:'rgba(255,255,255,0.3)'}}>No reservations yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab==='orders' && (
          <div>
            <h1 style={S.pageTitle}>Orders</h1>
            <div style={S.tabs}>
              {['all','Pending','Confirmed','Completed','Cancelled'].map(s => (
                <button key={s} onClick={()=>setOrderStatusFilter(s)} style={S.tab(orderStatusFilter===s,accent)}>{s==='all'?'All':s}</button>
              ))}
            </div>
            <div style={S.tableContainer}>
              <table style={S.table}>
                <thead><tr><th style={S.th}>#</th><th style={S.th}>Customer</th><th style={S.th}>Phone</th><th style={S.th} style={{minWidth:'200px'}}>Items Ordered</th><th style={S.th}>Total</th><th style={S.th}>Date</th><th style={S.th}>Status</th><th style={S.th}>Actions</th></tr></thead>
                <tbody>
                  {orders.filter(o=>orderStatusFilter==='all'||o.status===orderStatusFilter).map(order => (
                    <tr key={order.id} style={{...S.tr,cursor:'pointer'}} onClick={()=>setSelectedOrder(order)} onMouseEnter={e=>e.target.closest('tr').style.backgroundColor=S.trHover.backgroundColor} onMouseLeave={e=>e.target.closest('tr').style.backgroundColor='transparent'}>
                      <td style={S.td}>#{order.id}</td><td style={S.td}>{order.customerName}</td><td style={S.td}>{order.customerPhone}</td>
                      <td style={S.td}><div style={{fontSize:'12px',lineHeight:1.7}}>{(()=>{try{const i=JSON.parse(order.items);return Array.isArray(i)?i.map((x,idx)=><div key={idx} style={{color:'rgba(255,255,255,0.85)'}}>{x.name} <span style={{color:'rgba(255,255,255,0.4)'}}>x{x.qty||1}</span> <span style={{color:'#C9A84C',fontWeight:600}}>Rs.{(parseFloat(x.price||0)*(x.qty||1)).toFixed(0)}</span></div>):'1 item';}catch{return <span>{order.items||'N/A'}</span>;}})()}</div></td>
                      <td style={S.td} style={{fontWeight:700,color:'#C9A84C'}}>Rs. {parseFloat(order.totalAmount).toFixed(0)}</td><td style={S.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={S.td}><span style={S.badge(...(STATUS_BADGE[order.status]||['#fff','rgba(255,255,255,0.1)']))}>{order.status}</span></td>
                      <td style={S.td}>
                        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                          {['Pending','Confirmed','Completed','Cancelled'].map(s => (
                            <button key={s} onClick={()=>updateOrderStatus(order.id,s)} style={{padding:'4px 8px',borderRadius:'4px',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:600,backgroundColor:order.status===s?accent:'rgba(255,255,255,0.05)',color:order.status===s?'#000':'rgba(255,255,255,0.5)',transition:'all 0.2s'}}>{s}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.filter(o=>orderStatusFilter==='all'||o.status===orderStatusFilter).length===0 && <tr><td colSpan="8" style={{...S.td,textAlign:'center',color:'rgba(255,255,255,0.3)'}}>No orders found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==='reservations' && (
          <div>
            <h1 style={S.pageTitle}>Reservations</h1>
            <div style={S.tabs}>
              {['all','Pending','Confirmed','Cancelled'].map(s => (
                <button key={s} onClick={()=>setReservationStatusFilter(s)} style={S.tab(reservationStatusFilter===s,accent)}>{s==='all'?'All':s}</button>
              ))}
            </div>
            <div style={S.tableContainer}>
              <table style={S.table}>
                <thead><tr><th style={S.th}>#</th><th style={S.th}>Customer</th><th style={S.th}>Phone</th><th style={S.th}>Email</th><th style={S.th}>Date</th><th style={S.th}>Time</th><th style={S.th}>Party</th><th style={S.th}>Status</th><th style={S.th}>Actions</th></tr></thead>
                <tbody>
                  {reservations.filter(r=>reservationStatusFilter==='all'||r.status===reservationStatusFilter).map(res => (
                    <tr key={res.id} style={S.tr} onMouseEnter={e=>e.target.closest('tr').style.backgroundColor=S.trHover.backgroundColor} onMouseLeave={e=>e.target.closest('tr').style.backgroundColor='transparent'}>
                      <td style={S.td}>#{res.id}</td><td style={S.td}>{res.customerName}</td><td style={S.td}>{res.customerPhone}</td><td style={S.td}>{res.customerEmail}</td>
                      <td style={S.td}>{res.date}</td><td style={S.td}>{res.time}</td><td style={S.td}>{res.partySize} people</td>
                      <td style={S.td}><span style={S.badge(...(STATUS_BADGE[res.status]||['#fff','rgba(255,255,255,0.1)']))}>{res.status}</span></td>
                      <td style={S.td}>
                        <div style={{display:'flex',gap:'8px'}}>
                          {['Pending','Confirmed','Cancelled'].map(s => (
                            <button key={s} onClick={()=>updateReservationStatus(res.id,s)} style={{padding:'4px 8px',borderRadius:'4px',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:600,backgroundColor:res.status===s?accent:'rgba(255,255,255,0.05)',color:res.status===s?'#000':'rgba(255,255,255,0.5)'}}>{s}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reservations.filter(r=>reservationStatusFilter==='all'||r.status===reservationStatusFilter).length===0 && <tr><td colSpan="9" style={{...S.td,textAlign:'center',color:'rgba(255,255,255,0.3)'}}>No reservations found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==='menu' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h1 style={S.pageTitle}>Menu Management</h1>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>{setShowCatForm(!showCatForm);setEditingCat(null);setCatForm({name:'',description:'',sortOrder:0});}} style={S.btnOutline}>{showCatForm?'Cancel':'+ Category'}</button>
                <button onClick={()=>{setShowItemForm(!showItemForm);setEditingItem(null);setItemForm({categoryId:categories[0]?.id||'',name:'',subtitle:'',description:'',price:'',imageUrl:'',isSpecial:false,isAvailable:true,sortOrder:0});}} style={S.btnPrimary(accent)}>{showItemForm?'Cancel':'+ Menu Item'}</button>
              </div>
            </div>

            {showCatForm && (
              <div style={{...S.card,marginBottom:'16px'}}>
                <p style={{fontWeight:700,color:'#fff',fontSize:'14px',marginBottom:'16px'}}>{editingCat?'Edit Category':'New Category'}</p>
                <form onSubmit={saveCategory}>
                  <div style={S.grid2}>
                    <div><label style={S.label}>Name *</label><input value={catForm.name} onChange={e=>setCatForm({...catForm,name:e.target.value})} required style={S.input} /></div>
                    <div><label style={S.label}>Description</label><input value={catForm.description} onChange={e=>setCatForm({...catForm,description:e.target.value})} style={S.input} /></div>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                    <button type="submit" style={S.btnPrimary(accent)}>Save</button>
                    <button type="button" onClick={()=>{setShowCatForm(false);setEditingCat(null);}} style={S.btnOutline}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {showItemForm && (
              <div style={{...S.card,marginBottom:'16px'}}>
                <p style={{fontWeight:700,color:'#fff',fontSize:'14px',marginBottom:'16px'}}>{editingItem?'Edit Menu Item':'New Menu Item'}</p>
                <form onSubmit={saveItem}>
                  <div style={S.grid2}>
                    <div><label style={S.label}>Category *</label><select value={itemForm.categoryId} onChange={e=>setItemForm({...itemForm,categoryId:e.target.value})} required style={S.select}><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label style={S.label}>Name *</label><input value={itemForm.name} onChange={e=>setItemForm({...itemForm,name:e.target.value})} required style={S.input} /></div>
                    <div><label style={S.label}>Subtitle</label><input value={itemForm.subtitle} onChange={e=>setItemForm({...itemForm,subtitle:e.target.value})} style={S.input} /></div>
                    <div><label style={S.label}>Price * ($)</label><input type="number" step="0.01" min="0" value={itemForm.price} onChange={e=>setItemForm({...itemForm,price:e.target.value})} required style={S.input} placeholder="0.00" /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Description</label><textarea value={itemForm.description} onChange={e=>setItemForm({...itemForm,description:e.target.value})} rows={3} style={S.textarea} /></div>
                    <div style={{gridColumn:'1/-1'}}>
                      <label style={S.label}>Image</label>
                      <div style={{display:'flex',gap:'8px'}}>
                        <input value={itemForm.imageUrl} onChange={e=>setItemForm({...itemForm,imageUrl:e.target.value})} placeholder="Paste URL..." style={{...S.input,flex:1}} />
                        <label style={S.uploadBtn}>📁 Upload<input type="file" accept="image/*" style={{display:'none'}} onChange={async e=>{const file=e.target.files[0];if(!file)return;try{const url=await uploadFile(file,slug,'menu');setItemForm(f=>({...f,imageUrl:url}));}catch(err){alert('Upload failed: '+err.message);}}} /></label>
                        <button type="button" onClick={()=>setFilePicker({onSelect:(url)=>setItemForm(f=>({...f,imageUrl:url}))})} style={{...S.uploadBtn,backgroundColor:'rgba(255,255,255,0.05)'}}>📂 Files</button>
                      </div>
                      {itemForm.imageUrl && <img src={itemForm.imageUrl} alt="" style={{marginTop:'8px',height:'60px',borderRadius:'6px',objectFit:'cover'}} />}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'24px'}}>
                      <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'13px',color:'rgba(255,255,255,0.6)'}}><input type="checkbox" checked={itemForm.isSpecial} onChange={e=>setItemForm({...itemForm,isSpecial:e.target.checked})} />Mark as Special</label>
                      <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'13px',color:'rgba(255,255,255,0.6)'}}><input type="checkbox" checked={itemForm.isAvailable} onChange={e=>setItemForm({...itemForm,isAvailable:e.target.checked})} />Available</label>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                    <button type="submit" style={S.btnPrimary(accent)}>Save Item</button>
                    <button type="button" onClick={()=>{setShowItemForm(false);setEditingItem(null);}} style={S.btnOutline}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div style={{...S.card,marginBottom:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <h2 style={{fontSize:'1.25rem',fontWeight:700,color:'#fff'}}>Menu Items</h2>
                <div style={{display:'flex',gap:'16px'}}>
                  <input type="text" placeholder="Search items..." value={menuSearch} onChange={e=>setMenuSearch(e.target.value)} style={{...S.input,width:'200px'}} />
                  <select value={menuCategoryFilter} onChange={e=>setMenuCategoryFilter(e.target.value)} style={{...S.select,width:'150px'}}>
                    <option value="all">All Categories</option>
                    {categories.map(cat=><option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={S.menuTableContainer}>
                <table style={S.menuTable}>
                  <thead><tr><th style={S.menuTh}>Image</th><th style={S.menuTh}>Category</th><th style={S.menuTh}>Name</th><th style={S.menuTh}>Price</th><th style={S.menuTh}>Special</th><th style={S.menuTh}>Available</th><th style={S.menuTh}>Actions</th></tr></thead>
                  <tbody>
                    {menuItems.filter(item=>(menuCategoryFilter==='all'||item.categoryId==menuCategoryFilter)&&(item.name.toLowerCase().includes(menuSearch.toLowerCase())||item.description.toLowerCase().includes(menuSearch.toLowerCase()))).map(item=>{
                      const category=categories.find(c=>c.id==item.categoryId);
                      return (
                        <tr key={item.id} style={S.menuTr} onMouseEnter={e=>e.target.closest('tr').style.backgroundColor=S.menuTrHover.backgroundColor} onMouseLeave={e=>e.target.closest('tr').style.backgroundColor='transparent'}>
                          <td style={S.menuTd}>{item.imageUrl?<img src={item.imageUrl} alt={item.name} style={S.menuImage}/>:<div style={{width:'40px',height:'40px',borderRadius:'6px',backgroundColor:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>🍽️</div>}</td>
                          <td style={S.menuTd}>{category?.name||'Uncategorized'}</td>
                          <td style={S.menuTd}>{item.name}</td>
                          <td style={S.menuTd}>Rs. {parseFloat(item.price).toFixed(0)}</td>
                          <td style={S.menuTd}><button onClick={()=>toggleMenuItemSpecial(item.id,item.isSpecial)} style={{...S.toggleButton,...(item.isSpecial?S.toggleOn:S.toggleOff)}}>{item.isSpecial?'Yes':'No'}</button></td>
                          <td style={S.menuTd}><button onClick={()=>toggleMenuItemAvailability(item.id,item.isAvailable)} style={{...S.toggleButton,...(item.isAvailable?S.toggleOn:S.toggleOff)}}>{item.isAvailable?'Yes':'No'}</button></td>
                          <td style={S.menuTd}>
                            <div style={{display:'flex',gap:'8px'}}>
                              <button onClick={()=>{setEditingItem(item);setItemForm({categoryId:item.categoryId,name:item.name,subtitle:item.subtitle||'',description:item.description||'',price:item.price,imageUrl:item.imageUrl||'',isSpecial:item.isSpecial,isAvailable:item.isAvailable,sortOrder:item.sortOrder});setShowItemForm(true);window.scrollTo({top:0,behavior:'smooth'});}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',fontSize:'12px',padding:'4px 8px'}}>✏️</button>
                              <button onClick={()=>archiveMenuItem(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(251,191,36,0.6)',fontSize:'12px',padding:'4px 8px'}} title="Archive">🗄️</button>
                              <button onClick={()=>deleteItem(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(239,68,68,0.4)',fontSize:'12px',padding:'4px 8px'}}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {menuItems.filter(item=>(menuCategoryFilter==='all'||item.categoryId==menuCategoryFilter)&&(item.name.toLowerCase().includes(menuSearch.toLowerCase())||item.description.toLowerCase().includes(menuSearch.toLowerCase()))).length===0&&<tr><td colSpan="7" style={{...S.menuTd,textAlign:'center',color:'rgba(255,255,255,0.3)'}}>No menu items found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {categories.length>0&&(
              <div style={{marginBottom:'24px'}}>
                <p style={{...S.label,marginBottom:'12px'}}>Categories</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {categories.map(cat=>(
                    <div key={cat.id} style={{display:'flex',alignItems:'center',gap:'10px',backgroundColor:'#111',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'8px',padding:'8px 14px'}}>
                      <span style={{color:'#fff',fontSize:'13px',fontWeight:500}}>{cat.name}</span>
                      <span style={{color:'rgba(255,255,255,0.25)',fontSize:'11px'}}>({menuItems.filter(i=>i.categoryId===cat.id).length})</span>
                      <button onClick={()=>{setEditingCat(cat);setCatForm({name:cat.name,description:cat.description||'',sortOrder:cat.sortOrder});setShowCatForm(true);}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',fontSize:'12px',padding:'0 4px'}}>✏️</button>
                      <button onClick={()=>deleteCategory(cat.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(239,68,68,0.5)',fontSize:'12px',padding:'0 4px'}}>🗑</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {menuItems.length===0&&categories.length>0&&<div style={S.empty}><p>No menu items yet — click "+ Menu Item" to add</p></div>}
            {categories.length===0&&<div style={S.empty}><p style={{fontSize:'40px',marginBottom:'12px'}}>🍽️</p><p>Create a category first, then add menu items</p></div>}
          </div>
        )}

        {activeTab==='reviews' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h1 style={S.pageTitle}>Reviews</h1>
              <button onClick={()=>setShowReviewForm(!showReviewForm)} style={S.btnPrimary(accent)}>{showReviewForm?'Cancel':'+ Add Review'}</button>
            </div>
            {showReviewForm&&(
              <div style={{...S.card,marginBottom:'16px'}}>
                <form onSubmit={saveReview}>
                  <div style={S.grid2}>
                    <div><label style={S.label}>Customer Name *</label><input value={reviewForm.customerName} onChange={e=>setReviewForm({...reviewForm,customerName:e.target.value})} required style={S.input} /></div>
                    <div><label style={S.label}>Source</label><input value={reviewForm.source} onChange={e=>setReviewForm({...reviewForm,source:e.target.value})} placeholder="Google, Yelp..." style={S.input} /></div>
                    <div><label style={S.label}>Rating</label><div style={{display:'flex',gap:'6px'}}>{[1,2,3,4,5].map(i=><button key={i} type="button" onClick={()=>setReviewForm({...reviewForm,rating:i})} style={{background:'none',border:'none',cursor:'pointer',fontSize:'28px',color:i<=reviewForm.rating?'#FBBF24':'rgba(255,255,255,0.15)'}}>★</button>)}</div></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Review *</label><textarea value={reviewForm.content} onChange={e=>setReviewForm({...reviewForm,content:e.target.value})} required rows={3} style={S.textarea} /></div>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                    <button type="submit" style={S.btnPrimary(accent)}>Add Review</button>
                    <button type="button" onClick={()=>setShowReviewForm(false)} style={S.btnOutline}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {reviews.length===0?<div style={S.empty}><p style={{fontSize:'40px',marginBottom:'12px'}}>⭐</p><p>No reviews yet</p></div>:reviews.map(review=>(
              <div key={review.id} style={{...S.card,borderColor:review.isApproved?'rgba(74,222,128,0.2)':'rgba(255,255,255,0.06)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px'}}>
                      <p style={{fontWeight:700,color:'#fff',fontSize:'14px'}}>{review.customerName}</p>
                      {review.source&&<span style={{fontSize:'11px',color:'rgba(255,255,255,0.3)'}}>via {review.source}</span>}
                      <span style={{marginLeft:'auto',...S.badge(review.isApproved?'#4ade80':'#fbbf24',review.isApproved?'rgba(74,222,128,0.15)':'rgba(251,191,36,0.15)')}}>{review.isApproved?'Published':'Pending'}</span>
                    </div>
                    <div style={{display:'flex',gap:'2px',marginBottom:'8px'}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=review.rating?'#FBBF24':'rgba(255,255,255,0.15)',fontSize:'14px'}}>★</span>)}</div>
                    <p style={{color:'rgba(255,255,255,0.6)',fontSize:'13px',lineHeight:1.6}}>{review.content}</p>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginLeft:'16px'}}>
                    <button onClick={()=>toggleApprove(review.id)} style={review.isApproved?S.btnDanger:S.btnSuccess}>{review.isApproved?'Unpublish':'Publish'}</button>
                    <button onClick={()=>deleteReview(review.id)} style={S.btnDanger}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab==='gallery' && (
          <div>
            <h1 style={S.pageTitle}>Gallery</h1>
            <div style={{...S.card,marginBottom:'24px'}}>
              <div style={{display:'flex',gap:'10px'}}>
                <input type="text" id="gallery-url" placeholder="Paste image URL..." style={{...S.input,flex:1}} />
                <button onClick={()=>{const inp=document.getElementById('gallery-url');if(inp.value){addGalleryImage(inp.value);inp.value='';}}} style={S.btnPrimary(accent)}>Add URL</button>
                <button onClick={()=>setFilePicker({onSelect:(url)=>addGalleryImage(url)})} style={{...S.uploadBtn,backgroundColor:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.7)'}}>📁 From Files</button>
                <label style={S.uploadBtn}>📁 Upload Image<input type="file" accept="image/*" style={{display:'none'}} onChange={async e=>{const file=e.target.files[0];if(!file)return;try{const url=await uploadFile(file,slug,'gallery');await addGalleryImage(url);}catch(err){alert('Upload failed: '+err.message);}}} /></label>
              </div>
            </div>
            {gallery.length===0?<div style={S.empty}><p style={{fontSize:'40px',marginBottom:'12px'}}>🖼️</p><p>No gallery images yet</p></div>:(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',gap:'12px'}}>
                {gallery.map(img=>(
                  <div key={img.id} style={{position:'relative',borderRadius:'10px',overflow:'hidden',aspectRatio:'1'}}>
                    <img src={img.imageUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    <div style={{position:'absolute',inset:0,backgroundColor:'rgba(0,0,0,0)',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',transition:'background 0.3s'}} onMouseEnter={e=>{e.currentTarget.style.backgroundColor='rgba(0,0,0,0.6)';e.currentTarget.querySelectorAll('button').forEach(b=>b.style.opacity='1');}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor='rgba(0,0,0,0)';e.currentTarget.querySelectorAll('button').forEach(b=>b.style.opacity='0');}}>
                      <button onClick={()=>archiveGalleryImage(img.id)} style={{opacity:0,padding:'7px 12px',backgroundColor:'#f59e0b',color:'#000',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'11px',fontWeight:700,transition:'opacity 0.3s'}}>Archive</button>
                      <button onClick={()=>deleteGalleryImage(img.id)} style={{opacity:0,padding:'7px 12px',backgroundColor:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'11px',fontWeight:700,transition:'opacity 0.3s'}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab==='about-us' && aboutForm && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h1 style={S.pageTitle}>About Us</h1>
              {!editingAbout&&<button onClick={()=>setEditingAbout(true)} style={S.btnPrimary(accent)}>Edit</button>}
            </div>
            {editingAbout?(
              <form onSubmit={saveAbout}>
                <div style={{...S.card,marginBottom:'16px'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <div><label style={S.label}>Short Description</label><input value={aboutForm.aboutShort} onChange={e=>setAboutForm({...aboutForm,aboutShort:e.target.value})} placeholder="A brief one-liner..." style={S.input} /></div>
                    <div><label style={S.label}>Full About Text</label><textarea value={aboutForm.aboutText} onChange={e=>setAboutForm({...aboutForm,aboutText:e.target.value})} rows={6} placeholder="Tell your restaurant's full story..." style={{...S.textarea,minHeight:'140px'}} /></div>
                    <div>
                      <label style={S.label}>About Image</label>
                      <div style={{display:'flex',gap:'8px'}}>
                        <input value={aboutForm.aboutImageUrl} onChange={e=>setAboutForm({...aboutForm,aboutImageUrl:e.target.value})} placeholder="Paste image URL..." style={{...S.input,flex:1}} />
                        <label style={S.uploadBtn}>📁 Upload<input type="file" accept="image/*" style={{display:'none'}} onChange={async e=>{const file=e.target.files[0];if(!file)return;try{const url=await uploadFile(file,slug,'about');setAboutForm(f=>({...f,aboutImageUrl:url}));}catch(err){alert('Upload failed: '+err.message);}}} /></label>
                        <button type="button" onClick={()=>setFilePicker({onSelect:(url)=>setAboutForm(f=>({...f,aboutImageUrl:url}))})} style={{...S.uploadBtn,backgroundColor:'rgba(255,255,255,0.05)'}}>📂 Files</button>
                      </div>
                      {aboutForm.aboutImageUrl&&<img src={aboutForm.aboutImageUrl} alt="" style={{marginTop:'10px',height:'120px',borderRadius:'8px',objectFit:'cover'}} />}
                    </div>
                  </div>
                </div>
                <div style={{display:'flex',gap:'10px'}}>
                  <button type="submit" disabled={savingAbout} style={{...S.btnPrimary(accent),opacity:savingAbout?0.5:1}}>{savingAbout?'Saving...':'Save Changes'}</button>
                  <button type="button" onClick={()=>setEditingAbout(false)} style={S.btnOutline}>Cancel</button>
                </div>
              </form>
            ):(
              <div style={S.card}>
                <div style={{borderBottom:'1px solid rgba(255,255,255,0.05)',paddingBottom:'14px',marginBottom:'14px'}}><p style={{...S.label,marginBottom:'4px'}}>Short Description</p><p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>{aboutForm.aboutShort||'Not set'}</p></div>
                <div style={{borderBottom:'1px solid rgba(255,255,255,0.05)',paddingBottom:'14px',marginBottom:'14px'}}><p style={{...S.label,marginBottom:'4px'}}>Full About Text</p><p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{aboutForm.aboutText||'Not set'}</p></div>
                <div><p style={{...S.label,marginBottom:'8px'}}>About Image</p>{aboutForm.aboutImageUrl?<img src={aboutForm.aboutImageUrl} alt="" style={{height:'140px',borderRadius:'8px',objectFit:'cover'}} />:<p style={{color:'rgba(255,255,255,0.3)',fontSize:'14px'}}>Not set</p>}</div>
              </div>
            )}
          </div>
        )}

        {activeTab==='why-choose-us' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h1 style={S.pageTitle}>Why Choose Us</h1>
              <button onClick={()=>{setShowWhyChooseUsForm(!showWhyChooseUsForm);setEditingWhyChooseUs(null);setWhyChooseUsForm({icon:'',title:'',description:'',sortOrder:0});}} style={S.btnPrimary(accent)}>{showWhyChooseUsForm?'Cancel':'+ Add Item'}</button>
            </div>
            {showWhyChooseUsForm&&(
              <div style={{...S.card,marginBottom:'16px'}}>
                <p style={{fontWeight:700,color:'#fff',fontSize:'14px',marginBottom:'16px'}}>{editingWhyChooseUs?'Edit Item':'New Item'}</p>
                <form onSubmit={saveWhyChooseUs}>
                  <div style={S.grid2}>
                    <div><label style={S.label}>Icon (emoji)</label><input value={whyChooseUsForm.icon} onChange={e=>setWhyChooseUsForm({...whyChooseUsForm,icon:e.target.value})} placeholder="🍽️ 🌱 👨‍🍳" style={S.input} /></div>
                    <div><label style={S.label}>Sort Order</label><input type="number" value={whyChooseUsForm.sortOrder} onChange={e=>setWhyChooseUsForm({...whyChooseUsForm,sortOrder:parseInt(e.target.value)||0})} style={S.input} /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Title *</label><input value={whyChooseUsForm.title} onChange={e=>setWhyChooseUsForm({...whyChooseUsForm,title:e.target.value})} required style={S.input} /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Description *</label><textarea value={whyChooseUsForm.description} onChange={e=>setWhyChooseUsForm({...whyChooseUsForm,description:e.target.value})} required rows={3} style={S.textarea} /></div>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                    <button type="submit" style={S.btnPrimary(accent)}>Save Item</button>
                    <button type="button" onClick={()=>{setShowWhyChooseUsForm(false);setEditingWhyChooseUs(null);}} style={S.btnOutline}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {whyChooseUs.length===0?<div style={S.empty}><p style={{fontSize:'40px',marginBottom:'12px'}}>🌟</p><p>No items yet — click "+ Add Item" to add</p></div>:(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:'20px'}}>
                {whyChooseUs.map(item=>(
                  <div key={item.id} style={{...S.card,display:'flex',gap:'16px'}}>
                    <div style={{fontSize:'2rem'}}>{item.icon||'🌟'}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                        <h3 style={{fontWeight:700,color:'#fff',fontSize:'16px'}}>{item.title}</h3>
                        <div style={{display:'flex',gap:'8px'}}>
                          <button onClick={()=>{setEditingWhyChooseUs(item);setWhyChooseUsForm({icon:item.icon,title:item.title,description:item.description,sortOrder:item.sortOrder});setShowWhyChooseUsForm(true);}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',fontSize:'12px',padding:'4px 8px'}}>✏️</button>
                          <button onClick={()=>deleteWhyChooseUs(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(239,68,68,0.4)',fontSize:'12px',padding:'4px 8px'}}>🗑</button>
                        </div>
                      </div>
                      <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',lineHeight:1.5}}>{item.description}</p>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'12px'}}>
                        <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>Order: {item.sortOrder}</span>
                        <button onClick={()=>archiveWhyChooseUs(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(251,191,36,0.6)',fontSize:'12px',padding:'4px 8px'}}>Archive</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab==='awards' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h1 style={S.pageTitle}>Awards & Recognition</h1>
              <button onClick={()=>{setShowAwardForm(!showAwardForm);setEditingAward(null);setAwardForm({icon:'🏆',title:'',organization:'',year:'',description:'',sortOrder:0});}} style={S.btnPrimary(accent)}>{showAwardForm?'Cancel':'+ Add Award'}</button>
            </div>
            {showAwardForm&&(
              <div style={{...S.card,marginBottom:'16px'}}>
                <p style={{fontWeight:700,color:'#fff',fontSize:'14px',marginBottom:'16px'}}>{editingAward?'Edit Award':'New Award'}</p>
                <form onSubmit={saveAward}>
                  <div style={S.grid2}>
                    <div><label style={S.label}>Icon (emoji)</label><input value={awardForm.icon} onChange={e=>setAwardForm({...awardForm,icon:e.target.value})} placeholder="🏆 🥇 ⭐" style={S.input} /></div>
                    <div><label style={S.label}>Year</label><input value={awardForm.year} onChange={e=>setAwardForm({...awardForm,year:e.target.value})} placeholder="2024" style={S.input} /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Title *</label><input value={awardForm.title} onChange={e=>setAwardForm({...awardForm,title:e.target.value})} required placeholder="Best Restaurant Award" style={S.input} /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Organization</label><input value={awardForm.organization} onChange={e=>setAwardForm({...awardForm,organization:e.target.value})} placeholder="Nepal Restaurant Association" style={S.input} /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Description</label><textarea value={awardForm.description} onChange={e=>setAwardForm({...awardForm,description:e.target.value})} rows={3} placeholder="Brief description of the award..." style={S.textarea} /></div>
                    <div><label style={S.label}>Sort Order</label><input type="number" value={awardForm.sortOrder} onChange={e=>setAwardForm({...awardForm,sortOrder:parseInt(e.target.value)||0})} style={S.input} /></div>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                    <button type="submit" style={S.btnPrimary(accent)}>Save Award</button>
                    <button type="button" onClick={()=>{setShowAwardForm(false);setEditingAward(null);}} style={S.btnOutline}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {awards.length===0?(
              <div style={S.empty}><p style={{fontSize:'40px',marginBottom:'12px'}}>🏆</p><p>No awards yet — click "+ Add Award" to add</p></div>
            ):(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',gap:'20px'}}>
                {awards.map(item=>(
                  <div key={item.id} style={{...S.card,display:'flex',gap:'16px'}}>
                    <div style={{fontSize:'2.5rem',flexShrink:0}}>{item.icon||'🏆'}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                        <h3 style={{fontWeight:700,color:'#fff',fontSize:'15px',lineHeight:1.3}}>{item.title}</h3>
                        <div style={{display:'flex',gap:'6px',marginLeft:'8px',flexShrink:0}}>
                          <button onClick={()=>{setEditingAward(item);setAwardForm({icon:item.icon||'🏆',title:item.title,organization:item.organization||'',year:item.year||'',description:item.description||'',sortOrder:item.sortOrder});setShowAwardForm(true);window.scrollTo({top:0,behavior:'smooth'});}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',fontSize:'13px',padding:'4px 6px'}}>✏️</button>
                          <button onClick={()=>deleteAward(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(239,68,68,0.4)',fontSize:'13px',padding:'4px 6px'}}>🗑</button>
                        </div>
                      </div>
                      {item.organization&&<p style={{color:'rgba(255,255,255,0.5)',fontSize:'12px',marginBottom:'4px'}}>🏛 {item.organization}</p>}
                      {item.year&&<p style={{color:accent,fontSize:'12px',fontWeight:700,marginBottom:'6px'}}>📅 {item.year}</p>}
                      {item.description&&<p style={{color:'rgba(255,255,255,0.65)',fontSize:'13px',lineHeight:1.5}}>{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab==='awards' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h1 style={S.pageTitle}>Awards & Recognition</h1>
              <button onClick={()=>{setShowAwardForm(!showAwardForm);setEditingAward(null);setAwardForm({icon:'🏆',title:'',organization:'',year:'',description:'',sortOrder:0});}} style={S.btnPrimary(accent)}>{showAwardForm?'Cancel':'+ Add Award'}</button>
            </div>
            {showAwardForm&&(
              <div style={{...S.card,marginBottom:'16px'}}>
                <p style={{fontWeight:700,color:'#fff',fontSize:'14px',marginBottom:'16px'}}>{editingAward?'Edit Award':'New Award'}</p>
                <form onSubmit={saveAward}>
                  <div style={S.grid2}>
                    <div><label style={S.label}>Icon (emoji)</label><input value={awardForm.icon} onChange={e=>setAwardForm({...awardForm,icon:e.target.value})} placeholder="🏆 🥇 ⭐" style={S.input} /></div>
                    <div><label style={S.label}>Year</label><input value={awardForm.year} onChange={e=>setAwardForm({...awardForm,year:e.target.value})} placeholder="2024" style={S.input} /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Title *</label><input value={awardForm.title} onChange={e=>setAwardForm({...awardForm,title:e.target.value})} required placeholder="Best Restaurant Award" style={S.input} /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Organization</label><input value={awardForm.organization} onChange={e=>setAwardForm({...awardForm,organization:e.target.value})} placeholder="Nepal Restaurant Association" style={S.input} /></div>
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>Description</label><textarea value={awardForm.description} onChange={e=>setAwardForm({...awardForm,description:e.target.value})} rows={3} placeholder="Brief description of the award..." style={S.textarea} /></div>
                    <div><label style={S.label}>Sort Order</label><input type="number" value={awardForm.sortOrder} onChange={e=>setAwardForm({...awardForm,sortOrder:parseInt(e.target.value)||0})} style={S.input} /></div>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                    <button type="submit" style={S.btnPrimary(accent)}>Save Award</button>
                    <button type="button" onClick={()=>{setShowAwardForm(false);setEditingAward(null);}} style={S.btnOutline}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {awards.length===0?(
              <div style={S.empty}><p style={{fontSize:'40px',marginBottom:'12px'}}>🏆</p><p>No awards yet — click "+ Add Award" to add</p></div>
            ):(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',gap:'20px'}}>
                {awards.map(item=>(
                  <div key={item.id} style={{...S.card,display:'flex',gap:'16px'}}>
                    <div style={{fontSize:'2.5rem',flexShrink:0}}>{item.icon||'🏆'}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                        <h3 style={{fontWeight:700,color:'#fff',fontSize:'15px',lineHeight:1.3}}>{item.title}</h3>
                        <div style={{display:'flex',gap:'6px',marginLeft:'8px',flexShrink:0}}>
                          <button onClick={()=>{setEditingAward(item);setAwardForm({icon:item.icon||'🏆',title:item.title,organization:item.organization||'',year:item.year||'',description:item.description||'',sortOrder:item.sortOrder});setShowAwardForm(true);window.scrollTo({top:0,behavior:'smooth'});}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',fontSize:'13px',padding:'4px 6px'}}>✏️</button>
                          <button onClick={()=>deleteAward(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(239,68,68,0.4)',fontSize:'13px',padding:'4px 6px'}}>🗑</button>
                        </div>
                      </div>
                      {item.organization&&<p style={{color:'rgba(255,255,255,0.5)',fontSize:'12px',marginBottom:'4px'}}>🏛 {item.organization}</p>}
                      {item.year&&<p style={{color:accent,fontSize:'12px',fontWeight:700,marginBottom:'6px'}}>📅 {item.year}</p>}
                      {item.description&&<p style={{color:'rgba(255,255,255,0.65)',fontSize:'13px',lineHeight:1.5}}>{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab==='filemanager' && (
          <div>
            <h1 style={S.pageTitle}>File Manager</h1>
            <div style={{height:'calc(100vh - 160px)'}}><FileManager restaurantSlug={slug} /></div>
          </div>
        )}

        {activeTab==='info' && infoForm && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h1 style={S.pageTitle}>Restaurant Info</h1>
              {!editingInfo&&<button onClick={()=>setEditingInfo(true)} style={S.btnPrimary(accent)}>Edit Info</button>}
            </div>
            {editingInfo?(
              <form onSubmit={saveInfo}>
                <div style={{...S.card,marginBottom:'16px'}}>
                  <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'20px'}}>Basic Info</p>
                  <div style={S.grid2}>
                    {[{key:'name',label:'Restaurant Name',required:true},{key:'tagline',label:'Tagline'},{key:'heroTitle',label:'Hero Title'},{key:'heroSubtitle',label:'Hero Subtitle'},{key:'aboutShort',label:'Short Description'},{key:'reservationText',label:'Reservation Text'},{key:'address',label:'Address'},{key:'phone',label:'Phone'},{key:'email',label:'Email'}].map(({key,label,required})=>(
                      <div key={key}><label style={S.label}>{label}</label><input value={infoForm[key]||''} onChange={e=>setInfoForm({...infoForm,[key]:e.target.value})} required={required} style={S.input} /></div>
                    ))}
                    <div style={{gridColumn:'1/-1'}}><label style={S.label}>About Text</label><textarea value={infoForm.aboutText||''} onChange={e=>setInfoForm({...infoForm,aboutText:e.target.value})} rows={4} style={S.textarea} /></div>
                  </div>
                </div>
                <div style={{...S.card,marginBottom:'16px'}}>
                  <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'20px'}}>Colors & Theme</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px'}}>
                    {[{key:'accentColor',label:'Accent Color'},{key:'primaryColor',label:'Primary Color'},{key:'bgColor',label:'Background Color'}].map(({key,label})=>(
                      <div key={key}><label style={S.label}>{label}</label><div style={{display:'flex',gap:'8px'}}><input type="color" value={infoForm[key]||'#000'} onChange={e=>setInfoForm({...infoForm,[key]:e.target.value})} style={{width:'44px',height:'44px',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',cursor:'pointer',backgroundColor:'transparent',padding:'2px'}} /><input value={infoForm[key]||''} onChange={e=>setInfoForm({...infoForm,[key]:e.target.value})} style={{...S.input,flex:1}} /></div></div>
                    ))}
                  </div>
                </div>
                <div style={{...S.card,marginBottom:'16px'}}>
                  <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'20px'}}>Media</p>
                  <div style={S.grid2}>
                    <div>
                      <label style={S.label}>Logo</label>
                      <div style={{display:'flex',gap:'8px'}}><input value={infoForm.logoUrl||''} onChange={e=>setInfoForm({...infoForm,logoUrl:e.target.value})} placeholder="URL..." style={{...S.input,flex:1}} /><label style={S.uploadBtn}>📁<input type="file" accept="image/*" style={{display:'none'}} onChange={async e=>{const file=e.target.files[0];if(!file)return;try{const url=await uploadFile(file,slug,'logos');setInfoForm(f=>({...f,logoUrl:url}));}catch(err){alert('Upload failed: '+err.message);}}} /></label></div>
                      {infoForm.logoUrl&&<img src={infoForm.logoUrl} alt="" style={{marginTop:'8px',height:'40px',objectFit:'contain',borderRadius:'4px'}} />}
                    </div>
                    <div>
                      <label style={S.label}>Hero Video</label>
                      <div style={{display:'flex',gap:'8px'}}><input value={infoForm.videoUrl||''} onChange={e=>setInfoForm({...infoForm,videoUrl:e.target.value})} placeholder="https://..." style={{...S.input,flex:1}} /><label style={S.uploadBtn}>📁<input type="file" accept="video/*" style={{display:'none'}} onChange={async e=>{const file=e.target.files[0];if(!file)return;try{const url=await uploadFile(file,slug,'videos');setInfoForm(f=>({...f,videoUrl:url}));}catch(err){alert('Upload failed: '+err.message);}}} /></label></div>
                    </div>
                    <div style={{gridColumn:'1/-1'}}>
                      <label style={S.label}>Banner Images (up to 5)</label>
                      {(()=>{
                        const banners=(()=>{try{const p=JSON.parse(infoForm.bannerUrl||'[]');return Array.isArray(p)?p:[];}catch{return infoForm.bannerUrl?[infoForm.bannerUrl]:[]}})();
                        const updateBanners=(nb)=>setInfoForm({...infoForm,bannerUrl:JSON.stringify(nb)});
                        return (<div>
                          {banners.map((b,i)=>(<div key={i} style={{display:'flex',gap:'10px',alignItems:'center',backgroundColor:'#0d0d0d',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',padding:'10px 14px',marginBottom:'8px'}}><img src={b} alt="" style={{height:'36px',width:'56px',objectFit:'cover',borderRadius:'4px'}} /><span style={{flex:1,fontSize:'12px',color:'rgba(255,255,255,0.3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Banner {i+1}</span><button type="button" onClick={()=>updateBanners(banners.filter((_,idx)=>idx!==i))} style={{background:'none',border:'none',cursor:'pointer',color:'#f87171',fontSize:'16px',padding:'0 4px'}}>✕</button></div>))}
                          {banners.length<5&&(<div style={{display:'flex',gap:'8px'}}><input type="text" id="info-banner-url" placeholder="Paste image URL..." style={{...S.input,flex:1}} /><button type="button" onClick={()=>{const inp=document.getElementById('info-banner-url');if(inp.value){updateBanners([...banners,inp.value]);inp.value='';}}} style={S.btnPrimary(accent)}>Add</button><label style={S.uploadBtn}>📁 Upload<input type="file" accept="image/*" style={{display:'none'}} onChange={async e=>{const file=e.target.files[0];if(!file)return;try{const url=await uploadFile(file,slug,'banners');updateBanners([...banners,url]);}catch(err){alert('Upload failed: '+err.message);}}} /></label></div>)}
                        </div>);
                      })()}
                    </div>
                  </div>
                </div>
                <div style={{...S.card,marginBottom:'16px'}}>
                  <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'20px'}}>Social & Maps</p>
                  <div style={S.grid2}>
                    {[{key:'facebookUrl',label:'Facebook URL'},{key:'instagramUrl',label:'Instagram URL'},{key:'tiktokUrl',label:'TikTok URL'},{key:'mapEmbedUrl',label:'Google Maps Embed URL'}].map(({key,label})=>(
                      <div key={key}><label style={S.label}>{label}</label><input value={infoForm[key]||''} onChange={e=>setInfoForm({...infoForm,[key]:e.target.value})} style={S.input} /></div>
                    ))}
                  </div>
                </div>
                <div style={{...S.card,marginBottom:'16px'}}>
                  <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'20px'}}>Opening Hours</p>
                  <div style={S.grid2}>
                    {DAYS.map(day=>(<div key={day} style={{display:'flex',alignItems:'center',gap:'12px'}}><span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',textTransform:'capitalize',width:'80px',flexShrink:0}}>{day}</span><input value={infoForm.openingHoursObj?.[day]||''} onChange={e=>setInfoForm({...infoForm,openingHoursObj:{...infoForm.openingHoursObj,[day]:e.target.value}})} placeholder="11:00 AM - 10:00 PM" style={{...S.input,flex:1,fontSize:'12px'}} /></div>))}
                  </div>
                </div>
                <div style={{display:'flex',gap:'10px'}}>
                  <button type="submit" disabled={savingInfo} style={{...S.btnPrimary(accent),opacity:savingInfo?0.5:1}}>{savingInfo?'Saving...':'Save Changes'}</button>
                  <button type="button" onClick={()=>setEditingInfo(false)} style={S.btnOutline}>Cancel</button>
                </div>
              </form>
            ):(
              <div style={S.card}>
                {[{label:'Name',value:restaurant?.name},{label:'Tagline',value:restaurant?.tagline},{label:'Address',value:restaurant?.address},{label:'Phone',value:restaurant?.phone},{label:'Email',value:restaurant?.email}].map(({label,value})=>(
                  <div key={label} style={{borderBottom:'1px solid rgba(255,255,255,0.05)',paddingBottom:'14px',marginBottom:'14px'}}><p style={{...S.label,marginBottom:'4px'}}>{label}</p><p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>{value||'Not set'}</p></div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab==='archive' && (
          <div>
            <h1 style={S.pageTitle}>Archive</h1>
            <p style={{color:'rgba(255,255,255,0.35)',fontSize:'13px',marginBottom:'24px'}}>Archived items are hidden from the public site. Restore them anytime.</p>
            {archivedGallery.length===0&&archivedItems.length===0&&<div style={S.empty}><p style={{fontSize:'40px',marginBottom:'12px'}}>🗄️</p><p>No archived items yet</p></div>}
            {archivedGallery.length>0&&(
              <div style={{marginBottom:'32px'}}>
                <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:accent,marginBottom:'16px'}}>Gallery ({archivedGallery.length})</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))',gap:'12px'}}>
                  {archivedGallery.map(img=>(<div key={img.id} style={{...S.card,padding:0,overflow:'hidden',margin:0,position:'relative',opacity:0.7}}><img src={img.imageUrl} alt="" style={{width:'100%',aspectRatio:'1',objectFit:'cover'}} /><div style={{padding:'10px',display:'flex',gap:'6px'}}><button onClick={()=>restoreGalleryImage(img.id)} style={{flex:1,...S.btnSuccess,padding:'6px',fontSize:'11px'}}>Restore</button><button onClick={()=>deleteGalleryImage(img.id)} style={{...S.btnDanger,padding:'6px',fontSize:'11px'}}>Del</button></div></div>))}
                </div>
              </div>
            )}
            {archivedItems.length>0&&(
              <div>
                <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:accent,marginBottom:'16px'}}>Menu Items ({archivedItems.length})</p>
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  {archivedItems.map(item=>(<div key={item.id} style={{...S.card,display:'flex',alignItems:'center',gap:'14px',margin:0,opacity:0.7}}>{item.imageUrl&&<img src={item.imageUrl} alt="" style={{width:'48px',height:'48px',objectFit:'cover',borderRadius:'6px'}} />}<div style={{flex:1}}><p style={{fontWeight:700,color:'#fff',fontSize:'14px'}}>{item.name}</p><p style={{color:'rgba(255,255,255,0.35)',fontSize:'12px'}}>${parseFloat(item.price).toFixed(2)}</p></div><button onClick={()=>restoreMenuItem(item.id)} style={{...S.btnSuccess,padding:'7px 14px'}}>Restore</button></div>))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div style={{position:'fixed',inset:0,zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
            <div onClick={()=>setSelectedOrder(null)} style={{position:'absolute',inset:0,backgroundColor:'rgba(0,0,0,0.7)'}} />
            <div style={{position:'relative',backgroundColor:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'32px',width:'100%',maxWidth:'520px',maxHeight:'90vh',overflowY:'auto'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
                <h2 style={{color:'#fff',fontSize:'18px',fontWeight:800}}>Order #{selectedOrder.id}</h2>
                <button onClick={()=>setSelectedOrder(null)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:'20px',cursor:'pointer'}}>✕</button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <div style={{backgroundColor:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'16px'}}>
                  <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'12px'}}>Customer</p>
                  <p style={{color:'#fff',fontWeight:600,marginBottom:'4px'}}>{selectedOrder.customerName}</p>
                  <p style={{color:'rgba(255,255,255,0.6)',fontSize:'14px'}}>{selectedOrder.customerPhone}</p>
                </div>
                <div style={{backgroundColor:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'16px'}}>
                  <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'12px'}}>Items Ordered</p>
                  {(()=>{try{const items=JSON.parse(selectedOrder.items);return Array.isArray(items)?items.map((item,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                      <span style={{color:'rgba(255,255,255,0.85)',fontSize:'14px'}}>{item.name} <span style={{color:'rgba(255,255,255,0.4)'}}>x{item.qty||1}</span></span>
                      <span style={{color:accent,fontWeight:700,fontSize:'14px'}}>Rs. {(parseFloat(item.price||0)*(item.qty||1)).toFixed(0)}</span>
                    </div>
                  )):<p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px'}}>{selectedOrder.items}</p>;}catch{return <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px'}}>{selectedOrder.items}</p>;}})()}
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:'12px',paddingTop:'12px',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                    <span style={{color:'#fff',fontWeight:700}}>Total</span>
                    <span style={{color:accent,fontWeight:800,fontSize:'16px'}}>Rs. {parseFloat(selectedOrder.totalAmount).toFixed(0)}</span>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div style={{backgroundColor:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'16px'}}>
                    <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'8px'}}>Notes / Address</p>
                    <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',lineHeight:1.6}}>{selectedOrder.notes}</p>
                  </div>
                )}
                <div style={{backgroundColor:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'16px'}}>
                  <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'8px'}}>Status</p>
                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    {['Pending','Confirmed','Completed','Cancelled'].map(s=>(
                      <button key={s} onClick={()=>{updateOrderStatus(selectedOrder.id,s);setSelectedOrder({...selectedOrder,status:s});}} style={{padding:'8px 16px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700,backgroundColor:selectedOrder.status===s?accent:'rgba(255,255,255,0.08)',color:selectedOrder.status===s?'#000':'rgba(255,255,255,0.6)'}}>{s}</button>
                    ))}
                  </div>
                </div>
                <p style={{color:'rgba(255,255,255,0.3)',fontSize:'12px',textAlign:'right'}}>Ordered on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {filePicker&&(
          <FilePicker restaurantSlug={slug} onSelect={(url)=>{filePicker.onSelect(url);setFilePicker(null);}} onClose={()=>setFilePicker(null)} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
