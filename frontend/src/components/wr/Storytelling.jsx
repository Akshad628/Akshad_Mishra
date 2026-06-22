import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const QUEST_IMG =
  "https://images.unsplash.com/photo-1780547292624-8bc828bdae07?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxtZXRhJTIwcXVlc3QlMjBWUiUyMGhlYWRzZXR8ZW58MHx8fHwxNzgyMTQ4Mzg0fDA&ixlib=rb-4.1.0&q=85";

const FRAGMENTS = [
  { x: -260, y: -180, rot: -28, label: "Optics" },
  { x: 280, y: -160, rot: 22, label: "IR Sensors" },
  { x: -300, y: 60, rot: -14, label: "Headstrap" },
  { x: 300, y: 80, rot: 18, label: "Speakers" },
  { x: -120, y: 240, rot: -6, label: "Battery" },
  { x: 140, y: 240, rot: 10, label: "Controller" },
];

function Fragment({ i, f, progress }) {
  const fx = useTransform(progress, [0.55, 0.8, 1], [0, f.x, 0]);
  const fy = useTransform(progress, [0.55, 0.8, 1], [0, f.y, 0]);
  const fr = useTransform(progress, [0.55, 0.8, 1], [0, f.rot, 0]);
  const fo = useTransform(progress, [0.5, 0.6, 0.85, 1], [0, 1, 1, 0]);
  return (
    <motion.div
      data-testid={`quest-fragment-${i}`}
      style={{ x: fx, y: fy, rotate: fr, opacity: fo }}
      className="absolute z-20 pointer-events-none"
    >
      <div className="wr-glass-dark rounded-xl px-3 py-2 text-white text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
        {f.label}
      </div>
    </motion.div>
  );
}

export default function Storytelling() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lift = useTransform(scrollYProgress, [0, 0.25, 1], [60, -40, -40]);
  const rotate = useTransform(scrollYProgress, [0.2, 0.6], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 0.7, 1], [0.8, 1, 1.05, 1]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.8, 1], [0.3, 0.6, 0.45, 0.4, 0.55]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0.8, 1.1, 0.95, 1.05]);

  return (
    <section
      id="storytelling"
      ref={ref}
      data-testid="storytelling-section"
      className="relative min-h-[260vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.55) 100%)",
          }}
        />

        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center px-6 z-10">
          <p className="overline mb-3">storytelling · meta quest 3</p>
          <h2 className="font-display text-4xl sm:text-6xl tracking-tighter text-neutral-900">
            Anatomy of an experience
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base max-w-md mx-auto">
            Scroll — watch the headset rise, rotate, break apart, and find
            itself again.
          </p>
        </div>

        <motion.div
          style={{ opacity: shadowOpacity, scale: shadowScale }}
          className="absolute bottom-[18%] w-[60%] max-w-[520px] h-6 rounded-[50%]"
        >
          <div
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(6px)",
            }}
          />
        </motion.div>

        <motion.div style={{ y: lift, rotate, scale }} className="relative z-10">
          <div className="relative w-[min(70vw,560px)] aspect-[16/10] rounded-[28px] overflow-hidden wr-glass">
            <img
              src={QUEST_IMG}
              alt="Meta Quest headset"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/20" />
            <div className="absolute top-3 left-3 text-white font-mono text-[10px] uppercase tracking-[0.25em] bg-black/40 px-2 py-1 rounded-full">
              quest 3 · render
            </div>
          </div>
        </motion.div>

        {FRAGMENTS.map((f, i) => (
          <Fragment key={i} i={i} f={f} progress={scrollYProgress} />
        ))}

        <div className="absolute bottom-10 left-6 sm:left-12 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          rise · rotate · explode · reassemble
        </div>
        <div className="absolute bottom-10 right-6 sm:right-12 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          scene 04
        </div>
      </div>
    </section>
  );
}
