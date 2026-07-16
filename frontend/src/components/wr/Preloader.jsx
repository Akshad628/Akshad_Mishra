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
    "booting akshad.dev",
    "loading projects",
    "compiling skills",
    "syncing github",
    "ready. press ↵",
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
          className="fixed inset-0 z-[100] flex flex-col p-8 sm:p-14"
          style={{ background: "radial-gradient(ellipse at center, #f7f7f7 0%, #e9e9e9 50%, #0a0a0a 130%)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="overline">akshad.dev</p>
              <p className="font-mono text-[11px] mt-2 text-neutral-500">v.2026 · portfolio</p>
            </div>
            <div className="font-mono text-[11px] text-neutral-500 text-right">
              <div>level 00 · boot</div>
              <div>press cmd+k · anywhere</div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div data-testid="preloader-loader" className="relative w-[min(78vw,460px)] aspect-square flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full"
                style={{ animation: "wr-spin-slow 14s linear infinite", transformOrigin: "50% 50%" }}>
                <circle cx="50" cy="50" r="48" fill="none" stroke="#0a0a0a" strokeWidth="1.1"
                  strokeDasharray="2.5 3.5" strokeLinecap="round" opacity="0.85" />
              </svg>
              <svg viewBox="0 0 100 100" className="absolute inset-[10%] w-[80%] h-[80%]"
                style={{ animation: "wr-spin-slow 22s linear infinite reverse", transformOrigin: "50% 50%" }}>
                <circle cx="50" cy="50" r="48" fill="none" stroke="#0a0a0a" strokeWidth="0.9"
                  strokeDasharray="1 4" strokeLinecap="round" opacity="0.6" />
              </svg>
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                {[0, 90, 180, 270].map((a) => (
                  <line key={a} x1="50" y1="2" x2="50" y2="6" stroke="#0a0a0a" strokeWidth="1.4"
                    strokeLinecap="round" transform={`rotate(${a} 50 50)`} />
                ))}
              </svg>
              <div className="relative text-center px-6 max-w-[78%]">
                <p className="overline mb-3">initialising</p>
                <AnimatePresence mode="wait">
                  <motion.p key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45 }}
                    className="font-display text-base sm:text-2xl text-neutral-800 leading-tight">
                    {captions[idx]}
                  </motion.p>
                </AnimatePresence>
                <p className="font-mono text-[10px] mt-4 text-neutral-500">
                  {String(idx + 1).padStart(2, "0")} / {String(captions.length).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div data-testid="preloader-percent" className="font-display text-[18vw] sm:text-[12vw] leading-[0.9] text-neutral-900">
              {String(pct).padStart(3, "0")}
            </div>
            <div className="w-full h-[2px] bg-neutral-300 mt-4 overflow-hidden">
              <motion.div style={{ width: `${pct}%` }} className="h-full bg-neutral-900" transition={{ ease: "linear" }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
