import React, { useState, useEffect } from 'react';

const OurClients = () => {
  const [clients, setClients] = useState([
    { name: 'Marcus Vance', image: 'assets/images/clients/client1.jpg' },
    { name: 'Sophia Bennett', image: 'assets/images/clients/client2.jpg' },
    { name: 'David Chen', image: 'assets/images/clients/client3.jpg' },
    { name: 'Elena Rostova', image: 'assets/images/clients/client4.jpg' }
  ]);

  useEffect(() => {
    fetch('/api/clients.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setClients(data);
      })
      .catch(err => console.log('Error loading clients:', err));
  }, []);

  const isFontAwesome = (str) => {
    return typeof str === 'string' && (str.startsWith('fa-') || str.startsWith('fas ') || str.startsWith('fab '));
  };

  const getImgSrc = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return '/' + img;
  };

  const duplicatedClients = [...clients, ...clients];

  return (
    <section id="clients" className="clients-section section-padding">
      <div className="container">
        <div className="text-center scroll-reveal">
          <span className="section-tag">Roster</span>
          <h2 className="section-title">Our Clients</h2>
          <p className="section-subtitle">
            Trusted by private developers and enterprise clients globally to construct landmarks.
          </p>
        </div>
      </div>

      <div className="scrolling-testimonials-container scroll-reveal delay-200">
        <div className="scrolling-track">
          {duplicatedClients.map((client, idx) => (
            <div key={idx} className="client-logo-card" style={{ flexShrink: 0, width: '220px' }}>
              <div className="client-badge-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', margin: '0 auto 15px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                {isFontAwesome(client.image) ? (
                  <i className={`fa-solid ${client.image}`} style={{ fontSize: '2rem' }}></i>
                ) : (
                  <img 
                    src={getImgSrc(client.image)} 
                    alt={client.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                )}
              </div>
              <h4 className="client-name">{client.name}</h4>
              <div className="client-hover-bar"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurClients;
