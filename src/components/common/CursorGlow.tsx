import React, { useEffect, useRef } from 'react';
import { useCyberTheme } from '../../context/ThemeContext';

export const CursorGlow: React.FC = () => {
  const { theme } = useCyberTheme();
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMoving = false;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        el.style.opacity = '0.75';
      }
    };

    const handleMouseLeave = () => {
      el.style.opacity = '0';
      isMoving = false;
    };

    const updatePosition = () => {
      // High-order smooth damping
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      el.style.transform = `translate3d(${currentX - 90}px, ${currentY - 90}px, 0)`;

      animId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-[180px] h-[180px] rounded-full pointer-events-none z-30 transition-opacity duration-500 ease-out opacity-0 hidden md:block"
      style={{
        background: `radial-gradient(circle, ${theme.glow} 0%, rgba(0,0,0,0) 70%)`,
        mixBlendMode: 'screen',
        willChange: 'transform',
      }}
    />
  );
};
