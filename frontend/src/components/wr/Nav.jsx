import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { id: "ateliers", label: "Ateliers" },
  { id: "services", label: "Services" },
  { id: "storytelling", label: "Storytelling" },
  { id: "reach", label: "Reach" },
  { id: "team", label: "Team" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="mx-auto w-[min(1240px,94%)] flex items-center justify-between">
        <a
          href="#top"
          data-testid="nav-logo"
          className="flex items-center gap-2 font-display text-lg tracking-tight"
        >
          <span className="inline-block w-3 h-3 bg-neutral-900 rounded-sm rotate-45" />
          <span>Wandel<span className="italic font-light">Reality</span></span>
        </a>

        <nav
          className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full transition-all wr-glass`}
        >
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-testid={`nav-${l.id}`}
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-white/70 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#reach"
            data-testid="nav-cta"
            className="hidden sm:inline-flex wr-skeu-btn !py-2.5 !px-5 text-sm"
          >
            Book a call
          </a>
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full wr-glass"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mx-auto mt-3 w-[min(1240px,94%)] wr-glass rounded-2xl p-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              data-testid={`nav-mobile-${l.id}`}
              className="px-3 py-2 rounded-lg text-sm text-neutral-800 hover:bg-white/70"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
