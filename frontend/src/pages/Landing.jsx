import { useState } from "react";
import useLenisScroll from "../lib/useLenis";
import Preloader from "../components/wr/Preloader";
import Nav from "../components/wr/Nav";
import Hero from "../components/wr/Hero";
import Ateliers from "../components/wr/Ateliers";
import Services from "../components/wr/Services";
import Storytelling from "../components/wr/Storytelling";
import Reach from "../components/wr/Reach";
import Team from "../components/wr/Team";
import Footer from "../components/wr/Footer";
import DashScribbles from "../components/wr/DashScribbles";
import { Toaster } from "../components/ui/sonner";

export default function Landing() {
  const [ready, setReady] = useState(false);
  useLenisScroll();

  return (
    <div data-testid="landing-root" className="wr-vignette relative">
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div id="top" />
      <Nav />
      <main className="relative z-[2]">
        <Hero />
        <Ateliers />
        <Services />
        <Storytelling />

        {/* Background dashed scribble decor — sits between Reach + Team in the
            deepest layer (z-0 inside its parent). Cards/forms always render
            above because their containers carry their own backgrounds. */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-[200vh] pointer-events-none" style={{ zIndex: 0 }}>
            <DashScribbles seed={3} density={28} />
          </div>
          <div className="relative" style={{ zIndex: 1 }}>
            <Reach />
            <Team />
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
