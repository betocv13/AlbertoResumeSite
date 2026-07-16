import { useCallback, useEffect, useRef, useState } from "react";
import "./HamburgerNav.css";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "capabilities", label: "Capabilities" },
  { id: "approach", label: "Approach" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "reviews", label: "Reviews" },
  { id: "stats", label: "Stats" },
  { id: "contact", label: "Contact" },
];

export default function HamburgerNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(SECTIONS[0].id);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);

  // Track which section is closest to the viewport's vertical center.
  useEffect(() => {
    const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);

    const onScroll = () => {
      const viewportMid = window.scrollY + window.innerHeight / 2;
      let bestId = null;
      let bestDist = Infinity;

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        const clamped = Math.max(top, Math.min(viewportMid, bottom));
        const dist = Math.abs(viewportMid - clamped);

        if (dist < bestDist) {
          bestDist = dist;
          bestId = sec.id;
        }
      });

      if (bestId) setActive((prev) => (bestId !== prev ? bestId : prev));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Move focus into the menu on open.
  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
  }, [open]);

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Clicking outside the menu (and outside the toggle) closes it.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (toggleRef.current?.contains(e.target)) return;
      close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, close]);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    close();
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={`hamburger-toggle${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls="hamburger-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="hamburger-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        ref={menuRef}
        id="hamburger-menu"
        className={`hamburger-menu${open ? " is-open" : ""}`}
        aria-hidden={!open}
        aria-label="Section navigation"
      >
        <ul>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                ref={i === 0 ? firstLinkRef : undefined}
                tabIndex={open ? 0 : -1}
                className={`hamburger-link${active === s.id ? " is-active" : ""}`}
                onClick={(e) => handleLinkClick(e, s.id)}
              >
                <span className="hamburger-dot" aria-hidden="true" />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
