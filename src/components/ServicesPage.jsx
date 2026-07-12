import React, { useEffect, useState, useRef } from 'react';

const ServicesPage = ({ setCurrentPage }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showCards, setShowCards] = useState(false);
  const canvasRef = useRef(null);

  const [serviceList, setServiceList] = useState([
    {
      id: 1,
      image: 'assets/images/service_residential.jpg',
      icon: 'fa-house-chimney',
      title: 'Residential Construction',
      description: 'Custom luxury villas, estates, and eco-friendly smart homes engineered for modern comfort, energy efficiency, and premium longevity.',
      details: {
        timeline: '8 - 14 Months',
        materials: 'Eco-Concrete M40, Recycled Steel, Premium Timber',
        rating: 'A+ Structural Integrity Passed',
        solar: 'Full integration with APN Solar systems',
        costIndex: 'Custom bidding available'
      }
    },
    {
      id: 2,
      image: 'assets/images/service_commercial.jpg',
      icon: 'fa-building',
      title: 'Commercial Construction',
      description: 'High-performance office complexes, retail centers, and industrial facilities planned with scalable layouts and robust building physics.',
      details: {
        timeline: '12 - 24 Months',
        materials: 'Grade 50 Carbon Steel, Reinforced Fire-concrete, Energy glass',
        rating: 'OSHA Zero-Incident Approved',
        solar: 'High-capacity roof grid layouts and net metering',
        costIndex: 'Standard corporate framework bids'
      }
    },
    {
      id: 3,
      image: 'assets/images/service_renovation.jpg',
      icon: 'fa-trowel-bricks',
      title: 'Renovation & Remodeling',
      description: 'Transforming historic or dated structures into contemporary spaces, adding modern utility while maintaining architectural integrity.',
      details: {
        timeline: '3 - 6 Months',
        materials: 'Custom retrofitted steel beams, composite insulation panels',
        rating: 'ISO 9001 Structural Restoration Certified',
        solar: 'Retrofit solar hot water and electrical tie-in',
        costIndex: 'Phased inspection estimations'
      }
    },
    {
      id: 4,
      image: 'assets/images/process_planning.jpg',
      icon: 'fa-compass-drafting',
      title: 'Architectural Space Planning',
      description: 'Optimized interior load paths, virtual 3D floor plan walk-throughs, and custom room layouts for modern commercial or residential settings.',
      details: {
        timeline: '1 - 2 Months',
        materials: 'AutoCAD, Revit, and BIM compliance specifications',
        rating: 'AIA Registered design blueprints',
        solar: 'Sun-path optimization layouts for natural thermal heating',
        costIndex: 'Per square foot design rates'
      }
    }
  ]);

  // Load from API
  useEffect(() => {
    fetch('/api/services.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServiceList(data);
        }
      })
      .catch(err => console.error("Error loading services page:", err));
  }, []);

  // Cascading entry animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Floating particles canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = `rgba(61, 94, 225, ${this.opacity})`; // Royal blue theme color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particleArray = Array.from({ length: 45 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particleArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCtaClick = (e) => {
    e.preventDefault();
    setCurrentPage('home');
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  return (
    <div className="services-page-wrapper">
      {/* Floating Canvas */}
      <canvas ref={canvasRef} className="services-particles-canvas"></canvas>

      {/* Hero Banner Header */}
      <div className="services-page-header">
        <div className="container text-center">
          <span className="orange-blue-pill animate-fade-in-down">Premium Architecture & Contracting</span>
          <h1 className="services-page-title animate-fade-in-up">
            Our Structural <span className="text-highlight-mint">Services</span>
          </h1>
          <p className="services-page-subtitle animate-fade-in-up delay-200">
            Precision engineering, LEED sustainable systems, and high-end materials combined to craft spaces that stand the test of time.
          </p>
        </div>
      </div>

      {/* Services Showcase Cards Section */}
      <div className="container pb-24">
        <div className={`services-page-grid ${showCards ? 'active' : ''}`}>
          {serviceList.map((service, index) => (
            <div 
              key={service.id} 
              className="services-page-card"
              style={{ transitionDelay: `${index * 120}ms` }}
              onClick={() => setSelectedService(service)}
            >
              <div className="card-image-panel">
                <img src={service.image} alt={service.title} className="card-panel-img" />
                <div className="card-panel-overlay">
                  <span>View Specifications <i className="fa-solid fa-arrow-right"></i></span>
                </div>
              </div>
              <div className="card-content-panel">
                <div className="card-icon-badge">
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
                <h3 className="card-panel-title">{service.title}</h3>
                <p className="card-panel-desc">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic CTA Banner */}
        <div className="services-cta-banner scroll-reveal active mt-16 text-center">
          <h3>Need a Customized Structural Bid?</h3>
          <p>Contact our project estimations desk to review blueprints, environmental guidelines, and scheduling drafts.</p>
          <a href="#contact" className="btn btn-primary mt-6" onClick={handleCtaClick}>
            Get a Quote <i className="fa-solid fa-paper-plane icon-right-sm"></i>
          </a>
        </div>
      </div>

      {/* Interactive Detail specifications Modal Overlay */}
      {selectedService && selectedService.details && (
        <div className="query-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="query-modal-card spec-modal" onClick={(e) => e.stopPropagation()}>
            <button className="query-close-btn" onClick={() => setSelectedService(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header">
              <div className="spec-icon-box">
                <i className={`fa-solid ${selectedService.icon}`}></i>
              </div>
              <h3>{selectedService.title} Specs</h3>
              <p>Real-time engineering limits and construction standards.</p>
            </div>

            <div className="spec-modal-body">
              <div className="spec-stat-row">
                <span className="spec-label">Timeline Range:</span>
                <span className="spec-val font-bold text-highlight-mint">{selectedService.details.timeline}</span>
              </div>
              <div className="spec-stat-row">
                <span className="spec-label">Material Spec:</span>
                <span className="spec-val">{selectedService.details.materials}</span>
              </div>
              <div className="spec-stat-row">
                <span className="spec-label">Zoning & Safety:</span>
                <span className="spec-val text-green-500">{selectedService.details.rating}</span>
              </div>
              <div className="spec-stat-row">
                <span className="spec-label">Solar Integration:</span>
                <span className="spec-val">{selectedService.details.solar}</span>
              </div>
              <div className="spec-stat-row">
                <span className="spec-label">Billing Rate:</span>
                <span className="spec-val">{selectedService.details.costIndex}</span>
              </div>

              <div className="spec-desc-box mt-6">
                <h6>Core Objective:</h6>
                <p>{selectedService.description}</p>
              </div>
            </div>

            <button className="btn btn-primary w-full mt-6" onClick={(e) => {
              setSelectedService(null);
              handleCtaClick(e);
            }}>
              Consult on this Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
