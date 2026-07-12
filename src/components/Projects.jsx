import React, { useState, useEffect } from 'react';

const Projects = ({ setCurrentPage }) => {
  const [projectsData, setProjectsData] = useState([
    {
      id: 1,
      title: 'The Aurelia Villa',
      description: 'A luxurious modern residential estate featuring high-concept geometric architecture and open light-filled spaces.',
      image: 'assets/images/project1.jpg',
      category: 'Residential',
      location: 'Beverly Hills, CA',
      year: '2025',
      client: 'Private Owner'
    },
    {
      id: 2,
      title: 'Vertex Office Tower',
      description: 'A pioneering commercial skyscraper incorporating sustainable green design elements and advanced structural steel systems.',
      image: 'assets/images/project2.jpg',
      category: 'Commercial',
      location: 'Seattle, WA',
      year: '2026',
      client: 'Vertex Holdings'
    },
    {
      id: 3,
      title: 'Ironclad Warehouse Loft',
      description: 'A modern industrial warehouse conversion preserving classic brick and iron elements while integrating high-end modern amenities.',
      image: 'assets/images/project4.jpg',
      category: 'Industrial',
      location: 'Portland, OR',
      year: '2024',
      client: 'Ironclad Development'
    }
  ]);

  useEffect(() => {
    fetch('/api/projects.php')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProjectsData(data);
        }
      })
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const currentProject = projectsData[currentIdx];
  const nextIdx = (currentIdx + 1) % projectsData.length;
  const nextProject = projectsData[nextIdx];

  const handleNextProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsDetailOpen(false);
    setTimeout(() => {
      setCurrentIdx(nextIdx);
      setIsAnimating(false);
    }, 350);
  };

  return (
    <section id="projects" className="featured-projects-section">
      <div className="container">
        <div className="projects-showcase-grid">
          
          {/* 1. Title Block */}
          <div className="projects-title-block" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
              <span className="projects-eyebrow" style={{ margin: 0 }}>View my projects</span>
              <button 
                className="heading-arrow-btn" 
                onClick={() => {
                  setCurrentPage('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="View all projects"
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <h2 className="projects-heading" style={{ margin: 0 }}>Projects</h2>
          </div>

          {/* 2. Image Display */}
          <div className="projects-image-column">
            <div className="featured-image-wrapper">
              <img 
                src={currentProject.image} 
                alt={currentProject.title} 
                className={`featured-main-img ${isAnimating ? 'animating-img' : ''}`}
                onClick={() => setIsDetailOpen(prev => !prev)}
              />
              
              <button 
                className={`info-circle-btn ${isDetailOpen ? 'active' : ''}`} 
                onClick={() => setIsDetailOpen(prev => !prev)}
                aria-label="Toggle details"
              >
                <i className={`fa-solid ${isDetailOpen ? 'fa-xmark' : 'fa-info'}`}></i>
              </button>

              {/* Next Project Thumbnail Preview overlay */}
              <div className="next-thumbnail-overlay" onClick={handleNextProject}>
                <img src={nextProject.image} alt={nextProject.title} className="next-thumbnail-img" />
                <div className="thumb-hover-overlay">
                  <span>Next</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Info Block */}
          <div className="projects-info-column">
            <div className={`project-info-block ${isAnimating ? 'fade-out-text' : 'fade-in-text'}`}>
              <h3 className="project-showcase-title">{currentProject.title}</h3>
              <p className="project-showcase-desc">{currentProject.description}</p>
            </div>
            
            <button className="next-project-btn" onClick={handleNextProject}>
              Next Project <i className="fa-solid fa-arrow-right"></i>
            </button>
            
            <div className={`project-counter ${isAnimating ? 'fade-out-text' : 'fade-in-text'}`}>
              <span className="current-count">{String(currentProject.id).padStart(2, '0')}</span>
              <span className="total-count">/ {String(projectsData.length).padStart(2, '0')}</span>
            </div>
          </div>
          
        </div>

        {/* Minimal Project Detail Section */}
        <div className={`project-detail-panel ${isDetailOpen ? 'open' : ''}`}>
          <div className="detail-panel-inner">
            <h4 className="detail-panel-title">{currentProject.title} Specs</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Category</span>
                <span className="detail-value">{currentProject.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{currentProject.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Year</span>
                <span className="detail-value">{currentProject.year}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Client</span>
                <span className="detail-value">{currentProject.client}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Projects;
