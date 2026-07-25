import { useEffect, useRef, useState } from "react";

// The `stats` schema stores value as a free-form string ("5,000+", "4x",
// "300+") rather than separate numeric value/suffix fields, so it can be
// typed into Supabase exactly as it should display. To still animate it,
// pull out the numeric substring and keep whatever came before/after it
// (commas, "x", "+", etc.) to re-apply on every animated frame.
function parseStatValue(raw) {
  const str = String(raw ?? "");
  const match = str.match(/-?[\d,]*\.?\d+/);

  if (!match) {
    // No number to count up to -- render the raw string as-is, unanimated.
    return { number: null, raw: str };
  }

  const numStr = match[0];
  const prefix = str.slice(0, match.index);
  const suffix = str.slice(match.index + numStr.length);
  const hasCommas = numStr.includes(",");
  const cleanNum = numStr.replace(/,/g, "");
  const decimalIndex = cleanNum.indexOf(".");
  const decimals = decimalIndex === -1 ? 0 : cleanNum.length - decimalIndex - 1;

  return { number: parseFloat(cleanNum), prefix, suffix, decimals, hasCommas };
}

function formatAtProgress(parsed, progress) {
  if (parsed.number === null) return parsed.raw;

  const current = parsed.number * progress;
  const rounded = parsed.decimals > 0
    ? Math.round(current * 10 ** parsed.decimals) / 10 ** parsed.decimals
    : Math.round(current);

  const formatted = parsed.hasCommas
    ? rounded.toLocaleString(undefined, {
        minimumFractionDigits: parsed.decimals,
        maximumFractionDigits: parsed.decimals,
      })
    : rounded.toFixed(parsed.decimals);

  return `${parsed.prefix}${formatted}${parsed.suffix}`;
}

// Count-up mechanism (IntersectionObserver trigger, ease-out cubic, 2s @
// 60fps) ported from the deleted homepage StatsSection (git history,
// commit e6a8b6c^) -- same easing/duration/threshold, adapted for the
// string-based value schema above instead of separate value+suffix
// fields.
export default function CaseStudyStats({ items = [] }) {
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const t = frame / totalFrames;
      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - t, 3);
      setProgress(easeOut);

      if (frame >= totalFrames) {
        clearInterval(counter);
        setProgress(1); // ensure the final values land exactly
      }
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, [isVisible]);

  if (!items.length) return null;

  return (
    <div className="case-study-section case-study-section-stats" ref={sectionRef}>
      <div className="case-study-stats">
        {items.map((item, i) => {
          const parsed = parseStatValue(item.value);
          return (
            <div key={i} className="case-study-stat-item">
              <span className="case-study-stat-number">
                {formatAtProgress(parsed, progress)}
              </span>
              {item.label && (
                <span className="case-study-stat-label">{item.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
