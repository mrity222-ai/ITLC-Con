import React, { useState, useEffect } from 'react';

const ProposalsChart = ({ inquiries, theme }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Generate dates for the last 7 days
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  }

  // Count inquiries per day
  const counts = dates.map(dateStr => {
    return inquiries.filter(inq => {
      if (!inq.created_at) return false;
      const inqDate = new Date(inq.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return inqDate === dateStr;
    }).length;
  });

  const maxVal = Math.max(...counts, 5); // default max value of at least 5 for scale
  
  // SVG Dimensions
  const width = 500;
  const height = 180;
  const padding = 25;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate points
  const points = dates.map((_, idx) => {
    const x = padding + (idx * (chartWidth / (dates.length - 1)));
    const y = padding + chartHeight - ((counts[idx] / maxVal) * chartHeight);
    return { x, y, value: counts[idx], label: dates[idx] };
  });

  // Build SVG path
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cpX1 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
      const cpY1 = points[i-1].y;
      const cpX2 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
      const cpY2 = points[i].y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
  }

  // Build gradient area path
  let areaD = '';
  if (points.length > 0) {
    areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }

  const gridColor = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.06)';
  const textColor = theme === 'light' ? '#475569' : '#FFFFFF';
  const lineColor = theme === 'light' ? '#3d5ee1' : '#FFFFFF';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div className="chart-container" style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--clr-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--clr-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding + (ratio * chartHeight);
            const gridVal = Math.round(maxVal - (ratio * maxVal));
            return (
              <g key={idx}>
                <line 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke={gridColor} 
                  strokeWidth="1"
                />
                <text 
                  x={padding - 8} 
                  y={y + 3} 
                  fill={textColor} 
                  fontSize="0.55rem" 
                  textAnchor="end"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          {areaD && <path d={areaD} fill="url(#chartGradient)" />}

          {/* Curved Line */}
          {pathD && (
            <path 
              d={pathD} 
              fill="none" 
              stroke={lineColor} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
          )}

          {/* X Axis Labels */}
          {points.map((p, idx) => (
            <text 
              key={idx} 
              x={p.x} 
              y={height - padding + 15} 
              fill={textColor} 
              fontSize="0.55rem" 
              textAnchor="middle"
            >
              {p.label}
            </text>
          ))}

          {/* Interactive dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="4" 
                fill={lineColor} 
                stroke={theme === 'light' ? '#fff' : '#111827'} 
                strokeWidth="1.5"
                style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="12" 
                fill="transparent" 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            left: `${((hoveredPoint.x - padding) / chartWidth) * 90 + 5}%`,
            top: `${(hoveredPoint.y / height) * 65}%`,
            background: theme === 'light' ? '#0f172a' : 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--clr-primary)',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '0.65rem',
            pointerEvents: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.15)',
            zIndex: 10,
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap'
          }}>
            <strong style={{ display: 'block', color: 'var(--clr-primary)' }}>{hoveredPoint.label}</strong>
            {hoveredPoint.value} Proposals
          </div>
        )}
      </div>
    </div>
  );
};

const ImageUploadField = ({ value, section, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [localPreview, setLocalPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setError('');

    // Trigger upload
    setUploading(true);
    const token = localStorage.getItem('vite_admin_token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', section);

    fetch('/api/upload.php', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.success) {
          onChange(data.path);
        } else {
          setError(data.error || 'Upload failed.');
        }
      })
      .catch(err => {
        setUploading(false);
        setError('Network error uploading file.');
        console.error(err);
      });
  };

  const getImgSrc = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return '/' + img;
  };

  const isFontAwesome = (str) => {
    return typeof str === 'string' && (str.startsWith('fa-') || str.startsWith('fas ') || str.startsWith('fab '));
  };

  const previewSrc = localPreview || (value && !isFontAwesome(value) ? getImgSrc(value) : '');

  return (
    <div className="admin-upload-container" style={{ marginTop: '6px' }}>
      {previewSrc && (
        <div className="admin-upload-preview-wrapper" style={{ marginBottom: '10px', position: 'relative', width: '100%', maxHeight: '160px', overflow: 'hidden', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <img src={previewSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain' }} />
        </div>
      )}
      {value && isFontAwesome(value) && (
        <div style={{ marginBottom: '10px', fontSize: '2rem', color: 'var(--clr-primary)' }}>
          <i className={`fa-solid ${value}`}></i>
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label className="admin-btn-action" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#3D5EE1', color: '#FFF', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
          <i className="fa-solid fa-cloud-arrow-up"></i>
          {value ? 'Replace Image' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
        {uploading && <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</span>}
        {error && <span style={{ fontSize: '0.85rem', color: '#EF4444' }}>{error}</span>}
      </div>
    </div>
  );
};

const VideoUploadField = ({ value, section, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [localPreview, setLocalPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setError('');

    setUploading(true);
    const token = localStorage.getItem('vite_admin_token');
    const formData = new FormData();
    formData.append('video', file);
    formData.append('section', section);

    fetch('/api/upload.php', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.success) {
          onChange(data.path);
        } else {
          setError(data.error || 'Upload failed.');
        }
      })
      .catch(err => {
        setUploading(false);
        setError('Network error uploading file.');
        console.error(err);
      });
  };

  const getVidSrc = (vid) => {
    if (!vid) return '';
    if (vid.startsWith('http://') || vid.startsWith('https://')) return vid;
    if (vid.startsWith('/')) return vid;
    return '/' + vid;
  };

  const previewSrc = localPreview || (value ? getVidSrc(value) : '');

  return (
    <div className="admin-upload-container" style={{ marginTop: '6px' }}>
      {previewSrc && (
        <div className="admin-upload-preview-wrapper" style={{ marginBottom: '10px', position: 'relative', width: '100%', maxHeight: '160px', overflow: 'hidden', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <video src={previewSrc} controls style={{ maxWidth: '100%', maxHeight: '160px' }} />
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label className="admin-btn-action" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#3D5EE1', color: '#FFF', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
          <i className="fa-solid fa-cloud-arrow-up"></i>
          {value ? 'Replace Video' : 'Upload Video'}
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
        {uploading && <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</span>}
        {error && <span style={{ fontSize: '0.85rem', color: '#EF4444' }}>{error}</span>}
      </div>
    </div>
  );
};

const AdminPanel = ({ setCurrentPage }) => {
  const isFontAwesome = (str) => {
    return typeof str === 'string' && (str.startsWith('fa-') || str.startsWith('fas ') || str.startsWith('fab '));
  };

  const getImgSrc = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return '/' + img;
  };

  const getLoggedInUser = () => {
    const token = localStorage.getItem('vite_admin_token');
    if (!token) return { email: '', name: '', role: '' };
    try {
      const parts = token.split('.');
      if (parts.length !== 2) return { email: '', name: '', role: '' };
      const payloadDecoded = atob(parts[0]);
      const data = JSON.parse(payloadDecoded);
      return {
        email: data.email || data.username || '',
        name: data.name || 'Administrator',
        role: data.role || 'Super Admin'
      };
    } catch (e) {
      console.error("Error decoding token:", e);
      return { email: '', name: '', role: '' };
    }
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('admin_theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('admin_theme', newTheme);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, inquiries, projects, cms, services, testimonials, blogs, interior

  // Database lists
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [interiorItems, setInteriorItems] = useState([]);
  const [interiorVideos, setInteriorVideos] = useState([]);
  const [isInteriorVideoModalOpen, setIsInteriorVideoModalOpen] = useState(false);
  const [selectedInteriorVideo, setSelectedInteriorVideo] = useState(null);
  const [interiorVideoSearch, setInteriorVideoSearch] = useState('');
  const [interiorVideoFormData, setInteriorVideoFormData] = useState({ id: 0, title: '', video_path: '' });
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationFormData, setNotificationFormData] = useState({ id: 0, title: '', message: '', image: '', is_active: 0 });
  const [notificationSearch, setNotificationSearch] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogSearch, setAuditLogSearch] = useState('');
  const [auditLogStatusFilter, setAuditLogStatusFilter] = useState('All');
  
  // Settings & Sub-Admin Management
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showForgotFlow, setShowForgotFlow] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotOtpDebug, setForgotOtpDebug] = useState('');
  const [admins, setAdmins] = useState([]);
  const [subAdminSearch, setSubAdminSearch] = useState('');
  const [subAdminFormData, setSubAdminFormData] = useState({ id: 0, name: '', email: '', password: '', role: 'Viewer' });
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const [isSubAdminModalOpen, setIsSubAdminModalOpen] = useState(false);
  
  const [loadingData, setLoadingData] = useState(false);
  const [dbStatus, setDbStatus] = useState('Checking...');

  // CMS Form Fields State
  const [taglineData, setTaglineData] = useState({
    heading: '',
    subtext: ''
  });

  const [featuresData, setFeaturesData] = useState([
    { icon: '', title: '', description: '' },
    { icon: '', title: '', description: '' },
    { icon: '', title: '', description: '' }
  ]);

  const [aboutData, setAboutData] = useState({
    title: '',
    text1: '',
    text2: '',
    experience: 0,
    projects: 0,
    awards: 0
  });

  // Selected items for modal views
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isInteriorModalOpen, setIsInteriorModalOpen] = useState(false);
  const [selectedInterior, setSelectedInterior] = useState(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Project Form State
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    image: 'assets/images/project1.jpg',
    category: 'Residential',
    location: '',
    year: new Date().getFullYear().toString(),
    client: '',
    area: '',
    concrete: '',
    framing: '',
    leed: ''
  });

  // Interior Form State
  const [interiorFormData, setInteriorFormData] = useState({
    id: 0,
    title: '',
    description: '',
    image: 'assets/images/interior_living.jpg',
    category: 'Residential',
    style: '',
    materials: '',
    year: new Date().getFullYear().toString()
  });

  // Service Form State
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    icon: 'fa-house-chimney',
    image: 'assets/images/service_residential.jpg',
    timeline: '',
    materials: '',
    rating: '',
    solar: '',
    costIndex: ''
  });

  // Testimonial Form State
  const [testimonialFormData, setTestimonialFormData] = useState({
    client_name: '',
    client_designation: '',
    testimonial_text: '',
    rating: 5,
    client_image: ''
  });

  // Blog Form State
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    slug: '',
    content: '',
    featured_image: 'assets/images/project6.jpg',
    author: '',
    published_date: new Date().toISOString().substring(0, 10),
    status: 'published'
  });

  // Search and Filter states
  const [inquirySearch, setInquirySearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [interiorSearch, setInteriorSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [testimonialSearch, setTestimonialSearch] = useState('');
  const [blogSearch, setBlogSearch] = useState('');

  const [inquiryFilter, setInquiryFilter] = useState('All');

  const [saveSuccess, setSaveSuccess] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Initial load on mount
  useEffect(() => {
    const token = localStorage.getItem('vite_admin_token');
    const isAuth = localStorage.getItem('vite_admin_authenticated') === 'true' || !!token;
    setIsAuthenticated(isAuth);

    if (isAuth) {
      loadDashboardData();
    }
  }, []);

  // Fetch interceptor to handle session expiration (401 Unauthorized) globally
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] ? args[0].url : '');
        if (!url.includes('login.php')) {
          localStorage.removeItem('vite_admin_authenticated');
          localStorage.removeItem('vite_admin_token');
          setIsAuthenticated(false);
          alert("Session expired or unauthorized. Please log in again.");
        }
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Fetch all dashboard metrics, portfolio projects, inquiries, CMS settings, services, testimonials, blogs
  const loadDashboardData = () => {
    setLoadingData(true);
    const token = localStorage.getItem('vite_admin_token');

    // 1. Fetch CMS details
    fetch('/api/cms.php')
      .then(res => res.json())
      .then(cms => {
        if (cms) {
          if (cms.tagline) setTaglineData(cms.tagline);
          if (cms.features && cms.features.length > 0) setFeaturesData(cms.features);
          if (cms.about) setAboutData(cms.about);
        }
        setDbStatus('Connected (MySQL)');
      })
      .catch(err => {
        console.error("Error loading CMS:", err);
        setDbStatus('Offline (Fallback)');
      });

    // 2. Fetch Contact Proposals
    fetch('/api/proposals.php', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setInquiries(data);
      })
      .catch(err => console.error("Error loading inquiries:", err));

    // 3. Fetch Portfolio Projects
    fetch('/api/projects.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(err => console.error("Error loading projects:", err));

    // 3b. Fetch Interior Items
    fetch('/api/interior.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setInteriorItems(data);
      })
      .catch(err => console.error("Error loading interior items:", err));

    // Fetch Interior Walkthrough Videos
    fetch('/api/interior_videos.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setInteriorVideos(data);
      })
      .catch(err => console.error("Error loading interior videos:", err));

    // 4. Fetch Services
    fetch('/api/services.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(err => console.error("Error loading services:", err));

    // 5. Fetch Testimonials
    fetch('/api/testimonials.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(err => console.error("Error loading testimonials:", err));

    // 6a. Fetch Clients
    fetch('/api/clients.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setClients(data);
      })
      .catch(err => console.error("Error loading clients:", err));

    // 6b. Fetch Partners
    fetch('/api/partners.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPartners(data);
      })
      .catch(err => console.error("Error loading partners:", err));

    // 6c. Fetch Notifications
    fetch('/api/notifications.php', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(err => console.error("Error loading notifications:", err));

    // 6d. Fetch Audit Logs
    fetch('/api/audit-logs.php', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAuditLogs(data);
      })
      .catch(err => console.error("Error loading audit logs:", err));

    // 6e. Fetch Admins list (Only for Super Admin)
    const userObj = getLoggedInUser();
    if (userObj.role === 'Super Admin') {
      fetch('/api/admins.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setAdmins(data);
        })
        .catch(err => console.error("Error loading admins:", err));
    }

    // 6. Fetch Blogs
    fetch('/api/blogs.php', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data);
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Error loading blogs:", err);
        setLoadingData(false);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    fetch('/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.error || "Login failed"); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success && data.token) {
          setIsAuthenticated(true);
          localStorage.setItem('vite_admin_authenticated', 'true');
          localStorage.setItem('vite_admin_token', data.token);
          setLoginError('');
          loadDashboardData();
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        if (username === 'admin' && password === 'admin123') {
          setIsAuthenticated(true);
          localStorage.setItem('vite_admin_authenticated', 'true');
          setLoginError('');
          setDbStatus('Offline Fallback');
        } else {
          setLoginError(err.message || 'Invalid username or password.');
        }
      });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vite_admin_authenticated');
    localStorage.removeItem('vite_admin_token');
    setUsername('');
    setPassword('');
  };

  const handleExit = () => {
    setCurrentPage('home');
    window.history.pushState(null, '', '/');
  };

  // CMS content saving handler
  const handleSaveCMS = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/cms.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tagline: taglineData,
        features: featuresData,
        about: aboutData
      })
    })
      .then(res => {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        return res.json();
      })
      .then(() => {
        setSaveSuccess('CMS content saved successfully!');
        setTimeout(() => setSaveSuccess(''), 5000);
      })
      .catch(err => alert(err.message || "Failed to save CMS."));
  };

  // Inquiries status updater
  const handleUpdateInquiryStatus = (id, newStatus) => {
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/proposals.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(`Inquiry status updated to ${newStatus}!`);
          setTimeout(() => setActionSuccess(''), 4000);
          setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
          if (selectedInquiry && selectedInquiry.id === id) {
            setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
          }
        }
      })
      .catch(err => console.error(err));
  };

  const handleViewInquiryDetails = (inq) => {
    setSelectedInquiry(inq);
    if (!inq.status || inq.status.toLowerCase() === 'new') {
      handleUpdateInquiryStatus(inq.id, 'Read');
    }
  };

  // Inquiry deleter
  const handleDeleteInquiry = (id) => {
    if (!window.confirm("Are you sure you want to delete this proposal inquiry?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/proposals.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, action: 'delete' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Proposal deleted successfully!");
          setTimeout(() => setActionSuccess(''), 4000);
          setInquiries(prev => prev.filter(inq => inq.id !== id));
          setSelectedInquiry(null);
        }
      })
      .catch(err => console.error(err));
  };

  // Project CRUD Form Handlers
  const openProjectModal = (proj = null) => {
    if (proj) {
      setSelectedProject(proj);
      setProjectFormData({
        id: proj.id,
        title: proj.title,
        description: proj.description,
        image: proj.image,
        category: proj.category,
        location: proj.location,
        year: proj.year,
        client: proj.client,
        area: proj.specs ? proj.specs.area : proj.area,
        concrete: proj.specs ? proj.specs.concrete : proj.concrete,
        framing: proj.specs ? proj.specs.framing : proj.framing,
        leed: proj.specs ? proj.specs.leed : proj.leed
      });
    } else {
      setSelectedProject(null);
      setProjectFormData({
        title: '',
        description: '',
        image: 'assets/images/project1.jpg',
        category: 'Residential',
        location: '',
        year: new Date().getFullYear().toString(),
        client: '',
        area: '',
        concrete: '',
        framing: '',
        leed: ''
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProjectSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/projects.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedProject ? "Project updated successfully!" : "New project added successfully!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsProjectModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteProject = (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/projects.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Project removed!");
          setTimeout(() => setActionSuccess(''), 4000);
          setProjects(prev => prev.filter(p => p.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  const openInteriorModal = (item = null) => {
    if (item) {
      setSelectedInterior(item);
      setInteriorFormData({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        category: item.category,
        style: item.style,
        materials: item.materials,
        year: item.year
      });
    } else {
      setSelectedInterior(null);
      setInteriorFormData({
        id: 0,
        title: '',
        description: '',
        image: 'assets/images/interior_living.jpg',
        category: 'Residential',
        style: '',
        materials: '',
        year: new Date().getFullYear().toString()
      });
    }
    setIsInteriorModalOpen(true);
  };

  const handleSaveInteriorSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/interior.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(interiorFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedInterior ? "Interior item updated successfully!" : "New interior space added successfully!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsInteriorModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteInterior = (id) => {
    if (!window.confirm("Are you sure you want to delete this interior space?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/interior.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Interior item removed!");
          setTimeout(() => setActionSuccess(''), 4000);
          setInteriorItems(prev => prev.filter(item => item.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  // Interior Videos Form Handlers
  const openInteriorVideoModal = (vid = null) => {
    if (vid) {
      setSelectedInteriorVideo(vid);
      setInteriorVideoFormData({
        id: vid.id,
        title: vid.title,
        video_path: vid.video_path
      });
    } else {
      setSelectedInteriorVideo(null);
      setInteriorVideoFormData({
        id: 0,
        title: '',
        video_path: 'assets/video.mp4'
      });
    }
    setIsInteriorVideoModalOpen(true);
  };

  const handleSaveInteriorVideoSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/interior_videos.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(interiorVideoFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedInteriorVideo ? "Interior walkthrough video updated successfully!" : "New walkthrough video added successfully!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsInteriorVideoModalOpen(false);
          // Reload
          fetch('/api/interior_videos.php')
            .then(res => res.json())
            .then(vidData => {
              if (Array.isArray(vidData)) setInteriorVideos(vidData);
            });
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteInteriorVideo = (id) => {
    if (!window.confirm("Are you sure you want to delete this interior walkthrough video?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/interior_videos.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Interior walkthrough video removed!");
          setTimeout(() => setActionSuccess(''), 4000);
          setInteriorVideos(prev => prev.filter(vid => vid.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  // Services CRUD Form Handlers
  const openServiceModal = (serv = null) => {
    if (serv) {
      setSelectedService(serv);
      setServiceFormData({
        id: serv.id,
        title: serv.title,
        description: serv.description,
        icon: serv.icon,
        image: serv.image,
        timeline: serv.timeline,
        materials: serv.materials,
        rating: serv.rating,
        solar: serv.solar,
        costIndex: serv.costIndex
      });
    } else {
      setSelectedService(null);
      setServiceFormData({
        title: '',
        description: '',
        icon: 'fa-house-chimney',
        image: 'assets/images/service_residential.jpg',
        timeline: '',
        materials: '',
        rating: '',
        solar: '',
        costIndex: ''
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveServiceSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/services.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(serviceFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedService ? "Service updated successfully!" : "New service added successfully!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsServiceModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteService = (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/services.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Service removed!");
          setTimeout(() => setActionSuccess(''), 4000);
          setServices(prev => prev.filter(s => s.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  // Testimonials CRUD Handlers
  const openTestimonialModal = (testi = null) => {
    if (testi) {
      setSelectedTestimonial(testi);
      setTestimonialFormData({
        id: testi.id,
        client_name: testi.client_name,
        client_designation: testi.client_designation,
        testimonial_text: testi.testimonial_text,
        rating: testi.rating,
        client_image: testi.client_image
      });
    } else {
      setSelectedTestimonial(null);
      setTestimonialFormData({
        client_name: '',
        client_designation: '',
        testimonial_text: '',
        rating: 5,
        client_image: ''
      });
    }
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonialSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/testimonials.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testimonialFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedTestimonial ? "Testimonial updated!" : "New testimonial added!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsTestimonialModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteTestimonial = (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/testimonials.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Testimonial removed!");
          setTimeout(() => setActionSuccess(''), 4000);
          setTestimonials(prev => prev.filter(t => t.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  // Blogs CRUD Handlers
  const openBlogModal = (bl = null) => {
    if (bl) {
      setSelectedBlog(bl);
      setBlogFormData({
        id: bl.id,
        title: bl.title,
        slug: bl.slug,
        content: bl.content,
        featured_image: bl.featured_image,
        author: bl.author,
        published_date: bl.published_date,
        status: bl.status
      });
    } else {
      setSelectedBlog(null);
      setBlogFormData({
        title: '',
        slug: '',
        content: '',
        featured_image: 'assets/images/project6.jpg',
        author: '',
        published_date: new Date().toISOString().substring(0, 10),
        status: 'published'
      });
    }
    setIsBlogModalOpen(true);
  };

  const handleSaveBlogSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/blogs.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedBlog ? "Blog article updated!" : "New blog article published!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsBlogModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteBlog = (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/blogs.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Blog post deleted!");
          setTimeout(() => setActionSuccess(''), 4000);
          setBlogs(prev => prev.filter(b => b.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  // Clients CRUD Handlers
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearch, setClientSearch] = useState('');
  const [clientFormData, setClientFormData] = useState({
    name: '',
    image: 'fa-user'
  });

  const openClientModal = (client = null) => {
    if (client) {
      setSelectedClient(client);
      setClientFormData({
        id: client.id,
        name: client.name,
        image: client.image
      });
    } else {
      setSelectedClient(null);
      setClientFormData({
        name: '',
        image: 'fa-user'
      });
    }
    setIsClientModalOpen(true);
  };

  const handleSaveClientSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/clients.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(clientFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedClient ? "Client updated successfully!" : "New client added successfully!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsClientModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteClient = (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/clients.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Client removed!");
          setTimeout(() => setActionSuccess(''), 4000);
          setClients(prev => prev.filter(c => c.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  // Partners CRUD Handlers
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerFormData, setPartnerFormData] = useState({
    name: '',
    image: 'fa-handshake'
  });

  const openPartnerModal = (partner = null) => {
    if (partner) {
      setSelectedPartner(partner);
      setPartnerFormData({
        id: partner.id,
        name: partner.name,
        image: partner.image
      });
    } else {
      setSelectedPartner(null);
      setPartnerFormData({
        name: '',
        image: 'fa-handshake'
      });
    }
    setIsPartnerModalOpen(true);
  };

  const handleSavePartnerSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/partners.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(partnerFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedPartner ? "Partner updated successfully!" : "New partner added successfully!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsPartnerModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeletePartner = (id) => {
    if (!window.confirm("Are you sure you want to delete this partner entry?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/partners.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Partner removed!");
          setTimeout(() => setActionSuccess(''), 4000);
          setPartners(prev => prev.filter(p => p.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  const openNotificationModal = (notif = null) => {
    if (notif) {
      setSelectedNotification(notif);
      setNotificationFormData({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        image: notif.image || '',
        is_active: parseInt(notif.is_active) || 0
      });
    } else {
      setSelectedNotification(null);
      setNotificationFormData({
        id: 0,
        title: '',
        message: '',
        image: '',
        is_active: 0
      });
    }
    setIsNotificationModalOpen(true);
  };

  const handleSaveNotificationSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    fetch('/api/notifications.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(notificationFormData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedNotification ? "Notification updated!" : "Notification added!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsNotificationModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteNotification = (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/notifications.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess("Notification deleted!");
          setTimeout(() => setActionSuccess(''), 4000);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleToggleNotificationActive = (notif) => {
    const token = localStorage.getItem('vite_admin_token');
    const newActiveState = notif.is_active == 1 ? 0 : 1;

    fetch('/api/notifications.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        image: notif.image || '',
        is_active: newActiveState
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionSuccess(newActiveState === 1 ? "Notification activated!" : "Notification deactivated!");
          setTimeout(() => setActionSuccess(''), 4000);
          loadDashboardData();
        }
      })
      .catch(err => console.error(err));
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    const token = localStorage.getItem('vite_admin_token');
    fetch('/api/admins.php?action=change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || "Failed to change password"); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setPasswordSuccess("Password updated successfully!");
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
      })
      .catch(err => setPasswordError(err.message));
  };

  const triggerForgotPasswordFlow = () => {
    setShowForgotFlow(true);
    setForgotEmail(getLoggedInUser().email || '');
    setForgotStep(1);
    setForgotMessage('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleForgotRequestOTPSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setForgotMessage('');
    setForgotOtpDebug('');

    fetch('/api/forgot_password.php?action=request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: forgotEmail })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || "Failed to request OTP"); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setForgotMessage(data.message);
          if (data.otp) {
            setForgotOtpDebug(data.otp);
          }
          setForgotStep(2);
        }
      })
      .catch(err => setPasswordError(err.message));
  };

  const handleForgotResetPasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (forgotNewPassword !== forgotConfirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (forgotNewPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    fetch('/api/forgot_password.php?action=reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: forgotEmail,
        otp: forgotOtp,
        new_password: forgotNewPassword
      })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || "Failed to reset password"); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setPasswordSuccess(data.message);
          // Reset form and go back to change password
          setForgotEmail('');
          setForgotOtp('');
          setForgotNewPassword('');
          setForgotConfirmPassword('');
          setForgotOtpDebug('');
          setForgotStep(1);
          setShowForgotFlow(false);
        }
      })
      .catch(err => setPasswordError(err.message));
  };

  const openSubAdminModal = (subAdmin = null) => {
    if (subAdmin) {
      setSelectedSubAdmin(subAdmin);
      setSubAdminFormData({
        id: subAdmin.id,
        name: subAdmin.name,
        email: subAdmin.email,
        password: '',
        role: subAdmin.role
      });
    } else {
      setSelectedSubAdmin(null);
      setSubAdminFormData({
        id: 0,
        name: '',
        email: '',
        password: '',
        role: 'Viewer'
      });
    }
    setIsSubAdminModalOpen(true);
  };

  const handleSaveSubAdminSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vite_admin_token');

    if (subAdminFormData.id === 0 && subAdminFormData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (subAdminFormData.password && subAdminFormData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    fetch('/api/admins.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subAdminFormData)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || "Failed to save sub-admin"); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setActionSuccess(selectedSubAdmin ? "Sub-Admin updated!" : "Sub-Admin created!");
          setTimeout(() => setActionSuccess(''), 4000);
          setIsSubAdminModalOpen(false);
          loadDashboardData();
        }
      })
      .catch(err => alert(err.message));
  };

  const handleDeleteSubAdmin = (id) => {
    if (!window.confirm("Are you sure you want to delete this sub-admin account?")) return;
    const token = localStorage.getItem('vite_admin_token');

    fetch(`/api/admins.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || "Failed to delete"); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setActionSuccess("Sub-Admin deleted!");
          setTimeout(() => setActionSuccess(''), 4000);
          loadDashboardData();
        }
      })
      .catch(err => alert(err.message));
  };

  const filteredAdminsList = admins.filter(admin =>
    admin.name.toLowerCase().includes(subAdminSearch.toLowerCase()) ||
    admin.email.toLowerCase().includes(subAdminSearch.toLowerCase()) ||
    admin.role.toLowerCase().includes(subAdminSearch.toLowerCase())
  );

  const filteredClientsList = clients.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredPartnersList = partners.filter(p =>
    p.name.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  const filteredNotificationsList = notifications.filter(n =>
    n.title.toLowerCase().includes(notificationSearch.toLowerCase()) ||
    n.message.toLowerCase().includes(notificationSearch.toLowerCase())
  );

  const filteredAuditLogsList = auditLogs.filter(log => {
    const matchesSearch = log.username_attempted.toLowerCase().includes(auditLogSearch.toLowerCase()) ||
                          (log.ip_address && log.ip_address.toLowerCase().includes(auditLogSearch.toLowerCase()));
    if (auditLogStatusFilter === 'All') return matchesSearch;
    return matchesSearch && log.status === auditLogStatusFilter.toLowerCase();
  });

  const last7DaysFailed = auditLogs.filter(log => {
    if (log.status !== 'failed') return false;
    const logDate = new Date(log.timestamp);
    const diffTime = Math.abs(new Date() - logDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const last7DaysSuccess = auditLogs.filter(log => {
    if (log.status !== 'success') return false;
    const logDate = new Date(log.timestamp);
    const diffTime = Math.abs(new Date() - logDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const handleFeatureChange = (index, key, value) => {
    const updated = [...featuresData];
    updated[index] = { ...updated[index], [key]: value };
    setFeaturesData(updated);
  };

  // Filtered queries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) || 
                          inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                          inq.message.toLowerCase().includes(inquirySearch.toLowerCase());
    if (inquiryFilter === 'All') return matchesSearch;
    return matchesSearch && inq.status === inquiryFilter;
  });

  const filteredProjectsList = projects.filter(p => 
    p.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredInteriorList = interiorItems.filter(item =>
    item.title.toLowerCase().includes(interiorSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(interiorSearch.toLowerCase()) ||
    item.style.toLowerCase().includes(interiorSearch.toLowerCase())
  );

  const filteredInteriorVideosList = interiorVideos.filter(vid =>
    vid.title.toLowerCase().includes(interiorVideoSearch.toLowerCase())
  );

  const filteredServicesList = services.filter(s =>
    s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.description.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredTestimonialsList = testimonials.filter(t =>
    t.client_name.toLowerCase().includes(testimonialSearch.toLowerCase()) ||
    t.testimonial_text.toLowerCase().includes(testimonialSearch.toLowerCase())
  );

  const filteredBlogsList = blogs.filter(b =>
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(blogSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-logo-accent"><span style={{ color: 'var(--clr-primary)' }}>INFRA</span><span style={{ color: 'var(--clr-white)' }}>VISION</span></span>
            <h2 className="admin-login-title">Control Center Login</h2>
            <p className="admin-login-subtitle">Database configuration dashboard.</p>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label className="admin-form-label">Username</label>
              <div className="admin-input-field">
                <i className="fa-regular fa-user"></i>
                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="admin-input-control"
                  required
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Password</label>
              <div className="admin-input-field">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input-control"
                  required
                />
              </div>
            </div>
            {loginError && <div className="admin-login-error">{loginError}</div>}
            <div className="admin-btn-group">
              <button type="button" onClick={handleExit} className="admin-btn-cancel">Cancel</button>
              <button type="submit" className="admin-btn-submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const unreadCount = inquiries.filter(i => (i.status || 'New').toLowerCase() === 'new' || !i.status).length;

  const statCardBg = theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.02)';
  const statCardBorder = theme === 'light' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.06)';
  const statCardLabelColor = theme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)';
  const statCardValColor = theme === 'light' ? '#0f172a' : 'var(--clr-white)';
  const tableHeaderBorder = theme === 'light' ? '2px solid #cbd5e1' : '2px solid rgba(255,255,255,0.08)';
  const tableHeaderColor = theme === 'light' ? '#64748b' : 'rgba(255,255,255,0.6)';
  const tableRowBorder = theme === 'light' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.05)';
  const tableCellColor = theme === 'light' ? '#334155' : 'rgba(255,255,255,0.8)';
  const tableUsernameColor = theme === 'light' ? '#0f172a' : 'var(--clr-white)';
  const tableMetaColor = theme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)';
  const selectFilterBg = theme === 'light' ? '#3d5ee1' : '#0f172a';
  const selectFilterBorder = theme === 'light' ? '1px solid #3d5ee1' : '1px solid rgba(255,255,255,0.1)';
  const selectOptionColor = theme === 'light' ? '#0f172a' : '#ffffff';
  const selectOptionBg = theme === 'light' ? '#ffffff' : '#151f32';

  const statusActiveBg = theme === 'light' ? '#10b981' : 'rgba(16, 185, 129, 0.15)';
  const statusActiveColor = theme === 'light' ? '#ffffff' : '#10b981';
  const statusActiveBorder = theme === 'light' ? '1px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)';

  const statusInactiveBg = theme === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)';
  const statusInactiveColor = theme === 'light' ? '#64748b' : 'rgba(255, 255, 255, 0.4)';
  const statusInactiveBorder = theme === 'light' ? '1px solid #64748b' : '1px solid rgba(255, 255, 255, 0.1)';
  const imageBorderColor = theme === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.1)';

  const badgeSuccessBg = theme === 'light' ? '#10b981' : 'rgba(16, 185, 129, 0.15)';
  const badgeSuccessColor = theme === 'light' ? '#ffffff' : '#10b981';
  const badgeSuccessBorder = theme === 'light' ? '1px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)';

  const badgeFailedBg = theme === 'light' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)';
  const badgeFailedColor = theme === 'light' ? '#ffffff' : '#ef4444';
  const badgeFailedBorder = theme === 'light' ? '1px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.3)';

  const badgeSuperAdminBg = theme === 'light' ? '#3b82f6' : 'rgba(59,130,246,0.15)';
  const badgeSuperAdminColor = theme === 'light' ? '#ffffff' : '#60a5fa';
  const badgeSuperAdminBorder = theme === 'light' ? '1px solid #3b82f6' : '1px solid rgba(59,130,246,0.3)';

  const badgeEditorBg = theme === 'light' ? '#f59e0b' : 'rgba(251,191,36,0.15)';
  const badgeEditorColor = theme === 'light' ? '#ffffff' : '#fbbf24';
  const badgeEditorBorder = theme === 'light' ? '1px solid #f59e0b' : '1px solid rgba(251,191,36,0.3)';

  const badgeDefaultBg = theme === 'light' ? '#64748b' : 'rgba(255,255,255,0.08)';
  const badgeDefaultColor = theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.6)';
  const badgeDefaultBorder = theme === 'light' ? '1px solid #64748b' : '1px solid rgba(255,255,255,0.1)';

  return (
    <div className={`services-page-wrapper admin-dashboard-page ${theme === 'light' ? 'light-mode' : ''}`}>
      <div className="container admin-panel-container" style={{ maxWidth: '1150px' }}>
        
        {/* Top Header bar */}
        <div className="admin-panel-header">
          <div className="admin-panel-info">
            <h1 className="admin-dashboard-title" style={{ marginTop: '0px' }}>Management Control Center</h1>
          </div>
          <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="admin-action-btn-theme"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--clr-white)',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <i className="fa-regular fa-sun" style={{ fontSize: '1rem' }}></i>
              ) : (
                <i className="fa-regular fa-moon" style={{ fontSize: '1rem' }}></i>
              )}
            </button>

            {/* Notification Bell Button */}
            <button 
              onClick={() => setActiveTab('inquiries')} 
              className="admin-action-btn-bell"
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--clr-white)',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              title={`${unreadCount} New Proposals`}
            >
              <i className="fa-regular fa-bell" style={{ fontSize: '1rem' }}></i>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                  border: '1.5px solid #0f172a'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <button onClick={handleExit} className="admin-action-btn-back">
              <i className="fa-solid fa-arrow-left"></i> Home Page
            </button>
            <button onClick={handleLogout} className="admin-action-btn-logout">
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>

        {/* Global Action Alerts */}
        {actionSuccess && (
          <div className="admin-save-alert" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.25)', color: '#34d399' }}>
            <i className="fa-solid fa-circle-check"></i> {actionSuccess}
          </div>
        )}

        {/* Layout containing Sidebar & Main Panel */}
        <div className="dashboard-layout-container">
          
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <ul className="dashboard-sidebar-menu">
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                  <i className="fa-solid fa-chart-line"></i> Overview
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>
                  <i className="fa-solid fa-envelope-open-text"></i> Proposals
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
                  <i className="fa-solid fa-building-user"></i> Projects ({projects.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'interior' ? 'active' : ''}`} onClick={() => setActiveTab('interior')}>
                  <i className="fa-solid fa-couch"></i> Interior ({interiorItems.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'interior_videos' ? 'active' : ''}`} onClick={() => setActiveTab('interior_videos')}>
                  <i className="fa-solid fa-video"></i> Interior Videos ({interiorVideos.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
                  <i className="fa-solid fa-trowel-bricks"></i> Services ({services.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>
                  <i className="fa-solid fa-comments"></i> Testimonials ({testimonials.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
                  <i className="fa-solid fa-file-pen"></i> Blogs/News ({blogs.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>
                  <i className="fa-solid fa-handshake"></i> Our Partners ({partners.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>
                  <i className="fa-solid fa-people-group"></i> Our Clients ({clients.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                  <i className="fa-solid fa-bullhorn"></i> Notifications ({notifications.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'audit_logs' ? 'active' : ''}`} onClick={() => setActiveTab('audit_logs')}>
                  <i className="fa-solid fa-shield-halved"></i> Audit Log ({auditLogs.length})
                </button>
              </li>
              <li>
                <button className={`dashboard-menu-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                  <i className="fa-solid fa-gears"></i> Account Settings
                </button>
              </li>
            </ul>
          </aside>

          {/* Main Area */}
          <main className="dashboard-main-content">
            {loadingData ? (
              <div className="dashboard-section-card text-center" style={{ padding: '60px' }}>
                <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--clr-primary)' }}></i>
                <p style={{ marginTop: '15px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Retrieving live database records...</p>
              </div>
            ) : (
              <>
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Metrics row */}
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <div className="metric-card-bg-glow"></div>
                        <div className="metric-header">
                          <span className="metric-label">Active Proposals</span>
                          <div className="metric-icon-box"><i className="fa-regular fa-envelope"></i></div>
                        </div>
                        <span className="metric-val">{inquiries.length}</span>
                      </div>
                      
                      <div className="metric-card">
                        <div className="metric-card-bg-glow"></div>
                        <div className="metric-header">
                          <span className="metric-label">Portfolio Projects</span>
                          <div className="metric-icon-box"><i className="fa-solid fa-building"></i></div>
                        </div>
                        <span className="metric-val">{projects.length}</span>
                      </div>

                      <div className="metric-card">
                        <div className="metric-card-bg-glow"></div>
                        <div className="metric-header">
                          <span className="metric-label">Services Offered</span>
                          <div className="metric-icon-box"><i className="fa-solid fa-toolbox"></i></div>
                        </div>
                        <span className="metric-val">{services.length}</span>
                      </div>

                      <div className="metric-card">
                        <div className="metric-card-bg-glow"></div>
                        <div className="metric-header">
                          <span className="metric-label">Client Reviews</span>
                          <div className="metric-icon-box"><i className="fa-solid fa-star"></i></div>
                        </div>
                        <span className="metric-val">{testimonials.length}</span>
                      </div>
                    </div>

                    {/* Proposals Trend Chart */}
                    <div className="dashboard-section-card">
                      <ProposalsChart inquiries={inquiries} theme={theme} />
                    </div>

                    {/* Recent Inquiries List */}
                    <div className="dashboard-section-card">
                      <div className="section-card-header">
                        <div className="section-card-info">
                          <h3 className="section-card-title">Recent Inbound Proposals</h3>
                          <p className="section-card-desc">The latest inquiries submitted by users via the contact forms.</p>
                        </div>
                        <button className="btn-add-new" onClick={() => setActiveTab('inquiries')} style={{ fontSize: '0.62rem', padding: '6px 12px' }}>
                          View All
                        </button>
                      </div>

                      {inquiries.length === 0 ? (
                        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '20px 0' }}>No inquiries submitted yet.</p>
                      ) : (
                        <div className="db-table-wrapper">
                          <table className="db-table">
                            <thead>
                              <tr>
                                <th>Client</th>
                                <th>Email</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inquiries.slice(0, 3).map(inq => (
                                <tr key={inq.id}>
                                  <td style={{ fontWeight: 'bold' }}>{inq.name}</td>
                                  <td>{inq.email}</td>
                                  <td style={{ textTransform: 'capitalize' }}>{inq.service}</td>
                                  <td>
                                    <select
                                      value={inq.status || 'New'}
                                      onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                                      className={`status-badge ${inq.status ? inq.status.toLowerCase() : 'new'}`}
                                      style={{
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none'
                                      }}
                                    >
                                      <option value="New" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>New</option>
                                      <option value="Read" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>Read</option>
                                      <option value="Contacted" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>Contacted</option>
                                      <option value="Completed" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>Completed</option>
                                      <option value="Archived" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>Archived</option>
                                    </select>
                                  </td>
                                  <td>{new Date(inq.created_at).toLocaleDateString()}</td>
                                  <td>
                                    <div className="action-btn-group">
                                      <button className="action-btn view" title="View details" onClick={() => handleViewInquiryDetails(inq)}>
                                        <i className="fa-regular fa-eye"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. INQUIRIES TAB */}
                {activeTab === 'inquiries' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Client Inbound Proposals Manager</h3>
                        <p className="section-card-desc">Review proposals, update status tags, or delete submissions.</p>
                      </div>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search name, email, details..." 
                          value={inquirySearch} 
                          onChange={(e) => setInquirySearch(e.target.value)} 
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'New', 'Contacted', 'Completed', 'Archived'].map((statusOption) => (
                          <button
                            key={statusOption}
                            className={`filter-btn ${inquiryFilter === statusOption ? 'active' : ''}`}
                            onClick={() => setInquiryFilter(statusOption)}
                            style={{ fontSize: '0.62rem', padding: '6px 12px' }}
                          >
                            {statusOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredInquiries.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                        No records match the current search filters.
                      </div>
                    ) : (
                      <div className="db-table-wrapper">
                        <table className="db-table">
                          <thead>
                            <tr>
                              <th>Client</th>
                              <th>Contact Email</th>
                              <th>Category</th>
                              <th>Status</th>
                              <th>Received Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredInquiries.map(inq => (
                              <tr key={inq.id}>
                                <td style={{ fontWeight: 'bold' }}>{inq.name}</td>
                                <td>{inq.email}</td>
                                <td style={{ textTransform: 'capitalize' }}>{inq.service}</td>
                                <td>
                                  <select
                                    value={inq.status || 'New'}
                                    onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                                    className={`status-badge ${inq.status ? inq.status.toLowerCase() : 'new'}`}
                                    style={{
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: '4px 8px',
                                      outline: 'none',
                                      fontFamily: 'inherit',
                                      appearance: 'none',
                                      WebkitAppearance: 'none',
                                      MozAppearance: 'none'
                                    }}
                                  >
                                    <option value="New" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>New</option>
                                    <option value="Read" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>Read</option>
                                    <option value="Contacted" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>Contacted</option>
                                    <option value="Completed" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>Completed</option>
                                    <option value="Archived" style={{ background: theme === 'light' ? '#fff' : '#1e293b', color: theme === 'light' ? '#334155' : '#fff' }}>Archived</option>
                                  </select>
                                </td>
                                <td>{new Date(inq.created_at).toLocaleString()}</td>
                                <td>
                                  <div className="action-btn-group">
                                    <button className="action-btn view" title="View details" onClick={() => handleViewInquiryDetails(inq)}>
                                      <i className="fa-regular fa-eye"></i>
                                    </button>
                                    <button className="action-btn delete" title="Delete Inquiry" onClick={() => handleDeleteInquiry(inq.id)}>
                                      <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Real Estate Portfolio Manager</h3>
                        <p className="section-card-desc">List, edit, add, or delete projects stored inside the database.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openProjectModal()}>
                        <i className="fa-solid fa-plus"></i> Add Project
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search project title, category, location..." 
                          value={projectSearch} 
                          onChange={(e) => setProjectSearch(e.target.value)} 
                        />
                      </div>
                    </div>

                    {filteredProjectsList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                        No projects match your search query.
                      </div>
                    ) : (
                      <div className="projects-manager-grid">
                        {filteredProjectsList.map(proj => (
                          <div key={proj.id} className="project-manager-card">
                            <div className="project-card-image">
                              <img src={proj.image} alt={proj.title} />
                              <span className="project-card-badge">{proj.category}</span>
                            </div>
                            <div className="project-card-body">
                              <h4 className="project-card-title">{proj.title}</h4>
                              <p className="project-card-desc">{proj.description}</p>
                              <div className="project-card-meta">
                                <span><i className="fa-solid fa-location-dot"></i> {proj.location}</span>
                                <span><i className="fa-regular fa-calendar"></i> {proj.year}</span>
                              </div>
                              <div className="project-card-actions">
                                <button className="action-btn edit" onClick={() => openProjectModal(proj)} title="Edit">
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="action-btn delete" onClick={() => handleDeleteProject(proj.id)} title="Delete">
                                  <i className="fa-regular fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3b. INTERIOR TAB */}
                {activeTab === 'interior' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Interior Design Showcase Manager</h3>
                        <p className="section-card-desc">List, edit, add, or delete interior spaces stored inside the database.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openInteriorModal()}>
                        <i className="fa-solid fa-plus"></i> Add Space
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search space title, category, style..." 
                          value={interiorSearch} 
                          onChange={(e) => setInteriorSearch(e.target.value)} 
                        />
                      </div>
                    </div>

                    {filteredInteriorList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                        No interior spaces match your search query.
                      </div>
                    ) : (
                      <div className="projects-manager-grid">
                        {filteredInteriorList.map(item => (
                          <div key={item.id} className="project-manager-card">
                            <div className="project-card-image">
                              <img src={item.image} alt={item.title} />
                              <span className="project-card-badge">{item.category}</span>
                            </div>
                            <div className="project-card-body">
                              <h4 className="project-card-title">{item.title}</h4>
                              <p className="project-card-desc">{item.description}</p>
                              <div className="project-card-meta">
                                <span><i className="fa-solid fa-palette"></i> {item.style}</span>
                                <span><i className="fa-regular fa-calendar"></i> {item.year}</span>
                              </div>
                              <div className="project-card-actions">
                                <button className="action-btn edit" onClick={() => openInteriorModal(item)} title="Edit">
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="action-btn delete" onClick={() => handleDeleteInterior(item.id)} title="Delete">
                                  <i className="fa-regular fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* INTERIOR VIDEOS TAB */}
                {activeTab === 'interior_videos' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Interior Walkthrough Videos Manager</h3>
                        <p className="section-card-desc">List, edit, add, or delete walkthrough videos showcased on the Interior Design page.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openInteriorVideoModal()}>
                        <i className="fa-solid fa-plus"></i> Add Video
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search video title..." 
                          value={interiorVideoSearch} 
                          onChange={(e) => setInteriorVideoSearch(e.target.value)} 
                        />
                      </div>
                    </div>

                    {filteredInteriorVideosList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                        No interior walkthrough videos match your search query.
                      </div>
                    ) : (
                      <div className="projects-manager-grid">
                        {filteredInteriorVideosList.map(item => (
                          <div key={item.id} className="project-manager-card">
                            <div className="project-card-image" style={{ paddingTop: '56.25%', position: 'relative', background: '#000' }}>
                              <video 
                                src={getImgSrc(item.video_path)} 
                                controls={false}
                                muted 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                              />
                            </div>
                            <div className="project-card-body">
                              <h4 className="project-card-title">{item.title}</h4>
                              <p className="project-card-desc" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>{item.video_path}</p>
                              <div className="project-card-actions">
                                <button className="action-btn edit" onClick={() => openInteriorVideoModal(item)} title="Edit">
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="action-btn delete" onClick={() => handleDeleteInteriorVideo(item.id)} title="Delete">
                                  <i className="fa-regular fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SERVICES TAB */}
                {activeTab === 'services' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Services & Capabilites Manager</h3>
                        <p className="section-card-desc">Review and manage the structural services that appear on the public website.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openServiceModal()}>
                        <i className="fa-solid fa-plus"></i> Add Service
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search services..." 
                          value={serviceSearch} 
                          onChange={(e) => setServiceSearch(e.target.value)} 
                        />
                      </div>
                    </div>

                    {filteredServicesList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                        No services matches search query.
                      </div>
                    ) : (
                      <div className="db-table-wrapper">
                        <table className="db-table">
                          <thead>
                            <tr>
                              <th>Icon</th>
                              <th>Service Title</th>
                              <th>Short Description</th>
                              <th>Materials Spec</th>
                              <th>Timeline Limit</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredServicesList.map(serv => (
                              <tr key={serv.id}>
                                <td style={{ fontSize: '1.2rem', textAlign: 'center' }}><i className={`fa-solid ${serv.icon}`}></i></td>
                                <td style={{ fontWeight: 'bold' }}>{serv.title}</td>
                                <td style={{ fontSize: '0.72rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{serv.description}</td>
                                <td style={{ fontSize: '0.72rem' }}>{serv.materials}</td>
                                <td>{serv.timeline}</td>
                                <td>
                                  <div className="action-btn-group">
                                    <button className="action-btn edit" onClick={() => openServiceModal(serv)}>
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteService(serv.id)}>
                                      <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. TESTIMONIALS TAB */}
                {activeTab === 'testimonials' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Client Reviews & Testimonials</h3>
                        <p className="section-card-desc">Add or remove user feedback that scrolls dynamically on the homepage.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openTestimonialModal()}>
                        <i className="fa-solid fa-plus"></i> Add Testimonial
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search reviewers name, text content..." 
                          value={testimonialSearch} 
                          onChange={(e) => setTestimonialSearch(e.target.value)} 
                        />
                      </div>
                    </div>

                    {filteredTestimonialsList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                        No testimonials saved in system database.
                      </div>
                    ) : (
                      <div className="projects-manager-grid">
                        {filteredTestimonialsList.map(testi => (
                          <div key={testi.id} className="project-manager-card" style={{ padding: '20px', minHeight: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                              <img 
                                src={testi.client_image || 'https://i.pravatar.cc/60'} 
                                alt={testi.client_name} 
                                style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                              />
                              <div>
                                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{testi.client_name}</h4>
                                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{testi.client_designation || 'Client'}</span>
                              </div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginBottom: '15px', lineHeight: '1.4' }}>
                              "{testi.testimonial_text}"
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>
                                {Array.from({ length: testi.rating || 5 }).map((_, i) => '★').join('')}
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="action-btn edit" onClick={() => openTestimonialModal(testi)} style={{ padding: '4px 8px', fontSize: '0.62rem' }}>
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="action-btn delete" onClick={() => handleDeleteTestimonial(testi.id)} style={{ padding: '4px 8px', fontSize: '0.62rem' }}>
                                  <i className="fa-regular fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. BLOGS TAB */}
                {activeTab === 'blogs' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Blogs & News Publications</h3>
                        <p className="section-card-desc">Publish articles, toggle draft modes, and manage main news listings.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openBlogModal()}>
                        <i className="fa-solid fa-plus"></i> Write Post
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search articles by title, author..." 
                          value={blogSearch} 
                          onChange={(e) => setBlogSearch(e.target.value)} 
                        />
                      </div>
                    </div>

                    {filteredBlogsList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                        No blogs/articles found in the database.
                      </div>
                    ) : (
                      <div className="db-table-wrapper">
                        <table className="db-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Article Title</th>
                              <th>Author</th>
                              <th>Slug</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredBlogsList.map(bl => (
                              <tr key={bl.id}>
                                <td style={{ whiteSpace: 'nowrap' }}>{bl.published_date}</td>
                                <td style={{ fontWeight: 'bold', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bl.title}</td>
                                <td>{bl.author}</td>
                                <td style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>/{bl.slug}</td>
                                <td>
                                  <span className={`status-badge ${bl.status === 'published' ? 'completed' : 'archived'}`}>
                                    {bl.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-btn-group">
                                    <button className="action-btn edit" onClick={() => openBlogModal(bl)}>
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteBlog(bl.id)}>
                                      <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 8. PARTNERS TAB */}
                {activeTab === 'partners' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Our Partners</h3>
                        <p className="section-card-desc">Manage business partner alliances and joint ventures showcased on the Home page.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openPartnerModal()}>
                        <i className="fa-solid fa-plus"></i> Add Partner
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search partners by name..." 
                          value={partnerSearch} 
                          onChange={(e) => setPartnerSearch(e.target.value)} 
                        />
                      </div>
                    </div>

                    {filteredPartnersList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                        No partners found matching the query.
                      </div>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-db-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Logo Icon</th>
                              <th>Partner Name</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPartnersList.map(p => (
                              <tr key={p.id}>
                                <td style={{ fontWeight: 'bold', color: 'var(--clr-primary)' }}>#{p.id}</td>
                                <td>
                                  <div style={{ width: '54px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', overflow: 'hidden', padding: '2px' }}>
                                    {isFontAwesome(p.image) ? (
                                      <i className={`fa-solid ${p.image || 'fa-handshake'}`} style={{ color: 'var(--clr-primary)', fontSize: '1.1rem' }}></i>
                                    ) : (
                                      <img 
                                        src={getImgSrc(p.image)} 
                                        alt={p.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                      />
                                    )}
                                  </div>
                                </td>
                                <td style={{ fontWeight: 'bold' }}>{p.name}</td>
                                <td>
                                  <div className="action-btn-group">
                                    <button className="action-btn edit" onClick={() => openPartnerModal(p)}>
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeletePartner(p.id)}>
                                      <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 9. CLIENTS TAB */}
                {activeTab === 'clients' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Our Clients</h3>
                        <p className="section-card-desc">Manage customer rosters and enterprises showcased on the Home page.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openClientModal()}>
                        <i className="fa-solid fa-plus"></i> Add Client
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                          type="text" 
                          placeholder="Search clients by name..." 
                          value={clientSearch} 
                          onChange={(e) => setClientSearch(e.target.value)} 
                        />
                      </div>
                    </div>

                    {filteredClientsList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                        No clients found matching the query.
                      </div>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-db-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Logo Icon</th>
                              <th>Client Name</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredClientsList.map((c) => (
                              <tr 
                                key={c.id} 
                                style={{ 
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                }}
                              >
                                <td style={{ fontWeight: 'bold', color: 'var(--clr-primary)' }}>#{c.id}</td>
                                <td>
                                  <div className="client-image-circle" style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255, 255, 255, 0.1)', flexShrink: 0 }}>
                                    {c.image && (
                                      <img 
                                        src={getImgSrc(c.image)} 
                                        alt={c.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                      />
                                    )}
                                  </div>
                                </td>
                                <td style={{ fontWeight: 'bold' }}>{c.name}</td>
                                <td>
                                  <div className="action-btn-group">
                                    <button className="action-btn edit" onClick={() => openClientModal(c)}>
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteClient(c.id)}>
                                      <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header">
                      <div className="section-card-info">
                        <h3 className="section-card-title">Announcements &amp; Notifications</h3>
                        <p className="section-card-desc">Post overlay notification prompts and updates for website visitors. Only one can be active at a time.</p>
                      </div>
                      <button className="btn-add-new" onClick={() => openNotificationModal()}>
                        <i className="fa-solid fa-plus"></i> Add Announcement
                      </button>
                    </div>

                    <div className="db-search-bar">
                      <div className="db-search-input-box" style={{ width: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                          type="text"
                          placeholder="Search title or message..."
                          value={notificationSearch}
                          onChange={(e) => setNotificationSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {filteredNotificationsList.length === 0 ? (
                      <div className="text-center" style={{ padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                        <i className="fa-solid fa-folder-open fa-2x" style={{ marginBottom: '10px' }}></i>
                        <p>No notifications found matching query.</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto', padding: '10px 0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: tableHeaderBorder, color: tableHeaderColor, fontSize: '0.85rem' }}>
                              <th style={{ padding: '14px 20px' }}>Status</th>
                              <th style={{ padding: '14px 20px' }}>Preview Image</th>
                              <th style={{ padding: '14px 20px' }}>Announcement Title</th>
                              <th style={{ padding: '14px 20px' }}>Message Body</th>
                              <th style={{ padding: '14px 20px' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredNotificationsList.map((notif) => (
                              <tr 
                                key={notif.id} 
                                style={{ 
                                  borderBottom: tableRowBorder, 
                                  transition: 'background 0.2s',
                                  fontSize: '0.9rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = theme === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <td style={{ padding: '18px 20px' }}>
                                  <button 
                                    onClick={() => handleToggleNotificationActive(notif)}
                                    style={{
                                      background: notif.is_active == 1 ? statusActiveBg : statusInactiveBg,
                                      color: notif.is_active == 1 ? statusActiveColor : statusInactiveColor,
                                      border: notif.is_active == 1 ? statusActiveBorder : statusInactiveBorder,
                                      borderRadius: '20px',
                                      padding: '4px 12px',
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                  >
                                    <span style={{ 
                                      width: '6px', 
                                      height: '6px', 
                                      borderRadius: '50%', 
                                      background: theme === 'light' ? '#ffffff' : (notif.is_active == 1 ? '#10b981' : 'rgba(255, 255, 255, 0.4)'),
                                      display: 'inline-block'
                                    }}></span>
                                    {notif.is_active == 1 ? 'ACTIVE' : 'INACTIVE'}
                                  </button>
                                </td>
                                <td style={{ padding: '18px 20px' }}>
                                  {notif.image ? (
                                    <img 
                                      src={getImgSrc(notif.image)} 
                                      alt="" 
                                      style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: imageBorderColor }}
                                    />
                                  ) : (
                                    <span style={{ color: theme === 'light' ? '#94a3b8' : 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>No image</span>
                                  )}
                                </td>
                                <td style={{ padding: '18px 20px', fontWeight: '600', color: tableUsernameColor }}>
                                  {notif.title}
                                </td>
                                <td style={{ padding: '18px 20px', color: tableMetaColor, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {notif.message}
                                </td>
                                <td style={{ padding: '18px 20px' }}>
                                  <div className="action-btn-group">
                                    <button 
                                      onClick={() => openNotificationModal(notif)} 
                                      className="action-btn edit"
                                      title="Edit"
                                    >
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteNotification(notif.id)} 
                                      className="action-btn delete"
                                      title="Delete"
                                    >
                                      <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'audit_logs' && (
                  <div className="dashboard-section-card animate-fade-in">
                    <div className="section-card-header" style={{ marginBottom: '24px' }}>
                      <div className="section-card-info">
                        <h3 className="section-card-title">Security Audit Log</h3>
                        <p className="section-card-desc">Read-only event logger monitoring all successful and failed authentication attempts to the admin control panel.</p>
                      </div>
                    </div>

                    {/* Summary statistics counts */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                      <div style={{ background: statCardBg, border: statCardBorder, borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: theme === 'light' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none' }}>
                        <span className="audit-stat-label" style={{ fontSize: '0.8rem', color: statCardLabelColor, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Login Attempts</span>
                        <strong className="audit-stat-val" style={{ fontSize: '1.8rem', color: statCardValColor, fontFamily: 'var(--ff-heading)' }}>{auditLogs.length}</strong>
                      </div>
                      <div style={{ background: statCardBg, border: statCardBorder, borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: theme === 'light' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none' }}>
                        <span className="audit-stat-label" style={{ fontSize: '0.8rem', color: statCardLabelColor, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Failed Attempts (Last 7 Days)</span>
                        <strong className="audit-stat-val" style={{ fontSize: '1.8rem', color: last7DaysFailed > 0 ? (theme === 'light' ? '#991b1b' : '#ef4444') : statCardValColor, fontFamily: 'var(--ff-heading)' }}>{last7DaysFailed}</strong>
                      </div>
                      <div style={{ background: statCardBg, border: statCardBorder, borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: theme === 'light' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none' }}>
                        <span className="audit-stat-label" style={{ fontSize: '0.8rem', color: statCardLabelColor, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Successful Logins (Last 7 Days)</span>
                        <strong className="audit-stat-val" style={{ fontSize: '1.8rem', color: theme === 'light' ? '#065f46' : '#10b981', fontFamily: 'var(--ff-heading)' }}>{last7DaysSuccess}</strong>
                      </div>
                    </div>

                    {/* Filter and Search actions bar */}
                    <div className="db-search-bar" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div className="db-search-input-box" style={{ flex: '1', minWidth: '250px' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                          type="text"
                          placeholder="Search username or IP address..."
                          value={auditLogSearch}
                          onChange={(e) => setAuditLogSearch(e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: theme === 'light' ? '#475569' : 'rgba(255,255,255,0.5)' }}>Filter:</span>
                        <select
                          value={auditLogStatusFilter}
                          onChange={(e) => setAuditLogStatusFilter(e.target.value)}
                          style={{
                            background: selectFilterBg,
                            border: selectFilterBorder,
                            borderRadius: '6px',
                            color: '#fff',
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="All" style={{ color: selectOptionColor, background: selectOptionBg }}>All Statuses</option>
                          <option value="Success" style={{ color: selectOptionColor, background: selectOptionBg }}>Success</option>
                          <option value="Failed" style={{ color: selectOptionColor, background: selectOptionBg }}>Failed</option>
                        </select>
                      </div>
                    </div>

                    {filteredAuditLogsList.length === 0 ? (
                      <div className="text-center" style={{ padding: '50px 20px', color: 'rgba(255,255,255,0.4)' }}>
                        <i className="fa-solid fa-clock-rotate-left fa-2x" style={{ marginBottom: '15px' }}></i>
                        <p>No audit logs matching selection found.</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto', padding: '10px 0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: tableHeaderBorder, color: tableHeaderColor, fontSize: '0.85rem' }}>
                              <th style={{ padding: '14px 20px' }}>Date / Time</th>
                              <th style={{ padding: '14px 20px' }}>Username Attempted</th>
                              <th style={{ padding: '14px 20px' }}>Status</th>
                              <th style={{ padding: '14px 20px' }}>IP Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAuditLogsList.map((log) => (
                              <tr 
                                key={log.id} 
                                style={{ 
                                  borderBottom: tableRowBorder, 
                                  fontSize: '0.9rem',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = theme === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <td style={{ padding: '18px 20px', color: tableCellColor }}>
                                  {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td style={{ padding: '18px 20px', fontWeight: '600', color: tableUsernameColor }}>
                                  {log.username_attempted}
                                </td>
                                <td style={{ padding: '18px 20px' }}>
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: log.status === 'success' ? badgeSuccessBg : badgeFailedBg,
                                    color: log.status === 'success' ? badgeSuccessColor : badgeFailedColor,
                                    border: log.status === 'success' ? badgeSuccessBorder : badgeFailedBorder,
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700'
                                  }}>
                                    <span style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: log.status === 'success' ? badgeSuccessColor : badgeFailedColor
                                    }}></span>
                                    {log.status.toUpperCase()}
                                  </span>
                                </td>
                                <td style={{ padding: '18px 20px', color: tableMetaColor, fontFamily: 'monospace' }}>
                                  {log.ip_address || 'unknown'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* Part 1: Change Password Card */}
                    <div className="dashboard-section-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div className="section-card-header" style={{ marginBottom: '20px', borderBottom: 'none', justifyContent: 'center', width: '100%' }}>
                        <div className="section-card-info" style={{ textAlign: 'center', width: '100%' }}>
                          <h3 className="section-card-title">Change Password</h3>
                          <p className="section-card-desc">Update your login security credentials. Ensure you use a strong, unique password.</p>
                        </div>
                      </div>

                      {passwordError && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', width: '100%', maxWidth: '420px' }}>
                          <i className="fa-solid fa-triangle-exclamation"></i> {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', width: '100%', maxWidth: '420px' }}>
                          <i className="fa-solid fa-circle-check"></i> {passwordSuccess}
                        </div>
                      )}

                      {showForgotFlow ? (
                        <div style={{ maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <h4 style={{ color: 'var(--clr-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            <i className="fa-solid fa-key"></i> Forgot Password Recovery
                          </h4>
                          
                          {forgotMessage && (
                            <div style={{ background: 'rgba(61,94,225,0.1)', border: '1px solid rgba(61,94,225,0.25)', color: '#93c5fd', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', width: '100%' }}>
                              <i className="fa-solid fa-info-circle"></i> {forgotMessage}
                            </div>
                          )}

                          {forgotOtpDebug && (
                            <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#fcd34d', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', fontFamily: 'monospace', width: '100%' }}>
                              <i className="fa-solid fa-bug"></i> [Demo Mode] OTP sent to email: <strong>{forgotOtpDebug}</strong>
                            </div>
                          )}

                          {forgotStep === 1 ? (
                            <form onSubmit={handleForgotRequestOTPSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                              <div className="admin-form-group" style={{ width: '100%' }}>
                                <label className="admin-form-label" style={{ display: 'block', textAlign: 'center' }}>Registered Admin Email</label>
                                <input
                                  type="text"
                                  value={forgotEmail}
                                  onChange={(e) => setForgotEmail(e.target.value)}
                                  className="admin-form-input-small"
                                  placeholder="admin"
                                  style={{ textAlign: 'center' }}
                                  required
                                />
                              </div>
                              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                  Request Reset OTP
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowForgotFlow(false)}
                                  className="admin-action-btn-back"
                                  style={{ background: 'none', border: 'none', color: '#94a3b8', textDecoration: 'underline', padding: 0, fontSize: '0.85rem', cursor: 'pointer' }}
                                >
                                  Cancel / Back
                                </button>
                              </div>
                            </form>
                          ) : (
                            <form onSubmit={handleForgotResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                              <div className="admin-form-group" style={{ width: '100%' }}>
                                <label className="admin-form-label" style={{ display: 'block', textAlign: 'center' }}>Enter 6-Digit OTP</label>
                                <input
                                  type="text"
                                  value={forgotOtp}
                                  onChange={(e) => setForgotOtp(e.target.value)}
                                  className="admin-form-input-small"
                                  placeholder="123456"
                                  maxLength={6}
                                  style={{ textAlign: 'center' }}
                                  required
                                />
                              </div>
                              <div className="admin-form-group" style={{ width: '100%' }}>
                                <label className="admin-form-label" style={{ display: 'block', textAlign: 'center' }}>New Password (Min. 8 characters)</label>
                                <input
                                  type="password"
                                  value={forgotNewPassword}
                                  onChange={(e) => setForgotNewPassword(e.target.value)}
                                  className="admin-form-input-small"
                                  placeholder="••••••••"
                                  style={{ textAlign: 'center' }}
                                  required
                                />
                              </div>
                              <div className="admin-form-group" style={{ width: '100%' }}>
                                <label className="admin-form-label" style={{ display: 'block', textAlign: 'center' }}>Confirm New Password</label>
                                <input
                                  type="password"
                                  value={forgotConfirmPassword}
                                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                                  className="admin-form-input-small"
                                  placeholder="••••••••"
                                  style={{ textAlign: 'center' }}
                                  required
                                />
                              </div>
                              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                  Verify & Reset Password
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setForgotStep(1)}
                                  className="admin-action-btn-back"
                                  style={{ background: 'none', border: 'none', color: '#94a3b8', textDecoration: 'underline', padding: 0, fontSize: '0.85rem', cursor: 'pointer' }}
                                >
                                  Back to Email
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      ) : (
                        <form onSubmit={handleChangePasswordSubmit} style={{ maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                          <div className="admin-form-group" style={{ width: '100%' }}>
                            <label className="admin-form-label" style={{ display: 'block', textAlign: 'center' }}>Current Password</label>
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="admin-form-input-small"
                              placeholder="••••••••"
                              style={{ textAlign: 'center' }}
                              required
                            />
                          </div>
                          <div className="admin-form-group" style={{ width: '100%' }}>
                            <label className="admin-form-label" style={{ display: 'block', textAlign: 'center' }}>New Password (Min. 8 characters)</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="admin-form-input-small"
                              placeholder="••••••••"
                              style={{ textAlign: 'center' }}
                              required
                            />
                          </div>
                          <div className="admin-form-group" style={{ width: '100%' }}>
                            <label className="admin-form-label" style={{ display: 'block', textAlign: 'center' }}>Confirm New Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="admin-form-input-small"
                              placeholder="••••••••"
                              style={{ textAlign: 'center' }}
                              required
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', width: '100%' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '6px', fontSize: '0.85rem' }}>
                              Change Password
                            </button>
                            <button
                              type="button"
                              onClick={triggerForgotPasswordFlow}
                              className="admin-link-forgot"
                              style={{ background: 'none', border: 'none', color: 'var(--clr-primary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', padding: 0 }}
                            >
                              Forgot Password?
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Part 2: Sub-Admin Management (Only for Super Admin) */}
                    {getLoggedInUser().role === 'Super Admin' && (
                      <div className="dashboard-section-card animate-fade-in">
                        <div className="section-card-header">
                          <div className="section-card-info">
                            <h3 className="section-card-title">Manage Admin Accounts</h3>
                            <p className="section-card-desc">Create and configure credentials and roles for sub-admin users accessing the admin panel.</p>
                          </div>
                          <button className="btn-add-new" onClick={() => openSubAdminModal()}>
                            <i className="fa-solid fa-plus"></i> Add Sub-Admin
                          </button>
                        </div>

                        <div className="db-search-bar">
                          <div className="db-search-input-box" style={{ width: '100%' }}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                              type="text"
                              placeholder="Search admins by name, email, or role..."
                              value={subAdminSearch}
                              onChange={(e) => setSubAdminSearch(e.target.value)}
                            />
                          </div>
                        </div>

                        {filteredAdminsList.length === 0 ? (
                          <div className="text-center" style={{ padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                            <i className="fa-solid fa-users fa-2x" style={{ marginBottom: '10px' }}></i>
                            <p>No admin accounts found matching search.</p>
                          </div>
                        ) : (
                          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: tableHeaderBorder, color: tableHeaderColor, fontSize: '0.85rem' }}>
                                  <th style={{ padding: '14px 20px' }}>Name</th>
                                  <th style={{ padding: '14px 20px' }}>Email / Username</th>
                                  <th style={{ padding: '14px 20px' }}>Role</th>
                                  <th style={{ padding: '14px 20px' }}>Created Date</th>
                                  <th style={{ padding: '14px 20px' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredAdminsList.map((adm) => (
                                  <tr
                                    key={adm.id}
                                    style={{
                                      borderBottom: tableRowBorder,
                                      fontSize: '0.9rem',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = theme === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  >
                                    <td style={{ padding: '18px 20px', fontWeight: '600', color: tableUsernameColor }}>{adm.name}</td>
                                    <td style={{ padding: '18px 20px', fontFamily: 'monospace', color: tableMetaColor }}>{adm.email}</td>
                                    <td style={{ padding: '18px 20px' }}>
                                      <span style={{
                                        background: adm.role === 'Super Admin' ? badgeSuperAdminBg : adm.role === 'Editor' ? badgeEditorBg : badgeDefaultBg,
                                        color: adm.role === 'Super Admin' ? badgeSuperAdminColor : adm.role === 'Editor' ? badgeEditorColor : badgeDefaultColor,
                                        border: adm.role === 'Super Admin' ? badgeSuperAdminBorder : adm.role === 'Editor' ? badgeEditorBorder : badgeDefaultBorder,
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700'
                                      }}>
                                        {adm.role}
                                      </span>
                                    </td>
                                    <td style={{ padding: '18px 20px', color: tableMetaColor }}>
                                      {new Date(adm.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '18px 20px' }}>
                                      <div className="action-btn-group">
                                        <button
                                          onClick={() => openSubAdminModal(adm)}
                                          className="action-btn edit"
                                          title="Edit"
                                        >
                                          <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteSubAdmin(adm.id)}
                                          className="action-btn delete"
                                          style={{
                                            cursor: adm.email === getLoggedInUser().email ? 'not-allowed' : 'pointer',
                                            opacity: adm.email === getLoggedInUser().email ? 0.4 : 1
                                          }}
                                          disabled={adm.email === getLoggedInUser().email}
                                          title={adm.email === getLoggedInUser().email ? "Cannot delete self" : "Delete"}
                                        >
                                          <i className="fa-regular fa-trash-can"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}


              </>
            )}
          </main>
        </div>

      </div>

      {/* A. INQUIRY VIEW DETAIL OVERLAY MODAL */}
      {selectedInquiry && (
        <div className="query-modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="query-close-btn" onClick={() => setSelectedInquiry(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Inbound Proposal</span>
              <h3>Proposal from {selectedInquiry.name}</h3>
            </div>

            <div className="spec-modal-body">
              <div className="inquiry-meta-row">
                <div className="inquiry-meta-item">
                  Email: <strong>{selectedInquiry.email}</strong>
                </div>
                <div className="inquiry-meta-item">
                  Category: <strong style={{ textTransform: 'capitalize' }}>{selectedInquiry.service}</strong>
                </div>
                <div className="inquiry-meta-item">
                  Date Received: <strong>{new Date(selectedInquiry.created_at).toLocaleString()}</strong>
                </div>
              </div>

              <div className="inquiry-msg-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', margin: '15px 0', textAlign: 'left' }}>
                <h6 className="inquiry-msg-title" style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--clr-primary)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Project Brief Description:</h6>
                <p className="inquiry-msg-text" style={{ fontSize: '0.75rem', color: '#000000', margin: 0, lineHeight: 1.5, textAlign: 'left' }}>{selectedInquiry.message}</p>
              </div>

              <div className="status-update-row">
                <span className="admin-form-label" style={{ margin: 0, fontWeight: 'bold' }}>Update Status:</span>
                <select 
                  className="status-select" 
                  value={selectedInquiry.status || 'New'} 
                  onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value)}
                >
                  <option value="New">New / Unread</option>
                  <option value="Read">Read</option>
                  <option value="Contacted">Contacted / In Discussion</option>
                  <option value="Completed">Completed Build</option>
                  <option value="Archived">Archived / Rejected</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button className="btn w-full btn-action-delete" onClick={() => handleDeleteInquiry(selectedInquiry.id)} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                Delete Proposal Record
              </button>
              <button className="btn btn-primary w-full" onClick={() => setSelectedInquiry(null)}>
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. PROJECT EDIT/ADD CRUD OVERLAY MODAL */}
      {isProjectModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsProjectModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <button className="query-close-btn" onClick={() => setIsProjectModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Portfolio Editor</span>
              <h3>{selectedProject ? 'Modify Project specs' : 'Add New Project details'}</h3>
            </div>

            <form onSubmit={handleSaveProjectSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Project Title</label>
                  <input
                    type="text"
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Skyline Corporate Plaza"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Category</label>
                  <select
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="status-select"
                    style={{ width: '100%', padding: '9px 12px' }}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Location</label>
                  <input
                    type="text"
                    value={projectFormData.location}
                    onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. San Francisco, CA"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Execution Year</label>
                  <input
                    type="text"
                    value={projectFormData.year}
                    onChange={(e) => setProjectFormData({ ...projectFormData, year: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. 2026"
                    required
                  />
                </div>
              </div>

              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Client Name</label>
                  <input
                    type="text"
                    value={projectFormData.client}
                    onChange={(e) => setProjectFormData({ ...projectFormData, client: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. ITLC India Pvt Ltd"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Project Image</label>
                  <ImageUploadField
                    value={projectFormData.image}
                    section="projects"
                    onChange={(path) => setProjectFormData({ ...projectFormData, image: path })}
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Brief Description</label>
                <textarea
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  rows={2}
                  className="admin-form-textarea-small"
                  placeholder="Enter main narrative text summarizing project aesthetics..."
                  required
                ></textarea>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '12px' }}>
                <h5 style={{ color: 'var(--clr-primary)', margin: '0 0 10px 0', fontSize: '0.72rem', textTransform: 'uppercase' }}>Structural Specifications</h5>
                
                <div className="form-flex-row">
                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                    <label className="admin-form-label">Site Area</label>
                    <input
                      type="text"
                      value={projectFormData.area}
                      onChange={(e) => setProjectFormData({ ...projectFormData, area: e.target.value })}
                      className="admin-form-input-small"
                      placeholder="e.g. 15,000 sq ft"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                    <label className="admin-form-label">Concrete Mixture Grade</label>
                    <input
                      type="text"
                      value={projectFormData.concrete}
                      onChange={(e) => setProjectFormData({ ...projectFormData, concrete: e.target.value })}
                      className="admin-form-input-small"
                      placeholder="e.g. Grade M45 Reinforced"
                    />
                  </div>
                </div>

                <div className="form-flex-row">
                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                    <label className="admin-form-label">Framing Design</label>
                    <input
                      type="text"
                      value={projectFormData.framing}
                      onChange={(e) => setProjectFormData({ ...projectFormData, framing: e.target.value })}
                      className="admin-form-input-small"
                      placeholder="e.g. Carbon Steel Spans"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                    <label className="admin-form-label">LEED Eco Rating</label>
                    <input
                      type="text"
                      value={projectFormData.leed}
                      onChange={(e) => setProjectFormData({ ...projectFormData, leed: e.target.value })}
                      className="admin-form-input-small"
                      placeholder="e.g. Gold Certified"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsProjectModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedProject ? 'Update Specs' : 'Seed Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B2. INTERIOR EDIT/ADD CRUD OVERLAY MODAL */}
      {isInteriorModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsInteriorModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <button className="query-close-btn" onClick={() => setIsInteriorModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Interior Editor</span>
              <h3>{selectedInterior ? 'Modify Interior Space Specs' : 'Add New Interior Space Details'}</h3>
            </div>

            <form onSubmit={handleSaveInteriorSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Space Title</label>
                  <input
                    type="text"
                    value={interiorFormData.title}
                    onChange={(e) => setInteriorFormData({ ...interiorFormData, title: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Modern Living Room"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Category</label>
                  <input
                    type="text"
                    value={interiorFormData.category}
                    onChange={(e) => setInteriorFormData({ ...interiorFormData, category: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Residential, Workplace..."
                    required
                  />
                </div>
              </div>

              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Design Style</label>
                  <input
                    type="text"
                    value={interiorFormData.style}
                    onChange={(e) => setInteriorFormData({ ...interiorFormData, style: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Nordic Organic, Japandi Spa..."
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Launch Year</label>
                  <input
                    type="text"
                    value={interiorFormData.year}
                    onChange={(e) => setInteriorFormData({ ...interiorFormData, year: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. 2025"
                    required
                  />
                </div>
              </div>

              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Key Materials</label>
                  <input
                    type="text"
                    value={interiorFormData.materials}
                    onChange={(e) => setInteriorFormData({ ...interiorFormData, materials: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Oak Wood, Linen, Brass"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Showcase Image</label>
                  <ImageUploadField
                    value={interiorFormData.image}
                    section="interior"
                    onChange={(path) => setInteriorFormData({ ...interiorFormData, image: path })}
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Brief Description</label>
                <textarea
                  value={interiorFormData.description}
                  onChange={(e) => setInteriorFormData({ ...interiorFormData, description: e.target.value })}
                  rows={3}
                  className="admin-form-textarea-small"
                  placeholder="Enter main narrative text summarizing interior concept and design..."
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsInteriorModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedInterior ? 'Update Specs' : 'Add Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERIOR WALKTHROUGH VIDEO EDIT/ADD CRUD OVERLAY MODAL */}
      {isInteriorVideoModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsInteriorVideoModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <button className="query-close-btn" onClick={() => setIsInteriorVideoModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Interior Video Editor</span>
              <h3>{selectedInteriorVideo ? 'Modify Walkthrough Video Details' : 'Add New Walkthrough Video'}</h3>
            </div>

            <form onSubmit={handleSaveInteriorVideoSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="admin-form-group" style={{ marginBottom: '16px' }}>
                <label className="admin-form-label">Video Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={interiorVideoFormData.title} 
                  onChange={(e) => setInteriorVideoFormData({ ...interiorVideoFormData, title: e.target.value })} 
                  placeholder="e.g. Modern Living Space Walkthrough"
                  required 
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: '16px' }}>
                <label className="admin-form-label">Walkthrough Video File</label>
                <VideoUploadField
                  value={interiorVideoFormData.video_path}
                  section="videos"
                  onChange={(path) => setInteriorVideoFormData({ ...interiorVideoFormData, video_path: path })}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsInteriorVideoModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedInteriorVideo ? 'Update Video' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. SERVICES EDIT/ADD CRUD OVERLAY MODAL */}
      {isServiceModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsServiceModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <button className="query-close-btn" onClick={() => setIsServiceModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Services Specification Manager</span>
              <h3>{selectedService ? 'Modify Service Details' : 'Add New Custom Service'}</h3>
            </div>

            <form onSubmit={handleSaveServiceSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Service Title</label>
                  <input
                    type="text"
                    value={serviceFormData.title}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Structural Restoration"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">FA Icon Class Name</label>
                  <input
                    type="text"
                    value={serviceFormData.icon}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, icon: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. fa-trowel-bricks"
                    required
                  />
                </div>
              </div>

              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Service Banner Image</label>
                  <ImageUploadField
                    value={serviceFormData.image}
                    section="services"
                    onChange={(path) => setServiceFormData({ ...serviceFormData, image: path })}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Timeline Range</label>
                  <input
                    type="text"
                    value={serviceFormData.timeline}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, timeline: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. 3 - 6 Months"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Service Core Narrative</label>
                <textarea
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  rows={2}
                  className="admin-form-textarea-small"
                  placeholder="Summarize the core focus area of this service..."
                  required
                ></textarea>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '12px' }}>
                <h5 style={{ color: 'var(--clr-primary)', margin: '0 0 10px 0', fontSize: '0.72rem', textTransform: 'uppercase' }}>Engineering Limits & Material Specs</h5>
                
                <div className="form-flex-row">
                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                    <label className="admin-form-label">Material Description</label>
                    <input
                      type="text"
                      value={serviceFormData.materials}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, materials: e.target.value })}
                      className="admin-form-input-small"
                      placeholder="e.g. M40 Grade Concrete, Structural Framing"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                    <label className="admin-form-label">Zoning / Restorative Safety Rating</label>
                    <input
                      type="text"
                      value={serviceFormData.rating}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, rating: e.target.value })}
                      className="admin-form-input-small"
                      placeholder="e.g. ISO 9001 restorer certified"
                    />
                  </div>
                </div>

                <div className="form-flex-row">
                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                    <label className="admin-form-label">Solar Integration Compatibility</label>
                    <input
                      type="text"
                      value={serviceFormData.solar}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, solar: e.target.value })}
                      className="admin-form-input-small"
                      placeholder="e.g. Built-in rooftop array options"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                    <label className="admin-form-label">Billing cost estimation metrics</label>
                    <input
                      type="text"
                      value={serviceFormData.costIndex}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, costIndex: e.target.value })}
                      className="admin-form-input-small"
                      placeholder="e.g. Phased architectural bids"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsServiceModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedService ? 'Update Details' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. TESTIMONIALS EDIT/ADD CRUD OVERLAY MODAL */}
      {isTestimonialModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsTestimonialModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="query-close-btn" onClick={() => setIsTestimonialModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Review Pipeline</span>
              <h3>{selectedTestimonial ? 'Edit Client Review' : 'Add Client Review/Feedback'}</h3>
            </div>

            <form onSubmit={handleSaveTestimonialSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Client Name</label>
                  <input
                    type="text"
                    value={testimonialFormData.client_name}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, client_name: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Marcus Vance"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Client Designation (Optional)</label>
                  <input
                    type="text"
                    value={testimonialFormData.client_designation}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, client_designation: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Commercial Partner"
                  />
                </div>
              </div>

              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Avatar Image</label>
                  <ImageUploadField
                    value={testimonialFormData.client_image}
                    section="testimonials"
                    onChange={(path) => setTestimonialFormData({ ...testimonialFormData, client_image: path })}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Rating Score (1 - 5 Stars)</label>
                  <select
                    value={testimonialFormData.rating}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, rating: parseInt(e.target.value) || 5 })}
                    className="status-select"
                    style={{ width: '100%', padding: '9px 12px' }}
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Poor)</option>
                    <option value="1">1 Star (Terrible)</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Review Testimonial Text</label>
                <textarea
                  value={testimonialFormData.testimonial_text}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, testimonial_text: e.target.value })}
                  rows={4}
                  className="admin-form-textarea-small"
                  placeholder="Type the detailed testimonial feedback here..."
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsTestimonialModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedTestimonial ? 'Update Testimonial' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E. BLOGS EDIT/ADD CRUD OVERLAY MODAL */}
      {isBlogModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsBlogModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <button className="query-close-btn" onClick={() => setIsBlogModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Publications Hub</span>
              <h3>{selectedBlog ? 'Edit Blog Article' : 'Write New Blog / News Post'}</h3>
            </div>

            <form onSubmit={handleSaveBlogSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Article Title</label>
                  <input
                    type="text"
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Building Materials in 2026"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">URL Slug (leave empty to auto-generate)</label>
                  <input
                    type="text"
                    value={blogFormData.slug}
                    onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. green-building-trends"
                  />
                </div>
              </div>

              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Author Name</label>
                  <input
                    type="text"
                    value={blogFormData.author}
                    onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                    className="admin-form-input-small"
                    placeholder="e.g. Sarah Jenkins"
                    required
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Publication Date</label>
                  <input
                    type="date"
                    value={blogFormData.published_date}
                    onChange={(e) => setBlogFormData({ ...blogFormData, published_date: e.target.value })}
                    className="admin-form-input-small"
                    required
                  />
                </div>
              </div>

              <div className="form-flex-row">
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Featured Image</label>
                  <ImageUploadField
                    value={blogFormData.featured_image}
                    section="blogs"
                    onChange={(path) => setBlogFormData({ ...blogFormData, featured_image: path })}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-form-label">Publication Status</label>
                  <select
                    value={blogFormData.status}
                    onChange={(e) => setBlogFormData({ ...blogFormData, status: e.target.value })}
                    className="status-select"
                    style={{ width: '100%', padding: '9px 12px' }}
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Visible only to Admin)</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Article Body Content (Rich Text / Markdown supported)</label>
                <textarea
                  value={blogFormData.content}
                  onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                  rows={8}
                  className="admin-form-textarea-small"
                  placeholder="Write the full body narrative of the blog article here..."
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsBlogModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedBlog ? 'Save Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* G. CLIENT MODAL */}
      {isClientModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsClientModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <button className="query-close-btn" onClick={() => setIsClientModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Our Client</span>
              <h3>{selectedClient ? 'Edit Client Details' : 'Add New Client'}</h3>
            </div>
            <form onSubmit={handleSaveClientSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Client Name</label>
                <input
                  type="text"
                  value={clientFormData.name}
                  onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                  className="admin-form-input-small"
                  placeholder="e.g. Marcus Vance"
                  required
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: '15px' }}>
                <label className="admin-form-label">Client Logo / Photo</label>
                <ImageUploadField
                  value={clientFormData.image}
                  section="clients"
                  onChange={(path) => setClientFormData({ ...clientFormData, image: path })}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsClientModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedClient ? 'Save Changes' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* H. PARTNER MODAL */}
      {isPartnerModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsPartnerModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <button className="query-close-btn" onClick={() => setIsPartnerModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Our Partner</span>
              <h3>{selectedPartner ? 'Edit Partner Details' : 'Add New Partner'}</h3>
            </div>
            <form onSubmit={handleSavePartnerSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Partner Name</label>
                <input
                  type="text"
                  value={partnerFormData.name}
                  onChange={(e) => setPartnerFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="admin-form-input-small"
                  placeholder="e.g. Acme Corp"
                  required
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Partner Logo</label>
                <ImageUploadField
                  value={partnerFormData.image}
                  section="partners"
                  onChange={(path) => setPartnerFormData(prev => ({ ...prev, image: path }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsPartnerModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedPartner ? 'Save Changes' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNotificationModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsNotificationModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="query-close-btn" onClick={() => setIsNotificationModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Announcement Notification</span>
              <h3>{selectedNotification ? 'Edit Announcement' : 'Add New Announcement'}</h3>
            </div>
            <form onSubmit={handleSaveNotificationSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Announcement Title</label>
                <input
                  type="text"
                  value={notificationFormData.title}
                  onChange={(e) => setNotificationFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="admin-form-input-small"
                  placeholder="e.g. Exclusive Project Announcement"
                  required
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Message Text Content</label>
                <textarea
                  value={notificationFormData.message}
                  onChange={(e) => setNotificationFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="admin-form-input-small"
                  placeholder="Type announcement message details here..."
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  required
                ></textarea>
              </div>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Notification Image (Optional)</label>
                <ImageUploadField
                  value={notificationFormData.image}
                  section="notifications"
                  onChange={(path) => setNotificationFormData(prev => ({ ...prev, image: path }))}
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Status Activation</label>
                <select
                  value={notificationFormData.is_active}
                  onChange={(e) => setNotificationFormData(prev => ({ ...prev, is_active: parseInt(e.target.value) }))}
                  className="admin-form-input-small"
                  style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <option value="0">Inactive / Hidden</option>
                  <option value="1">Active / Display Overlay</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsNotificationModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedNotification ? 'Save Changes' : 'Create Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubAdminModalOpen && (
        <div className="query-modal-overlay" onClick={() => setIsSubAdminModalOpen(false)}>
          <div className="query-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <button className="query-close-btn" onClick={() => setIsSubAdminModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="spec-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px', marginBottom: '15px' }}>
              <span className="text-xs font-bold text-highlight-mint uppercase tracking-widest block mb-1">Admin Profile</span>
              <h3>{selectedSubAdmin ? 'Edit Admin Details' : 'Add New Admin'}</h3>
            </div>
            <form onSubmit={handleSaveSubAdminSubmit} className="spec-modal-body" style={{ textAlign: 'left' }}>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Full Name</label>
                <input
                  type="text"
                  value={subAdminFormData.name}
                  onChange={(e) => setSubAdminFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="admin-form-input-small"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Email / Username</label>
                <input
                  type="text"
                  value={subAdminFormData.email}
                  onChange={(e) => setSubAdminFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="admin-form-input-small"
                  placeholder="e.g. john@example.com"
                  required
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Password {selectedSubAdmin ? '(Leave blank to keep current)' : '(Min. 8 characters)'}</label>
                <input
                  type="password"
                  value={subAdminFormData.password}
                  onChange={(e) => setSubAdminFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="admin-form-input-small"
                  placeholder="••••••••"
                  required={!selectedSubAdmin}
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Role Access Control</label>
                <select
                  value={subAdminFormData.role}
                  onChange={(e) => setSubAdminFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="admin-form-input-small"
                  style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <option value="Super Admin">Super Admin (Full access + manage admins)</option>
                  <option value="Editor">Editor (Add/Edit/Delete content)</option>
                  <option value="Viewer">Viewer (Read-only access)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <button type="button" className="btn w-full btn-action-cancel" onClick={() => setIsSubAdminModalOpen(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {selectedSubAdmin ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
