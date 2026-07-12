import React, { useEffect, useState, useRef } from 'react';

const BlogPage = ({ setCurrentPage }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCards, setShowCards] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch('/api/blogs.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading blogs page:", err);
        setLoading(false);
      });
  }, []);

  // Cascading entry animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timer);
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

    const particleArray = Array.from({ length: 45 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particleArray.forEach((p) => {
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

  const handleReadMore = (e, slug) => {
    e.preventDefault();
    window.history.pushState(null, '', `/blog/${slug}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="services-page-wrapper">
      <canvas ref={canvasRef} className="services-particles-canvas"></canvas>

      {/* Hero Banner Header */}
      <div className="services-page-header">
        <div className="container text-center">
          <span className="orange-blue-pill animate-fade-in-down">Construction News & Tech Trends</span>
          <h1 className="services-page-title animate-fade-in-up">
            Our News & <span className="text-highlight-mint">Blogs</span>
          </h1>
          <p className="services-page-subtitle animate-fade-in-up delay-200">
            Insights on sustainable materials, smart contracting, site safety guidelines, and architectural milestones.
          </p>
        </div>
      </div>

      <div className="container pb-24">
        {/* Search Bar */}
        <div className="db-search-bar" style={{ maxWidth: '600px', margin: '0 auto 40px auto', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <div className="db-search-input-box" style={{ width: '100%' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Search blog articles..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: '60px' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--clr-primary)' }}></i>
            <p style={{ marginTop: '15px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Loading insights database...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center" style={{ padding: '60px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            No blog articles match your search parameters.
          </div>
        ) : (
          <div className={`services-page-grid ${showCards ? 'active' : ''}`}>
            {filteredBlogs.map((blog, index) => (
              <div 
                key={blog.id} 
                className="services-page-card"
                style={{ transitionDelay: `${index * 120}ms` }}
                onClick={(e) => handleReadMore(e, blog.slug)}
              >
                <div className="card-image-panel">
                  <img src={blog.featured_image} alt={blog.title} className="card-panel-img" />
                  <div className="card-panel-overlay">
                    <span>Read Article <i className="fa-solid fa-arrow-right"></i></span>
                  </div>
                </div>
                <div className="card-content-panel">
                  <div className="blog-meta-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                    <span>By {blog.author}</span>
                    <span>{new Date(blog.published_date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="card-panel-title">{blog.title}</h3>
                  <p className="card-panel-desc">{blog.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
