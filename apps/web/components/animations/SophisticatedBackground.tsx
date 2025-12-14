'use client';
// /workspaces/website/apps/web/components/animations/SophisticatedBackground.tsx
// Description: Background animé sophistiqué et minimal style Awwwards
// Last modified: 2025-12-14
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from '../../hooks/useAwwardsAnimation';

export default function SophisticatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mousePosition = useMousePosition();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Sophisticated grid and lines
    const drawSophisticatedElements = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.0005;

      // Subtle moving grid
      ctx.strokeStyle = 'rgba(113, 113, 122, 0.08)';
      ctx.lineWidth = 0.5;

      const gridSize = 80;
      const offsetX = (mousePosition.x * 0.02) % gridSize;
      const offsetY = (mousePosition.y * 0.02) % gridSize;

      // Vertical lines
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Diagonal accent lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;

      // Top-right diagonal
      const diagonalOffset = Math.sin(time) * 20;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.6 + diagonalOffset, 0);
      ctx.lineTo(canvas.width + diagonalOffset, canvas.height * 0.4);
      ctx.stroke();

      // Geometric accent shapes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      
      // Subtle rectangle that follows mouse
      const rectX = canvas.width * 0.8 + (mousePosition.x - canvas.width / 2) * 0.05;
      const rectY = canvas.height * 0.2 + (mousePosition.y - canvas.height / 2) * 0.05;
      
      ctx.fillRect(rectX, rectY, 120, 2);
      ctx.fillRect(rectX + 140, rectY - 40, 2, 80);

      // Breathing dots
      const dotOpacity = 0.03 + Math.sin(time * 2) * 0.02;
      ctx.fillStyle = `rgba(255, 255, 255, ${dotOpacity})`;
      
      // Top dots
      ctx.beginPath();
      ctx.arc(canvas.width * 0.15, canvas.height * 0.2, 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(canvas.width * 0.85, canvas.height * 0.7, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Subtle gradient overlay that reacts to scroll
      const scrollY = window.scrollY || 0;
      const gradientOpacity = Math.min(scrollY / 1000, 0.3);
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `rgba(9, 9, 11, ${gradientOpacity})`);
      gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      drawSophisticatedElements();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMounted, mousePosition]);

  // Don't render anything on server
  if (!isMounted) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}