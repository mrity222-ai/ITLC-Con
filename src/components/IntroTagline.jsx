import React, { useState, useEffect } from 'react';

const IntroTagline = () => {
  const [data, setData] = useState({
    heading: 'Crafting Excellence in Every Project',
    subtext: 'We combine cutting-edge building technology with timeless craftsmanship to deliver premium structures that exceed the highest industry standards of quality, safety, and durability.'
  });

  useEffect(() => {
    fetch('/api/cms.php')
      .then(res => res.json())
      .then(cms => {
        if (cms && cms.tagline) {
          setData(cms.tagline);
        }
      })
      .catch(err => {
        console.error("Error fetching tagline from API, falling back to localStorage", err);
        const saved = localStorage.getItem('cms_tagline');
        if (saved) {
          setData(JSON.parse(saved));
        }
      });
  }, []);

  return (
    <section className="intro-tagline-section bg-navy text-white">
      <div className="container text-center scroll-reveal">
        <span className="accent-tag">Our Commitment</span>
        <h2 className="tagline-heading">{data.heading}</h2>
        <div className="tagline-divider"></div>
        <p className="tagline-subtext">{data.subtext}</p>
      </div>
    </section>
  );
};

export default IntroTagline;
