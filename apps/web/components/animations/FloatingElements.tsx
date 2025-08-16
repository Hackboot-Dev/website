'use client';
// /workspaces/website/apps/web/components/animations/FloatingElements.tsx
// Description: Éléments flottants avec physique avancée et interactions
// Last modified: 2025-08-16
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useEffect, useRef } from 'react';

interface FloatingOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  mass: number;
  color: string;
  opacity: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
}

export default function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const orbsRef = useRef<FloatingOrb[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialisation des orbes
    const initOrbs = () => {
      const orbCount = 8;
      orbsRef.current = [];

      for (let i = 0; i < orbCount; i++) {
        orbsRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 60 + 20,
          mass: Math.random() * 3 + 1,
          color: `hsl(${240 + Math.random() * 60}, 70%, 60%)`,
          opacity: Math.random() * 0.3 + 0.1,
          trail: []
        });
      }
    };

    initOrbs();

    // Gestion du mouvement de la souris
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Physics engine
    const updatePhysics = () => {
      const orbs = orbsRef.current;
      const mouse = mouseRef.current;

      orbs.forEach((orb, index) => {
        // Ajouter position actuelle au trail
        orb.trail.push({ x: orb.x, y: orb.y, opacity: orb.opacity * 0.5 });
        if (orb.trail.length > 15) {
          orb.trail.shift();
        }

        // Diminuer l'opacité du trail
        orb.trail.forEach((point, i) => {
          point.opacity *= 0.95;
        });

        // Attraction vers la souris
        const mouseDistance = Math.sqrt(
          Math.pow(mouse.x - orb.x, 2) + Math.pow(mouse.y - orb.y, 2)
        );

        if (mouseDistance < 300) {
          const force = (300 - mouseDistance) / 300 * 0.02;
          const angle = Math.atan2(mouse.y - orb.y, mouse.x - orb.x);
          orb.vx += Math.cos(angle) * force;
          orb.vy += Math.sin(angle) * force;
        }

        // Répulsion entre orbes
        orbs.forEach((otherOrb, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(
              Math.pow(otherOrb.x - orb.x, 2) + Math.pow(otherOrb.y - orb.y, 2)
            );

            if (distance < 150 && distance > 0) {
              const force = (150 - distance) / 150 * 0.01;
              const angle = Math.atan2(orb.y - otherOrb.y, orb.x - otherOrb.x);
              orb.vx += Math.cos(angle) * force;
              orb.vy += Math.sin(angle) * force;
            }
          }
        });

        // Friction
        orb.vx *= 0.995;
        orb.vy *= 0.995;

        // Limiter la vitesse
        const maxSpeed = 2;
        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
        if (speed > maxSpeed) {
          orb.vx = (orb.vx / speed) * maxSpeed;
          orb.vy = (orb.vy / speed) * maxSpeed;
        }

        // Appliquer la vélocité
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Rebonds sur les bords avec amortissement
        if (orb.x < orb.size / 2) {
          orb.x = orb.size / 2;
          orb.vx *= -0.7;
        }
        if (orb.x > window.innerWidth - orb.size / 2) {
          orb.x = window.innerWidth - orb.size / 2;
          orb.vx *= -0.7;
        }
        if (orb.y < orb.size / 2) {
          orb.y = orb.size / 2;
          orb.vy *= -0.7;
        }
        if (orb.y > window.innerHeight - orb.size / 2) {
          orb.y = window.innerHeight - orb.size / 2;
          orb.vy *= -0.7;
        }

        // Variation d'opacité basée sur la vitesse
        const speedFactor = Math.min(speed / maxSpeed, 1);
        orb.opacity = 0.1 + speedFactor * 0.3;
      });

      animationRef.current = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ zIndex: 0 }}
    >
      {orbsRef.current.map((orb, index) => (
        <div key={index}>
          {/* Trail */}
          {orb.trail.map((point, trailIndex) => (
            <div
              key={trailIndex}
              className="absolute pointer-events-none"
              style={{
                left: point.x - orb.size / 4,
                top: point.y - orb.size / 4,
                width: orb.size / 2,
                height: orb.size / 2,
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                borderRadius: '50%',
                opacity: point.opacity,
                transition: 'opacity 0.1s ease'
              }}
            />
          ))}
          
          {/* Orbe principal */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: orb.x - orb.size / 2,
              top: orb.y - orb.size / 2,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 30% 30%, ${orb.color} 0%, ${orb.color}80 50%, transparent 100%)`,
              borderRadius: '50%',
              opacity: orb.opacity,
              filter: 'blur(1px)',
              boxShadow: `0 0 ${orb.size}px ${orb.color}40`,
              transition: 'opacity 0.2s ease'
            }}
          />
          
          {/* Core lumineux */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: orb.x - orb.size / 6,
              top: orb.y - orb.size / 6,
              width: orb.size / 3,
              height: orb.size / 3,
              background: orb.color,
              borderRadius: '50%',
              opacity: orb.opacity * 1.5,
              filter: 'blur(2px)'
            }}
          />
        </div>
      ))}

      {/* Connections entre orbes proches */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {orbsRef.current.map((orb, index) =>
          orbsRef.current.slice(index + 1).map((otherOrb, otherIndex) => {
            const distance = Math.sqrt(
              Math.pow(otherOrb.x - orb.x, 2) + Math.pow(otherOrb.y - orb.y, 2)
            );
            
            if (distance < 200) {
              const opacity = (200 - distance) / 200 * 0.1;
              return (
                <line
                  key={`${index}-${otherIndex}`}
                  x1={orb.x}
                  y1={orb.y}
                  x2={otherOrb.x}
                  y2={otherOrb.y}
                  stroke={orb.color}
                  strokeWidth="1"
                  strokeOpacity={opacity}
                />
              );
            }
            return null;
          })
        )}
      </svg>
    </div>
  );
}