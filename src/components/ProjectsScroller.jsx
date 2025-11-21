import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import ProjectCard from "./ProjectCard";
import "./ProjectScroller.css";

export default function ProjectsScroller() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, image_url, link_url, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    })();
  }, []);

  // Track scroll position
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

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
      <section className="scroller-wrapper">
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
    <section className="scroller-wrapper">
      <div className="scroller" ref={scrollerRef} aria-label="Projects">
        {items.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            description={p.description}
            imageUrl={p.image_url}
            linkUrl={p.link_url}
          />
        ))}
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
    </section>
  );
}