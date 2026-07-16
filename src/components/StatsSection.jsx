import React, { useEffect, useState, useRef } from "react";
import "./StatsSection.css";

function StatsSection() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState([0, 0, 0]);
    const hasAnimated = useRef(false);

    const stats = [
        { value: 3, suffix: "", label: "Years of experience" },
        { value: 12.5, suffix: "K", label: "Followers on tiktok" },
        { value: 18, suffix: "+", label: "Projects & counting" },
    ];

    // Intersection Observer to detect when section is in view
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

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Count-up animation
    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000; // 2 seconds
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease-out cubic for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts(
                stats.map((stat) => {
                    const current = stat.value * easeOut;
                    // For decimal values like 12.5, keep one decimal place
                    if (stat.value % 1 !== 0) {
                        return Math.round(current * 10) / 10;
                    }
                    return Math.round(current);
                })
            );

            if (frame >= totalFrames) {
                clearInterval(counter);
                // Ensure final values are exact
                setCounts(stats.map((stat) => stat.value));
            }
        }, 1000 / frameRate);

        return () => clearInterval(counter);
    }, [isVisible]);

    const formatNumber = (num, index) => {
        const stat = stats[index];
        // Format decimal numbers
        if (stat.value % 1 !== 0) {
            return num.toFixed(1);
        }
        return num;
    };

    return (
        <section className="stats" ref={sectionRef}>
            <h2 className="section-heading stats-title">Statistics</h2>
            <div className="stats__container">
                {stats.map((stat, index) => (
                    <div key={stat.label} className="stats__item">
                        <span className="stats__number">
                            {formatNumber(counts[index], index)}
                            {stat.suffix}
                        </span>
                        <span className="stats__label">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default StatsSection;
