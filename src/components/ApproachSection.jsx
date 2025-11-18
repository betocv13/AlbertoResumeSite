import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // adjust the path if needed
import "./ApproachSection.css";

function ApproachSection() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApproachItems() {
            const { data, error } = await supabase
                .from("approach_items")
                .select("*")
                .order("number", { ascending: true });

            if (error) {
                console.error("Error loading approach items:", error);
            } else {
                setItems(data || []);
            }

            setLoading(false);
        }

        fetchApproachItems();
    }, []);

    if (loading) {
        return null; // or a small loading text if you want
    }

    return (
        <section className="approach">
            <h2 className="approach__title">Approach</h2>

            <div className="approach__grid">
                {items.map((item) => (
                    <div key={item.id} className="approach__item">
                        <div className="approach__number">{item.number}</div>

                        <p className="approach__text">
                            <span className="approach__text-title">{item.title}</span>{" "}
                            <span className="approach__text-desc">{item.description}</span>
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ApproachSection;
