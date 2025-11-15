
import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative overflow-hidden rounded-md bg-muted ${className}`}>
       <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-background/20 to-transparent"></div>
    </div>
  );
};

export default Skeleton;
