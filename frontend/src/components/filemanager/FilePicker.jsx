import { useState } from 'react';
import FileManager from './FileManager';

const FilePicker = ({ restaurantSlug, onSelect, onClose }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <div style={{ width: '100%', maxWidth: '900px', height: '600px', display: 'flex', flexDirection: 'column', backgroundColor: '#0d0d0d', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#111' }}>
          <p style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>📁 File Manager — Select a File</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '20px' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', padding: '0' }}>
          <FileManager restaurantSlug={restaurantSlug} onSelect={onSelect} mode="picker" />
        </div>
      </div>
    </div>
  );
};

export default FilePicker;
