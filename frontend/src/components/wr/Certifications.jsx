import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";

const CERTS = [
  { name: "Java & DBMS (SQL)", by: "Oracle", year: "2024", url: process.env.PUBLIC_URL + "/assets/javaCertificate.pdf" },
  { name: "C Programming", by: "NPTEL", year: "2023", url: process.env.PUBLIC_URL + "/assets/AKSHADMISHRA-CLA - Programmin-certificate.pdf" },
  { name: "Python — 100 Days Bootcamp", by: "Udemy", year: "2024" },
  { name: "Full-Stack Development (MERN)", by: "Udemy", year: "2025" },
  { name: "Introduction to AI", by: "Sample cert", year: "2024", url: process.env.PUBLIC_URL + "/assets/Intro_AI_Akshad.pdf" },
  { name: "Quantum Computing", by: "Sample cert", year: "2024", url: process.env.PUBLIC_URL + "/assets/Quantum_Computing_Akshad.pdf" },
];

export default function Certifications() {
  return (
    <section id="certs" data-testid="certs-section" className="relative py-20 sm:py-28">
      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="overline mb-3">certifications · loot drops</p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tighter">Papered up</h2>
          </div>
          <p className="hidden md:block text-neutral-600 text-sm max-w-xs">
            The stuff people say I should mention. Two sample cert PDFs are wired below.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTS.map((c, i) => (
            <motion.a key={c.name}
              href={c.url || undefined}
              onClick={(e) => { if (!c.url) e.preventDefault(); }}
              style={{ cursor: c.url ? "pointer" : "default" }}
              target={c.url ? "_blank" : undefined}
              rel="noreferrer"
              data-testid={`cert-${i}`}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={c.url ? { y: -3 } : {}}
              className="wr-glass rounded-2xl p-5 flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(180deg, #fff 0%, #e9e9e9 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.06)",
                }}>
                <Award size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg leading-tight">{c.name}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  {c.by} · {c.year}
                </p>
              </div>
              {c.url && (
                <ExternalLink size={14} className="text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
