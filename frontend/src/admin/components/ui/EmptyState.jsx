import React from 'react';

const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  message = 'There is no data to display right now.',
  action = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white border border-[#e6e1d6] rounded-[12px] shadow-sm ${className}`}>
      <div className="w-14 h-14 rounded-full bg-[#f6f3ec] border border-[#e6e1d6] flex items-center justify-center text-[#0a1f44] mb-4">
        {Icon ? (
          <Icon className="w-7 h-7" />
        ) : (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-[#0a1f44] mb-1">{title}</h3>
      <p className="text-sm text-[#6b7280] max-w-md mb-6 leading-relaxed">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
