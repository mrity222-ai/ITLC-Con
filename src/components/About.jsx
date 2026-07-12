import React, { useState, useEffect, useRef } from 'react';

const About = () => {
  const sectionRef = useRef(null);
  const [stats, setStats] = useState({
    experience: 0,
    projects: 0,
    awards: 0
  });
  const [hasStarted, setHasStarted] = useState(false);

  const [aboutData, setAboutData] = useState({
    title: 'Pioneering Premium Construction & Architecture',
    text1: 'For over 10 years, InfraVision by ITLC India Private Limited has stood at the intersection of aesthetic design and structural integrity. We treat every project not just as a building, but as a monument to precision engineering.',
    text2: 'Our collaborative team of architects, project managers, and expert builders ensure that each detail aligns with our client\'s vision. From ground breaking to key handover, our commitment to green practices, safety, and modern design stands unmatched.',
    experience: 10,
    projects: 120,
    awards: 45
  });

  useEffect(() => {
    fetch('/api/cms.php')
      .then(res => res.json())
      .then(cms => {
        if (cms && cms.about) {
          setAboutData(cms.about);
        }
      })
      .catch(err => {
        console.error("Error fetching about data from API, falling back to localStorage", err);
        const saved = localStorage.getItem('cms_about');
        if (saved) {
          setAboutData(JSON.parse(saved));
        }
      });
  }, []);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            animateStats();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, [hasStarted, aboutData]);

  const animateStats = () => {
    const targets = { 
      experience: aboutData.experience, 
      projects: aboutData.projects, 
      awards: aboutData.awards 
    };
    const duration = 2000; // 2 seconds
    const intervalTime = 20;
    const steps = duration / intervalTime;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        experience: Math.min(Math.round((targets.experience / steps) * step), targets.experience),
        projects: Math.min(Math.round((targets.projects / steps) * step), targets.projects),
        awards: Math.min(Math.round((targets.awards / steps) * step), targets.awards)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);
  };

  return (
    <section id="about" ref={sectionRef} className="about-section section-padding">
      <div className="container">
        <div className="section-grid">
          <div className="about-content scroll-reveal">
            <span className="section-tag">Who We Are</span>
            <h2 className="section-title">{aboutData.title}</h2>
            <p className="about-text">{aboutData.text1}</p>
            <p className="about-text">{aboutData.text2}</p>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{stats.experience}</span>
                <span className="stat-plus">+</span>
                <span className="stat-label">Years of Experience</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.projects}</span>
                <span className="stat-plus">+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.awards}</span>
                <span className="stat-plus">+</span>
                <span className="stat-label">Design Awards</span>
              </div>
            </div>
          </div>

          <div className="about-image-wrapper scroll-reveal delay-200">
            <div className="image-accent-border"></div>
            <img src="assets/images/about.jpg" alt="Architects discussing details on a modern site" className="about-img" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
