import "./ProjectScroller.css";

export default function ProjectCard({ title, description, imageUrl, linkUrl, isCaseStudy, onCaseStudyClick }) {
  const content = (
    <div className="card">
      {imageUrl && (
        <img className="card-img" src={imageUrl} alt={title} loading="lazy" />
      )}
      <div className="card-footer">
        <div className="card-title">{title}</div>
        {description && <div className="card-desc">{description}</div>}
      </div>
      {/* Show arrow for external links or expand icon for case studies */}
      {(linkUrl || isCaseStudy) && (
        <span className="card-arrow" aria-hidden="true">
          {isCaseStudy ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </span>
      )}
    </div>
  );

  // Case study: open modal on click
  if (isCaseStudy) {
    return (
      <button
        type="button"
        className="card-link card-button"
        onClick={onCaseStudyClick}
        aria-label={`View ${title} case study`}
      >
        {content}
      </button>
    );
  }

  // External link: wrap in <a>
  if (linkUrl) {
    return (
      <a href={linkUrl} className="card-link" target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  // No link and not case study: just render content
  return content;
}