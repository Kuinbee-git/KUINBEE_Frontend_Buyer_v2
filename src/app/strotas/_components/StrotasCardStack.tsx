"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { ArrowDown } from "lucide-react";
import styles from "./StrotasPageContent.module.css";

export function StrotasCardStack({
  children,
  labels,
}: {
  children: ReactNode;
  labels: string[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  function choose(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const target = top + index * Number(track.dataset.stackStep);
    // The card animates in place; jumping the track avoids playing every
    // intermediate chapter when someone selects a distant section.
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo({ top: target, behavior: "instant" });
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-stack-card]")
    );
    const buttons = Array.from(
      track.querySelectorAll<HTMLButtonElement>("[data-chapter-button]")
    );
    const desktop = window.matchMedia(
      "(min-width: 1100px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)"
    );
    let frame: number | null = null;
    let needsLayout = true;
    let visible = true;
    let initialHashHandled = false;
    let activeIndex = -1;
    const paint = () => {
      frame = null;
      const active = desktop.matches;
      const step = Math.min(760, Math.round(window.innerHeight * 0.78));
      if (track.dataset.stackActive !== String(active))
        track.dataset.stackActive = String(active);
      if (needsLayout) {
        track.dataset.stackStep = String(step);
        track.style.setProperty(
          "--stack-distance",
          `${(cards.length - 0.45) * step}px`
        );
        cards.forEach((card, index) => {
          card.dataset.stackIndex = String(index);
        });
        needsLayout = false;
      }
      if (!active) {
        cards.forEach((card) => {
          card.inert = false;
          card.removeAttribute("aria-hidden");
          delete card.dataset.cardCurrent;
          delete card.dataset.cardPosition;
        });
        activeIndex = -1;
        return;
      }
      const progress = Math.max(
        0,
        Math.min(cards.length - 1, -track.getBoundingClientRect().top / step)
      );
      // A small dead zone prevents a trackpad from toggling at the boundary.
      // CSS completes the handoff, even if scrolling stops halfway through.
      const current =
        activeIndex < 0 || Math.abs(progress - activeIndex) > 0.6
          ? Math.round(progress)
          : activeIndex;
      if (current !== activeIndex) {
        cards.forEach((card, index) => {
          card.inert = index !== current;
          card.setAttribute("aria-hidden", String(index !== current));
          card.dataset.cardCurrent = String(index === current);
          card.dataset.cardPosition = index < current ? "before" : "after";
          card.dataset.storyVisible = String(index === current);
        });
        buttons.forEach((button, index) => {
          if (index === current) button.setAttribute("aria-current", "step");
          else button.removeAttribute("aria-current");
        });
        track.dataset.stackCurrent = String(current);
        activeIndex = current;
      }
      if (!initialHashHandled) {
        initialHashHandled = true;
        const target = window.location.hash
          ? document.getElementById(window.location.hash.slice(1))
          : null;
        const index = cards.findIndex(
          (card) => card === target || (target && card.contains(target))
        );
        if (index > 0) {
          const targetY =
            track.getBoundingClientRect().top + window.scrollY + index * step;
          window.scrollTo({ top: targetY, behavior: "instant" });
        }
      }
    };
    const schedule = () => {
      if (frame === null && visible && !document.hidden)
        frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      needsLayout = true;
      schedule();
    };
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) measure();
      },
      { rootMargin: "200px 0px" }
    );
    intersection.observe(track);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    desktop.addEventListener("change", measure);
    paint();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      intersection.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", schedule);
      desktop.removeEventListener("change", measure);
      cards.forEach((card) => {
        card.inert = false;
        card.removeAttribute("aria-hidden");
      });
    };
  }, []);

  return (
    <div ref={trackRef} className={styles.storyStack} data-strotas-card-stack>
      <div className={styles.stackStage}>
        <div className={styles.stackCanvas}>{children}</div>
        <nav className={styles.storyRail} aria-label="Explore Strotas">
          <span className={styles.railBrand}>
            STROTAS <span>/</span>
          </span>
          <div>
            {labels.map((label, index) => (
              <button
                type="button"
                key={label}
                data-chapter-button
                onClick={() => choose(index)}
              >
                <span>{String(index).padStart(2, "0")}</span>
                {label}
              </button>
            ))}
          </div>
          <span className={styles.scrollHint}>
            Scroll to explore <ArrowDown size={13} aria-hidden="true" />
          </span>
        </nav>
      </div>
    </div>
  );
}
