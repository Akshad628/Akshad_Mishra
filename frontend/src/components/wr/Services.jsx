import { motion } from "framer-motion";
import {
  Box,
  Gamepad2,
  Layers3,
  AudioWaveform,
  Compass,
  FlaskConical,
  ArrowUpRight,
} from "lucide-react";

const SERVICES = [
  {
    icon: Box,
    title: "Immersive Design",
    desc: "Full-stack XR experience design from concept to deployment — UX research, interaction design, spatial prototyping.",
  },
  {
    icon: Gamepad2,
    title: "VR Development",
    desc: "Custom VR applications for Meta Quest, PC VR and standalone headsets — Unity, Unreal, and bespoke runtimes.",
  },
  {
    icon: Layers3,
    title: "3D Content Creation",
    desc: "Environment modeling, character design, animation and real-time asset optimisation for immersive platforms.",
  },
  {
    icon: AudioWaveform,
    title: "Spatial Audio",
    desc: "3D audio design and implementation for believable virtual soundscapes that move with the listener.",
  },
  {
    icon: Compass,
    title: "Technical Consulting",
    desc: "XR strategy, platform selection and technical architecture for enterprise immersive projects.",
  },
  {
    icon: FlaskConical,
    title: "Research & Innovation",
    desc: "HCI research, usability studies and prototyping for next-generation spatial computing interfaces.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-32 sm:py-44"
    >
      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="grid md:grid-cols-12 gap-10 items-end mb-16">
          <div className="md:col-span-7">
            <p className="overline mb-4">xr craft · end to end</p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter">
              What we do
            </h2>
          </div>
          <p className="md:col-span-5 text-neutral-600 text-base sm:text-lg">
            Six disciplines, one studio. From the first sketch to the last
            haptic — we build the whole stack of an immersive moment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                data-testid={`service-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                whileHover={{ y: -6 }}
                className="group relative wr-glass rounded-3xl p-7 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(circle at top left, rgba(0,0,0,0.06), transparent 60%)",
                  }}
                />
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(180deg, #fff 0%, #e9e9e9 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Icon size={20} className="text-neutral-900" />
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowUpRight size={20} />
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl text-neutral-900">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {s.desc}
                </p>

                <div className="mt-6 pt-5 border-t border-neutral-200/70 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    0{i + 1} · service
                  </span>
                  <a
                    href="#reach"
                    className="text-xs font-medium underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-900"
                  >
                    Learn more
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
