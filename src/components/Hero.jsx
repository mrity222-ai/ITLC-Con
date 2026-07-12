import React, { useState, useRef, useEffect } from 'react';
import heroVideo from '../assets/video_scroll.mp4';

const Hero = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const targetTimeRef = useRef(0);
  const lastSeekTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const isLoopRunning = useRef(false);

  const stages = [
    {
      id: 0,
      title: '01 / Ground Foundation',
      subtitle: 'Earth excavation, site grading, and high-strength concrete foundation pouring.',
    },
    {
      id: 1,
      title: '02 / Structural Construction',
      subtitle: 'Assembling structural steel framing, wall cladding, and roofing panels.',
    },
    {
      id: 2,
      title: '03 / Handover & Finished',
      subtitle: 'Final inspection, site cleaning, and presenting keys to the completed custom home.',
    }
  ];

  // Lerping loop to interpolate currentTime toward targetTime
  const updateVideoTime = () => {
    if (!videoRef.current) {
      isLoopRunning.current = false;
      return;
    }
    const video = videoRef.current;
    const targetTime = targetTimeRef.current;
    const current = video.currentTime;

    // Linear interpolation (lerp) for smooth 'catch-up' effect
    const ease = 0.15;
    const diff = targetTime - current;

    if (Math.abs(diff) > 0.002) {
      const now = performance.now();
      if (now - lastSeekTimeRef.current > 40) {
        video.currentTime = current + diff * ease;
        lastSeekTimeRef.current = now;
      }

      // Update progress bar and stages based on the actual interpolated currentTime
      const duration = video.duration;
      if (duration > 0) {
        const currentProgress = (video.currentTime / duration) * 100;
        setProgress(currentProgress);

        if (currentProgress < 33.33) {
          setActiveStage(0);
        } else if (currentProgress < 66.66) {
          setActiveStage(1);
        } else {
          setActiveStage(2);
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateVideoTime);
    } else {
      // Snapped to target, stop loop
      video.currentTime = targetTime;
      isLoopRunning.current = false;
      
      const duration = video.duration;
      if (duration > 0) {
        const finalProgress = (targetTime / duration) * 100;
        setProgress(finalProgress);
        if (finalProgress < 33.33) {
          setActiveStage(0);
        } else if (finalProgress < 66.66) {
          setActiveStage(1);
        } else {
          setActiveStage(2);
        }
      }
    }
  };

  const handleScroll = () => {
    if (!trackRef.current || !videoRef.current) return;
    const track = trackRef.current;
    const video = videoRef.current;

    const rect = track.getBoundingClientRect();
    const trackHeight = rect.height;
    const viewHeight = window.innerHeight;
    const scrollOffset = -rect.top;
    const maxScroll = trackHeight - viewHeight;

    if (maxScroll <= 0) return;

    // Progress percentage between 0 and 1
    let scrollProgress = scrollOffset / maxScroll;
    scrollProgress = Math.min(1, Math.max(0, scrollProgress));

    const duration = video.duration;
    if (!isNaN(duration) && duration > 0) {
      targetTimeRef.current = scrollProgress * duration;

      // Start the lerping animation loop if not already running
      if (!isLoopRunning.current) {
        isLoopRunning.current = true;
        animationFrameRef.current = requestAnimationFrame(updateVideoTime);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure preload = 'auto' to download buffer frames
    video.preload = 'auto';
    video.load();

    const handleCanPlayThrough = () => {
      setVideoReady(true);
      handleScroll();
    };

    const handleLoadedMetadata = () => {
      if (video.readyState >= 3) {
        setVideoReady(true);
      }
      handleScroll();
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Warm up decoder on interaction
    const warmUpVideo = () => {
      if (video.paused) {
        video.play()
          .then(() => {
            video.pause();
          })
          .catch((err) => console.log("Video warm-up prevented:", err));
      }
      window.removeEventListener('touchstart', warmUpVideo);
      window.removeEventListener('scroll', warmUpVideo);
    };

    window.addEventListener('touchstart', warmUpVideo);
    window.addEventListener('scroll', warmUpVideo);
    window.addEventListener('scroll', handleScroll);

    // Initial check in case it's already cached and ready
    if (video.readyState >= 3) {
      setVideoReady(true);
      handleScroll();
    }

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('touchstart', warmUpVideo);
      window.removeEventListener('scroll', warmUpVideo);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleStageClick = (idx) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const trackRect = track.getBoundingClientRect();
    const scrollY = window.scrollY;

    const trackTop = trackRect.top + scrollY;
    const trackHeight = trackRect.height;
    const viewHeight = window.innerHeight;
    const maxScroll = trackHeight - viewHeight;

    const targetFraction = idx === 0 ? 0 : idx === 1 ? 0.3333 : 0.6666;
    const targetScroll = trackTop + (targetFraction * maxScroll);

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const scrollToNextSection = (e) => {
    e.preventDefault();
    const element = document.getElementById('services');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getStageProgressBarWidth = (idx) => {
    if (idx === 0) {
      return `${Math.min(100, Math.max(0, (progress / 33.33) * 100))}%`;
    }
    if (idx === 1) {
      return `${Math.min(100, Math.max(0, ((progress - 33.33) / 33.33) * 100))}%`;
    }
    if (idx === 2) {
      return `${Math.min(100, Math.max(0, ((progress - 66.66) / 33.34) * 100))}%`;
    }
    return '0%';
  };

  return (
    <div className="hero-scroll-track" ref={trackRef}>
      <section id="home" className="hero-video-section sticky-hero">
        {/* Background Video */}
        <div className="hero-video-container">
          <video
            ref={videoRef}
            src={heroVideo}
            muted
            loop
            playsInline
            className="hero-bg-video"
            style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.5s ease' }}
          />
          {!videoReady && (
            <div className="video-loading-placeholder" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', background: '#090d16' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ color: 'var(--clr-primary)', fontSize: '1.5rem' }}></i>
            </div>
          )}
          <div className="hero-video-overlay"></div>
        </div>

        {/* Hero Content Overlays */}
        <div className="container hero-video-content">
          {/* Bottom Split: Dynamic Stage Details + Indicators */}
          <div className="hero-footer-grid scroll-reveal delay-200">
            {/* Active Stage Description Widget */}
            <div className="active-stage-widget">
              <span className="stage-badge">Active Progress</span>
              <h2 className="stage-title">{stages[activeStage].title}</h2>
              <p className="stage-desc">{stages[activeStage].subtitle}</p>
            </div>

            {/* Interactive Steps List Indicators */}
            <div className="stage-indicators-panel">
              {stages.map((stage, idx) => (
                <div 
                  key={stage.id} 
                  className={`stage-nav-item ${activeStage === idx ? 'active' : ''}`}
                  onClick={() => handleStageClick(idx)}
                >
                  <div className="stage-bar-wrapper">
                    <div 
                      className="stage-progress-bar" 
                      style={{ 
                        width: getStageProgressBarWidth(idx),
                        transition: 'none'
                      }}
                    ></div>
                  </div>
                  <span className="stage-label-text">{stage.title.split(' / ')[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hero-scroll-indicator" onClick={scrollToNextSection}>
            <span className="mouse-wheel-icon"></span>
            <span className="scroll-label">Scroll to Explore</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
