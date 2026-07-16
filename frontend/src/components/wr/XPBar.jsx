// Top XP progress bar — level increments 1-9 as the user scrolls.
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const LEVELS = ["boot", "hero", "projects", "skills", "reel", "stats", "about", "reach", "clear!"];

export default function XPBar() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = Math.min(LEVELS.length - 1, Math.floor(v * LEVELS.length));
      setLevel(idx);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <div data-testid="xp-bar" className="fixed top-0 inset-x-0 z-[45] pointer-events-none">
      <div className="h-[3px] w-full bg-neutral-200/60">
        <motion.div style={{ scaleX: width, transformOrigin: "0% 50%" }} className="h-full bg-neutral-900" />
      </div>
      <div className="mx-auto w-[min(1240px,94%)] flex items-center justify-between mt-1 pointer-events-none">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 bg-white/70 rounded-full px-2 py-0.5 backdrop-blur">
          lvl {String(level).padStart(2, "0")} · {LEVELS[level]}
        </span>
      </div>
    </div>
  );
}
