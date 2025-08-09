import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-accent-600 hover:bg-accent-700 text-white focus:ring-accent-500 shadow-lg shadow-accent-500/20',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100 focus:ring-accent-500/40 border border-gray-600',
    ghost: 'text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-accent-500/40',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  const iconSpacing = {
    sm: iconPosition === 'left' ? 'mr-1.5' : 'ml-1.5',
    md: iconPosition === 'left' ? 'mr-2' : 'ml-2',
    lg: iconPosition === 'left' ? 'mr-2' : 'ml-2',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizes[size]} ${iconSpacing[size]}`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizes[size]} ${iconSpacing[size]}`} />
          )}
        </>
      )}
    </button>
  );
};