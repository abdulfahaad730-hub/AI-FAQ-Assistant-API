import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'purple' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-all duration-300 rounded-xl select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3',
  };

  const variantStyles = {
    primary: 'bg-[#00D9FF] text-[#030712] hover:bg-[#38bdf8] shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] border border-cyan-300 font-extrabold',
    secondary: 'bg-slate-900/60 text-[#00D9FF] border border-[#00D9FF]/50 hover:bg-[#00D9FF]/10 hover:border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.15)]',
    purple: 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] border border-purple-400 font-extrabold',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/60',
    danger: 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400',
  };

  return (
    <button
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
