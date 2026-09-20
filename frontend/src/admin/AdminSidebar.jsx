import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/admin/assets.js';
import { BRAND_NAME } from '../config/brand.js';

const AdminSidebar = ({ onNavItemClick, onRequestLogout }) => {
  const navItems = [
    {
      to: '/samay',
      end: true,
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/samay/add',
      end: false,
      label: 'Add Product',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      to: '/samay/list',
      end: false,
      label: 'Products',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      to: '/samay/orders',
      end: false,
      label: 'Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-[#1b2437] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#e6e1d6] flex items-center gap-3 shrink-0">
        <img src={assets.jhanvi_mark} className="h-9 w-auto object-contain" alt={BRAND_NAME} />
        <div>
          <h2 className="font-bold text-base text-[#0a1f44] leading-tight">{BRAND_NAME}</h2>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b8934a]">Admin Panel</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 min-h-[44px] ${
                isActive
                  ? 'bg-[#0a1f44] text-white shadow-sm font-semibold'
                  : 'text-[#1b2437] hover:bg-[#f6f3ec] hover:text-[#0a1f44]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-[#6b7280]'}>{item.icon}</span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-3 border-t border-[#e6e1d6] shrink-0">
        <button
          type="button"
          onClick={onRequestLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm text-[#b91c1c] hover:bg-[#fee2e2]/50 transition-colors duration-150 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
