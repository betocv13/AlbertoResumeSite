import { useEffect } from "react";
import "./CaseStudyModal.css";

export default function CaseStudyModal({ project, onClose }) {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
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
    case_study_images = [],
  } = project;

  // Parse team if it's a string
  const teamMembers = typeof team === "string" ? JSON.parse(team) : team;

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
                      <img
                        key={idx}
                        src={member.avatar_url}
                        alt={member.name}
                        className="case-study-avatar"
                        title={member.name}
                      />
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

          {/* Image Gallery */}
          {case_study_images.length > 0 && (
            <div className="case-study-gallery">
              {/* Hero image */}
              <div className="case-study-hero">
                <img
                  src={case_study_images[0]}
                  alt={`${title} hero`}
                  loading="lazy"
                />
              </div>

              {/* Two images side by side */}
              {case_study_images.length > 1 && (
                <div className="case-study-images-row">
                  {case_study_images.slice(1, 3).map((img, idx) => (
                    <div key={idx} className="case-study-image-half">
                      <img
                        src={img}
                        alt={`${title} ${idx + 2}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
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
