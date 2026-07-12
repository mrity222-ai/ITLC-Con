import React, { useState, useEffect } from 'react';

const Header = ({ currentPage = 'home', setCurrentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (currentPage !== 'home') {
        setIsScrolled(true);
        return;
      }
      const heroTrack = document.querySelector('.hero-scroll-track');
      if (heroTrack) {
        const rect = heroTrack.getBoundingClientRect();
        if (rect.bottom > 80) {
          setIsScrolled(false);
        } else {
          setIsScrolled(true);
        }
      } else {
        if (window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const sections = document.querySelectorAll('section');
    const navOptions = {
      threshold: 0.4,
      rootMargin: '-80px 0px -20% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.getAttribute('id'));
        }
      });
    }, navOptions);

    sections.forEach(section => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(section => observer.unobserve(section));
    };
  }, [currentPage]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (targetId === 'home') {
      if (setCurrentPage) {
        setCurrentPage('home');
      }
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setActiveSection('home');
      return;
    }

    const pageList = ['services', 'projects', 'about', 'contact', 'query', 'blog', 'blog-detail', 'interior'];
    if (pageList.includes(targetId)) {
      if (setCurrentPage) {
        setCurrentPage(targetId);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setActiveSection(targetId);
      }
      return;
    }
  };

  const navLinks = [
    { label: 'Home', target: 'home' },
    { label: 'Services', target: 'services' },
    { label: 'Projects', target: 'projects' },
    { label: 'Interior', target: 'interior' },
    { label: 'About', target: 'about' },
    { label: 'Contact', target: 'contact' },
    { label: 'Blog', target: 'blog' }
  ];

  return (
    <>
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <a href="#home" className="logo" onClick={(e) => handleLinkClick(e, 'home')}>
            <span className="logo-infra">INFRA</span><span className="logo-vision">VISION</span>
          </a>
          
          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              {navLinks.map((link) => (
                <li key={link.target}>
                  <a
                    href={`#${link.target}`}
                    className={`nav-link ${
                      currentPage === 'home'
                        ? (activeSection === link.target ? 'active' : '')
                        : (currentPage === link.target || (currentPage === 'blog-detail' && link.target === 'blog') ? 'active' : '')
                    }`}
                    onClick={(e) => handleLinkClick(e, link.target)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-cta-container">
            <a 
              href="#contact" 
              className="btn btn-primary header-cta" 
              onClick={(e) => handleLinkClick(e, 'contact')}
            >
              Get a Quote
            </a>
          </div>

          <button 
            className={`mobile-nav-toggle ${isMenuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
