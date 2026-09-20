import React from 'react';

const PageHeader = ({ title, subtitle, actions, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1f44] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#6b7280] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
