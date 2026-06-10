import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { TenantProvider } from './context/TenantContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import LandingPage from './pages/public/LandingPage';
import HomePage from './pages/public/HomePage';
import MenuPage from './pages/public/MenuPage';
import AboutPage from './pages/public/AboutPage';
import GalleryPage from './pages/public/GalleryPage';
import ContactPage from './pages/public/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/:slug" element={<TenantProvider><HomePage /></TenantProvider>} />
        <Route path="/:slug/menu" element={<TenantProvider><MenuPage /></TenantProvider>} />
        <Route path="/:slug/about" element={<TenantProvider><AboutPage /></TenantProvider>} />
        <Route path="/:slug/gallery" element={<TenantProvider><GalleryPage /></TenantProvider>} />
        <Route path="/:slug/contact" element={<TenantProvider><ContactPage /></TenantProvider>} />
        <Route path="/:slug/admin" element={<AdminLogin />} />
        <Route path="/:slug/admin/dashboard" element={<TenantProvider><AdminDashboard /></TenantProvider>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
