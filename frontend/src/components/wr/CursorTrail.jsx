// =============================================================================
// Wandel Reality — Cursor Trail
// A cursive dashed line that follows the cursor along a smoothed bezier path.
//   • Active once user reaches #reach (faded in/out smoothly)
//   • Scrolling DOWN  → long tail (max 70 points)
//   • Scrolling UP    → tail shortens (max 22 points) for a "rewinding" feel
//   • Fixed position, z-0, pointer-events: none — never blocks input.
// =============================================================================

import { useEffect, useRef, useState } from "react";

const TRAIL_LEN_DOWN = 28;
const TRAIL_LEN_UP = 12;
const SAMPLE_MS = 16;

export default function CursorTrail({ startSelector = "#reach" }) {
  const pathRef = useRef(null);
  const ptsRef = useRef([]);
  const rafRef = useRef(0);
  const maxLenRef = useRef(TRAIL_LEN_DOWN);
  const [active, setActive] = useState(false);

  // Toggle active when user is past the start section + track scroll direction
  useEffect(() => {
    let lastY = window.scrollY;
    const check = () => {
      const el = document.querySelector(startSelector);
      if (el) {
        const top = el.getBoundingClientRect().top;
        setActive(top < window.innerHeight * 0.5);
      }
      const cur = window.scrollY;
      if (cur < lastY - 1) {
        maxLenRef.current = TRAIL_LEN_UP;
      } else if (cur > lastY + 1) {
        maxLenRef.current = TRAIL_LEN_DOWN;
      }
      lastY = cur;
      // Actively trim trail to current cap so it shortens immediately on scroll up
      const pts = ptsRef.current;
      while (pts.length > maxLenRef.current) pts.shift();
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [startSelector]);

  // Capture cursor movement + draw loop
  useEffect(() => {
    if (!active) return;
    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < SAMPLE_MS) return;
      last = now;
      const pts = ptsRef.current;
      pts.push({ x: e.clientX, y: e.clientY });
      while (pts.length > maxLenRef.current) pts.shift();
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      const path = pathRef.current;
      const pts = ptsRef.current;
      if (path && pts.length > 1) {
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const cx = (p1.x + p2.x) / 2;
          const cy = (p1.y + p2.y) / 2;
          d += ` Q ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
        }
        const tail = pts[pts.length - 1];
        d += ` T ${tail.x.toFixed(1)} ${tail.y.toFixed(1)}`;
        path.setAttribute("d", d);
      } else if (path && pts.length <= 1) {
        path.setAttribute("d", "");
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  // When deactivated, clear the trail so it doesn't leak across sections
  useEffect(() => {
    if (!active) {
      ptsRef.current = [];
      if (pathRef.current) pathRef.current.setAttribute("d", "");
    }
  }, [active]);

  return (
    <svg
      data-testid="cursor-trail"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity: active ? 0.6 : 0,
        transition: "opacity 600ms ease",
      }}
      width="100%"
      height="100%"
    >
      <defs>
        <filter id="wr-trail-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.4" />
        </filter>
        <linearGradient id="wr-trail-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#050505" stopOpacity="0" />
          <stop offset="40%" stopColor="#050505" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#050505" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        fill="none"
        stroke="url(#wr-trail-fade)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 6"
        filter="url(#wr-trail-rough)"
        style={{
          animation: "wr-dash-march 5s linear infinite",
          mixBlendMode: "multiply",
        }}
      />
    </svg>
  );
}
