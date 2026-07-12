import React, { useState, useEffect } from 'react';

const Services = () => {
  const [serviceList, setServiceList] = useState([
    {
      image: 'assets/images/service_residential.jpg',
      icon: 'fa-house-chimney',
      title: 'Residential Construction',
      description: 'Custom luxury villas, estates, and eco-friendly smart homes engineered for modern comfort, energy efficiency, and premium longevity.'
    },
    {
      image: 'assets/images/service_commercial.jpg',
      icon: 'fa-building',
      title: 'Commercial Construction',
      description: 'High-performance office complexes, retail centers, and industrial facilities planned with scalable layouts and robust building physics.'
    },
    {
      image: 'assets/images/service_renovation.jpg',
      icon: 'fa-trowel-bricks',
      title: 'Renovation & Remodeling',
      description: 'Transforming historic or dated structures into contemporary spaces, adding modern utility while maintaining architectural integrity.'
    }
  ]);

  useEffect(() => {
    fetch('/api/services.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServiceList(data);
        }
      })
      .catch(err => console.error("Error loading services:", err));
  }, []);

  const scrollToContact = (e) => {
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
    <section id="services" className="services-section section-padding bg-light">
      <div className="container">
        <div className="text-center scroll-reveal">
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">Services That Fit Your Needs</h2>
          <p className="section-subtitle">
            From design drafting to heavy masonry, we provide complete, integrated structural execution to match your project specifications.
          </p>
        </div>

        <div className="grid-layout services-grid">
          {serviceList.map((service, index) => (
            <div key={index} className="card service-card scroll-reveal">
              <div className="service-card-image-wrapper">
                <img src={service.image} alt={service.title} className="service-card-img" />
              </div>
              <div className="service-card-body">
                <div className="service-icon">
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <a href="#contact" className="service-link" onClick={scrollToContact}>
                  Learn More <i className="fa-solid fa-chevron-right icon-right-sm"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
