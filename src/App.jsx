import RightPillNav from "./components/RightPillNav";
import AboutSection from "./components/AboutSection";
import "./App.css";

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
        <section className="scroller">
          <div className="card">SceneIt</div>
          <div className="card">Wardro</div>
          <div className="card">Parkside Tavern</div>
          <div className="card">Artez</div>
          <div className="card">More…</div>
        </section>

        <AboutSection />

        <section id="contact" className="pad">
          <h2>Contact</h2>
          <p>Form will go here…</p>
        </section>
      </main>
    </>
  );
}