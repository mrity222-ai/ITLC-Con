import React from 'react';

const PremiumServices = ({ setCurrentPage }) => {
  const premiumServicesData = [
    {
      image: 'assets/images/service_residential.jpg',
      number: '01',
      title: 'PROPERTY SHOWCASE',
      description: 'Sleek high-impact studio that elevates your property\'s visual presence.'
    },
    {
      image: 'assets/images/service_commercial.jpg',
      number: '02',
      title: 'SITE PLANNING',
      description: 'Comprehensive zoning compliance and site grading layout engineering.'
    },
    {
      image: 'assets/images/service_renovation.jpg',
      number: '03',
      title: 'BUILDING DESIGN',
      description: 'State-of-the-art virtual blueprints and architectural structural layouts.'
    },
    {
      image: 'assets/images/process_planning.jpg',
      number: '04',
      title: 'SPACE PLANNING',
      description: 'Optimized interior load paths and custom open-concept room divisions.'
    }
  ];

  return (
    <section className="premium-services-section">
      <div className="container">
        <div className="premium-services-header scroll-reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '40px', textAlign: 'left' }}>
          <h2 className="premium-services-title" style={{ margin: 0 }}>OUR SERVICES</h2>
          <button 
            className="heading-arrow-btn" 
            onClick={() => {
              setCurrentPage('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="View all services"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        
        <div className="premium-services-grid scroll-reveal delay-200">
          {premiumServicesData.map((service, idx) => (
            <div key={idx} className="premium-service-card">
              <div className="premium-service-image-wrapper">
                <img src={service.image} alt={service.title} className="premium-service-img" />
              </div>
              <div className="premium-service-info">
                <span className="premium-service-number">{service.number}</span>
                <h3 className="premium-service-card-title">{service.title}</h3>
                <p className="premium-service-desc">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumServices;
