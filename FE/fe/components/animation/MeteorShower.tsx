"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Meteor {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  trailLength: number;
}

interface MeteorShowerProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function MeteorShower({ isActive, onComplete }: MeteorShowerProps) {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const meteorIdRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createMeteor = useCallback((): Meteor => {
    return {
      id: meteorIdRef.current++,
      x: 100 + Math.random() * 10,
      y: -5 - Math.random() * 10,
      size: 3 + Math.random() * 4,
      speedX: 0.4 + Math.random() * 0.3,
      speedY: 0.6 + Math.random() * 0.4,
      opacity: 0.75 + Math.random() * 0.25,
      trailLength: 60 + Math.random() * 80,
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setIsAnimating(false);
      setMeteors([]);
      return;
    }

    setIsAnimating(true);
    const meteorInterval = setInterval(() => {
      setMeteors(prev => {
        if (prev.length < 8) {
          return [...prev, createMeteor()];
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(meteorInterval);
  }, [isActive, createMeteor]);

  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      setMeteors(prev => {
        return prev.map(meteor => ({
          ...meteor,
          x: meteor.x - meteor.speedX,
          y: meteor.y + meteor.speedY,
        })).filter(meteor => meteor.y < 105 && meteor.x > -10);
      });

      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isAnimating]);

  useEffect(() => {
    if (!isActive) return;

    const completionTimer = setTimeout(() => {
      setIsAnimating(false);
      setMeteors([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(completionTimer);
  }, [isActive, onComplete]);

  if (!mounted) return null;

  const content = (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    >
      {/* Meteors - Rơi CHÉO từ góc trên phải xuống góc dưới trái */}
      {meteors.map(meteor => (
        <div
          key={meteor.id}
          style={{
            position: 'absolute',
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            transform: 'rotate(35deg)',
          }}
        >
          {/* Meteor head với glow */}
          <div
            style={{
              width: meteor.size,
              height: meteor.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fef3c7 0%, #fbbf24 30%, #f97316 60%, #ef4444 100%)',
              boxShadow: `
                0 0 ${meteor.size * 3}px #fbbf24,
                0 0 ${meteor.size * 6}px #f97316,
                0 0 ${meteor.size * 10}px rgba(249, 115, 22, 0.6)
              `,
              opacity: meteor.opacity,
            }}
          />
          
          {/* Trail - đuôi thiên thạch hướng ngược lại */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%) translateX(-100%)',
              width: meteor.trailLength,
              height: meteor.size * 0.5,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                rgba(239, 68, 68, ${meteor.opacity * 0.15}) 20%,
                rgba(249, 115, 22, ${meteor.opacity * 0.4}) 50%, 
                rgba(251, 191, 36, ${meteor.opacity * 0.7}) 80%,
                rgba(254, 243, 199, ${meteor.opacity}) 100%
              )`,
              filter: 'blur(2px)',
              borderRadius: '50% 0 0 50%',
            }}
          />
          
          {/* Sparkles dọc theo trail */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: meteor.size * 0.3,
                height: meteor.size * 0.3,
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                boxShadow: `0 0 ${meteor.size}px #fbbf24`,
                opacity: meteor.opacity * (1 - i * 0.2),
                top: '50%',
                left: `-${(meteor.trailLength * (i + 1)) / 5}px`,
                transform: 'translateY(-50%)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );

  return createPortal(content, document.body);
}
