import React from 'react';
import { clsx } from 'clsx';

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  return (
    <div
      className={clsx(
        'mb-12 md:mb-16',
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl',
        className
      )}
    >
      {/* Badge */}
      <div
        className={clsx(
          'inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono tracking-widest uppercase border mb-4',
          'bg-cyan-950/40 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        {badge}
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-400 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
