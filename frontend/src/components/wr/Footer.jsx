import { Github, Linkedin, Instagram, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="footer"
      data-testid="site-footer"
      className="relative pt-24 pb-10 text-neutral-200"
      style={{
        background:
          "linear-gradient(180deg, #0c0c0c 0%, #050505 60%, #000 100%)",
      }}
    >
      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="grid md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 font-display text-2xl tracking-tight text-white">
              <span className="inline-block w-3 h-3 bg-white rounded-sm rotate-45" />
              Wandel<span className="italic font-light">Reality</span>
            </div>
            <p className="mt-5 max-w-md text-neutral-400 text-sm leading-relaxed">
              An XR studio building spatial experiences across art, science and
              industry — pieced together one frame at a time.
            </p>

            <a
              href="#reach"
              data-testid="footer-cta"
              className="mt-8 inline-flex items-center gap-2 font-display text-3xl sm:text-5xl text-white group"
            >
              Start a project
              <ArrowUpRight
                size={36}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </div>

          <Col
            title="Sitemap"
            links={[
              ["Home", "#top"],
              ["Ateliers", "#ateliers"],
              ["Services", "#services"],
              ["Storytelling", "#storytelling"],
              ["Reach", "#reach"],
              ["Team", "#team"],
            ]}
          />

          <Col
            title="Studio"
            links={[
              ["About", "#"],
              ["Press", "#"],
              ["Careers", "#"],
              ["Privacy", "#"],
              ["Terms", "#"],
            ]}
          />

          <div className="md:col-span-2">
            <p className="overline mb-4 !text-neutral-500">Incorporation</p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Wandel Reality Pvt. Ltd.
              <br />
              CIN: U72900KA2024PTC000000
              <br />
              Bengaluru · IN
            </p>
            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
              hello@wandelreality.studio
            </p>
          </div>
        </div>

        {/* Big wordmark */}
        <div className="py-16 select-none">
          <div className="font-display text-[18vw] sm:text-[14vw] leading-[0.85] tracking-tighter text-white/95">
            wandel reality
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            spatial · puzzle · craft · 2026
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Wandel Reality. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <SocialIcon Icon={Github} label="github" />
            <SocialIcon Icon={Linkedin} label="linkedin" />
            <SocialIcon Icon={Instagram} label="instagram" />
            <SocialIcon Icon={Twitter} label="twitter" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }) {
  return (
    <div className="md:col-span-2">
      <p className="overline mb-4 !text-neutral-500">{title}</p>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ Icon, label }) {
  return (
    <a
      href="#"
      aria-label={label}
      data-testid={`social-${label}`}
      className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white hover:text-black transition"
    >
      <Icon size={14} />
    </a>
  );
}
