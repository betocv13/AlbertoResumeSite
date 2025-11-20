import { useEffect, useRef, useState } from "react";
import "./CursorLens.css";

export default function CursorLens({
  size = 150,
  blur = 8,
  scale = 1.1,
  borderColor = "rgba(255, 255, 255, 0.1)",
  distortion = 20
}) {
  const lensRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const lens = lensRef.current;
    if (!lens) return;

    let animationId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      // Smooth easing
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      lens.style.transform = `translate(${currentX - size / 2}px, ${currentY - size / 2}px) scale(${scale})`;

      animationId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    animationId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [isMobile, isVisible, size, scale]);

  if (isMobile) return null;

  return (
    <>
      {/* SVG filter for liquid distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="liquid-glass">
            <feGaussianBlur in="SourceGraphic" stdDeviation={distortion / 4} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        ref={lensRef}
        className={`cursor-lens ${isVisible ? "cursor-lens--visible" : ""}`}
        style={{
          width: size,
          height: size,
          "--blur": `${blur}px`,
          "--border-color": borderColor,
        }}
      />
    </>
  );
}
