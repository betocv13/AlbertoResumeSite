import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SiReact,
  SiVuedotjs,
  SiNodedotjs,
  SiSupabase,
  SiFigma,
  SiGithub,
  SiCanva,
  SiTypescript,
  SiWebflow,
  SiPostgresql,   // for SQL
  SiPython,
  SiHtml5,
  SiCss3,
  SiJavascript,
} from "react-icons/si";
import SiteHeader from "./SiteHeader";
import AboutSection from "./AboutSection";
import CapabilitiesSection from "./CapabilitiesSection";
import LogoLoopIcons from "./LogoLoopIcons";
import ContactSection from "./ContactSection";
import ProjectsScroller from "./ProjectsScroller";
import ApproachSection from "./ApproachSection";
import ReviewSection from "./ReviewSection";

const techIcons = [
  { el: <SiReact />, label: "React" },
  { el: <SiVuedotjs />, label: "Vue" },
  { el: <SiNodedotjs />, label: "Node.js" },
  { el: <SiSupabase />, label: "Supabase" },
  { el: <SiFigma />, label: "Figma" },
  { el: <SiHtml5 />, label: "HTML5" },
  { el: <SiGithub />, label: "GitHub" },
  { el: <SiCanva />, label: "Canva" },
  { el: <SiCss3 />, label: "CSS3" },
  { el: <SiTypescript />, label: "TypeScript" },
  { el: <SiWebflow />, label: "Webflow" },
  { el: <SiPostgresql />, label: "SQL" },
  { el: <SiPython />, label: "Python" },
  { el: <SiJavascript />, label: "JavaScript" },
];

export default function HomePage() {
  const location = useLocation();

  // Cross-page anchor navigation: the nav can send us here as "/#about"
  // etc. (e.g. clicked from the /work page). Most sections fetch from
  // Supabase and may not exist in the DOM yet at this exact moment, so
  // retry until the target shows up instead of just checking once.
  useEffect(() => {
    const id = location.hash?.slice(1);
    if (!id) return undefined;

    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 200; // generous headroom for a slow Supabase fetch

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts += 1;
      if (attempts < MAX_ATTEMPTS) requestAnimationFrame(tryScroll);
    };
    tryScroll();

    return () => {
      cancelled = true;
    };
  }, [location.hash]);

  return (
    <main className="container">
      <SiteHeader />

      {/* Big headline like the reference */}
      <section id="home" className="hero">
        <h1>Software Engineer Blending Code & Design</h1>
      </section>

      {/* Placeholder for horizontal scroll “cards” */}
      <ProjectsScroller />

      <AboutSection />

      <CapabilitiesSection />

      <ApproachSection />

      <LogoLoopIcons
        icons={techIcons}
        title="Tech Stack"
        size={75}
        gap={60}
        speed={22}
        sizeMobile={44}     // smaller icons on phones
        gapMobile={32}      // tighter spacing on phones
        speedMobile={0}    // 🚀 faster on phones
      />
      <ReviewSection />

      <ContactSection />
    </main>
  );
}
