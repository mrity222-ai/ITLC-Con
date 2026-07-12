import React, { useEffect, useState, useRef } from 'react';

const InteriorPage = ({ setCurrentPage }) => {
  const canvasRef = useRef(null);

  const defaultImages = [
    { 
      src: 'assets/images/interior_living.jpg', 
      title: 'Modern Living Room', 
      description: 'A warm, light-filled spatial design prioritizing seamless transitions, bespoke linen furniture, and raw oak woodwork panels.',
      category: 'Residential',
      style: 'Modern Luxury',
      materials: 'Oak Wood, Linen, Brass',
      year: '2025'
    },
    { 
      src: 'assets/images/interior_kitchen.jpg', 
      title: 'Minimalist Kitchen', 
      description: 'Engineered culinary layout featuring invisible touch-to-open cabinets, integrated energy-saving lighting, and custom Carrara marble backdrops.',
      category: 'Culinary',
      style: 'Contemporary Minimalist',
      materials: 'Quartz Countertops, Carrara Marble',
      year: '2025'
    },
    { 
      src: 'assets/images/interior_bedroom.jpg', 
      title: 'Premium Master Bedroom', 
      description: 'A wellness-focused design with integrated acoustic wood framing, warm layered task lamps, and curated cotton textures.',
      category: 'Residential',
      style: 'Nordic Organic',
      materials: 'Acoustic Wood, Cotton Fabrics',
      year: '2025'
    },
    { 
      src: 'assets/images/interior_dining.jpg', 
      title: 'Oak Dinette Studio', 
      description: 'An open-air dining concept blending natural oak tables with organic woven textures and panoramic floor-to-ceiling glass integration.',
      category: 'Dining',
      style: 'Biophilic Rustic',
      materials: 'Natural Oak Wood, Woven Textures',
      year: '2025'
    },
    { 
      src: 'assets/images/interior_bathroom.jpg', 
      title: 'Luxury Spa Bathroom', 
      description: 'A wellness sanctuary utilizing large-format porcelain stone tiling, recessed ambient dimming, and matte-black custom hardware.',
      category: 'Wellness',
      style: 'Japandi Spa',
      materials: 'Porcelain Stone, Matte-black Metals',
      year: '2025'
    },
    { 
      src: 'assets/images/interior_office.jpg', 
      title: 'Executive Home Office', 
      description: 'A quiet workspace layout blending walnut veneer cabinetry, customized sound absorption panels, and ergonomic focus zones.',
      category: 'Workplace',
      style: 'Executive Modern',
      materials: 'Walnut Veneer, Sound-absorbing Foam',
      year: '2025'
    }
  ];

  const [galleryImages, setGalleryImages] = useState(defaultImages);

  const defaultVideos = [
    { id: 'v1', title: 'Modern Living Space Walkthrough', video_path: 'assets/video.mp4' },
    { id: 'v2', title: 'Minimalist Kitchen Concept', video_path: 'assets/video.mp4' },
    { id: 'v3', title: 'Luxury Penthouse Suite Tour', video_path: 'assets/video.mp4' }
  ];
  const [videos, setVideos] = useState(defaultVideos);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);

  useEffect(() => {
    fetch('/api/interior.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            id: item.id,
            src: item.image,
            title: item.title,
            description: item.description,
            category: item.category,
            style: item.style,
            materials: item.materials,
            year: item.year
          }));
          setGalleryImages(formatted);
        }
      })
      .catch(err => console.error("Error fetching interior items:", err));

    // Fetch interior walkthrough videos
    fetch('/api/interior_videos.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
        }
      })
      .catch(err => console.error("Error fetching interior videos:", err));
  }, []);



  // Floating particles canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = `rgba(61, 94, 225, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 45 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Distribute galleryImages dynamically into 3 columns
  const col1 = [];
  const col2 = [];
  const col3 = [];
  galleryImages.forEach((img, idx) => {
    if (idx % 3 === 0) col1.push(img);
    else if (idx % 3 === 1) col2.push(img);
    else col3.push(img);
  });

  // Duplicate arrays to ensure seamless infinite looping marquee scrolling
  const col1Items = [...col1, ...col1];
  const col2Items = [...col2, ...col2];
  const col3Items = [...col3, ...col3];

  return (
    <div className="services-page-wrapper">
      <canvas ref={canvasRef} className="services-particles-canvas"></canvas>

      <div className="services-page-header">
        <div className="container text-center">
          <span className="orange-blue-pill animate-fade-in-down">Premium Spaces Curation</span>
          <h1 className="services-page-title animate-fade-in-up">
            Interior <span className="text-highlight-mint">Design</span>
          </h1>
          <p className="services-page-subtitle animate-fade-in-up delay-200">
            Discover bespoke interior architectural styling that blends modern utility with high-end premium aesthetics.
          </p>
        </div>
      </div>

      <div className="container pb-24">
        {/* Detail text description */}
        <div className="about-section pt-0 pb-16">
          <div className="section-grid grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="about-content scroll-reveal active">
              <span className="section-tag">Design Philosophy</span>
              <h2 className="section-title text-white">Artistry in Every Detail, Function in Every Plan</h2>
              <p className="about-text">
                At ITLC India, our interior design methodology is rooted in the synthesis of structural integrity and aesthetic sophistication. We believe that an interior space is a direct extension of structural architecture, demanding the same precision.
              </p>
              <p className="about-text">
                Our interior division manages every facet of design execution. From advanced lighting engineering and sun-path optimization layouts to materials specifications and bespoke furniture curation, we handle it all.
              </p>
            </div>
            <div className="about-image-wrapper scroll-reveal active">
              <div className="image-accent-border"></div>
              <img 
                src="assets/images/interior_living.jpg" 
                alt="Modern Living Interior" 
                className="about-img rounded-2xl shadow-lg border border-white/10" 
              />
            </div>
          </div>
        </div>



        {/* Redesigned Showcase Masonry Marquee Section */}
        <div className="scroll-reveal active mb-16">
          <div className="projects-title-block text-center mb-8">
            <span className="orange-blue-pill mb-4" style={{ display: 'inline-block' }}>
              INTERIOR ARCHITECTURE SHOWCASE
            </span>
            <h2 className="projects-heading">Gallery</h2>
          </div>

          <div className="masonry-marquee-container">
            <div className="marquee-grid">
              {/* Left Column (Scrolls UP) */}
              <div className="marquee-column col-left">
                <div className="marquee-column-inner scroll-up">
                  {col1Items.map((img, idx) => (
                    <div key={`${img.id || idx}-c1`} className="marquee-card">
                      <img src={img.src} alt={img.title} />
                      <div className="marquee-card-overlay">
                        <h3 className="marquee-card-title">{img.title}</h3>
                        <span className="marquee-card-category">{img.category || 'Interior'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Column (Scrolls DOWN) */}
              <div className="marquee-column col-middle">
                <div className="marquee-column-inner scroll-down">
                  {col2Items.map((img, idx) => (
                    <div key={`${img.id || idx}-c2`} className="marquee-card">
                      <img src={img.src} alt={img.title} />
                      <div className="marquee-card-overlay">
                        <h3 className="marquee-card-title">{img.title}</h3>
                        <span className="marquee-card-category">{img.category || 'Interior'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (Scrolls UP) */}
              <div className="marquee-column col-right">
                <div className="marquee-column-inner scroll-up">
                  {col3Items.map((img, idx) => (
                    <div key={`${img.id || idx}-c3`} className="marquee-card">
                      <img src={img.src} alt={img.title} />
                      <div className="marquee-card-overlay">
                        <h3 className="marquee-card-title">{img.title}</h3>
                        <span className="marquee-card-category">{img.category || 'Interior'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interior Walkthrough Video Showcase Section */}
        {videos.length > 0 && (
          <div className="scroll-reveal active mb-16">
            <div className="projects-title-block text-center mb-8">
              <span className="orange-blue-pill mb-4" style={{ display: 'inline-block' }}>
                INTERIOR WALKTHROUGH SHOWCASE
              </span>
              <h2 className="projects-heading">Walkthrough Tours</h2>
            </div>

            <div className="video-showcase-container" style={{ maxWidth: '850px', margin: '0 auto' }}>
              <div 
                className="video-showcase-card card-content-panel" 
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden'
                }}
              >
                <div className="video-wrapper" style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', // 16:9 Aspect Ratio
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <video
                    key={videos[currentVideoIdx].video_path}
                    src={videos[currentVideoIdx].video_path}
                    controls
                    autoPlay
                    muted
                    loop
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div className="video-info-block" style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div>
                    <h3 className="video-title text-white" style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      letterSpacing: '-0.5px'
                    }}>
                      {videos[currentVideoIdx].title}
                    </h3>
                    <p className="video-subtitle" style={{
                      margin: '4px 0 0 0',
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      Tour {currentVideoIdx + 1} of {videos.length}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentVideoIdx((prev) => (prev + 1) % videos.length)}
                    style={{
                      padding: '12px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    Next Tour <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic CTA Banner */}
        <div className="services-cta-banner scroll-reveal active mt-16 text-center">
          <h3>Transform Your Home or Commercial Office Today</h3>
          <p>Schedule a layout consultation with our lead interior designers to review your home specifications.</p>
          <a 
            href="#contact" 
            className="btn btn-primary mt-6" 
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Schedule Consultation <i className="fa-solid fa-arrow-right icon-right-sm"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default InteriorPage;
