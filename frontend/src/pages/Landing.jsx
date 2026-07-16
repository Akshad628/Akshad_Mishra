import { useState } from "react";
import useLenisScroll from "../lib/useLenis";
import Preloader from "../components/wr/Preloader";
import Nav from "../components/wr/Nav";
import Hero from "../components/wr/Hero";
import Projects from "../components/wr/Projects";
import Skills from "../components/wr/Skills";
import Reel3D from "../components/wr/Reel3D";
import Stats from "../components/wr/Stats";
import About from "../components/wr/About";
import Certifications from "../components/wr/Certifications";
import Reach from "../components/wr/Reach";
import Footer from "../components/wr/Footer";
import CursorTrail from "../components/wr/CursorTrail";
import XPBar from "../components/wr/XPBar";
import CommandPalette from "../components/wr/CommandPalette";
import Konami from "../components/wr/Konami";
import { InventoryHUD } from "../components/wr/CollectibleSpot";
import { AchievementsProvider } from "../components/wr/Achievements";
import { Toaster } from "../components/ui/sonner";

export default function Landing() {
  const [ready, setReady] = useState(false);
  useLenisScroll();

  return (
    <AchievementsProvider>
      <div data-testid="landing-root" className="wr-vignette relative">
        {!ready && <Preloader onDone={() => setReady(true)} />}
        <CursorTrail startSelector="#projects" />
        <XPBar />
        <CommandPalette />
        <Konami />
        <InventoryHUD />
        <div id="top" />
        <Nav />
        <main className="relative z-[2]">
          <Hero />
          <Projects />
          <Skills />
          <Reel3D />
          <Stats />
          <About />
          <Certifications />
          <Reach />
        </main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </div>
    </AchievementsProvider>
  );
}
