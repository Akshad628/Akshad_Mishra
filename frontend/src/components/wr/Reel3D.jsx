// =============================================================================
// 3D REEL — Blender + Unity showcase
// TODO(Akshad): drop your renders/videos into /app/frontend/public/reel/
// and replace the ITEMS[i].image URLs below. Videos: set `video: true` and
// use an .mp4 in the same folder.
// =============================================================================

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Play, Sparkles } from "lucide-react";
import { useAchievement } from "./Achievements";
import CollectibleSpot from "./CollectibleSpot";

const ITEMS = [
  {
    title: "Fantasy Sword",
    tag: "Blender · Emission · Particles",
    year: "2025",
    desc: "High-detail magical sword — glowing cyan blade via Emission nodes, procedural crack/crystal textures, bloom post + particle lightning at the guard.",
    image: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Minecraft Temple",
    tag: "Blender · PBR · HDRI",
    year: "2025",
    desc: "Voxel-style ancient temple on a floating island — PBR blocks (grass/stone/dirt), AO baking, custom HDRI-lit environment.",
    image: "https://images.unsplash.com/photo-1607988795691-3d0147b43231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Architecture Renders",
    tag: "Infosys internship · 2025",
    desc: "Floor plans → block-out → UV → PBR → HDRI → final. Delivered multiple textured, lit architectural assets.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Reel3D() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  useAchievement(ref, "reel", { title: "3D Reel discovered", icon: Sparkles });

  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);

  return (
    <section id="reel" ref={ref} data-testid="reel-section" className="relative min-h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <CollectibleSpot id="c-reel" top="18%" right="8%" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.5) 100%)" }} />

        <div className="relative z-10 h-full flex flex-col items-center pt-24 sm:pt-28 pb-10">
          <div className="text-center px-6 max-w-md">
            <p className="overline mb-3">3d reel · level 04</p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tighter">Worlds I{"\u2019"}ve built</h2>
            <p className="mt-3 text-neutral-600 text-xs sm:text-base">
              Blender modeling, shading and light — a taste of what I{"\u2019"}m making outside code.
            </p>
          </div>

          <div className="flex-1 w-full relative flex items-center justify-center">
            <motion.div style={{ rotate, scale }} className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-[min(92vw,1100px)] mt-4">
              {ITEMS.map((it, i) => (
                <motion.div key={it.title} data-testid={`reel-item-${i}`}
                  initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.12, duration: 0.9 }}
                  className={`wr-glass rounded-3xl overflow-hidden ${i === 1 ? "sm:-translate-y-8" : ""}`}>
                  <div className="relative aspect-[4/5]">
                    <img src={it.image} alt={it.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 wr-glass-dark text-white text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1 rounded-full">
                      {it.tag}
                    </span>
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="wr-glass-dark rounded-full w-12 h-12 flex items-center justify-center text-white">
                        <Play size={16} />
                      </span>
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-display text-lg leading-tight">{it.title}</p>
                      <p className="text-[11px] text-white/70 mt-1 line-clamp-2">{it.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 z-10">
            drop your renders in /public/reel/ · replace image urls in Reel3D.jsx
          </p>
        </div>
      </div>
    </section>
  );
}
