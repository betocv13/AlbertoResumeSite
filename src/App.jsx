import RightPillNav from "./components/RightPillNav";
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
          <div className="card">Daylight</div>
          <div className="card">Workmate</div>
          <div className="card">Slingshot</div>
          <div className="card">Patreon</div>
          <div className="card">More…</div>
        </section>

        <section id="about" className="pad">
          <h2>About</h2>
          <p>Short bio goes here…</p>
        </section>

        <section id="contact" className="pad">
          <h2>Contact</h2>
          <p>Form will go here…</p>
        </section>
      </main>
    </>
  );
}