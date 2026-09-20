import React from 'react';

const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const variants = {
    success: 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]',
    warning: 'bg-[#fef3c7] text-[#b45309] border border-[#fde68a]',
    danger: 'bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]',
    info: 'bg-[#dbeafe] text-[#1d4ed8] border border-[#bfdbfe]',
    neutral: 'bg-[#f3f4f6] text-[#4b5563] border border-[#e5e7eb]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs sm:text-sm font-medium',
    lg: 'px-3 py-1 text-sm font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium tracking-wide ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
