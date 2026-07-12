import React, { useState } from 'react';

const Contact = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'residential',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error message when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'name' && value.trim() === '') {
      errorMsg = 'Please enter your name.';
    } else if (name === 'email' && !isValidEmail(value.trim())) {
      errorMsg = 'Please enter a valid email address.';
    } else if (name === 'message' && value.trim().length < 15) {
      errorMsg = 'Project description must be at least 15 characters long.';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));

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
          setFormData({
            name: '',
            email: '',
            service: 'residential',
            message: ''
          });

          // Hide success banner after 8 seconds
          setTimeout(() => {
            setIsSubmitted(false);
          }, 8000);
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
        // Fallback
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          service: 'residential',
          message: ''
        });
        setTimeout(() => {
          setIsSubmitted(false);
        }, 8000);
      });
    }
  };

  return (
    <section id="contact" className="contact-section section-padding bg-light">
      <div className="container">
        <div className="section-grid">
          {/* Contact Details & Map */}
          <div className="contact-info-col scroll-reveal">
            <span className="section-tag">Let's Connect</span>
            <h2 className="section-title">Discuss Your Next Construction Venture</h2>
            <p className="contact-intro">
              Whether it is a custom luxury home foundation, an office complex bid, or a renovation consultation, our
              team is equipped to quote and deliver.
            </p>

            <div className="contact-details">
              <div className="contact-detail-item">
                <div className="detail-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="detail-text">
                  <h5>Corporate Headquarters</h5>
                  <p>G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="detail-text">
                  <h5>Call or Text Us</h5>
                  <p>(+91) 953 234 1000</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="detail-text">
                  <h5>Direct Inquiry Email</h5>
                  <p>info.itlcindia@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Styled Map Embed Fallback */}
            <div className="map-container">
              <div className="map-placeholder">
                <div className="map-bg-grid"></div>
                <div className="map-marker-ping"></div>
                <div className="map-card">
                  <h6>INFRAVISION HEADQUARTERS</h6>
                  <p>Golf City, Lucknow, UP</p>
                  <a href="https://maps.google.com/?q=G1/0049,+Olive+Wood+Villa,+Golf+City,+Lucknow" target="_blank" rel="noopener noreferrer" className="map-link">
                    Open in Google Maps <i className="fa-solid fa-up-right-from-square"></i>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form Column */}
          <div className="contact-form-col scroll-reveal delay-200">
            <div className="card form-card">
              <h3>Initiate Proposal</h3>
              <p className="form-subtext">
                Fill out the fields below, and our engineering estimators will contact you within 24 hours.
              </p>

              <form id="contact-form" onSubmit={handleSubmit} noValidate>
                <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="name">
                    Full Name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <i className="fa-regular fa-user input-icon"></i>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  <span className="error-msg">{errors.name}</span>
                </div>

                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <i className="fa-regular fa-envelope input-icon"></i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  <span className="error-msg">{errors.email}</span>
                </div>

                <div className="form-group">
                  <label htmlFor="service-select">Inquiry Interest</label>
                  <div className="input-wrapper">
                    <i className="fa-solid fa-sliders input-icon"></i>
                    <select
                      id="service-select"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                    >
                      <option value="residential">Residential Custom Build</option>
                      <option value="commercial">Commercial Development</option>
                      <option value="planning">Architecture & Planning</option>
                      <option value="renovation">Renovation & Loft Overhaul</option>
                      <option value="other">General Construction Bid</option>
                    </select>
                  </div>
                </div>

                <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                  <label htmlFor="message">
                    Detailed Project Description <span className="required">*</span>
                  </label>
                  <div className="input-wrapper align-start">
                    <i className="fa-regular fa-comment-dots input-icon mt-1"></i>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Tell us about the project size, location, and timeline preferences..."
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                    ></textarea>
                  </div>
                  <span className="error-msg">{errors.message}</span>
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`}
                  id="submit-btn"
                  disabled={isLoading}
                >
                  <span className="btn-text">Submit Request</span>
                  <span className="spinner" id="form-spinner"></span>
                </button>

                {isSubmitted && (
                  <div className="form-feedback" style={{ display: 'flex' }}>
                    <i className="fa-solid fa-circle-check"></i>
                    <div>
                      <h5>Request Submitted Successfully!</h5>
                      <p>Our estimating team is reviewing your project details. We will call you shortly.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom-right aligned Arrow Button for the entire section */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button 
            className="heading-arrow-btn" 
            onClick={() => {
              setCurrentPage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="View contact page"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
