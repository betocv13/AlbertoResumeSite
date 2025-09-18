import "./ContactSection.css";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { FiDownload } from "react-icons/fi";

export default function ContactSection() {
  // TODO: replace with your real email + links
  const email = "betito.castillo.98@icloud.com";
  const linkedin = "https://www.linkedin.com/in/alberto-s-053004288/";
  const github = "https://github.com/betocv13"; // update if needed
  const resumeUrl = "https://zyxtcejariappicwkusz.supabase.co/storage/v1/object/public/Resume/AlbertoSotoResume.pdf";


  return (
    <section id="contact" className="contact">
      <h2 className="contact-title">Contact</h2>

      <div className="contact-grid">
        {/* Left card */}
        <div className="contact-card">
          <h3>Let’s build your next project</h3>
          <p>
            I focus on modern web apps with React/Vue, Supabase, and clean UI. Tell me about your idea and timeline — I’ll reply with next steps.
          </p>
          <p>
            Email me at:{" "}
            <a href={`mailto:${email}`} className="contact-link">
              {email}
            </a>
          </p>
          <p>
  Call or text:{" "}
  <a href="tel:+15157703607" className="contact-link">
    (515) 770-3607
  </a>
</p>
          <small className="availability">Available for new work — let’s chat.</small>
        </div>

        {/* Elsewhere */}
        <div className="elsewhere">
          <h3>Elsewhere</h3>
          <ul className="elsewhere-list">
            <li>
              <a href={linkedin} target="_blank" rel="noreferrer">
                <SiLinkedin /> LinkedIn
              </a>
            </li>
            <li>
              <a href={github} target="_blank" rel="noreferrer">
                <SiGithub /> GitHub
              </a>
            </li>
            <li>
            <a href={resumeUrl} target="_blank" rel="noreferrer">
                <FiDownload /> Download Résumé
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}