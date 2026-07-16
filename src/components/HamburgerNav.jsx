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
  { id: "contact", label: "Contact" },
];

export default function HamburgerNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(SECTIONS[0].id);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);

  // Track the active section with a "scrollspy" threshold: the active
  // section is whichever one's top has most recently crossed a line near
  // the top of the viewport. This is deliberately NOT "closest to the
  // viewport's center" -- several sections here (Home, Capabilities,
  // Approach's single row, the Tech Stack marquee) are, by design, shorter
  // than half a typical viewport, so a center-distance comparison hands
  // activation to a neighboring section for their entire scroll range.
  // Threshold-crossing doesn't care about a section's height at all.
  //
  // About/Capabilities/Approach/Reviews/Work all fetch their content from
  // Supabase and render nothing until that resolves, so their <section>
  // elements don't exist in the DOM yet at mount time. Looking ids up once
  // (e.g. in a mount-only effect) bakes in whichever subset happened to be
  // present at that instant and silently drops the rest forever. Query the
  // DOM fresh on every tick instead, and also recompute whenever the DOM
  // mutates so a late-arriving section is picked up immediately rather than
  // waiting for the next scroll/resize.
  useEffect(() => {
    const getCurrentSections = () =>
      SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);

    const onScroll = () => {
      const sections = getCurrentSections();
      if (!sections.length) return;

      // A section is "active" for the entire scroll range between its own
      // top crossing this line and the next section's top crossing it --
      // that range is fixed by the document-space gap between the two tops
      // and doesn't shrink or grow with this value. What the threshold
      // controls is only *how far below the viewport's top edge* a
      // section's top can be while still counting as "reached". It has to
      // stay comfortably under the tightest real top-to-top gap on the
      // page (the shortest sections here run ~230-250px apart) or a
      // section's own top-aligned scroll position ends up past the next
      // section's activation point, overshooting by one. A small fixed
      // offset (roughly a header height) avoids that regardless of
      // viewport size.
      const threshold = 120;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      let bestId = sections[0].id;
      if (atBottom) {
        bestId = sections[sections.length - 1].id;
      } else {
        for (const sec of sections) {
          if (sec.getBoundingClientRect().top <= threshold) {
            bestId = sec.id;
          } else {
            break;
          }
        }
      }

      setActive((prev) => (bestId !== prev ? bestId : prev));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const observer = new MutationObserver(onScroll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
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
