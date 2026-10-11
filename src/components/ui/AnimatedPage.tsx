"use client";

import { ScrollAnimator } from "@/components/ui/ScrollAnimator";
import { ReactNode } from "react";

/**
 * Client-side wrapper that applies scroll-reveal animations
 * to all child content. Use this in server components to enable
 * the ScrollAnimator without making the whole page a client component.
 */
export function AnimatedPage({ children }: { children: ReactNode }) {
  return <ScrollAnimator>{children}</ScrollAnimator>;
}
