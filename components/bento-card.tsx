"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: ReactNode;
  /** Pass grid column span classes (e.g. "col-span-12 md:col-span-8") */
  className?: string;
  /** Position in the stagger sequence — drives the entrance delay */
  index?: number;
  /** Max tilt angle in degrees */
  tiltStrength?: number;
}

/**
 * Reusable Bento grid cell wrapper that adds:
 * - whileInView spring entrance animation with stagger
 * - 3D tilt effect driven by mouse position (pointer devices only)
 * - Hover scale-up on pointer devices; press scale-down on touch
 * - Fully respects prefers-reduced-motion
 */
export function BentoCard({
  children,
  className,
  index = 0,
  tiltStrength = 6,
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 30, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [tiltStrength, -tiltStrength]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-tiltStrength, tiltStrength]),
    springConfig,
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    // Only run on true pointer devices; coarse pointers (touch) skip the tilt
    if (!ref.current || prefersReduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // Cap total stagger at 300 ms so late cards don't feel sluggish on fast scrolls
  const staggerDelay = Math.min(index * 0.06, 0.3);

  return (
    // Outer div: participates in the CSS grid (col-span classes) + entrance animation
    <motion.div
      className={cn(className)}
      initial={prefersReduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: prefersReduced ? 0 : staggerDelay,
      }}
    >
      {/* Inner div: 3D tilt (pointer) + hover scale (pointer) + tap scale (touch) */}
      <motion.div
        ref={ref}
        className="h-full"
        style={
          prefersReduced
            ? undefined
            : { rotateX, rotateY, transformPerspective: 800 }
        }
        whileHover={prefersReduced ? undefined : { scale: 1.025 }}
        whileTap={prefersReduced ? undefined : { scale: 0.97 }}
        transition={{
          scale: { type: "spring", stiffness: 350, damping: 30 },
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
