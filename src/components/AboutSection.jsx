import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AboutSection.css";

export default function AboutSection() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("about").select("*").single();
      if (error) console.error(error);
      else setAbout(data);
    })();
  }, []);

  if (!about) return null;

  return (
    <section id="about" className="about">
      <h2 className="about-title">About</h2>

      <div className="about-grid">
        <div className="about-photo">
          {about.image_url && (
            <img src={about.image_url} alt="Alberto Soto-Vargas" loading="lazy" />
          )}
        </div>

        <div className="about-copy">
          <h3 className="about-heading">{about.heading}</h3>
          {about.subheading && <p className="about-sub">{about.subheading}</p>}

          {Array.isArray(about.bullets) && about.bullets.length > 0 && (
            <ul className="about-list">
              {about.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          <a className="about-read" href="#contact">Read more →</a>
        </div>
      </div>
    </section>
  );
}