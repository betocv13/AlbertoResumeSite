import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import "./ReviewSection.css";

function ReviewSection() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const trackRef = useRef(null);
    const [maxIndex, setMaxIndex] = useState(0);

    useEffect(() => {
        async function fetchReviews() {
            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .order("sort_order", { ascending: true });

            if (error) {
                console.error("Error loading reviews:", error);
            } else {
                setReviews(data || []);
            }

            setLoading(false);
        }

        fetchReviews();
    }, []);

    useEffect(() => {
        if (!trackRef.current || reviews.length === 0) return;

        const track = trackRef.current;
        const card = track.querySelector(".reviews__card");
        if (!card) return;

        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        // Get gap from computed styles (works for both desktop and mobile)
        const trackStyles = getComputedStyle(track);
        const gap = parseFloat(trackStyles.gap || "0");
        const cardWidthWithGap = cardRect.width + gap;

        // how many full cards fit in the viewport
        const visibleCount = Math.max(
            1,
            Math.floor(trackRect.width / cardWidthWithGap)
        );

        // last index where the last group of cards is fully visible
        const max = Math.max(0, reviews.length - visibleCount);
        setMaxIndex(max);
    }, [reviews]);


    if (loading || reviews.length === 0) {
        return null;
    }

    const scrollToIndex = (index) => {
        if (!trackRef.current) return;

        const card = trackRef.current.querySelector(".reviews__card");
        if (!card) return;

        const trackStyles = getComputedStyle(trackRef.current);
        const gap = parseFloat(trackStyles.gap || "0");
        const width = card.getBoundingClientRect().width + gap;

        trackRef.current.scrollTo({
            left: width * index,
            behavior: "smooth",
        });
    };

    const handleNext = () => {
        if (activeIndex >= maxIndex) return;
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex);
        scrollToIndex(nextIndex);
    };


    const handlePrev = () => {
        if (activeIndex <= 0) return;
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex);
        scrollToIndex(prevIndex);
    };

    const handleDotClick = (index) => {
        const targetIndex = Math.min(index, maxIndex);
        setActiveIndex(targetIndex);
        scrollToIndex(targetIndex);
    };


    const isAtStart = activeIndex === 0;
    const isAtEnd = activeIndex === maxIndex;


    return (
        <section className="reviews">
            <h2 className="reviews__title">In their words</h2>

            <div className="reviews__carousel">
                <div className="reviews__track" ref={trackRef}>
                    {reviews.map((review) => (
                        <article key={review.id} className="reviews__card">
                            <p className="reviews__text">{review.review_text}</p>

                            <div className="reviews__footer">
                                <div>
                                    <div className="reviews__name">{review.reviewer_name}</div>
                                    <div className="reviews__role">{review.reviewer_title}</div>
                                </div>

                                {review.profile_image_url && (
                                    <img
                                        src={review.profile_image_url}
                                        alt={review.reviewer_name}
                                        className="reviews__avatar"
                                    />
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {/* RIGHT fade — only show if not at end */}
                {!isAtEnd && <div className="reviews__fade reviews__fade--right" />}

                {/* LEFT fade — only show if not at start */}
                {!isAtStart && <div className="reviews__fade reviews__fade--left" />}

                {/* LEFT arrow: only if not at start */}
                {!isAtStart && (
                    <button
                        type="button"
                        className="reviews__arrow reviews__arrow--left"
                        onClick={handlePrev}
                        aria-label="Previous testimonial"
                    >
                        <span className="reviews__arrow-icon">‹</span>
                    </button>
                )}

                {/* RIGHT arrow: only if not at end */}
                {!isAtEnd && (
                    <button
                        type="button"
                        className="reviews__arrow reviews__arrow--right"
                        onClick={handleNext}
                        aria-label="Next testimonial"
                    >
                        <span className="reviews__arrow-icon">›</span>
                    </button>
                )}
            </div>

            <div className="reviews__dots">
                {reviews.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={
                            "reviews__dot" +
                            (index === activeIndex ? " reviews__dot--active" : "")
                        }
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default ReviewSection;
