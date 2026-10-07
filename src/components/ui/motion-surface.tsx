"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content remains visible without JavaScript or motion. */
export function MotionSurface({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const surface = root.current;
    if (!surface) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;

    const animate = (element: Element, frames: Keyframe[], delay = 0) => {
      const animation = element.animate(frames, {
        duration: 480,
        easing: "cubic-bezier(.22,1,.36,1)",
        delay,
      });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const stop = () => {
      observer?.disconnect();
      mutations?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const start = () => {
      stop();
      if (preference.matches) return;
      animate(surface, [
        { opacity: 0.65, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ]);
      observer = new IntersectionObserver(
        (entries) => {
          let stagger = 0;
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer?.unobserve(entry.target);
            animate(
              entry.target,
              [
                { opacity: 0.3, translate: "0 20px" },
                { opacity: 1, translate: "0 0" },
              ],
              Math.min(stagger++ * 55, 220),
            );
          });
        },
        { threshold: 0.08 },
      );
      const observe = () => {
        surface
          .querySelectorAll(
            ".product-card, .category-item, .section-title, .panel, .review, .timeline > div",
          )
          .forEach((element) => {
            if (seen.has(element)) return;
            seen.add(element);
            observer?.observe(element);
          });
      };
      observe();
      mutations = new MutationObserver(observe);
      mutations.observe(surface, { childList: true, subtree: true });
    };
    start();
    preference.addEventListener("change", start);
    return () => {
      stop();
      preference.removeEventListener("change", start);
    };
  }, [pathname]);

  return (
    <div ref={root} className="motion-surface">
      {children}
    </div>
  );
}
