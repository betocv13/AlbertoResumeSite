import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, image_url, link_url, sort_order, is_active, is_case_study, team, services, project_date, overview, sections")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}
