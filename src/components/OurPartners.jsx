import React, { useState, useEffect } from 'react';

const OurPartners = () => {
  const [partners, setPartners] = useState([
    { name: 'Godrej', image: 'svg-godrej' },
    { name: 'Havells', image: 'svg-havells' },
    { name: 'Sony', image: 'svg-sony' },
    { name: 'Asian Paints', image: 'svg-asianpaints' },
    { name: 'Jaguar', image: 'svg-jaquar' },
    { name: 'Bajaj', image: 'svg-bajaj' },
    { name: 'Tata Steel', image: 'svg-tata' },
    { name: 'Ultratech Cement', image: 'svg-ultratech' },
    { name: 'Kajaria', image: 'svg-kajaria' }
  ]);

  useEffect(() => {
    fetch('/api/partners.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setPartners(data);
      })
      .catch(err => console.log('Error loading partners:', err));
  }, []);

  const brandLogos = {
    'Godrej': (
      <svg viewBox="0 0 160 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="22" rx="27" ry="15" fill="#E31E24" />
        <text x="32" y="26" textAnchor="middle" fontFamily="'Brush Script MT', cursive, sans-serif" fontWeight="bold" fontSize="18" fill="#FFF">Godrej</text>
        <text x="76" y="29" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="900" fontSize="19" fill="#222" letterSpacing="0.8">PRO</text>
      </svg>
    ),
    'Havells': (
      <svg viewBox="0 0 160 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="25" height="25" rx="4" fill="#E31E24" />
        <path d="M12,17 L12,28 M23,17 L23,28 M12,22.5 L23,22.5" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
        <text x="38" y="29" fontFamily="'Futura', 'Arial Black', sans-serif" fontWeight="900" fontSize="18" fill="#222" letterSpacing="0.5">HAVELLS</text>
      </svg>
    ),
    'Sony': (
      <svg viewBox="0 0 150 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="5" width="105" height="35" rx="3" fill="#000000" />
        <text x="62" y="30" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="20" fill="#FFF" letterSpacing="1">SONY</text>
      </svg>
    ),
    'Asian Paints': (
      <svg viewBox="0 0 160 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,24 C18,14 28,14 24,24 C20,34 30,34 38,24" stroke="#E31E24" strokeWidth="4" fill="none" strokeLinecap="round" />
        <text x="44" y="30" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="800" fontSize="16" fontStyle="italic" fill="#005A9C">asianpaints</text>
      </svg>
    ),
    'Jaguar': (
      <svg viewBox="0 0 150 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,12 C18,12 22,18 20,28 C14,28 10,22 10,12 Z" fill="#006A4E" />
        <path d="M12,14 C16,16 18,20 18,26" stroke="#FFF" strokeWidth="1.5" fill="none" />
        <text x="28" y="29" fontFamily="'Montserrat', sans-serif" fontWeight="700" fontSize="18" fill="#111" letterSpacing="1">jaquar</text>
      </svg>
    ),
    'Bajaj': (
      <svg viewBox="0 0 150 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M5,15 C5,10 15,10 20,15 C25,20 20,30 5,30 Z" fill="#0057A0" />
        <path d="M12,15 L12,30 M12,15 C16,15 18,18 18,21 C18,24 12,24 12,24 M12,24 C17,24 19,27 19,30 C19,33 12,33 12,33" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <text x="32" y="29" fontFamily="sans-serif" fontWeight="bold" fontSize="18" fill="#0057A0" letterSpacing="1">BAJAJ</text>
      </svg>
    ),
    'Tata Steel': (
      <svg viewBox="0 0 150 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="22" r="15" fill="#005A9C" />
        <path d="M14,28 C16,22 20,16 20,16 C20,16 24,22 26,28" stroke="#FFF" strokeWidth="3" strokeLinecap="round" fill="none" />
        <text x="42" y="29" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="18" fill="#005A9C" letterSpacing="1">TATA</text>
      </svg>
    ),
    'Ultratech Cement': (
      <svg viewBox="0 0 160 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <polygon points="5,28 15,10 28,10 18,28" fill="#FFC72C" />
        <polygon points="12,28 22,10 26,10 16,28" fill="#000000" />
        <text x="32" y="28" fontFamily="'Impact', sans-serif" fontWeight="bold" fontSize="18" fill="#FFC72C">UltraTech</text>
      </svg>
    ),
    'Kajaria': (
      <svg viewBox="0 0 150 45" className="partner-svg" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,10 30,20 20,30 10,20" fill="#C8102E" />
        <line x1="10" y1="20" x2="30" y2="20" stroke="#FFF" strokeWidth="1.5" />
        <line x1="20" y1="10" x2="20" y2="30" stroke="#FFF" strokeWidth="1.5" />
        <text x="38" y="28" fontFamily="'Georgia', serif" fontWeight="900" fontSize="18" fontStyle="italic" fill="#C8102E">Kajaria</text>
      </svg>
    )
  };

  const isFontAwesome = (str) => {
    return typeof str === 'string' && (str.startsWith('fa-') || str.startsWith('fas ') || str.startsWith('fab '));
  };

  const getImgSrc = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return '/' + img;
  };

  const duplicatedPartners = [...partners, ...partners];

  return (
    <section id="partners" className="partners-section section-padding simplified-partners">
      <div className="scrolling-testimonials-container scroll-reveal">
        <div className="scrolling-track" style={{ alignItems: 'center' }}>
          {duplicatedPartners.map((partner, idx) => (
            <div key={idx} className="partner-logo-only" style={{ flexShrink: 0, width: '180px' }}>
              {brandLogos[partner.name] ? (
                brandLogos[partner.name]
              ) : isFontAwesome(partner.image) ? (
                <i className={`fa-solid ${partner.image}`}></i>
              ) : (
                <img 
                  src={getImgSrc(partner.image)} 
                  alt={partner.name} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPartners;
