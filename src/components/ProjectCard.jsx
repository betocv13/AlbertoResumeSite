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