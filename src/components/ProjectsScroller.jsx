import { useState, useEffect, useRef } from "react";
import useProjects from "../hooks/useProjects";
import { useCaseStudyModal } from "../hooks/useCaseStudyModal";
import ProjectCard from "./ProjectCard";
import CaseStudyModal from "./CaseStudyModal";
import "./ProjectScroller.css";

const HOMEPAGE_PROJECT_COUNT = 5;
const INDEX_CARD = {
  id: "__index__",
  title: "index",
  description: "view all projects",
  image_url: "https://zyxtcejariappicwkusz.supabase.co/storage/v1/object/public/assets/projectsFolder.webp",
};

export default function ProjectsScroller() {
  const { items, loading } = useProjects();
  const { selectedProject, openCaseStudy, closeCaseStudy } = useCaseStudyModal(items);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollerRef = useRef(null);

  // The homepage only teases the first few projects; the "index" tile
  // always brings up the rear, linking through to the full /work page.
  const displayItems = [...items.slice(0, HOMEPAGE_PROJECT_COUNT), INDEX_CARD];

  // Track scroll position
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Some browsers resolve the first card's `scroll-snap-align: start`
    // against the container's own padding-left by auto-scrolling past it
    // on initial layout -- landing on scrollLeft === paddingLeft instead of
    // 0, which visually cancels out the left inset padding-left exists to
    // create (the first card ends up flush against the true edge instead
    // of aligned with the rest of the page). Assert the real start
    // position once the actual cards are in the DOM.
    scroller.scrollLeft = 0;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      setIsAtStart(scrollLeft <= 5);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    };

    handleScroll(); // Check initial state
    scroller.addEventListener("scroll", handleScroll);
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollBy = (direction) => {
    if (!scrollerRef.current) return;
    const card = scrollerRef.current.querySelector(".card");
    if (!card) return;

    const scrollAmount = card.offsetWidth + 45; // card width + gap
    scrollerRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // Show skeleton cards while loading
  if (loading) {
    return (
      <section id="work" className="scroller-wrapper">
        <h2 className="sr-only">Work</h2>
        <div className="scroller" aria-label="Projects loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card card--skeleton">
              <div className="skeleton-img"></div>
              <div className="card-footer">
                <div className="skeleton-title"></div>
                <div className="skeleton-desc"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section id="work" className="scroller-wrapper">
      <h2 className="sr-only">Work</h2>
      <div className="scroller" ref={scrollerRef} aria-label="Projects">
        {displayItems.map((p) =>
          p === INDEX_CARD ? (
            <ProjectCard
              key={p.id}
              title={p.title}
              description={p.description}
              imageUrl={p.image_url}
              to="/work"
            />
          ) : (
            <ProjectCard
              key={p.id}
              title={p.title}
              description={p.description}
              imageUrl={p.image_url}
              linkUrl={p.link_url}
              isCaseStudy={p.is_case_study}
              onCaseStudyClick={() => openCaseStudy(p)}
            />
          )
        )}
      </div>

      {/* Fades - desktop only */}
      {!isAtStart && <div className="scroller-fade scroller-fade--left" />}
      {!isAtEnd && <div className="scroller-fade scroller-fade--right" />}

      {/* Arrows - desktop only */}
      {!isAtStart && (
        <button
          type="button"
          className="scroller-arrow scroller-arrow--left"
          onClick={() => scrollBy("left")}
          aria-label="Previous projects"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      )}
      {!isAtEnd && (
        <button
          type="button"
          className="scroller-arrow scroller-arrow--right"
          onClick={() => scrollBy("right")}
          aria-label="Next projects"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      )}

      {/* Case Study Modal */}
      {selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          onClose={closeCaseStudy}
        />
      )}
    </section>
  );
}
