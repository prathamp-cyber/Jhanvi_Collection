import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon = null,
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1f44] focus-visible:ring-offset-2 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-[#0a1f44] text-white hover:bg-[#12305f] active:bg-[#07152e] shadow-sm',
    secondary: 'bg-white text-[#1b2437] border border-[#e6e1d6] hover:bg-[#f8f6f0] hover:border-[#d6d0c2] active:bg-[#f0ece1]',
    danger: 'bg-[#b91c1c] text-white hover:bg-[#991b1b] active:bg-[#7f1d1d] shadow-sm',
    ghost: 'bg-transparent text-[#1b2437] hover:bg-[#eae6db] active:bg-[#e2dccf]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={size === 'sm' ? 'sm' : 'md'} className="text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
