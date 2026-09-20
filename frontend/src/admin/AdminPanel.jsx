import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './admin.css';
import AdminLogin from './AdminLogin';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import AddProduct from './AddProduct';
import ListProducts from './ListProducts';
import AdminOrders from './AdminOrders';
import { Modal, EmptyState, Button } from './components/ui';

const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const currency = '₹';

  // Handle robots meta tag while AdminPanel is mounted
  useEffect(() => {
    let meta = document.querySelector("meta[name='robots']");
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      created = true;
      document.head.appendChild(meta);
    }
    const prevContent = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (created) {
        meta.remove();
      } else if (prevContent !== null) {
        meta.setAttribute('content', prevContent);
      } else {
        meta.removeAttribute('content');
      }
    };
  }, []);

  // Axios interceptor for handling 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('adminToken');
          setToken('');
          toast.error(error.response.data?.message || 'Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle Esc key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsLogoutModalOpen(false);
    toast.info("Logged out of admin panel");
  };

  // If unauthenticated, show redesigned AdminLogin page
  if (!token) {
    return <AdminLogin setToken={setToken} backendUrl={backendUrl} />;
  }

  return (
    <div className="admin-root min-h-screen bg-[#f6f3ec] text-[#1b2437] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Desktop Fixed Left Sidebar (240px wide) */}
      <aside className="hidden lg:block w-[240px] shrink-0 h-screen sticky top-0 border-r border-[#e6e1d6] bg-white z-20">
        <AdminSidebar
          onNavItemClick={() => {}}
          onRequestLogout={() => setIsLogoutModalOpen(true)}
        />
      </aside>

      {/* Mobile Top Navbar */}
      <AdminNavbar
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onRequestLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Mobile Slide-in Drawer Backdrop & Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in Drawer Container */}
          <div className="relative w-[260px] max-w-[80vw] bg-white h-full shadow-2xl z-10 admin-animate-slide-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#e6e1d6]">
              <span className="font-bold text-sm text-[#0a1f44]">Navigation Menu</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-[#6b7280] hover:text-[#0a1f44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1f44]"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AdminSidebar
                onNavItemClick={() => setIsMobileMenuOpen(false)}
                onRequestLogout={() => {
                  setIsMobileMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard token={token} backendUrl={backendUrl} />} />
          <Route path="/add" element={<AddProduct token={token} backendUrl={backendUrl} />} />
          <Route path="/list" element={<ListProducts token={token} backendUrl={backendUrl} currency={currency} />} />
          <Route path="/order" element={<AdminOrders token={token} backendUrl={backendUrl} currency={currency} />} />
          <Route path="/orders" element={<AdminOrders token={token} backendUrl={backendUrl} currency={currency} />} />
          
          {/* Catch-all unknown subpaths */}
          <Route
            path="*"
            element={
              <div className="py-12">
                <EmptyState
                  title="Page Not Found"
                  message="The admin page you are looking for does not exist."
                  action={
                    <Link to="/samay">
                      <Button variant="primary">Back to Dashboard</Button>
                    </Link>
                  }
                />
              </div>
            }
          />
        </Routes>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out of the admin panel?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AdminPanel;
