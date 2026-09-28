import React, { useEffect, useRef } from 'react';
import { useCyberTheme } from '../../context/ThemeContext';

interface Photon {
  waveIndex: number;
  progress: number;
  speed: number;
  size: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export const CyberBackground: React.FC = () => {
  const { theme } = useCyberTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 1. Interactive Constellation Particles
    const particleCount = Math.min(Math.floor(width / 24), 55);
    const particles: Particle[] = [];
    const themeColors = [theme.primary, theme.secondary, theme.tertiary, '#FFFFFF', theme.primary];

    for (let i = 0; i < particleCount; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      particles.push({
        x: rx,
        y: ry,
        baseX: rx,
        baseY: ry,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.2 + 1,
        opacity: Math.random() * 0.6 + 0.25,
        color: themeColors[Math.floor(Math.random() * themeColors.length)],
      });
    }

    // 2. High-speed traveling photons along curves
    const photons: Photon[] = [
      { waveIndex: 0, progress: 0.1, speed: 0.0035, size: 4, trail: [] },
      { waveIndex: 0, progress: 0.6, speed: 0.0042, size: 4.5, trail: [] },
      { waveIndex: 1, progress: 0.35, speed: 0.0038, size: 3.5, trail: [] },
      { waveIndex: 1, progress: 0.85, speed: 0.0045, size: 4, trail: [] },
    ];

    let waveOffset = 0;
    let radarScanY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse spring interpolation
      const dxMouse = targetMouseX - mouseX;
      const dyMouse = targetMouseY - mouseY;
      mouseX += dxMouse * 0.06;
      mouseY += dyMouse * 0.06;

      const mouseSpeed = Math.hypot(targetMouseX - prevMouseX, targetMouseY - prevMouseY);
      prevMouseX = targetMouseX;
      prevMouseY = targetMouseY;

      const mouseInfluenceX = (mouseX / width - 0.5) * 70;
      const mouseInfluenceY = (mouseY / height - 0.5) * 45;

      const speedBoost = Math.min(mouseSpeed * 0.0001, 0.004);
      waveOffset += 0.014 + speedBoost;

      // ==========================================
      // ADVANCED SCANLINE RADAR SWEEP
      // ==========================================
      radarScanY = (radarScanY + 1.2) % (height + 200);
      if (radarScanY > 0 && radarScanY < height) {
        ctx.save();
        const scanGrad = ctx.createLinearGradient(0, radarScanY - 60, 0, radarScanY);
        scanGrad.addColorStop(0, 'rgba(0,0,0,0)');
        scanGrad.addColorStop(0.8, theme.glow);
        scanGrad.addColorStop(1, theme.primary);

        ctx.fillStyle = scanGrad;
        ctx.globalAlpha = 0.08;
        ctx.fillRect(0, radarScanY - 60, width, 60);

        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.25;
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(0, radarScanY);
        ctx.lineTo(width, radarScanY);
        ctx.stroke();
        ctx.restore();
      }

      // Helper function to calculate wave Y coordinate
      const getWaveY = (waveIdx: number, x: number) => {
        if (waveIdx === 0) {
          // Primary wave
          return (
            height * 0.46 +
            Math.sin((x + mouseInfluenceX) * 0.0026 + waveOffset) * 95 +
            Math.cos(x * 0.0015 - waveOffset * 0.6) * 55 +
            mouseInfluenceY * 0.8
          );
        } else {
          // Secondary wave
          return (
            height * 0.54 +
            Math.sin(x * 0.0022 - waveOffset * 0.85) * 115 +
            Math.cos(x * 0.003 + waveOffset * 0.9) * 45 -
            mouseInfluenceY * 0.6
          );
        }
      };

      const step = 20;

      // ==========================================
      // 1. PRIMARY MULTI-GRADIENT BEZIER WAVE
      // ==========================================
      ctx.save();
      const waveGrad1 = ctx.createLinearGradient(0, 0, width, 0);
      waveGrad1.addColorStop(0, theme.primary);
      waveGrad1.addColorStop(0.45, theme.secondary);
      waveGrad1.addColorStop(0.8, theme.tertiary);
      waveGrad1.addColorStop(1, theme.primary);

      ctx.beginPath();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = waveGrad1;
      ctx.shadowColor = theme.primary;
      ctx.shadowBlur = 28;

      const wave1Points: { x: number; y: number }[] = [];
      for (let x = -50; x <= width + 50; x += step) {
        const y = getWaveY(0, x);
        wave1Points.push({ x, y });
        if (x === -50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Glowing Node Crystals along Primary Wave
      ctx.save();
      for (let i = 0; i < wave1Points.length; i += 6) {
        const pt = wave1Points[i];
        const pulse = Math.sin(waveOffset * 3 + i) * 0.5 + 0.5;

        // Core white star
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 18;
        ctx.fill();

        // Pulsing orbital ring
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = theme.primary;
        ctx.globalAlpha = 0.35 + pulse * 0.3;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // ==========================================
      // 2. SECONDARY HARMONIC NEON CURVE
      // ==========================================
      ctx.save();
      const waveGrad2 = ctx.createLinearGradient(0, 0, width, 0);
      waveGrad2.addColorStop(0, theme.secondary);
      waveGrad2.addColorStop(0.5, theme.tertiary);
      waveGrad2.addColorStop(1, theme.secondary);

      ctx.beginPath();
      ctx.lineWidth = 2.8;
      ctx.strokeStyle = waveGrad2;
      ctx.shadowColor = theme.secondary;
      ctx.shadowBlur = 24;

      const wave2Points: { x: number; y: number }[] = [];
      for (let x = -50; x <= width + 50; x += step) {
        const y = getWaveY(1, x);
        wave2Points.push({ x, y });
        if (x === -50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Nodes on Secondary Wave
      ctx.save();
      for (let i = 3; i < wave2Points.length; i += 7) {
        const pt = wave2Points[i];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = theme.secondary;
        ctx.shadowColor = theme.secondary;
        ctx.shadowBlur = 14;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2);
        ctx.strokeStyle = theme.tertiary;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // ==========================================
      // 3. TERTIARY HARMONIC MOIRE RIPPLE CURVE
      // ==========================================
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = theme.primary;
      ctx.globalAlpha = 0.3;
      ctx.shadowColor = theme.primary;
      ctx.shadowBlur = 12;

      for (let x = -50; x <= width + 50; x += step) {
        const y =
          height * 0.37 +
          Math.cos(x * 0.002 + waveOffset * 1.25) * 65 +
          Math.sin(x * 0.0012 - waveOffset * 0.7) * 35;
        if (x === -50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // 4. FOURTH DEEP AMBIENT BASS WAVE
      // ==========================================
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = theme.tertiary;
      ctx.globalAlpha = 0.28;
      ctx.shadowColor = theme.tertiary;
      ctx.shadowBlur = 10;

      for (let x = -50; x <= width + 50; x += step) {
        const y =
          height * 0.63 +
          Math.sin(x * 0.0018 + waveOffset * 0.5) * 75 +
          Math.cos(x * 0.0028 - waveOffset * 0.4) * 50;
        if (x === -50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // 5. HIGH-SPEED TRAVELING PHOTONS (COMETS)
      // ==========================================
      for (let pIdx = 0; pIdx < photons.length; pIdx++) {
        const p = photons[pIdx];
        p.progress = (p.progress + p.speed) % 1.0;

        const currentX = p.progress * (width + 100) - 50;
        const currentY = getWaveY(p.waveIndex, currentX);

        // Record trail history
        p.trail.unshift({ x: currentX, y: currentY, alpha: 1.0 });
        if (p.trail.length > 18) p.trail.pop();

        // Draw glowing comet tail
        for (let t = 0; t < p.trail.length; t++) {
          const pt = p.trail[t];
          const trailAlpha = (1 - t / p.trail.length) * 0.8;
          ctx.save();
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * (1 - t / p.trail.length * 0.6), 0, Math.PI * 2);
          ctx.fillStyle = p.waveIndex === 0 ? theme.primary : theme.secondary;
          ctx.globalAlpha = trailAlpha;
          ctx.shadowColor = theme.primary;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }

        // Draw brilliant comet head
        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size + 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = p.waveIndex === 0 ? theme.primary : theme.secondary;
        ctx.shadowBlur = 26;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = p.waveIndex === 0 ? theme.primary : theme.secondary;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 6. PARTICLES WITH FLUID MOUSE REPULSION
      // ==========================================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interactive mouse repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.hypot(dx, dy);
        const maxRepelDist = 130;

        if (dist < maxRepelDist && dist > 0) {
          const force = (1 - dist / maxRepelDist) * 3;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        // Apply velocity with damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Drift towards base position smoothly
        p.x += (p.baseX - p.x) * 0.01;
        p.y += (p.baseY - p.y) * 0.01;

        // Wrap boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Render particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cDist = Math.hypot(cdx, cdy);

          if (cDist < 115) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = theme.primary;
            ctx.globalAlpha = (1 - cDist / 115) * 0.2;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Animated Atmospheric Aurora Orbs */}
      <div
        className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000 opacity-20"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full blur-[170px] pointer-events-none transition-colors duration-1000 opacity-25"
        style={{ backgroundColor: theme.secondary }}
      />
      <div
        className="absolute -bottom-40 left-1/3 w-[800px] h-[600px] rounded-full blur-[180px] pointer-events-none transition-colors duration-1000 opacity-20"
        style={{ backgroundColor: theme.tertiary }}
      />

      {/* Cyber Grid Texture */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />

      {/* Dynamic Animated Glowing Curves, Photons & Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Vignette mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/40 to-[#030712] pointer-events-none" />
    </div>
  );
};
