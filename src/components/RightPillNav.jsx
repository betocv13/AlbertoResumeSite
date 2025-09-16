import { useState, useEffect } from "react";

export default function RightPillNav() {
  // optional: highlight active section on scroll
  const [active, setActive] = useState("work");

  useEffect(() => {
    const ids = ["work", "about", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="pill-nav">
      <button
        className={`pill ${active === "work" ? "active" : ""}`}
        onClick={() => go("work")}
      >
        Work
      </button>
      <button
        className={`pill ${active === "about" ? "active" : ""}`}
        onClick={() => go("about")}
      >
        About
      </button>
      <button
        className={`pill ${active === "contact" ? "active" : ""}`}
        onClick={() => go("contact")}
      >
        Contact
      </button>
    </nav>
  );
}