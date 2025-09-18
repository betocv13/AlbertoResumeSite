import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProjectCard from "./ProjectCard";
import "./ProjectScroller.css";

export default function ProjectsScroller() {
  const [items, setItems] = useState([]);

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
    })();
  }, []);

  if (!items.length) return null;

  return (
    <section className="scroller" aria-label="Projects">
      {items.map((p) => (
        <ProjectCard
          key={p.id}
          title={p.title}
          description={p.description}
          imageUrl={p.image_url}
          linkUrl={p.link_url}
        />
      ))}
    </section>
  );
}