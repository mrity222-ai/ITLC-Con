import React, { useState, useEffect, useRef } from 'react';

const ProjectsPage = ({ setCurrentPage }) => {
  const [projectsData, setProjectsData] = useState([
    {
      id: 1,
      title: 'The Aurelia Villa',
      description: 'A luxurious modern residential estate featuring high-concept geometric architecture and open light-filled spaces.',
      image: 'assets/images/project1.jpg',
      category: 'Residential',
      location: 'Beverly Hills, CA',
      year: '2025',
      client: 'Private Owner',
      specs: {
        area: '8,500 sq ft',
        concrete: 'Grade M40 Self-Healing',
        framing: 'Heavy Timber & Structural Steel',
        leed: 'Gold Certified'
      }
    },
    {
      id: 2,
      title: 'Vertex Office Tower',
      description: 'A pioneering commercial skyscraper incorporating sustainable green design elements and advanced structural steel systems.',
      image: 'assets/images/project2.jpg',
      category: 'Commercial',
      location: 'Seattle, WA',
      year: '2026',
      client: 'Vertex Holdings',
      specs: {
        area: '185,000 sq ft',
        concrete: 'High-Strength Eco-Concrete',
        framing: 'Structural Carbon Steel Grade 50',
        leed: 'Platinum Certified'
      }
    },
    {
      id: 3,
      title: 'Ironclad Warehouse Loft',
      description: 'A modern industrial warehouse conversion preserving classic brick and iron elements while integrating high-end modern amenities.',
      image: 'assets/images/project4.jpg',
      category: 'Industrial',
      location: 'Portland, OR',
      year: '2024',
      client: 'Ironclad Development',
      specs: {
        area: '42,000 sq ft',
        concrete: 'Reinforced Retrofit Slabs',
        framing: 'Exposed Steel Spans',
        leed: 'Certified Silver'
      }
    }
  ]);

  useEffect(() => {
    fetch('/api/projects.php')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProjectsData(data);
        }
      })
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const canvasRef = useRef(null);

  const filteredProjects = filter === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  useEffect(() => {
    // Canvas backdrop line-connect grid effect for premium tech vibe
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

    class Point {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 0.3 - 0.15;
        this.vy = Math.random() * 0.3 - 0.15;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }
    }

    const points = Array.from({ length: 25 }, () => new Point());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(61, 94, 225, 0.04)';
      ctx.lineWidth = 1;

      // Draw lines
      for (let i = 0; i < points.length; i++) {
        points[i].update();
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const handleCtaClick = (e) => {
    e.preventDefault();
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="services-page-wrapper">
      <canvas ref={canvasRef} className="services-particles-canvas"></canvas>

      <div className="services-page-header">
        <div className="container text-center">
          <span className="orange-blue-pill animate-fade-in-down">Our Portfolio showcase</span>
          <h1 className="services-page-title animate-fade-in-up">
            Featured <span className="text-highlight-mint">Projects</span>
          </h1>
          <p className="services-page-subtitle animate-fade-in-up delay-200">
            A selective exhibition of residential estates, commercial office hubs, and green industrial conversions.
          </p>
        </div>
      </div>

      <div className="container pb-24">
        {/* Filters */}
        <div className="projects-filter-bar text-center mb-10 z-10 relative scroll-reveal active">
          {['All', 'Residential', 'Commercial', 'Industrial'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="services-page-grid active">
          {filteredProjects.map((project, idx) => (
            <div 
              key={project.id} 
              className="services-page-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="card-image-panel">
                <img src={project.image} alt={project.title} className="card-panel-img" />
                <div className="card-panel-overlay">
                  <span>View Details <i className="fa-solid fa-expand"></i></span>
                </div>
              </div>
              <div className="card-content-panel">
                <span className="text-xs font-bold text-highlight-mint uppercase tracking-wider block mb-2">{project.category}</span>
                <h3 className="card-panel-title m-0 mb-2">{project.title}</h3>
                <p className="card-panel-desc m-0">{project.description}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/6 text-xs text-white/50">
                  <span><i className="fa-solid fa-location-dot mr-1"></i>{project.location}</span>
                  <span><i className="fa-regular fa-calendar-check mr-1"></i>{project.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="services-cta-banner scroll-reveal active mt-16 text-center">
          <h3>Ready to Build Your Custom Venture?</h3>
          <p>Collaborate with InfraVision to design blueprint mockups, secure municipal permits, and estimate structural timelines.</p>
          <a href="#contact" className="btn btn-primary mt-6" onClick={handleCtaClick}>
            Partner With Us <i className="fa-solid fa-arrow-right icon-right-sm"></i>
          </a>
        </div>
      </div>

      {/* Details specs overlay modal */}
      {selectedProject && (
        <div className="query-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="query-modal-card spec-modal" onClick={(e) => e.stopPropagation()}>
            <button className="query-close-btn" onClick={() => setSelectedProject(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header">
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-2">{selectedProject.category} Project</span>
              <h3>{selectedProject.title} Specifications</h3>
              <p>Key metrics and structural execution details.</p>
            </div>

            <div className="spec-modal-body">
              <div className="spec-stat-row">
                <span className="spec-label">Client Name:</span>
                <span className="spec-val font-bold">{selectedProject.client}</span>
              </div>
              <div className="spec-stat-row">
                <span className="spec-label">Project Site Area:</span>
                <span className="spec-val">{selectedProject.specs.area}</span>
              </div>
              <div className="spec-stat-row">
                <span className="spec-label">Concrete Mixture Grade:</span>
                <span className="spec-val">{selectedProject.specs.concrete}</span>
              </div>
              <div className="spec-stat-row">
                <span className="spec-label">Framing / Structure:</span>
                <span className="spec-val">{selectedProject.specs.framing}</span>
              </div>
              <div className="spec-stat-row">
                <span className="spec-label">LEED Eco Rating:</span>
                <span className="spec-val text-green-accent font-bold"><i className="fa-solid fa-leaf mr-1"></i>{selectedProject.specs.leed}</span>
              </div>

              <div className="spec-desc-box mt-6">
                <h6>Project Summary:</h6>
                <p>{selectedProject.description}</p>
              </div>
            </div>

            <button className="btn btn-primary w-full mt-6" onClick={(e) => {
              setSelectedProject(null);
              handleCtaClick(e);
            }}>
              Inquire About Similar Build
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
