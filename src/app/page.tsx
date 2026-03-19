import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import TechCarousel from "@/components/TechCarousel";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import LanguageToggle from "@/components/LanguageToggle";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen">
      <LanguageToggle />
      <ScrollyCanvas />
      <Projects />
      <TechCarousel />
      <Experience />
      <Footer />
    </main>
  );
}
