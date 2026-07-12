import React, { useState, useEffect } from 'react';

const Blog = ({ setCurrentPage }) => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      image: 'assets/images/project6.jpg',
      category: 'Sustainability',
      title: 'The Future of Green Building Materials',
      excerpt: 'Discover how recycled steel, bamboo framing, and eco-concrete are driving down carbon footprints in modern premium construction projects.'
    },
    {
      id: 2,
      image: 'assets/images/project2.jpg',
      category: 'Innovation',
      title: 'Integrating Smart Technology in Commercial Sites',
      excerpt: 'From automated energy grids to touchless building entry, explore how IoT is reshaping modern architectural designs.'
    },
    {
      id: 3,
      image: 'assets/images/about.jpg',
      category: 'Safety',
      title: 'Key Safety Protocols on Active High-Rise Sites',
      excerpt: 'A detailed look at the structural safety measures, scaffolding rules, and audits that keep our active builds completely incident-free.'
    }
  ]);

  useEffect(() => {
    fetch('/api/blogs.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(err => console.error("Error loading homepage blogs:", err));
  }, []);

  const handleReadMore = (e, slug) => {
    e.preventDefault();
    window.history.pushState(null, '', `/blog/${slug}`);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <section id="blog" className="blog-section section-padding">
      <div className="container">
        <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', marginBottom: '15px' }}>
            <span className="section-tag" style={{ margin: 0 }}>News & Insights</span>
            <button 
              className="heading-arrow-btn" 
              onClick={() => {
                setCurrentPage('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="View all blogs"
              style={{ position: 'absolute', right: 0 }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <h2 className="section-title" style={{ margin: '15px auto 0 auto', textAlign: 'center' }}>Our Latest News and Blogs</h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0 auto', textAlign: 'center' }}>
            Stay updated with current industry trends, green building guidelines, and recent project walkthroughs.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid-layout blog-grid scroll-reveal">
          {blogs.slice(0, 3).map((blog) => (
            <div key={blog.id} className="card blog-card">
              <div className="blog-img-wrapper">
                <img src={blog.featured_image || blog.image} alt={blog.title} className="blog-card-img" />
                <span className="blog-category-badge">{blog.category || 'News'}</span>
              </div>
              <div className="blog-card-content">
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.excerpt}</p>
                <a 
                  href={`/blog/${blog.slug}`} 
                  className="blog-read-more"
                  onClick={(e) => handleReadMore(e, blog.slug)}
                >
                  Read More <i className="fa-solid fa-arrow-right icon-right-sm"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
