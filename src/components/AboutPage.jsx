import React, { useState, useEffect, useRef } from 'react';

const AboutPage = ({ setCurrentPage }) => {
  const sectionRef = useRef(null);
  const [stats, setStats] = useState({ experience: 0, projects: 0, awards: 0 });
  const [hasStarted, setHasStarted] = useState(false);
  const canvasRef = useRef(null);

  const [aboutData, setAboutData] = useState({
    title: 'Pioneering Premium Construction & Architecture',
    text1: 'For over 10 years, InfraVision by ITLC India Private Limited has stood at the intersection of aesthetic design and structural integrity. We treat every project not just as a building, but as a monument to precision engineering.',
    text2: 'Our collaborative team of architects, project managers, and expert builders ensure that each detail aligns with our client\'s vision. From ground breaking to key handover, our commitment to green practices, safety, and modern design stands unmatched.',
    experience: 10,
    projects: 120,
    awards: 45
  });

  const [features, setFeatures] = useState([
    {
      icon: 'fa-screwdriver-wrench',
      title: 'END-TO-END SOLUTIONS',
      description: 'From initial architectural blueprints and zoning clearances to final handover structural compliance inspections.'
    },
    {
      icon: 'fa-shield-halved',
      title: 'SAFETY INTEGRITY',
      description: 'Enforcing a zero-incident safety culture backed by certified OSHA-regulated audits and strict weekly site reviews.'
    },
    {
      icon: 'fa-leaf',
      title: 'SUSTAINABLE ENGINEERING',
      description: 'Incorporating green eco-concrete mixtures, thermal insulation systems, and LEED-compliant energy-efficient layouts.'
    }
  ]);

  useEffect(() => {
    fetch('/api/cms.php')
      .then(res => res.json())
      .then(cms => {
        if (cms) {
          if (cms.about) setAboutData(cms.about);
          if (cms.features && cms.features.length > 0) setFeatures(cms.features);
        }
      })
      .catch(err => {
        console.error("Error fetching about page data from API:", err);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            animateStats(aboutData);
          }
        });
      },
      { threshold: 0.2 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasStarted, aboutData]);

  const animateStats = (data) => {
    const targets = { 
      experience: data.experience, 
      projects: data.projects, 
      awards: data.awards 
    };
    const duration = 2000;
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
      if (step >= steps) clearInterval(timer);
    }, intervalTime);
  };

  useEffect(() => {
    // Beautiful particles canvas for about backdrop
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Spark {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.vy = Math.random() * -0.3 - 0.1;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.y += this.vy;
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.fillStyle = `rgba(61, 94, 225, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const sparks = Array.from({ length: 40 }, () => new Spark());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks.forEach(s => {
        s.update();
        s.draw();
      });
      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="services-page-wrapper">
      <canvas ref={canvasRef} className="services-particles-canvas"></canvas>

      <div className="services-page-header">
        <div className="container text-center">
          <span className="orange-blue-pill animate-fade-in-down">Pioneering Premium Construction</span>
          <h1 className="services-page-title animate-fade-in-up">
            About <span className="text-highlight-mint">Us</span>
          </h1>
          <p className="services-page-subtitle animate-fade-in-up delay-200">
            Learn about our core pillars, engineering history, and technical certifications.
          </p>
        </div>
      </div>

      <div className="container pb-24" ref={sectionRef}>
        {/* Core History Story Grid */}
        <div className="about-section pt-0 pb-16">
          <div className="section-grid grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="about-content scroll-reveal active">
              <span className="section-tag">Who We Are</span>
              <h2 className="section-title text-white">{aboutData.title}</h2>
              <p className="about-text">
                {aboutData.text1}
              </p>
              <p className="about-text">
                {aboutData.text2}
              </p>

              {/* Animated Stats Cards */}
              <div className="stats-grid grid grid-cols-3 gap-6 mt-8">
                <div className="stat-card p-4 bg-white/3 border border-white/6 rounded-xl text-center">
                  <span className="stat-number text-highlight-mint text-3xl font-black block">{stats.experience}</span>
                  <span className="stat-label text-xs text-white/50 block mt-1">Years Exp</span>
                </div>
                <div className="stat-card p-4 bg-white/3 border border-white/6 rounded-xl text-center">
                  <span className="stat-number text-highlight-mint text-3xl font-black block">{stats.projects}</span>
                  <span className="stat-label text-xs text-white/50 block mt-1">Projects</span>
                </div>
                <div className="stat-card p-4 bg-white/3 border border-white/6 rounded-xl text-center">
                  <span className="stat-number text-highlight-mint text-3xl font-black block">{stats.awards}</span>
                  <span className="stat-label text-xs text-white/50 block mt-1">Awards</span>
                </div>
              </div>
            </div>

            <div className="about-image-wrapper scroll-reveal active">
              <div className="image-accent-border"></div>
              <img src="assets/images/about.jpg" alt="Architects on site" className="about-img rounded-2xl shadow-lg border border-white/10" />
            </div>
          </div>
        </div>

        {/* Feature Grid SaaS style */}
        <div className="why-header scroll-reveal active text-center mb-12">
          <div className="orange-blue-pill mb-4 self-center inline-block">
            <span>TECHNICAL EXCELLENCE</span>
          </div>
          <h2 className="why-main-title text-white font-extrabold text-2xl tracking-wide">
            Our Core Quality Standards
          </h2>
        </div>

        <div className="why-features-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 scroll-reveal active">
          {features.map((feature, idx) => (
            <div key={idx} className="why-feature-card p-6 bg-white/3 border border-white/8 rounded-xl text-center">
              <div className="why-feature-icon-box w-12 h-12 rounded-full bg-green-500/10 text-green-accent flex items-center justify-center mx-auto mb-4 text-xl">
                <i className={`fa-solid ${feature.icon}`}></i>
              </div>
              <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed m-0">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Dynamic CTA Banner */}
        <div className="services-cta-banner scroll-reveal active mt-16 text-center">
          <h3>Need Professional Engineering Consultation?</h3>
          <p>Schedule a call with our registered AIA architects and OSHA coordinators to review your designs.</p>
          <a href="#contact" className="btn btn-primary mt-6" onClick={(e) => {
            e.preventDefault();
            setCurrentPage('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            Contact Our Engineers <i className="fa-solid fa-arrow-right icon-right-sm"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
