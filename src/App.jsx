import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PremiumServices from './components/PremiumServices';
import Projects from './components/Projects';
import Process from './components/Process';
import OurPartners from './components/OurPartners';
import WhyChooseUs from './components/WhyChooseUs';
import OurClients from './components/OurClients';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ServicesPage from './components/ServicesPage';
import ProjectsPage from './components/ProjectsPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AdminPanel from './components/AdminPanel';
import BlogPage from './components/BlogPage';
import BlogDetailPage from './components/BlogDetailPage';
import NotificationPopup from './components/NotificationPopup';
import InteriorDesign from './components/InteriorDesign';
import InteriorPage from './components/InteriorPage';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path === '/admin/' || path.startsWith('/admin')) {
        return 'admin';
      } else if (path === '/services' || path === '/services/') {
        return 'services';
      } else if (path === '/projects' || path === '/projects/') {
        return 'projects';
      } else if (path === '/interior' || path === '/interior/') {
        return 'interior';
      } else if (path === '/about' || path === '/about/') {
        return 'about';
      } else if (path === '/contact' || path === '/contact/') {
        return 'contact';
      } else if (path === '/blog' || path === '/blog/') {
        return 'blog';
      } else if (path.startsWith('/blog/')) {
        return 'blog-detail';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path === '/admin/' || path.startsWith('/admin')) {
        setCurrentPage('admin');
      } else if (path === '/services' || path === '/services/') {
        setCurrentPage('services');
      } else if (path === '/projects' || path === '/projects/') {
        setCurrentPage('projects');
      } else if (path === '/interior' || path === '/interior/') {
        setCurrentPage('interior');
      } else if (path === '/about' || path === '/about/') {
        setCurrentPage('about');
      } else if (path === '/contact' || path === '/contact/') {
        setCurrentPage('contact');
      } else if (path === '/blog' || path === '/blog/') {
        setCurrentPage('blog');
      } else if (path.startsWith('/blog/')) {
        setCurrentPage('blog-detail');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  useEffect(() => {
    if (currentPage === 'blog-detail') return; // Preserve custom blog slug path
    const path = currentPage === 'home' ? '/' : `/${currentPage}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, [currentPage]);

  useEffect(() => {
    // Scroll reveal observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Unobserve to reveal once
        }
      });
    }, revealOptions);

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [currentPage]);

  return (
    <>
      {currentPage !== 'admin' && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      {currentPage !== 'admin' && <NotificationPopup />}
      <main>
        {currentPage === 'home' && (
          <div className="animate-fade-in">
            <Hero />
            <OurPartners />
            <PremiumServices setCurrentPage={setCurrentPage} />
            <Projects setCurrentPage={setCurrentPage} />
            <InteriorDesign setCurrentPage={setCurrentPage} />
            <Process />
            <WhyChooseUs setCurrentPage={setCurrentPage} />
            <OurClients />
            <Testimonials />
            <FAQ />
            <Blog setCurrentPage={setCurrentPage} />
            <Contact setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'services' && (
          <div className="animate-fade-in">
            <ServicesPage setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'projects' && (
          <div className="animate-fade-in">
            <ProjectsPage setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'interior' && (
          <div className="animate-fade-in">
            <InteriorPage setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'about' && (
          <div className="animate-fade-in">
            <AboutPage setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'contact' && (
          <div className="animate-fade-in">
            <ContactPage setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'admin' && (
          <div className="animate-fade-in">
            <AdminPanel setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'blog' && (
          <div className="animate-fade-in">
            <BlogPage setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'blog-detail' && (
          <div className="animate-fade-in">
            <BlogDetailPage setCurrentPage={setCurrentPage} />
          </div>
        )}
      </main>
      {currentPage !== 'admin' && <Footer setCurrentPage={setCurrentPage} />}
    </>
  );
}

export default App;
