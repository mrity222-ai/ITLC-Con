import React from 'react';

const Footer = ({ setCurrentPage }) => {
  const navigateToPage = (e, pageId) => {
    e.preventDefault();
    if (setCurrentPage) {
      setCurrentPage(pageId);
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="main-footer" style={{ backgroundColor: '#000000' }}>
      <div className="container footer-top">
        {/* Left column: Brand Column */}
        <div className="footer-col brand-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <a 
            href="#home" 
            onClick={(e) => navigateToPage(e, 'home')} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', margin: 0, padding: 0 }}
          >
            <img 
              src="/assets/images/logo/logo.png" 
              alt="ITLC Logo" 
              style={{ height: '52px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
            />
            <span style={{ fontSize: '10px', color: '#FFFFFF', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'center', display: 'block', marginTop: '6px' }}>
              ITLC INDIA PVT LTD
            </span>
            <span className="logo" style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--ff-heading)', display: 'block', textAlign: 'center', marginTop: '4px' }}>
              <span className="logo-infra">INFRA</span><span className="logo-vision">VISION</span>
            </span>
          </a>
          <p className="brand-desc" style={{ margin: '8px 0 0 0', padding: 0, lineHeight: '1.5', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', maxWidth: '280px' }}>
            Building Structural Excellence and Trust in Lucknow for Over 10 Years.
          </p>
          <div className="social-links" style={{ display: 'flex', gap: '12px', marginTop: '12px', padding: 0 }}>
            <a href="https://www.instagram.com/infra_vision_itlc/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/people/Reactify/61586479122796/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Services Column */}
        <div className="footer-col links-col">
          <h4>Services</h4>
          <ul>
            <li><a href="/services" onClick={(e) => navigateToPage(e, 'services')}>Full Home Construction</a></li>
            <li><a href="/services" onClick={(e) => navigateToPage(e, 'services')}>Turnkey Projects</a></li>
            <li><a href="/interior" onClick={(e) => navigateToPage(e, 'interior')}>Interior Design</a></li>
            <li><a href="/services" onClick={(e) => navigateToPage(e, 'services')}>Civil Contracting</a></li>
            <li><a href="/services" onClick={(e) => navigateToPage(e, 'services')}>Structural Engineering</a></li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col links-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/services" onClick={(e) => navigateToPage(e, 'services')}>Services</a></li>
            <li><a href="/projects" onClick={(e) => navigateToPage(e, 'projects')}>Projects</a></li>
            <li><a href="/interior" onClick={(e) => navigateToPage(e, 'interior')}>Interior</a></li>
            <li><a href="/about" onClick={(e) => navigateToPage(e, 'about')}>About Us</a></li>
            <li><a href="/contact" onClick={(e) => navigateToPage(e, 'contact')}>Contact</a></li>
            <li><a href="/blog" onClick={(e) => navigateToPage(e, 'blog')}>Blog</a></li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div className="footer-col contact-col">
          <h4>Contact Us</h4>
          <ul className="footer-contact-list">
            <li className="footer-address-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--clr-primary)', marginTop: '4px' }}></i>
              <span>G1/0049, Olive Wood Villa, Golf City, Lucknow, <br className="footer-addr-br" />Uttar Pradesh – 226030</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-envelope" style={{ color: 'var(--clr-primary)' }}></i>
              <a href="mailto:info.itlcindia@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                info.itlcindia@gmail.com
              </a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-phone" style={{ color: 'var(--clr-primary)' }}></i>
              <a href="tel:+919532341000" style={{ color: 'inherit', textDecoration: 'none' }}>
                (+91) 953 234 1000
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', padding: '30px 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
          <p className="copyright" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            &copy; 2015-2026 InfraVision by ITLC India Pvt Ltd. All rights reserved.
          </p>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.8rem' }}>
            Website design by ITLC India Pvt Ltd.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
