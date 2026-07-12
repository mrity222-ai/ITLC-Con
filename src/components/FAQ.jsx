import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      question: "How do you manage project timelines and budget overruns?",
      answer: "We utilize real-time project management software to track tasks and materials daily. Any potential budget or schedule deviations are flagged instantly and resolved transparently with our clients."
    },
    {
      question: "What green building standards do you follow?",
      answer: "We incorporate LEED-aligned building principles, emphasizing superior thermal insulation, high-efficiency HVAC designs, solar integrations, and sustainably sourced structural materials."
    },
    {
      question: "Do you assist with zoning and building permits?",
      answer: "Yes, our pre-construction phase completely handles architectural drafting, zoning compliance reviews, structural calculations, and obtaining municipal building permits."
    },
    {
      question: "What warranties do you provide upon project completion?",
      answer: "We stand by our craftsmanship. We provide a 10-year structural warranty on framing and foundation elements, alongside standard manufacturer warranties on all mechanical systems and fixtures."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="modern-faq-section">
      <div className="container">
        <div className="faq-grid">
          
          {/* Left Column: Title and Description */}
          <div className="faq-title-column scroll-reveal">
            <div className="faq-badge-pill">
              <i className="fa-solid fa-circle-question"></i>
              <span>Frequently asked questions</span>
            </div>
            <h2 className="faq-heading">
              Frequently asked<br />
              <span className="faq-heading-accent">questions</span>
            </h2>
            <p className="faq-description">
              Find immediate answers to our client's most frequent questions regarding project estimations, safety, and structural warranties.
            </p>
          </div>

          {/* Right Column: Accordion */}
          <div className="faq-accordion-column scroll-reveal delay-200">
            {faqData.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`faq-card-item ${isOpen ? 'expanded' : ''}`}>
                  <button 
                    className="faq-card-header" 
                    onClick={() => handleToggle(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-card-question">{faq.question}</span>
                    <span className={`faq-chevron-circle ${isOpen ? 'active' : ''}`}>
                      <i className="fa-solid fa-chevron-down"></i>
                    </span>
                  </button>
                  <div className={`faq-card-body-wrapper ${isOpen ? 'open' : ''}`}>
                    <div className="faq-card-body">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;
