import React, { useState, useEffect } from 'react';

const Testimonials = () => {
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
    },
    {
      name: "David Chen",
      avatar: "https://i.pravatar.cc/60?img=12",
      text: "Professional project management from start to finish. They handled all site permits and zoning clearances seamlessly.",
      stars: 4
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
      .catch(err => console.error("Error loading testimonials:", err));
  }, []);

  // Duplicate reviews to create a seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section id="testimonials" className="testimonials-section section-padding">
      <div className="container">
        <div className="text-center scroll-reveal">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">Experience Shared by Our Clients</h2>
          <p className="section-subtitle">
            We are proud of the strong professional partnerships we build and the premium spaces we construct for our clients.
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Auto-Scrolling Part */}
      <div className="scrolling-testimonials-container scroll-reveal delay-200">
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

export default Testimonials;
