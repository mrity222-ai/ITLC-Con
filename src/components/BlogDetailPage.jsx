import React, { useEffect, useState, useRef } from 'react';

const BlogDetailPage = ({ setCurrentPage }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const getSlugFromUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/blog/')) {
      return path.substring(6); // Return part after /blog/
    }
    return '';
  };

  const getImgSrc = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return '/' + img;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const slug = getSlugFromUrl();
    if (!slug) {
      setError('Invalid post path.');
      setLoading(false);
      return;
    }

    fetch(`/api/blogs.php?slug=${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Blog post not found.");
        return res.json();
      })
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading blog details:", err);
        setError(err.message || 'Failed to load post.');
        setLoading(false);
      });
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
        this.opacity = Math.random() * 0.4 + 0.1;
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

  const handleBackClick = (e) => {
    e.preventDefault();
    window.history.pushState(null, '', '/blog');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="services-page-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <canvas ref={canvasRef} className="services-particles-canvas"></canvas>

      <div className="container" style={{ maxWidth: '800px', padding: '20px 20px 80px 20px', zIndex: 10, flexGrow: 1 }}>
        <button onClick={handleBackClick} className="admin-action-btn-back mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-arrow-left"></i> Back to Blogs
        </button>

        {loading ? (
          <div className="text-center" style={{ padding: '80px 0' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--clr-primary)' }}></i>
            <p style={{ marginTop: '15px', color: 'rgba(255,255,255,0.4)' }}>Retrieving article database...</p>
          </div>
        ) : error ? (
          <div className="text-center" style={{ padding: '80px 0' }}>
            <h2 style={{ color: 'rgba(255,255,255,0.9)' }}>Error</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>{error}</p>
          </div>
        ) : (
          <article className="blog-detail-content-card animate-fade-in" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)' }}>
            <div style={{ position: 'relative', height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '25px' }}>
              <img src={getImgSrc(blog.featured_image)} alt={blog.title} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)' }}></div>
            </div>

            <div className="blog-detail-meta" style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span><i className="fa-solid fa-user"></i> Author: <strong>{blog.author}</strong></span>
              <span><i className="fa-regular fa-calendar"></i> Published: <strong>{new Date(blog.published_date).toLocaleDateString()}</strong></span>
              <span><i className="fa-solid fa-tag"></i> {blog.category}</span>
            </div>

            <h1 className="blog-detail-title" style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '20px', lineHeight: '1.2' }}>
              {blog.title}
            </h1>

            <div 
              className="blog-detail-body" 
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}
            >
              {blog.content}
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;
