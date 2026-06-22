import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 2400;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onDone && onDone(), 900);
        }, 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const captions = [
    "calibrating spatial canvas",
    "loading puzzle geometry",
    "warming the parallax engine",
    "tuning haptics",
    "wandel reality, online",
  ];
  const idx = Math.min(captions.length - 1, Math.floor((pct / 100) * captions.length));

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          data-testid="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-end justify-between p-8 sm:p-14"
          style={{
            background:
              "radial-gradient(ellipse at center, #f7f7f7 0%, #e9e9e9 50%, #0a0a0a 130%)",
          }}
        >
          {/* Top label */}
          <div className="absolute top-8 left-8 sm:top-14 sm:left-14">
            <p className="overline">Wandel Reality</p>
            <p className="font-mono text-[11px] mt-2 text-neutral-500">
              v.2026 · spatial studio
            </p>
          </div>

          {/* Center caption */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-xl sm:text-3xl text-neutral-700"
            >
              {captions[idx]}
            </motion.p>
          </div>

          {/* Bottom row: percent + bar */}
          <div className="relative z-10 flex flex-col items-start w-full">
            <div
              data-testid="preloader-percent"
              className="font-display text-[18vw] leading-[0.9] sm:text-[14vw] text-neutral-900"
            >
              {String(pct).padStart(3, "0")}
            </div>
            <div className="w-full h-[2px] bg-neutral-300 mt-4 overflow-hidden">
              <motion.div
                style={{ width: `${pct}%` }}
                className="h-full bg-neutral-900"
                transition={{ ease: "linear" }}
              />
            </div>
          </div>

          <div className="absolute top-8 right-8 sm:top-14 sm:right-14 font-mono text-[11px] text-neutral-500 text-right">
            <div>scene: puzzle/01</div>
            <div>fps target: 60</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
