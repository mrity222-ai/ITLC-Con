import React, { useState, useEffect, useRef } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', service: 'residential', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const canvasRef = useRef(null);

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'name' && value.trim() === '') {
      errorMsg = 'Please enter your name.';
    } else if (name === 'email' && !isValidEmail(value.trim())) {
      errorMsg = 'Please enter a valid email.';
    } else if (name === 'message' && value.trim().length < 15) {
      errorMsg = 'Project description must be at least 15 characters.';
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return errorMsg === '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameValid = validateField('name', formData.name);
    const isEmailValid = validateField('email', formData.email);
    const isMessageValid = validateField('message', formData.message);

    if (isNameValid && isEmailValid && isMessageValid) {
      setIsLoading(true);
      fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(result => {
        setIsLoading(false);
        if (result.success) {
          setIsSubmitted(true);
          setFormData({ name: '', email: '', service: 'residential', message: '' });
          setTimeout(() => setIsSubmitted(false), 8000);
        } else {
          if (result.errors) {
            setErrors(prev => ({ ...prev, ...result.errors }));
          } else if (result.error) {
            alert(result.error);
          }
        }
      })
      .catch(err => {
        console.error("Error submitting contact form:", err);
        setIsLoading(false);
        alert("Connection issue: Failed to submit proposal. Please check if the server is active or try again later!");
      });
    }
  };

  useEffect(() => {
    // Backdrop particle grid
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Node {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }
      draw() {
        ctx.fillStyle = 'rgba(61, 94, 225, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const nodes = Array.from({ length: 30 }, () => new Node());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.update();
        n.draw();
      });
      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="services-page-wrapper">
      <canvas ref={canvasRef} className="services-particles-canvas"></canvas>

      <div className="services-page-header">
        <div className="container text-center">
          <span className="orange-blue-pill animate-fade-in-down">Let's Connect</span>
          <h1 className="services-page-title animate-fade-in-up">
            Contact <span className="text-highlight-mint">Us</span>
          </h1>
          <p className="services-page-subtitle animate-fade-in-up delay-200">
            Discuss architectural planning, request building audits, or invite bids on active tenders.
          </p>
        </div>
      </div>

      <div className="container pb-24">
        <div className="section-grid grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          
          {/* Details Column */}
          <div className="contact-info-col scroll-reveal active">
            <h2 className="text-white font-extrabold text-2xl mb-4">Corporate Offices</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Reach out to our project estimating desk directly, or visit our design studio in Lucknow.
            </p>

            <div className="contact-details space-y-6">
              <div className="contact-detail-item flex items-start gap-4">
                <div className="detail-icon w-10 h-10 rounded-full bg-green-500/10 text-green-accent flex items-center justify-center flex-shrink-0 text-base">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="detail-text">
                  <h5 className="text-white font-bold text-sm m-0 mb-1">Corporate HQ</h5>
                  <p className="text-xs text-white/60 m-0">G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030</p>
                </div>
              </div>

              <div className="contact-detail-item flex items-start gap-4">
                <div className="detail-icon w-10 h-10 rounded-full bg-green-500/10 text-green-accent flex items-center justify-center flex-shrink-0 text-base">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="detail-text">
                  <h5 className="text-white font-bold text-sm m-0 mb-1">Call Estimating</h5>
                  <p className="text-xs text-white/60 m-0">(+91) 953 234 1000</p>
                </div>
              </div>

              <div className="contact-detail-item flex items-start gap-4">
                <div className="detail-icon w-10 h-10 rounded-full bg-green-500/10 text-green-accent flex items-center justify-center flex-shrink-0 text-base">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="detail-text">
                  <h5 className="text-white font-bold text-sm m-0 mb-1">Direct Emails</h5>
                  <p className="text-xs text-white/60 m-0">info.itlcindia@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Map Frame wrapper */}
            <div className="map-container mt-8 h-48 rounded-xl overflow-hidden relative border border-white/10">
              <div className="map-placeholder h-full w-full bg-secondary flex items-center justify-center relative">
                <div className="map-bg-grid absolute inset-0 opacity-20"></div>
                <div className="map-marker-ping absolute w-4 h-4 bg-green-accent rounded-full animate-ping"></div>
                <div className="map-marker absolute w-3 h-3 bg-green-accent rounded-full border-2 border-secondary"></div>
                <div className="map-card absolute bottom-4 left-4 right-4 bg-secondary/90 border border-white/8 rounded-xl p-3 text-xs text-center backdrop-blur-md">
                  <h6 className="text-white font-bold m-0 mb-1">INFRAVISION HEADQUARTERS</h6>
                  <p className="text-white/60 m-0 mb-2">Golf City, Lucknow, UP</p>
                  <a href="https://maps.google.com/?q=G1/0049,+Olive+Wood+Villa,+Golf+City,+Lucknow" target="_blank" rel="noopener noreferrer" className="text-green-accent hover:text-white font-bold tracking-wider uppercase text-[9px] flex items-center justify-center gap-1">
                    Google Maps Link <i className="fa-solid fa-up-right-from-square"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-col scroll-reveal active">
            <div className="card form-card bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8">
              <h3 className="text-white font-extrabold text-xl mb-2">Initiate Proposal</h3>
              <p className="text-xs text-white/50 mb-6">Specify project parameters and details, and our estimators will follow up.</p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="form-group">
                  <label className="block text-white/80 text-xs font-bold mb-2">Your Full Name</label>
                  <div className="input-wrapper bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
                    <i className="fa-regular fa-user text-white/30"></i>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} onBlur={handleBlur} placeholder="John Doe" className="bg-transparent text-white text-xs w-full outline-none" required />
                  </div>
                  {errors.name && <span className="text-red-500 text-[10px] mt-1 block">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="block text-white/80 text-xs font-bold mb-2">Email Address</label>
                  <div className="input-wrapper bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
                    <i className="fa-regular fa-envelope text-white/30"></i>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} placeholder="john@example.com" className="bg-transparent text-white text-xs w-full outline-none" required />
                  </div>
                  {errors.email && <span className="text-red-500 text-[10px] mt-1 block">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="block text-white/80 text-xs font-bold mb-2">Interest Category</label>
                  <div className="input-wrapper bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
                    <i className="fa-solid fa-sliders text-white/30"></i>
                    <select name="service" value={formData.service} onChange={handleInputChange} className="bg-transparent text-white text-xs w-full outline-none border-none">
                      <option value="residential" className="bg-secondary text-white">Residential Custom Build</option>
                      <option value="commercial" className="bg-secondary text-white">Commercial Development</option>
                      <option value="planning" className="bg-secondary text-white">Space & Building Planning</option>
                      <option value="renovation" className="bg-secondary text-white">Restoration & Retrofit</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-white/80 text-xs font-bold mb-2">Project Brief Description</label>
                  <div className="input-wrapper bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-start gap-2">
                    <i className="fa-regular fa-comment-dots text-white/30 mt-1"></i>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} onBlur={handleBlur} rows={4} placeholder="Size, target location, eco requirements..." className="bg-transparent text-white text-xs w-full outline-none resize-none" required></textarea>
                  </div>
                  {errors.message && <span className="text-red-500 text-[10px] mt-1 block">{errors.message}</span>}
                </div>

                <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2">
                  {isLoading ? 'Sending Proposal...' : 'Submit Proposal Request'}
                </button>

                {isSubmitted && (
                  <div className="p-4 bg-green-600/10 border border-green-500/20 text-green-accent rounded-xl text-xs flex items-center gap-2 animate-fade-in mt-4">
                    <i className="fa-solid fa-circle-check"></i>
                    <div>
                      <h6 className="font-bold m-0 text-white">Proposal Request Received</h6>
                      <p className="m-0 text-white/70">Our estimating engineers are compiling standard scheduling options.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
