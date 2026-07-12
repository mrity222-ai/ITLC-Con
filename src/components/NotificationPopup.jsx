import React, { useState, useEffect } from 'react';

const NotificationPopup = () => {
  const [notification, setNotification] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already dismissed it in this session
    const hasDismissed = sessionStorage.getItem('has_dismissed_announcement');
    if (hasDismissed === 'true') {
      return;
    }

    fetch('/api/notifications.php?active=1')
      .then(res => res.json())
      .then(data => {
        if (data && data.title && data.message) {
          setNotification(data);
          setIsOpen(true);
        }
      })
      .catch(err => console.log('Error loading announcement:', err));
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('has_dismissed_announcement', 'true');
  };

  const getImgSrc = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return '/' + img;
  };

  if (!isOpen || !notification) return null;

  return (
    <div 
      className="query-modal-overlay" 
      onClick={handleClose} 
      style={{
        zIndex: 99999,
        background: 'rgba(9, 13, 22, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="query-modal-card animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '480px',
          padding: '30px',
          textAlign: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Close Button 'X' */}
        <button 
          onClick={handleClose} 
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--clr-white)'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}
          aria-label="Dismiss Announcement"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Header */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '15px' }}>
          <span 
            style={{ 
              color: 'var(--clr-primary)', 
              fontWeight: '800', 
              fontSize: '0.68rem', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              display: 'block', 
              marginBottom: '5px' 
            }}
          >
            Announcement
          </span>
          <h3 
            style={{ 
              fontFamily: 'var(--ff-heading)', 
              color: 'var(--clr-white)', 
              fontSize: '1.4rem', 
              fontWeight: '700', 
              margin: 0 
            }}
          >
            {notification.title}
          </h3>
        </div>

        {/* Optional Image */}
        {notification.image && (
          <div style={{ width: '100%', maxHeight: '180px', overflow: 'hidden', borderRadius: '8px' }}>
            <img 
              src={getImgSrc(notification.image)} 
              alt={notification.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}

        {/* Message Text Body */}
        <div style={{ maxHeight: '150px', overflowY: 'auto', paddingRight: '5px' }}>
          <p 
            style={{ 
              fontFamily: 'var(--ff-body)', 
              color: 'rgba(255, 255, 255, 0.75)', 
              fontSize: '0.9rem', 
              lineHeight: '1.6', 
              textAlign: 'left', 
              margin: 0 
            }}
          >
            {notification.message}
          </p>
        </div>

        {/* Footer Close Button */}
        <button 
          onClick={handleClose} 
          className="btn btn-primary"
          style={{ 
            width: '100%', 
            padding: '12px 0', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            fontSize: '0.85rem' 
          }}
        >
          Dismiss &amp; Continue
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
