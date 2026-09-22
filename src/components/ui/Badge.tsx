import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sky' | 'emerald' | 'amber' | 'rose' | 'slate' | 'indigo' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sky',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    sky: 'bg-sky-50 text-sky-700 border-sky-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 font-medium rounded-lg',
  };

  return (
    <span
      className={`inline-flex items-center justify-center border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
