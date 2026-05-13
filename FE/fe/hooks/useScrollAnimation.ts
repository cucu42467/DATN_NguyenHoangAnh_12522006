"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLElement | null>;
  isInView: boolean;
  hasAnimated: boolean;
}

export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseScrollAnimationOptions = {}): UseScrollAnimationReturn {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsInView(true);
        if (triggerOnce) {
          setHasAnimated(true);
        }
      } else if (!triggerOnce) {
        setIsInView(false);
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion) {
      setIsInView(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleIntersection, threshold, rootMargin, prefersReducedMotion]);

  return { ref: ref as React.RefObject<HTMLElement | null>, isInView, hasAnimated };
}

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  useScroll?: boolean;
}

interface UseCountUpReturn {
  ref: React.RefObject<HTMLElement | null>;
  count: number;
  isComplete: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
  useScroll = false,
}: UseCountUpOptions): UseCountUpReturn {
  const [count, setCount] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { ref, isInView } = useScrollAnimation({ triggerOnce: true });

  useEffect(() => {
    const shouldStart = useScroll ? isInView : true;
    if (!shouldStart) return;

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        setCount(Number(current.toFixed(decimals)));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsComplete(true);
        }
      };

      if (prefersReducedMotion) {
        setCount(end);
        setIsComplete(true);
      } else {
        requestAnimationFrame(animate);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [start, end, duration, delay, decimals, prefersReducedMotion, isInView, useScroll]);

  return { ref: ref as React.RefObject<HTMLElement | null>, count, isComplete };
}
