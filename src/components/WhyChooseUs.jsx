import React, { useState, useEffect } from 'react';

const WhyChooseUs = ({ setCurrentPage }) => {
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
        if (cms && cms.features && cms.features.length > 0) {
          setFeatures(cms.features);
        }
      })
      .catch(err => {
        console.error("Error fetching features from API, falling back to localStorage", err);
        const saved = localStorage.getItem('cms_features');
        if (saved) {
          setFeatures(JSON.parse(saved));
        }
      });
  }, []);

  const handleConsultClick = (e) => {
    e.preventDefault();
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
  };

  return (
    <section id="about" className="why-choose-us-section section-padding">
      <div className="container">
        
        <div className="why-header scroll-reveal" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', marginBottom: '15px' }}>
            <div className="orange-blue-pill" style={{ margin: 0 }}>
              <span>WHY CHOOSE INFRA VISION</span>
            </div>
            <button 
              className="heading-arrow-btn" 
              onClick={() => {
                setCurrentPage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="View about us"
              style={{ position: 'absolute', right: 0 }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <h2 className="why-main-title" style={{ color: '#3D5EE1', margin: '20px auto 0 auto', textAlign: 'center' }}>
            <span>BUILT ON TRUST AND</span><br />
            <span>QUALITY CONSTRUCTION</span>
          </h2>
        </div>

        {/* 3-Column Features Grid */}
        <div className="why-features-grid scroll-reveal delay-200">
          {features.map((feature, idx) => (
            <div key={idx} className="why-feature-card">
              <div className="why-feature-icon-box">
                <i className={`fa-solid ${feature.icon}`}></i>
              </div>
              <h3 className="why-feature-title">{feature.title}</h3>
              <p className="why-feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Highlight Banner Section (Bottom Part) */}
        <div className="why-highlight-banner scroll-reveal delay-400">
          
          {/* Left Side Info Panel */}
          <div className="highlight-left-panel">
            <div className="orange-blue-pill mini-pill">
              <span>POWERED BY ITLC INDIA PVT LTD</span>
            </div>
            <div className="partner-branding">
              <div className="green-badge-box">
                <i className="fa-solid fa-award"></i>
              </div>
              <h3 className="partner-title">PREMIUM CONSTRUCTION & DESIGN SERVICES</h3>
            </div>
            <p className="partner-desc">
              InfraVision is powered by ITLC India Pvt Ltd, delivering end-to-end expertise in modern building construction, luxury villas, modular kitchen systems, and premium interior architecture designed to elevate modern living.
            </p>
            
            {/* 4 Checkmark items in a row */}
            <div className="partner-checkmarks-row">
              <div className="checkmark-item">
                <i className="fa-solid fa-circle-check"></i>
                <span>INDUSTRY STANDARDS</span>
              </div>
              <div className="checkmark-item">
                <i className="fa-solid fa-circle-check"></i>
                <span>QUALITY ENGINEERING</span>
              </div>
              <div className="checkmark-item">
                <i className="fa-solid fa-circle-check"></i>
                <span>OSHA CERTIFIED</span>
              </div>
              <div className="checkmark-item">
                <i className="fa-solid fa-circle-check"></i>
                <span>LEED COMPLIANT</span>
              </div>
            </div>
          </div>

          {/* Right Side Support CTA Card */}
          <div className="highlight-right-card">
            <div className="support-icon-wrapper">
              <i className="fa-solid fa-headset"></i>
            </div>
            <h3 className="support-card-title">DEDICATED EXPERT SUPPORT</h3>
            <p className="support-card-desc">
              Need assistance with your home construction plans, modular kitchen designs, or interior styling layout? Consult with our specialists today.
            </p>
            <a href="#contact" className="support-consult-btn" onClick={handleConsultClick}>
              Consult Now <i className="fa-solid fa-arrow-right-long"></i>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
