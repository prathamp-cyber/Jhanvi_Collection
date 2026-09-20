import React from 'react';

const Card = ({ children, className = '', padding = 'md', onClick, ...props }) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const interactive = onClick ? 'cursor-pointer hover:border-[#d6d0c2] transition-colors duration-150' : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#e6e1d6] rounded-[12px] shadow-sm ${paddings[padding] || paddings.md} ${interactive} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
