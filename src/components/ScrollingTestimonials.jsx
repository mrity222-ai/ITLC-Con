import React, { useState, useEffect } from 'react';

const ScrollingTestimonials = () => {
  const [reviews, setReviews] = useState([
    {
      name: "Marcus Vance",
      avatar: "https://i.pravatar.cc/60?img=33",
      text: "The structural precision and steel framing work delivered by InfraVision exceeded our commercial zoning expectations.",
      stars: 5
    },
    {
      name: "Sophia Bennett",
      avatar: "https://i.pravatar.cc/60?img=49",
      text: "Our residential custom villa build was completed ahead of schedule. The concrete foundation quality is top-notch.",
      stars: 5
    }
  ]);

  useEffect(() => {
    fetch('/api/testimonials.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(err => console.error("Error loading scrolling reviews:", err));
  }, []);

  // Duplicate reviews to create a seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="scrolling-testimonials-section">
      <div className="scrolling-testimonials-container">
        <div className="scrolling-track">
          {duplicatedReviews.map((review, idx) => (
            <div key={idx} className="scrolling-review-card">
              <div className="scrolling-card-header">
                <img src={review.avatar} alt={review.name} className="scrolling-avatar" />
                <h4 className="scrolling-name">{review.name}</h4>
              </div>
              <p className="scrolling-text">"{review.text}"</p>
              <div className="scrolling-stars">
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <span key={starIdx} className={`star ${starIdx < review.stars ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollingTestimonials;
