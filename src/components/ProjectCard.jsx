import "./ProjectScroller.css";

export default function ProjectCard({ title, description, imageUrl, linkUrl }) {
  const content = (
    <div className="card">
      {imageUrl && (
        <img className="card-img" src={imageUrl} alt={title} loading="lazy" />
      )}
      <div className="card-footer">
        <div className="card-title">{title}</div>
        {description && <div className="card-desc">{description}</div>}
      </div>
      {linkUrl && (
        <span className="card-arrow" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      )}
    </div>
  );

  // only wrap in <a> if linkUrl exists
  return linkUrl ? (
    <a href={linkUrl} className="card-link" target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}