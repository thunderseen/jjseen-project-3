import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export const CursorCompanion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run on fine-pointer (mouse/trackpad) devices and respect reduced motion
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || isReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let active = false;
    let targetX = width * 0.5;
    let targetY = height * 0.5;
    let botX = targetX;
    let botY = targetY;
    let velX = 0;
    let velY = 0;
    let hoverInteractive = false;
    let blinkTimer = performance.now() + 2600;
    let blinkEnd = 0;
    let lastSparkAt = 0;

    const trail: TrailPoint[] = [];
    const sparks: Spark[] = [];
    const ripples: Ripple[] = [];
    const PALETTE = ['#8B7CFF', '#C084FC', '#67C5FF', '#D7E2EA'];

    const spawnSpark = (x: number, y: number, burst = false) => {
      const angle = Math.random() * Math.PI * 2;
      const spd = burst ? 1.2 + Math.random() * 2.2 : 0.25 + Math.random() * 0.7;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - (burst ? 0.3 : 0.15),
        size: burst ? 3.2 + Math.random() * 2.5 : 2 + Math.random() * 2.2,
        alpha: burst ? 0.95 : 0.75,
        hue: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      });
    };

    const drawFourPointStar = (
      x: number,
      y: number,
      r: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const onMove = (e: PointerEvent) => {
      if (!active) {
        botX = e.clientX + 18;
        botY = e.clientY + 18;
        active = true;
      }
      const dx = e.clientX - targetX;
      const dy = e.clientY - targetY;
      const dist = Math.hypot(dx, dy);
      targetX = e.clientX;
      targetY = e.clientY;

      // Detect hover over interactive elements
      const el = e.target as HTMLElement | null;
      hoverInteractive = Boolean(
        el?.closest('a, button, input, textarea, select, [role="button"], .contact-btn')
      );

      // Gentle starlight glints when gliding across the screen
      const now = performance.now();
      if (dist > 6 && now - lastSparkAt > 42 && sparks.length < 28) {
        spawnSpark(
          targetX + (Math.random() - 0.5) * 10,
          targetY + (Math.random() - 0.5) * 10,
          false
        );
        lastSparkAt = now;
      }
    };

    const onDown = (e: PointerEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, radius: 4, alpha: 0.75 });
      for (let i = 0; i < 6; i++) {
        spawnSpark(e.clientX, e.clientY, true);
      }
    };

    const onLeave = () => {
      active = false;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let lastTime = performance.now();

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min(0.032, (now - lastTime) / 1000);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);
      if (!active && sparks.length === 0 && ripples.length === 0) return;

      // Spring-damper physics for the cute floating micro-companion
      const restOffsetX = hoverInteractive ? 0 : 18;
      const restOffsetY = hoverInteractive ? 0 : 18;
      const goalX = targetX + restOffsetX;
      const goalY = targetY + restOffsetY;

      const stiffness = hoverInteractive ? 260 : 165;
      const damping = hoverInteractive ? 22 : 17;
      const ax = (goalX - botX) * stiffness - velX * damping;
      const ay = (goalY - botY) * stiffness - velY * damping;
      velX += ax * dt;
      velY += ay * dt;
      botX += velX * dt;
      botY += velY * dt;

      // Update silky trail points
      if (active) {
        trail.unshift({ x: botX, y: botY, age: 0 });
        if (trail.length > 18) trail.pop();
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += dt * 4.4;
        if (trail[i].age >= 1) trail.splice(i, 1);
      }

      // Draw tapered glowing silk ribbon trail
      if (trail.length > 2) {
        for (let i = 0; i < trail.length - 1; i++) {
          const p0 = trail[i];
          const p1 = trail[i + 1];
          const t = 1 - i / trail.length;
          const alpha = t * (1 - p0.age) * 0.42;
          if (alpha <= 0.01) continue;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(139, 124, 255, ${alpha.toFixed(3)})`;
          ctx.lineWidth = Math.max(0.8, t * 5.2);
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // Draw click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += dt * 95;
        r.alpha -= dt * 1.9;
        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(103, 197, 255, ${r.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Draw four-point starlight micro-sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.alpha -= dt * 1.65;
        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        drawFourPointStar(s.x, s.y, s.size, s.hue, s.alpha);
      }

      if (!active) return;

      // Cute blinking schedule
      if (now > blinkTimer) {
        blinkEnd = now + 130;
        blinkTimer = now + 2400 + Math.random() * 2800;
      }
      const isBlinking = now < blinkEnd;

      // Velocity-based playful squash & stretch
      const speed = Math.hypot(velX, velY);
      const angle = Math.atan2(velY, velX);
      const stretch = Math.min(0.28, speed * 0.00055);
      const bob = Math.sin(now * 0.0055) * 1.6;

      ctx.save();
      ctx.translate(botX, botY + bob);

      if (hoverInteractive) {
        // Sleek halo ring around interactive elements
        const pulse = 1 + Math.sin(now * 0.009) * 0.08;
        ctx.beginPath();
        ctx.arc(0, 0, 15 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139, 124, 255, 0.72)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Orbiting tiny diamond glint
        const orbAngle = now * 0.0045;
        drawFourPointStar(
          Math.cos(orbAngle) * 15,
          Math.sin(orbAngle) * 15,
          3.8,
          '#67C5FF',
          0.95
        );
      } else {
        // Soft ambient glow halo
        const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 18);
        glow.addColorStop(0, 'rgba(139, 124, 255, 0.42)');
        glow.addColorStop(0.6, 'rgba(103, 197, 255, 0.14)');
        glow.addColorStop(1, 'rgba(103, 197, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        // Professionally-cute glassmorphic mini-orb body with subtle squash/stretch
        ctx.rotate(angle);
        ctx.scale(1 + stretch, 1 - stretch * 0.6);
        ctx.rotate(-angle);

        const bodyGrad = ctx.createLinearGradient(-8, -8, 8, 8);
        bodyGrad.addColorStop(0, '#A594FF');
        bodyGrad.addColorStop(0.55, '#6C63FF');
        bodyGrad.addColorStop(1, '#67C5FF');

        ctx.beginPath();
        ctx.roundRect(-8.5, -7.5, 17, 15, 6.5);
        ctx.fillStyle = bodyGrad;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.stroke();

        // Expressive micro-eyes looking gently toward the cursor direction
        const lookX = Math.max(-1.6, Math.min(1.6, (targetX - botX) * 0.08));
        const lookY = Math.max(-1.2, Math.min(1.2, (targetY - botY) * 0.08));

        ctx.fillStyle = '#0C0C0C';
        if (isBlinking) {
          ctx.fillRect(-4.2 + lookX, -0.3 + lookY, 2.8, 1.1);
          ctx.fillRect(1.4 + lookX, -0.3 + lookY, 2.8, 1.1);
        } else {
          ctx.beginPath();
          ctx.arc(-2.8 + lookX, -0.2 + lookY, 1.45, 0, Math.PI * 2);
          ctx.arc(2.8 + lookX, -0.2 + lookY, 1.45, 0, Math.PI * 2);
          ctx.fill();

          // Tiny specular eye highlights
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-3.2 + lookX, -0.7 + lookY, 0.5, 0, Math.PI * 2);
          ctx.arc(2.4 + lookX, -0.7 + lookY, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-40"
    />
  );
};
