import React from 'react';

const InteriorDesign = ({ setCurrentPage }) => {
  const interiorShowcaseData = [
    {
      image: 'assets/images/interior_living.jpg',
      number: '01',
      title: 'MODERN LIVING ROOMS',
      description: 'Sophisticated open-concept layouts integrating custom ambient light installations, natural hardwoods, and premium textures.'
    },
    {
      image: 'assets/images/interior_kitchen.jpg',
      number: '02',
      title: 'MINIMALIST KITCHENS',
      description: 'State-of-the-art culinary studios featuring clean lines, premium stone countertops, and hidden storage integration.'
    },
    {
      image: 'assets/images/interior_bedroom.jpg',
      number: '03',
      title: 'LUXURIOUS MASTER BEDROOMS',
      description: 'Cozy sanctuaries blending warm lighting structures, custom upholstered accents, and acoustic wall panels.'
    },
    {
      image: 'assets/images/interior_dining.jpg',
      number: '04',
      title: 'CREATIVE DINING SPACES',
      description: 'Airy entertainment zones with custom furniture curation, statement pendant lighting, and seamless garden views.'
    }
  ];

  return (
    <section className="interior-showcase-section">
      <div className="container">
        <div className="premium-services-header scroll-reveal" style={{ textAlign: 'left', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <div className="orange-blue-pill" style={{ display: 'inline-block', margin: 0 }}>
              <span>INTERIOR EXCELLENCE</span>
            </div>
            <button 
              className="heading-arrow-btn" 
              onClick={() => {
                setCurrentPage('interior');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="View interior showcase"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <h2 className="premium-services-title" style={{ marginTop: '10px', margin: 0, textAlign: 'left' }}>INTERIOR DESIGN SHOWCASE</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', maxWidth: '600px', margin: '12px 0 0 0', textAlign: 'left', fontSize: '0.95rem', lineHeight: '1.6' }}>
            From virtual blueprints to final material curation, we craft modern, bespoke interior spaces that reflect luxury, functionality, and structural precision.
          </p>
        </div>
        
        <div className="premium-services-grid scroll-reveal delay-200" style={{ marginTop: '40px' }}>
          {interiorShowcaseData.map((item, idx) => (
            <div key={idx} className="premium-service-card" style={{ transition: 'transform 0.4s ease, box-shadow 0.4s ease' }}>
              <div className="premium-service-image-wrapper" style={{ overflow: 'hidden' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="premium-service-img" 
                  style={{ transition: 'transform 0.5s ease' }} 
                />
              </div>
              <div className="premium-service-info">
                <span className="premium-service-number" style={{ color: '#3D5EE1' }}>{item.number}</span>
                <h3 className="premium-service-card-title">{item.title}</h3>
                <p className="premium-service-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteriorDesign;
