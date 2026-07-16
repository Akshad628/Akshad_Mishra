import { Github, Linkedin, Mail, Trophy, ArrowUpRight } from "lucide-react";

const EMAIL = process.env.REACT_APP_CONTACT_EMAIL || "akshadmishra628@gmail.com";
const GH = process.env.REACT_APP_SOCIAL_GITHUB || "https://github.com/Akshad628";
const LN = process.env.REACT_APP_SOCIAL_LINKEDIN || "https://www.linkedin.com/in/akshadmishra";
const LC = "https://leetcode.com/akshad_mishra/";

const SOCIALS = [
  { Icon: Github, url: GH, label: "github" },
  { Icon: Linkedin, url: LN, label: "linkedin" },
  { Icon: Trophy, url: LC, label: "leetcode" },
  { Icon: Mail, url: `mailto:${EMAIL}`, label: "email" },
];

export default function Footer() {
  return (
    <footer id="footer" data-testid="site-footer"
      className="relative pt-24 pb-10 text-neutral-200"
      style={{ background: "linear-gradient(180deg, #0c0c0c 0%, #050505 60%, #000 100%)" }}>
      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="grid md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 font-display text-2xl tracking-tight text-white">
              <span className="inline-block w-3 h-3 bg-white rounded-sm rotate-45" />
              akshad<span className="italic font-light">.dev</span>
            </div>
            <p className="mt-5 max-w-md text-neutral-400 text-sm leading-relaxed">
              Full-stack, AI, and Blender. Currently a Computer Science undergrad at Geethanjali
              (Hyderabad) — always shipping.
            </p>
            <a href="#reach" data-testid="footer-cta"
              className="mt-8 inline-flex items-center gap-2 font-display text-3xl sm:text-5xl text-white group">
              Say hi
              <ArrowUpRight size={36} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          <Col title="Sitemap" links={[
            ["Home", "#top"],
            ["Projects", "#projects"],
            ["Skills", "#skills"],
            ["3D Reel", "#reel"],
            ["Stats", "#stats"],
            ["About", "#about"],
            ["Certs", "#certs"],
            ["Reach", "#reach"],
          ]} />
          <Col title="Elsewhere" links={[
            ["GitHub", GH],
            ["LinkedIn", LN],
            ["LeetCode", LC],
            ["Email", `mailto:${EMAIL}`],
          ]} external />
          <div className="md:col-span-2">
            <p className="overline mb-4 !text-neutral-500">Base</p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Hyderabad, Telangana<br />IST · UTC+5:30
            </p>
            <a href={`mailto:${EMAIL}`} className="mt-4 block text-sm text-neutral-300 hover:text-white">{EMAIL}</a>
          </div>
        </div>

        <div className="py-16 select-none">
          <div className="font-display text-[18vw] sm:text-[14vw] leading-[0.85] tracking-tighter text-white/95">
            akshad mishra
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            cse · hyderabad · portfolio · 2026
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Akshad Mishra. Built for curiosity.</p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                data-testid={`social-${s.label}`}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white hover:text-black transition">
                <s.Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links, external }) {
  return (
    <div className="md:col-span-2">
      <p className="overline mb-4 !text-neutral-500">{title}</p>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="text-sm text-neutral-300 hover:text-white transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
