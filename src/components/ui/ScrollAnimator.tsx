"use client";

import { useEffect, ReactNode } from "react";

/**
 * ScrollAnimator — A global provider that automatically applies
 * scroll-reveal animations to elements as they enter the viewport.
 *
 * It targets elements with the `data-animate` attribute, plus
 * common semantic elements inside sections.
 *
 * Usage: Wrap your page content with <ScrollAnimator>...</ScrollAnimator>
 *
 * Supported data-animate values:
 *   "fade-up" (default), "fade-down", "fade-left", "fade-right",
 *   "fade-in", "scale-up", "stagger-children"
 */
export function ScrollAnimator({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Immediately make everything visible
      document
        .querySelectorAll("[data-animate], .sa-item")
        .forEach((el) => {
          el.classList.add("sa-visible");
        });
      return;
    }

    // Auto-tag semantic elements that don't already have data-animate
    autoTagElements();

    // Collect all animated elements
    const elements = document.querySelectorAll("[data-animate]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.animateDelay || "0", 10);

            if (delay > 0) {
              setTimeout(() => {
                el.classList.add("sa-visible");
                revealStaggerChildren(el);
              }, delay);
            } else {
              el.classList.add("sa-visible");
              revealStaggerChildren(el);
            }

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return <div className="sa-root">{children}</div>;
}

/**
 * Auto-tag common elements with animation attributes.
 * Only tags elements that are NOT already inside a [data-animate] parent
 * and are within <section> or <main> tags.
 */
function autoTagElements() {
  // Target these selectors within sections and main containers
  const selectors = [
    "section h1, main h1",
    "section h2, main h2",
    "section h3, main h3",
    "section > p, main > p, section .lead-text, main .lead-text",
    "section img:not([data-animate])",
    "section article",
    "section .grid > *",
    "section form, main form",
    "footer > div",
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      // Skip if element itself already has data-animate
      if (el.hasAttribute("data-animate")) return;
      // Skip if an ancestor already handles the animation (prevents double translations)
      if (el.parentElement?.closest("[data-animate]")) return;

      const htmlEl = el as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === "h1" || tag === "h2") {
        htmlEl.setAttribute("data-animate", "fade-up");
      } else if (tag === "h3") {
        htmlEl.setAttribute("data-animate", "fade-up");
      } else if (tag === "p") {
        htmlEl.setAttribute("data-animate", "fade-up");
        htmlEl.setAttribute("data-animate-delay", "60");
      } else if (tag === "img") {
        htmlEl.setAttribute("data-animate", "fade-in");
        htmlEl.setAttribute("data-animate-delay", "100");
      } else if (tag === "article") {
        htmlEl.setAttribute("data-animate", "fade-up");
      } else if (tag === "form") {
        htmlEl.setAttribute("data-animate", "fade-up");
        htmlEl.setAttribute("data-animate-delay", "100");
      } else if (tag === "div") {
        htmlEl.setAttribute("data-animate", "fade-up");
      }
    });
  });

  // Add stagger delays to grid children
  document.querySelectorAll("section .grid, main .grid").forEach((grid) => {
    const children = grid.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      if (child.hasAttribute("data-animate") && !child.hasAttribute("data-animate-delay")) {
        child.setAttribute("data-animate-delay", String(i * 70));
      }
    }
  });
}

/**
 * Reveal stagger children when a parent with data-animate="stagger-children"
 * becomes visible.
 */
function revealStaggerChildren(el: HTMLElement) {
  if (el.dataset.animate === "stagger-children") {
    const children = el.querySelectorAll("[data-animate]");
    children.forEach((child, i) => {
      setTimeout(() => {
        child.classList.add("sa-visible");
      }, i * 80);
    });
  }
}
