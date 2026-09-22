import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEfecto?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEfecto = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6
        ${hoverEfecto ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
