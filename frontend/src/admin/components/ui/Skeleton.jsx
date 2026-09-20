import React from 'react';

const Skeleton = ({ className = '', variant = 'text', height, width }) => {
  const baseClasses = 'animate-pulse bg-[#e6e1d6]/70 rounded-md';

  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    circle: 'rounded-full h-10 w-10',
    card: 'h-32 w-full rounded-[12px]',
    button: 'h-11 w-28 rounded-lg',
  };

  const style = {};
  if (height) style.height = height;
  if (width) style.width = width;

  return <div className={`${baseClasses} ${variants[variant] || ''} ${className}`} style={style} />;
};

export const StatCardSkeleton = () => (
  <div className="bg-white border border-[#e6e1d6] rounded-[12px] p-5 shadow-sm space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="60%" className="h-4" />
      <Skeleton variant="circle" className="w-8 h-8" />
    </div>
    <Skeleton variant="title" width="40%" className="h-8" />
    <Skeleton variant="text" width="80%" className="h-3" />
  </div>
);

export const OrderRowSkeleton = () => (
  <div className="p-4 border border-[#e6e1d6] rounded-lg bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div className="space-y-2 flex-1">
      <Skeleton variant="title" width="45%" className="h-5" />
      <Skeleton variant="text" width="65%" className="h-4" />
    </div>
    <div className="flex items-center gap-3">
      <Skeleton variant="button" width="80px" className="h-7" />
      <Skeleton variant="title" width="70px" className="h-6" />
    </div>
  </div>
);

export default Skeleton;
