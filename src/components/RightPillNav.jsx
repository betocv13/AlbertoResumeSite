import { useState, useEffect } from "react";

export default function RightPillNav() {
  const ids = ["work", "capabilities", "about", "contact"];
  const [active, setActive] = useState("work");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const onScroll = () => {
      // pick the section whose top is closest to the middle of the viewport
      const viewportMid = window.scrollY + window.innerHeight / 2;

      let bestId = active;
      let bestDist = Infinity;

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;

        // clamp viewportMid into the section’s range, then measure distance
        const clamped = Math.max(top, Math.min(viewportMid, bottom));
        const dist = Math.abs(viewportMid - clamped);

        if (dist < bestDist) {
          bestDist = dist;
          bestId = sec.id;
        }
      });

      if (bestId !== active) setActive(bestId);
    };

    // run once and on scroll/resize
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="pill-nav">
      <button className={`pill ${active === "work" ? "active" : ""}`} onClick={() => go("work")}>
        Work
      </button>
      <button className={`pill ${active === "about" ? "active" : ""}`} onClick={() => go("about")}>
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