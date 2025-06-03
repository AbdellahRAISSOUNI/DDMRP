import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export function Card({ 
  title, 
  children, 
  className = '',
  headerClassName = '',
  bodyClassName = '',
  variant = 'default'
}: CardProps) {
  const variantStyles = {
    default: {
      header: 'bg-white border-b border-slate-200',
      headerText: 'text-slate-800',
      body: '',
    },
    primary: {
      header: 'bg-blue-50 border-b border-blue-100',
      headerText: 'text-blue-800',
      body: '',
    },
    success: {
      header: 'bg-green-50 border-b border-green-100',
      headerText: 'text-green-800',
      body: '',
    },
    warning: {
      header: 'bg-amber-50 border-b border-amber-100',
      headerText: 'text-amber-800',
      body: '',
    },
    danger: {
      header: 'bg-red-50 border-b border-red-100',
      headerText: 'text-red-800',
      body: '',
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {title && (
        <div className={`px-6 py-4 ${styles.header} ${headerClassName}`}>
          <h2 className={`text-lg font-medium ${styles.headerText}`}>{title}</h2>
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default Card; 