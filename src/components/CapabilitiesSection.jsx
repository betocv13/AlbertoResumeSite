import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./CapabilitiesSection.css";

export default function CapabilitiesSection() {
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("capabilities")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) console.error(error);
      else setCapabilities(data);
    })();
  }, []);

  if (!capabilities.length) return null;

  return (
    <section id="capabilities" className="capabilities">
      <div className="cap-grid">
        <h2 className="cap-title">Capabilities</h2>

        <div className="cap-list">
          {capabilities.map((c) => (
            <div key={c.id} className="cap-pill">
              {c.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}