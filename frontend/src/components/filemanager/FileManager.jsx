import { useState, useEffect } from 'react';
import { supabase, uploadFile, deleteFile, getPublicUrl } from '../../utils/upload';

const BUCKET = 'restro-assets';

const FileManager = ({ restaurantSlug, onSelect, mode = 'browse' }) => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState(restaurantSlug || '');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  const FOLDERS = ['banners', 'menu', 'gallery', 'logos', 'general', 'videos'];

  useEffect(() => { loadFiles(currentPath); }, [currentPath]);

  const loadFiles = async (path) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list(path, {
        limit: 200, sortBy: { column: 'created_at', order: 'desc' }
      });
      if (error) throw error;
      setFiles((data || []).filter(i => i.id));
    } catch (e) { setMsg('❌ ' + e.message); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    const uploadFiles = Array.from(e.target.files);
    if (!uploadFiles.length) return;
    setUploading(true);
    try {
      for (const file of uploadFiles) {
        const ext = file.name.split('.').pop();
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = `${currentPath}/${name}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file);
        if (error) throw error;
      }
      setMsg('✅ Uploaded!');
      loadFiles(currentPath);
      setTimeout(() => setMsg(''), 2000);
    } catch (e) { setMsg('❌ ' + e.message); }
    finally { setUploading(false); }
  };

  const handleDelete = async (fileName) => {
    if (!confirm('Delete this file?')) return;
    try {
      await deleteFile(`${currentPath}/${fileName}`);
      if (selected?.name === fileName) setSelected(null);
      loadFiles(currentPath);
      setMsg('✅ Deleted!');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) { setMsg('❌ ' + e.message); }
  };

  const getFileUrl = (fileName) => getPublicUrl(`${currentPath}/${fileName}`);
  const isImage = (name) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
  const isVideo = (name) => /\.(mp4|webm|mov)$/i.test(name);

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const S = {
    container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#111', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    body: { display: 'flex', flex: 1, overflow: 'hidden' },
    sidebar: { width: '160px', backgroundColor: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '12px', overflowY: 'auto', flexShrink: 0 },
    folderBtn: (active) => ({ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: active ? 700 : 500, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', backgroundColor: active ? 'rgba(201,168,76,0.15)' : 'transparent', color: active ? '#C9A84C' : 'rgba(255,255,255,0.75)', transition: 'all 0.2s' }),
    main: { flex: 1, overflowY: 'auto', padding: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' },
    fileCard: (selected) => ({ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', backgroundColor: '#111', transition: 'all 0.2s', position: 'relative' }),
    preview: { width: '160px', backgroundColor: '#0a0a0a', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '16px', overflowY: 'auto', flexShrink: 0 },
    input: { backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '7px 12px', color: '#fff', fontSize: '12px', outline: 'none', width: '200px' },
    uploadBtn: { padding: '8px 14px', backgroundColor: '#C9A84C', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  };

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
          <button onClick={() => setCurrentPath(restaurantSlug)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            📁 {restaurantSlug}
          </button>
          {currentPath !== restaurantSlug && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
              <span style={{ color: '#fff' }}>{currentPath.split('/').pop()}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." style={S.input} />
          <label style={S.uploadBtn}>
            {uploading ? 'Uploading...' : '+ Upload'}
            <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '8px 16px', fontSize: '12px', backgroundColor: msg.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', color: msg.includes('✅') ? '#4ade80' : '#f87171' }}>
          {msg}
        </div>
      )}

      <div style={S.body}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Folders</p>
          <button onClick={() => setCurrentPath(restaurantSlug)} style={S.folderBtn(currentPath === restaurantSlug)}>
            <span>📁</span> All Files
          </button>
          {FOLDERS.map(f => (
            <button key={f} onClick={() => setCurrentPath(`${restaurantSlug}/${f}`)} style={S.folderBtn(currentPath === `${restaurantSlug}/${f}`)}>
              <span>📁</span> <span style={{ textTransform: 'capitalize' }}>{f}</span>
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={S.main}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#C9A84C', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.2)' }}>
              <p style={{ fontSize: '40px', marginBottom: '8px' }}>📂</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>No files here yet</p>
              <p style={{ fontSize: '11px', marginTop: '4px', color: 'rgba(255,255,255,0.4)' }}>Upload files using the button above</p>
            </div>
          ) : (
            <div style={S.grid}>
              {filteredFiles.map(file => {
                const url = getFileUrl(file.name);
                const isSelected = selected?.name === file.name;
                return (
                  <div key={file.name} onClick={() => setSelected(isSelected ? null : { ...file, url })} style={S.fileCard(isSelected)}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                    <div style={{ aspectRatio: '1', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {isImage(file.name) ? (
                        <img src={url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : isVideo(file.name) ? (
                        <span style={{ fontSize: '28px' }}>🎬</span>
                      ) : (
                        <span style={{ fontSize: '28px' }}>📄</span>
                      )}
                    </div>
                    <div style={{ padding: '6px 8px' }}>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name.split('-').slice(2).join('-') || file.name}</p>
                    </div>
                    {/* Hover actions */}
                    <div style={{ position: 'absolute', top: '4px', right: '4px', display: 'flex', gap: '3px' }}>
                      <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(url); setMsg('✅ URL copied!'); setTimeout(() => setMsg(''), 2000); }}
                        style={{ width: '22px', height: '22px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📋</button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(file.name); }}
                        style={{ width: '22px', height: '22px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: 'rgba(239,68,68,0.7)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {selected && (
          <div style={S.preview}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preview</p>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>✕</button>
            </div>
            {isImage(selected.name) ? (
              <img src={selected.url} alt={selected.name} style={{ width: '100%', borderRadius: '6px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)' }} />
            ) : isVideo(selected.name) ? (
              <video src={selected.url} controls style={{ width: '100%', borderRadius: '6px', marginBottom: '12px' }} />
            ) : (
              <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#1a1a1a', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '12px' }}>📄</div>
            )}
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', wordBreak: 'break-all', marginBottom: '12px' }}>{selected.name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {onSelect && (
                <button onClick={() => { onSelect(selected.url); setSelected(null); }}
                  style={{ width: '100%', padding: '9px', backgroundColor: '#C9A84C', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Use This File
                </button>
              )}
              <button onClick={() => { navigator.clipboard.writeText(selected.url); setMsg('✅ URL copied!'); setTimeout(() => setMsg(''), 2000); }}
                style={{ width: '100%', padding: '9px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                Copy URL
              </button>
              <button onClick={() => handleDelete(selected.name)}
                style={{ width: '100%', padding: '9px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
