"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = "",
  stagger = false,
  delay = 0,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.classList.add("revealed");
      const children = el.querySelectorAll(".reveal");
      children.forEach((child) => child.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay if specified
            if (delay > 0) {
              setTimeout(() => {
                entry.target.classList.add("revealed");
                // Also reveal children if stagger mode
                if (stagger) {
                  entry.target.querySelectorAll(".reveal").forEach((child) => {
                    child.classList.add("revealed");
                  });
                }
              }, delay);
            } else {
              entry.target.classList.add("revealed");
              if (stagger) {
                entry.target.querySelectorAll(".reveal").forEach((child) => {
                  child.classList.add("revealed");
                });
              }
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay, stagger, threshold]);

  const classes = [
    stagger ? "reveal-stagger" : "reveal",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
