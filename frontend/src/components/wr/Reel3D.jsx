// =============================================================================
// 3D REEL — Apple-style horizontal sweeper (NO rotation, NO tilt).
// Cards translate horizontally as user scrolls the section. Cards stay flat.
// TODO(Akshad): drop your renders into /public/reel/ then update ITEMS.
// =============================================================================

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { useAchievement } from "./Achievements";
import CollectibleSpot from "./CollectibleSpot";

const ITEMS = [
  {
    title: "Fantasy Sword",
    tag: "Blender · Emission · Particles",
    year: "2025",
    desc: "High-detail magical sword — glowing cyan blade via Emission nodes, procedural crack/crystal textures, bloom post + particle lightning at the guard.",
    image: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Minecraft Temple",
    tag: "Blender · PBR · HDRI",
    year: "2025",
    desc: "Voxel-style ancient temple on a floating island. PBR blocks (grass/stone/dirt), AO baking, custom HDRI-lit environment.",
    image: "https://images.unsplash.com/photo-1607988795691-3d0147b43231?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Architecture Renders",
    tag: "Infosys internship",
    year: "2025",
    desc: "Full Blender pipeline: floor plans → block-out → UV → PBR → HDRI → final. Delivered multiple textured, lit architectural assets.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Environment Study",
    tag: "Blender · Study",
    year: "2025",
    desc: "Composition + lighting studies. Volumetrics, God rays, HDRI-driven mood.",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=85",
  },
];

export default function Reel3D() {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useAchievement(ref, "reel", { title: "3D Reel discovered", icon: Sparkles });

  // Card width + gap in px; the track is (items * cardWidth) wide. Compute how
  // far to translate: viewport width - total track width = negative translate.
  // We use vw units so it stays responsive.
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(ITEMS.length - 1) * 62}vw`]);

  return (
    <section id="reel" ref={ref} data-testid="reel-section" className="relative"
      style={{ height: `${100 + ITEMS.length * 60}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        <CollectibleSpot id="c-reel" top="18%" left="6%" />

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Heading */}
          <div className="pt-24 sm:pt-28 px-6 sm:px-14">
            <div className="max-w-3xl">
              <p className="overline mb-3">3d reel · level 04</p>
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tighter">Worlds I{"\u2019"}ve built</h2>
              <p className="mt-3 text-neutral-600 text-sm sm:text-base max-w-lg">
                Blender modeling, shading and light. Scroll to sweep through — no tilt, no tricks.
              </p>
            </div>
          </div>

          {/* Horizontal sweep track */}
          <div className="flex-1 flex items-center overflow-hidden">
            <motion.div ref={trackRef} style={{ x }}
              className="flex items-center gap-[4vw] pl-[8vw] pr-[8vw] will-change-transform">
              {ITEMS.map((it, i) => (
                <SweepCard key={it.title} it={it} i={i} />
              ))}
            </motion.div>
          </div>

          {/* Progress rail */}
          <div className="px-6 sm:px-14 pb-8">
            <div className="w-full h-[2px] bg-neutral-200 relative overflow-hidden">
              <motion.div style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
                className="absolute inset-0 bg-neutral-900" />
            </div>
            <div className="flex justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
              <span>swipe · scroll</span>
              <span>{ITEMS.length} pieces</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SweepCard({ it, i }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.05 * i }}
      whileHover={{ y: -6 }}
      data-testid={`reel-item-${i}`}
      className="relative wr-glass rounded-3xl overflow-hidden shrink-0 w-[58vw] max-w-[720px] aspect-[4/5]"
    >
      <img src={it.image} alt={it.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between text-white">
        <span className="wr-glass-dark rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
          {it.tag}
        </span>
        <span className="font-mono text-[11px] opacity-80">{it.year}</span>
      </div>

      {/* Bottom title + desc */}
      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
        <h3 className="font-display text-3xl sm:text-4xl leading-tight">{it.title}</h3>
        <p className="mt-2 max-w-md text-sm text-white/85">{it.desc}</p>
      </div>

      {/* Number tag */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 group-hover:opacity-100">
        <span className="font-display text-white text-4xl">{String(i + 1).padStart(2, "0")}</span>
      </div>
    </motion.article>
  );
}
