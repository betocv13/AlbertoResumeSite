import useProjects from "../hooks/useProjects";
import { useCaseStudyModal } from "../hooks/useCaseStudyModal";
import SiteHeader from "./SiteHeader";
import ProjectCard from "./ProjectCard";
import CaseStudyModal from "./CaseStudyModal";
import "./WorkPage.css";

export default function WorkPage() {
  const { items, loading } = useProjects();
  const { selectedProject, openCaseStudy, closeCaseStudy } = useCaseStudyModal(items);

  return (
    <main className="container">
      <SiteHeader />

      <h1 className="work-page-title">Work</h1>

      {!loading && items.length > 0 && (
        <div className="work-grid">
          {items.map((p) => (
            <ProjectCard
              key={p.id}
              title={p.title}
              description={p.description}
              imageUrl={p.image_url}
              linkUrl={p.link_url}
              isCaseStudy={p.is_case_study}
              onCaseStudyClick={() => openCaseStudy(p)}
            />
          ))}
        </div>
      )}

      {selectedProject && (
        <CaseStudyModal project={selectedProject} onClose={closeCaseStudy} />
      )}
    </main>
  );
}
