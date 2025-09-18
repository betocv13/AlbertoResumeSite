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
import RightPillNav from "./components/RightPillNav";
import AboutSection from "./components/AboutSection";
import CapabilitiesSection from "./components/CapabilitiesSection";
import LogoLoopIcons from "./components/LogoLoopIcons";
import ContactSection from "./components/ContactSection";
import ProjectsScroller from "./components/ProjectsScroller";
import "./App.css";

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


export default function App() {
  return (
    <>
      <RightPillNav />

      <main className="container">
        {/* Top-left name */}
        <header className="header">
          <div className="name">Alberto Soto-Vargas</div>
        </header>

        {/* Big headline like the reference */}
        <section id="work" className="hero">
        <h1>Software Engineer Blending Code & Design</h1>
        </section>

        {/* Placeholder for horizontal scroll “cards” */}
        <ProjectsScroller />

        <AboutSection />

        <CapabilitiesSection />

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
        <ContactSection />
      </main>
    </>
  );
}