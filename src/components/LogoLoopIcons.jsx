import "./LogoLoop.css";

export default function LogoLoopIcons({
  icons = [],
  size = 44,
  gap = 48,
  speed = 25,
  sizeMobile,
  gapMobile,
  speedMobile,
  reverse = false,
  title = "Tools I build with",
}) {
  if (!icons.length) return null;

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  const vars = {
    "--logo-height": `${isMobile && sizeMobile ? sizeMobile : size}px`,
    "--logo-gap": `${isMobile && gapMobile ? gapMobile : gap}px`,
    "--loop-duration": `${isMobile && speedMobile ? speedMobile : speed}s`,
  };

  const Row = ({ ariaHidden = false, className = "" }) => (
    <div
      className={`logo-loop-track ${className}`}
      aria-hidden={ariaHidden || undefined}
    >
      {icons.map((item, i) => (
        <div className="logo-item icon" key={i} title={item.label ?? ""}>
          <div style={{ width: `var(--logo-height)`, height: `var(--logo-height)` }}>
            {item.el}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="logo-loop-section">
    <h2 className="logo-loop-title">{title}</h2>
    <div className="logo-loop-mask">
      <div className="logo-loop-rail" style={vars}>
        <Row />
        <Row ariaHidden className="second" /> {/* start half-cycle earlier */}
      </div>
    </div>
  </section>
  );
}