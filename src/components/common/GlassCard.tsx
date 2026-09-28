import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'none';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'cyan',
  interactive = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'relative rounded-2xl backdrop-blur-xl border transition-all duration-300',
        glow === 'cyan' && 'bg-slate-900/60 border-cyan-500/20 hover:border-cyan-400/50 shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
        glow === 'purple' && 'bg-[#0f0b21]/65 border-purple-500/25 hover:border-purple-400/50 shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
        glow === 'none' && 'bg-slate-900/50 border-slate-800 hover:border-slate-700',
        interactive && 'hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,217,255,0.15)] group',
        className
      )}
      {...props}
    >
      {/* Corner crosshairs/accents for high-tech aesthetic */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-cyan-400/40 pointer-events-none" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-cyan-400/40 pointer-events-none" />

      {children}
    </div>
  );
};
