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
import CursorTrail from "../components/wr/CursorTrail";
import { Toaster } from "../components/ui/sonner";

export default function Landing() {
  const [ready, setReady] = useState(false);
  useLenisScroll();

  return (
    <div data-testid="landing-root" className="wr-vignette relative">
      {!ready && <Preloader onDone={() => setReady(true)} />}
      {/* Cursive cursor trail — appears once the user reaches the Reach section
          and follows the cursor with a dashed bezier tail all the way through
          the Team section and Footer. Fixed-position, z-0, pointer-none. */}
      <CursorTrail startSelector="#reach" />

      <div id="top" />
      <Nav />
      <main className="relative z-[2]">
        <Hero />
        <Ateliers />
        <Services />
        <Storytelling />
        <Reach />
        <Team />
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
