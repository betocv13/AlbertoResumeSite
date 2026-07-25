import { useEffect, useState } from "react";

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-")     // Spaces to hyphens
    .replace(/-+/g, "-");     // Collapse multiple hyphens
}

// Shared by the homepage carousel and the /work grid: opening a case study
// sets the URL hash to the project's slug (so it's linkable/shareable and
// survives back/forward), closing clears it.
export function useCaseStudyModal(items) {
  const [selectedProject, setSelectedProject] = useState(null);

  // Open a project from the URL hash on initial load.
  useEffect(() => {
    if (!items.length) return;

    const hash = window.location.hash.slice(1);
    if (hash) {
      const project = items.find((p) => slugify(p.title) === hash);
      if (project && project.is_case_study) {
        setSelectedProject(project);
      }
    }
  }, [items]);

  // Listen for hash changes (browser back/forward).
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      if (!hash) {
        setSelectedProject(null);
      } else {
        const project = items.find((p) => slugify(p.title) === hash);
        if (project && project.is_case_study) {
          setSelectedProject(project);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [items]);

  const openCaseStudy = (project) => {
    window.location.hash = slugify(project.title);
  };

  const closeCaseStudy = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setSelectedProject(null);
  };

  return { selectedProject, openCaseStudy, closeCaseStudy };
}
