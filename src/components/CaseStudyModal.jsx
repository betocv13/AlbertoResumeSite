import { useEffect } from "react";
import "./CaseStudyModal.css";

export default function CaseStudyModal({ project, onClose }) {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    // Store original styles
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const scrollY = window.scrollY;

    // Lock body scroll
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      // Restore original styles
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.overflow = originalOverflow;
      // Restore scroll position
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!project) return null;

  const {
    title,
    overview,
    team = [],
    services = [],
    project_date,
    link_url,
    sections = [],
  } = project;

  // Parse team if it's a string
  const teamMembers = typeof team === "string" ? JSON.parse(team) : team;

  // Parse sections if it's a string
  const parsedSections = typeof sections === "string" ? JSON.parse(sections) : sections;

  // Render a section based on its type
  const renderSection = (section, idx) => {
    if (section.type === "text") {
      return (
        <div key={idx} className="case-study-section case-study-section-text">
          {section.title && <h2 className="case-study-section-title">{section.title}</h2>}
          {section.content && <p className="case-study-section-content">{section.content}</p>}
        </div>
      );
    }

    if (section.type === "image") {
      const images = section.images || [];
      const layout = section.layout || "full";

      return (
        <div key={idx} className={`case-study-section case-study-section-image layout-${layout}`}>
          {layout === "full" && images[0] && (
            <div className="case-study-hero">
              <img src={images[0]} alt="" loading="lazy" />
            </div>
          )}
          {layout === "half" && (
            <div className="case-study-images-row">
              {images.slice(0, 2).map((img, i) => (
                <div key={i} className="case-study-image-half">
                  <img src={img} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          )}
          {layout === "grid" && (
            <div className="case-study-images-grid">
              {images.map((img, i) => (
                <div key={i} className="case-study-image-grid-item">
                  <img src={img} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="case-study-overlay" onClick={onClose}>
      <div className="case-study-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="case-study-header">
          <div className="case-study-name">Alberto Soto-Vargas</div>
          <button
            className="case-study-close"
            onClick={onClose}
            aria-label="Close case study"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="case-study-content">
          {/* Title */}
          <h1 className="case-study-title">{title}</h1>

          {/* Two-column layout: overview + metadata */}
          <div className="case-study-info">
            <div className="case-study-overview">
              <p>{overview}</p>
            </div>

            <div className="case-study-metadata">
              {/* Team */}
              {teamMembers.length > 0 && (
                <div className="case-study-row">
                  <span className="case-study-label">TEAM</span>
                  <div className="case-study-team">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="case-study-avatar-wrapper">
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="case-study-avatar"
                        />
                        <span className="case-study-avatar-name">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {services.length > 0 && (
                <div className="case-study-row">
                  <span className="case-study-label">SERVICES</span>
                  <div className="case-study-services">
                    {services.map((service, idx) => (
                      <span key={idx} className="case-study-pill">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              {project_date && (
                <div className="case-study-row">
                  <span className="case-study-label">DATE</span>
                  <span className="case-study-value">{project_date}</span>
                </div>
              )}

              {/* Link */}
              {link_url && (
                <div className="case-study-row">
                  <span className="case-study-label">LINK</span>
                  <a
                    href={link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="case-study-link"
                  >
                    Visit Site
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Sections */}
          {parsedSections.length > 0 && (
            <div className="case-study-sections">
              {parsedSections.map((section, idx) => renderSection(section, idx))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="case-study-footer">
          <span>© COPYRIGHT {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}
