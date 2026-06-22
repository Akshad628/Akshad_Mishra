// =============================================================================
// Wandel Reality — Cursor Trail
// A cursive dashed line that follows the cursor along a smoothed bezier path.
// Active only once the user has reached the #reach section, and continues
// through Team + Footer. Lives at fixed position, z-index 0, pointer-events
// none so it never blocks input.
// =============================================================================

import { useEffect, useRef, useState } from "react";

const TRAIL_LEN = 70;       // number of points in the tail
const SAMPLE_MS = 16;       // throttle (~60fps)

export default function CursorTrail({ startSelector = "#reach" }) {
  const pathRef = useRef(null);
  const ptsRef = useRef([]);
  const rafRef = useRef(0);
  const [active, setActive] = useState(false);

  // Toggle active when user is past the start section
  useEffect(() => {
    const check = () => {
      const el = document.querySelector(startSelector);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      setActive(top < window.innerHeight * 0.5);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [startSelector]);

  // Capture cursor movement
  useEffect(() => {
    if (!active) return;
    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < SAMPLE_MS) return;
      last = now;
      const pts = ptsRef.current;
      pts.push({ x: e.clientX, y: e.clientY, t: now });
      if (pts.length > TRAIL_LEN) pts.shift();
    };
    const onLeave = () => {
      // when cursor leaves the page, just stop adding — let trail fade
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    // Render loop — smooths the captured points into a cursive bezier path
    const tick = () => {
      const path = pathRef.current;
      const pts = ptsRef.current;
      if (path && pts.length > 1) {
        // Catmull-Rom-ish: convert points to cubic bezier segments
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < pts.length - 1; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const cx = (p1.x + p2.x) / 2;
          const cy = (p1.y + p2.y) / 2;
          d += ` Q ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
        }
        // last segment
        const tail = pts[pts.length - 1];
        d += ` T ${tail.x.toFixed(1)} ${tail.y.toFixed(1)}`;
        path.setAttribute("d", d);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
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
        opacity: active ? 0.9 : 0,
        transition: "opacity 400ms ease",
      }}
      width="100%"
      height="100%"
    >
      <defs>
        <filter id="wr-trail-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.4" />
        </filter>
      </defs>
      <path
        ref={pathRef}
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 8"
        filter="url(#wr-trail-rough)"
        style={{
          animation: "wr-dash-march 4s linear infinite",
          mixBlendMode: "multiply",
        }}
      />
    </svg>
  );
}
