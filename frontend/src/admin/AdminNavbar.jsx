import React from 'react';
import { useLocation } from 'react-router-dom';
import { assets } from '../assets/admin/assets.js';
import { BRAND_NAME } from '../config/brand.js';

const AdminNavbar = ({ onOpenMobileMenu, onRequestLogout }) => {
  const location = useLocation();

  // Determine current page title based on path
  const getPageTitle = (path) => {
    if (path === '/samay' || path === '/samay/') return 'Dashboard';
    if (path.startsWith('/samay/add')) return 'Add Product';
    if (path.startsWith('/samay/list')) return 'Products List';
    if (path.startsWith('/samay/orders') || path.startsWith('/samay/order')) return 'Orders Management';
    return 'Admin';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#e6e1d6] px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg border border-[#e6e1d6] bg-[#f6f3ec] text-[#0a1f44] hover:bg-[#eae6db] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1f44] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Open navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <img src={assets.jhanvi_mark} className="h-7 w-auto object-contain" alt={BRAND_NAME} />
          <h1 className="font-bold text-base text-[#0a1f44] tracking-tight">{pageTitle}</h1>
        </div>
      </div>

      <button
        type="button"
        onClick={onRequestLogout}
        className="p-2 text-[#b91c1c] hover:bg-[#fee2e2]/50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c] min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Logout"
        title="Logout"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </header>
  );
};

export default AdminNavbar;
