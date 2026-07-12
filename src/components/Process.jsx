import React, { useState } from 'react';

const Process = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: '01',
      label: 'Planning',
      title: 'Consultation & Planning',
      description: 'We align on project requirements, conduct thorough site evaluations, and draft realistic budgets and regulatory approvals before breaking ground.',
      icon: 'fa-compass-drafting',
      image: 'assets/images/process_planning.jpg'
    },
    {
      num: '02',
      label: 'Construction',
      title: 'Design & Construction',
      description: 'Our team drafts architectural blueprints, secures structural integrity, and manages daily building site logistics for flawless execution.',
      icon: 'fa-trowel-bricks',
      image: 'assets/images/process_construction.jpg'
    },
    {
      num: '03',
      label: 'Handover',
      title: 'Final Inspection & Handover',
      description: 'We perform strict safety audits, complete extensive site cleaning, and deliver premium structural documents alongside the physical keys.',
      icon: 'fa-key',
      image: 'assets/images/process_handover.jpg'
    }
  ];

  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  const progressPercentage = ((activeStep - 1) / (steps.length - 1)) * 100;
  const currentStepData = steps[activeStep - 1];

  return (
    <section id="process" className="process-section section-padding">
      <div className="container">
        <div className="text-center scroll-reveal">
          <span className="section-tag">Our Methodology</span>
          <h2 className="section-title">How We Get It Done</h2>
          <p className="section-subtitle">
            A systematic, three-stage workflow ensuring absolute precision, timeline control, and structural excellence.
          </p>
        </div>

        {/* Process Step Toggles */}
        <div className="process-steps-nav scroll-reveal">
          {steps.map((step, idx) => (
            <button
              key={idx}
              className={`process-nav-btn ${activeStep === idx + 1 ? 'active' : ''}`}
              onClick={() => handleStepClick(idx + 1)}
            >
              <span className="step-num">{step.num}</span>
              <span className="step-label">{step.label}</span>
            </button>
          ))}
        </div>

        {/* Process Content Box */}
        <div className="process-content-container scroll-reveal">
          <div className="process-progress-bar">
            <div className="progress-indicator" style={{ width: `${progressPercentage}%` }}></div>
          </div>

          <div className="process-step-content active">
            <div className="step-grid">
              <div className="step-info">
                <span className="step-phase">Step {currentStepData.num}</span>
                <h3>{currentStepData.title}</h3>
                <p>{currentStepData.description}</p>
              </div>
              <div className="step-visual">
                <div className="process-image-wrapper animate-step-in">
                  <img src={currentStepData.image} alt={currentStepData.title} className="process-step-img" />
                  <div className="process-step-icon-badge">
                    <i className={`fa-solid ${currentStepData.icon}`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
