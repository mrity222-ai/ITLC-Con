import express from 'express';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run production build on startup if the build folder doesn't exist
const buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath) || !fs.existsSync(path.join(buildPath, 'index.html'))) {
  console.log("Build directory not found or incomplete. Running npm run build...");
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log("Build completed successfully!");
  } catch (err) {
    console.error("Failed to run build:", err.message);
  }
}

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment detection (local vs production Hostinger)
const is_local = (process.platform === 'win32' || __dirname.startsWith('D:\\') || __dirname.startsWith('d:\\') || process.env.NODE_ENV === 'development');

let dbConfig;
if (is_local) {
  // Local Database Credentials (XAMPP)
  dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'u997632379_infravision',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
} else {
  // Production Database Credentials (Hostinger)
  dbConfig = {
    host: 'localhost',
    user: 'u997632379_Infra',
    password: 'Itlc@121',
    database: 'u997632379_Infravision',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(dbConfig);

// Database Schema Migrations on startup
async function runMigrations() {
  try {
    const [columns] = await pool.query("SHOW COLUMNS FROM admins LIKE 'reset_otp'");
    if (columns.length === 0) {
      await pool.query("ALTER TABLE admins ADD COLUMN reset_otp VARCHAR(10) NULL");
      console.log("Migration: Added reset_otp column to admins table.");
    }
  } catch (err) {
    console.error("Migration Warning (admins):", err.message);
  }

  try {
    const [columns] = await pool.query("SHOW COLUMNS FROM contact_proposals LIKE 'status'");
    if (columns.length === 0) {
      await pool.query("ALTER TABLE contact_proposals ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'new'");
      console.log("Migration: Added status column to contact_proposals table.");
    }
  } catch (err) {
    console.error("Migration Warning (contact_proposals):", err.message);
  }
}
runMigrations();

// Shared Authentication Helper for signed base64 session tokens (JWT-compatible)
const secret = 'supersecretjwtkey123!_infravision_itlc_project_2026';

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const payloadEncoded = parts[0];
  const signatureEncoded = parts[1];
  
  const payload = Buffer.from(payloadEncoded, 'base64').toString('utf8');
  const signature = Buffer.from(signatureEncoded, 'base64').toString('utf8');
  
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  
  try {
    // Constant-time compare to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
  } catch (err) {
    return null;
  }
  
  const data = JSON.parse(payload);
  if (!data || !data.exp || Date.now() / 1000 > data.exp) {
    return null;
  }
  
  return data;
}

// Authentication Middleware
function checkAuth(req, res, next) {
  let authHeader = req.headers['authorization'] || req.headers['x-authorization'] || '';
  if (!authHeader && req.query.token) {
    authHeader = 'Bearer ' + req.query.token;
  }
  
  let token = '';
  const match = authHeader.match(/Bearer\s(\S+)/);
  if (match) {
    token = match[1];
  }
  
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
  
  req.user = user;
  next();
}

// Helper to audit log attempts
async function logAudit(username, status, ip) {
  try {
    await pool.query("INSERT INTO audit_logs (username_attempted, status, ip_address) VALUES (?, ?, ?)", [
      username, status, ip || 'unknown'
    ]);
  } catch (err) {
    console.error("Failed to write audit log:", err.message);
  }
}

// ==========================================
// 1. Auth & Login Endpoints
// ==========================================

app.post('/api/login.php', async (req, res) => {
  const username = req.body.username ? req.body.username.trim() : '';
  const password = req.body.password ? req.body.password.trim() : '';

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM admins WHERE email = ?", [username]);
    const user = rows[0];

    if (user && bcrypt.compareSync(password, user.password_hash)) {
      await logAudit(username, 'success', req.ip || req.connection.remoteAddress);

      // Generate custom token matching PHP token logic
      const payload = JSON.stringify({
        email: user.email,
        name: user.name,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
      });
      const payloadEncoded = Buffer.from(payload).toString('base64');
      const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const signatureEncoded = Buffer.from(signature).toString('base64');
      const token = `${payloadEncoded}.${signatureEncoded}`;

      res.json({
        success: true,
        message: "Login successful",
        token: token
      });
    } else {
      await logAudit(username, 'failed', req.ip || req.connection.remoteAddress);
      res.status(401).json({ error: "Invalid username or password." });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.post('/api/forgot_password.php', async (req, res) => {
  const action = req.query.action ? req.query.action.trim() : '';
  const email = req.body.email ? req.body.email.trim() : '';

  if (action === 'request') {
    if (!email) {
      return res.status(400).json({ error: "Registered email address is required." });
    }

    try {
      const [rows] = await pool.query("SELECT id FROM admins WHERE email = ?", [email]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "No admin registered with this email address." });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await pool.query("UPDATE admins SET reset_otp = ? WHERE email = ?", [otp, email]);

      res.json({
        success: true,
        message: "A password reset OTP has been sent to your registered email!",
        otp: otp
      });
    } catch (err) {
      res.status(500).json({ error: "Database error: " + err.message });
    }
  } else if (action === 'reset') {
    const otp = req.body.otp ? req.body.otp.trim() : '';
    const newPassword = req.body.new_password ? req.body.new_password.trim() : '';

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and New Password are all required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters long." });
    }

    try {
      const [rows] = await pool.query("SELECT reset_otp FROM admins WHERE email = ?", [email]);
      const admin = rows[0];

      if (!admin || !admin.reset_otp || admin.reset_otp !== otp) {
        return res.status(400).json({ error: "Invalid or expired password reset OTP." });
      }

      const hashed = bcrypt.hashSync(newPassword, 10);
      await pool.query("UPDATE admins SET password_hash = ?, reset_otp = NULL WHERE email = ?", [hashed, email]);

      res.json({
        success: true,
        message: "Your password has been successfully reset! You can now log in with your new credentials."
      });
    } catch (err) {
      res.status(500).json({ error: "Database error: " + err.message });
    }
  } else {
    res.status(400).json({ error: "Invalid action parameter." });
  }
});

// ==========================================
// 2. CMS Endpoints
// ==========================================

app.get('/api/cms.php', async (req, res) => {
  try {
    const [taglineRows] = await pool.query("SELECT heading, subtext FROM cms_tagline WHERE id = 1");
    const [featuresRows] = await pool.query("SELECT icon, title, description FROM cms_features ORDER BY id ASC");
    const [aboutRows] = await pool.query("SELECT title, text1, text2, experience, projects, awards FROM cms_about WHERE id = 1");

    res.json({
      tagline: taglineRows[0] || null,
      features: featuresRows,
      about: aboutRows[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch CMS data: " + err.message });
  }
});

app.post('/api/cms.php', checkAuth, async (req, res) => {
  const { tagline, features, about } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (tagline) {
      await connection.query("UPDATE cms_tagline SET heading = ?, subtext = ? WHERE id = 1", [tagline.heading, tagline.subtext]);
    }

    if (features && Array.isArray(features)) {
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const id = i + 1;
        await connection.query("UPDATE cms_features SET icon = ?, title = ?, description = ? WHERE id = ?", [
          feature.icon, feature.title, feature.description, id
        ]);
      }
    }

    if (about) {
      await connection.query("UPDATE cms_about SET title = ?, text1 = ?, text2 = ?, experience = ?, projects = ?, awards = ? WHERE id = 1", [
        about.title,
        about.text1,
        about.text2,
        parseInt(about.experience) || 0,
        parseInt(about.projects) || 0,
        parseInt(about.awards) || 0
      ]);
    }

    await connection.commit();
    res.json({ success: true, message: "CMS configurations updated successfully!" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: "Failed to update CMS data: " + err.message });
  } finally {
    connection.release();
  }
});

// ==========================================
// 3. Contact Proposals & Form Submissions
// ==========================================

app.post('/api/contact.php', async (req, res) => {
  const name = req.body.name ? req.body.name.trim() : '';
  const email = req.body.email ? req.body.email.trim() : '';
  const service = req.body.service ? req.body.service.trim() : 'residential';
  const message = req.body.message ? req.body.message.trim() : '';

  let errors = {};
  if (!name) errors.name = "Name is required.";
  if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = "A valid email address is required.";
  if (!message || message.length < 15) errors.message = "Project description must be at least 15 characters.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    await pool.query("INSERT INTO contact_proposals (name, email, service, message) VALUES (?, ?, ?, ?)", [
      name, email, service, message
    ]);
    res.json({ success: true, message: "Proposal submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.get('/api/proposals.php', checkAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contact_proposals ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch proposals: " + err.message });
  }
});

app.post('/api/proposals.php', checkAuth, async (req, res) => {
  const id = parseInt(req.body.id) || 0;
  const action = req.body.action ? req.body.action.trim() : 'update_status';
  const status = req.body.status ? req.body.status.trim() : '';

  if (id <= 0) {
    return res.status(400).json({ error: "Invalid Proposal ID." });
  }

  try {
    if (action === 'delete') {
      await pool.query("DELETE FROM contact_proposals WHERE id = ?", [id]);
      res.json({ success: true, message: "Proposal deleted successfully!" });
    } else {
      if (!status) {
        return res.status(400).json({ error: "Status is required for update." });
      }
      await pool.query("UPDATE contact_proposals SET status = ? WHERE id = ?", [status, id]);
      res.json({ success: true, message: `Proposal status updated to '${status}'!` });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 4. Projects CRUD
// ==========================================

app.get('/api/projects.php', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    const mapped = rows.map(r => ({
      ...r,
      specs: {
        area: r.area,
        concrete: r.concrete,
        framing: r.framing,
        leed: r.leed
      }
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects: " + err.message });
  }
});

app.post('/api/projects.php', checkAuth, async (req, res) => {
  const { id, title, description, image, category, location, year, client, area, concrete, framing, leed } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({ error: "Title, Description, and Location are required." });
  }

  try {
    if (parseInt(id) > 0) {
      await pool.query("UPDATE projects SET title = ?, description = ?, image = ?, category = ?, location = ?, year = ?, client = ?, area = ?, concrete = ?, framing = ?, leed = ? WHERE id = ?", [
        title, description, image || 'assets/images/project1.jpg', category || 'Residential', location, year || '', client || '', area || '', concrete || '', framing || '', leed || '', id
      ]);
      res.json({ success: true, message: "Project updated successfully!" });
    } else {
      await pool.query("INSERT INTO projects (title, description, image, category, location, year, client, area, concrete, framing, leed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        title, description, image || 'assets/images/project1.jpg', category || 'Residential', location, year || '', client || '', area || '', concrete || '', framing || '', leed || ''
      ]);
      res.json({ success: true, message: "Project added successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/projects.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Project ID." });

  try {
    await pool.query("DELETE FROM projects WHERE id = ?", [id]);
    res.json({ success: true, message: "Project deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 5. Services CRUD
// ==========================================

app.get('/api/services.php', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM services ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services: " + err.message });
  }
});

app.post('/api/services.php', checkAuth, async (req, res) => {
  const { id, title, description, icon, image, timeline, materials, rating, solar, costIndex } = req.body;

  if (!title || !description || !icon) {
    return res.status(400).json({ error: "Title, Description, and Icon are required." });
  }

  try {
    if (parseInt(id) > 0) {
      await pool.query("UPDATE services SET title = ?, description = ?, icon = ?, image = ?, timeline = ?, materials = ?, rating = ?, solar = ?, costIndex = ? WHERE id = ?", [
        title, description, icon, image || 'assets/images/service_residential.jpg', timeline || '', materials || '', rating || '5.0', solar || '', costIndex || '', id
      ]);
      res.json({ success: true, message: "Service updated successfully!" });
    } else {
      await pool.query("INSERT INTO services (title, description, icon, image, timeline, materials, rating, solar, costIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        title, description, icon, image || 'assets/images/service_residential.jpg', timeline || '', materials || '', rating || '5.0', solar || '', costIndex || ''
      ]);
      res.json({ success: true, message: "Service added successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/services.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Service ID." });

  try {
    await pool.query("DELETE FROM services WHERE id = ?", [id]);
    res.json({ success: true, message: "Service deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 6. Testimonials CRUD
// ==========================================

app.get('/api/testimonials.php', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM testimonials ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch testimonials: " + err.message });
  }
});

app.post('/api/testimonials.php', checkAuth, async (req, res) => {
  const { id, client_name, client_designation, testimonial_text, rating, client_image } = req.body;

  if (!client_name || !testimonial_text) {
    return res.status(400).json({ error: "Client Name and Testimonial Text are required." });
  }

  try {
    if (parseInt(id) > 0) {
      await pool.query("UPDATE testimonials SET client_name = ?, client_designation = ?, testimonial_text = ?, rating = ?, client_image = ? WHERE id = ?", [
        client_name, client_designation || '', testimonial_text, parseInt(rating) || 5, client_image || '', id
      ]);
      res.json({ success: true, message: "Testimonial updated successfully!" });
    } else {
      await pool.query("INSERT INTO testimonials (client_name, client_designation, testimonial_text, rating, client_image) VALUES (?, ?, ?, ?, ?)", [
        client_name, client_designation || '', testimonial_text, parseInt(rating) || 5, client_image || ''
      ]);
      res.json({ success: true, message: "Testimonial added successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/testimonials.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Testimonial ID." });

  try {
    await pool.query("DELETE FROM testimonials WHERE id = ?", [id]);
    res.json({ success: true, message: "Testimonial deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 7. Blogs CRUD (Auth required for POST/DELETE, GET is public)
// ==========================================

app.get('/api/blogs.php', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs ORDER BY published_date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs: " + err.message });
  }
});

app.post('/api/blogs.php', checkAuth, async (req, res) => {
  const { id, title, slug, content, featured_image, author, published_date, status } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ error: "Title, Content, and Author are required." });
  }

  // Generate URL slug if not exists
  const computedSlug = slug ? slug.trim() : title.toLowerCase().replace(/[^a-z0-9_\-]+/g, '-').replace(/^-+|-+$/g, '');

  try {
    if (parseInt(id) > 0) {
      await pool.query("UPDATE blogs SET title = ?, slug = ?, content = ?, featured_image = ?, author = ?, published_date = ?, status = ? WHERE id = ?", [
        title, computedSlug, content, featured_image || '', author, published_date || new Date().toISOString().split('T')[0], status || 'published', id
      ]);
      res.json({ success: true, message: "Blog post updated successfully!" });
    } else {
      await pool.query("INSERT INTO blogs (title, slug, content, featured_image, author, published_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        title, computedSlug, content, featured_image || '', author, published_date || new Date().toISOString().split('T')[0], status || 'published'
      ]);
      res.json({ success: true, message: "Blog post created successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/blogs.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Blog ID." });

  try {
    await pool.query("DELETE FROM blogs WHERE id = ?", [id]);
    res.json({ success: true, message: "Blog post deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 8. Clients CRUD
// ==========================================

app.get('/api/clients.php', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clients ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients: " + err.message });
  }
});

app.post('/api/clients.php', checkAuth, async (req, res) => {
  const { id, name, image } = req.body;
  if (!name || !image) {
    return res.status(400).json({ error: "Client Name and Image path are required." });
  }

  try {
    if (parseInt(id) > 0) {
      await pool.query("UPDATE clients SET name = ?, image = ? WHERE id = ?", [name, image, id]);
      res.json({ success: true, message: "Client updated successfully!" });
    } else {
      await pool.query("INSERT INTO clients (name, image) VALUES (?, ?)", [name, image]);
      res.json({ success: true, message: "Client added successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/clients.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Client ID." });

  try {
    await pool.query("DELETE FROM clients WHERE id = ?", [id]);
    res.json({ success: true, message: "Client deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 9. Partners CRUD
// ==========================================

app.get('/api/partners.php', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM partners ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch partners: " + err.message });
  }
});

app.post('/api/partners.php', checkAuth, async (req, res) => {
  const { id, name, image } = req.body;
  if (!name || !image) {
    return res.status(400).json({ error: "Partner Name and Image path are required." });
  }

  try {
    if (parseInt(id) > 0) {
      await pool.query("UPDATE partners SET name = ?, image = ? WHERE id = ?", [name, image, id]);
      res.json({ success: true, message: "Partner updated successfully!" });
    } else {
      await pool.query("INSERT INTO partners (name, image) VALUES (?, ?)", [name, image]);
      res.json({ success: true, message: "Partner added successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/partners.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Partner ID." });

  try {
    await pool.query("DELETE FROM partners WHERE id = ?", [id]);
    res.json({ success: true, message: "Partner deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 10. Notifications CRUD
// ==========================================

app.get('/api/notifications.php', async (req, res) => {
  const activeOnly = req.query.active !== undefined;
  try {
    if (activeOnly) {
      const [rows] = await pool.query("SELECT * FROM notifications WHERE is_active = 1 LIMIT 1");
      res.json(rows[0] || null);
    } else {
      const [rows] = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
      res.json(rows);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications: " + err.message });
  }
});

app.post('/api/notifications.php', checkAuth, async (req, res) => {
  const { id, title, message, image, is_active } = req.body;
  const activeStatus = is_active ? 1 : 0;

  if (!title || !message) {
    return res.status(400).json({ error: "Notification title and message are required." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    let targetId = parseInt(id) || 0;
    let msg = "";

    if (targetId > 0) {
      await connection.query("UPDATE notifications SET title = ?, message = ?, image = ?, is_active = ? WHERE id = ?", [
        title, message, image || '', activeStatus, targetId
      ]);
      msg = "Notification updated successfully!";
    } else {
      const [result] = await connection.query("INSERT INTO notifications (title, message, image, is_active) VALUES (?, ?, ?, ?)", [
        title, message, image || '', activeStatus
      ]);
      targetId = result.insertId;
      msg = "Notification added successfully!";
    }

    // Enforce only ONE notification is active at a time
    if (activeStatus === 1) {
      await connection.query("UPDATE notifications SET is_active = 0 WHERE id != ?", [targetId]);
    }

    await connection.commit();
    res.json({ success: true, message: msg, id: targetId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: "Database error: " + err.message });
  } finally {
    connection.release();
  }
});

app.delete('/api/notifications.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Notification ID." });

  try {
    await pool.query("DELETE FROM notifications WHERE id = ?", [id]);
    res.json({ success: true, message: "Notification deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 11. Admins Management CRUD
// ==========================================

app.get('/api/admins.php', checkAuth, async (req, res) => {
  // Enforce Super Admin check for lists
  if (req.user.role !== 'Super Admin') {
    return res.status(403).json({ error: "Access denied. Only Super Admin can manage admin accounts." });
  }

  try {
    const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM admins ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin accounts: " + err.message });
  }
});

app.post('/api/admins.php', checkAuth, async (req, res) => {
  const action = req.query.action ? req.query.action.trim() : '';

  // 1. Change Password Action (Any admin user can run this on their own account)
  if (action === 'change_password') {
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({ error: "All password fields are required." });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ error: "New password and confirmation do not match." });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters long." });
    }

    try {
      const [rows] = await pool.query("SELECT * FROM admins WHERE email = ?", [req.user.email]);
      const dbUser = rows[0];

      if (!dbUser || !bcrypt.compareSync(current_password, dbUser.password_hash)) {
        return res.status(401).json({ error: "Current password is incorrect." });
      }

      const newHash = bcrypt.hashSync(new_password, 10);
      await pool.query("UPDATE admins SET password_hash = ? WHERE email = ?", [newHash, req.user.email]);

      return res.json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
  }

  // 2. Admin CRUD actions (Requires Super Admin)
  if (req.user.role !== 'Super Admin') {
    return res.status(403).json({ error: "Access denied. Only Super Admin can manage admin accounts." });
  }

  const { id, name, email, password, role } = req.body;
  const targetId = parseInt(id) || 0;
  const adminRole = role || 'Viewer';

  if (!name || !email || (targetId === 0 && !password)) {
    return res.status(400).json({ error: "Name, Email/Username, and Password are required." });
  }

  const allowedRoles = ['Super Admin', 'Editor', 'Viewer'];
  if (!allowedRoles.includes(adminRole)) {
    return res.status(400).json({ error: "Invalid role selected." });
  }

  try {
    if (targetId > 0) {
      if (password && password.trim() !== '') {
        if (password.length < 8) {
          return res.status(400).json({ error: "Password must be at least 8 characters long." });
        }
        const hash = bcrypt.hashSync(password, 10);
        await pool.query("UPDATE admins SET name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?", [
          name, email, hash, adminRole, targetId
        ]);
      } else {
        await pool.query("UPDATE admins SET name = ?, email = ?, role = ? WHERE id = ?", [
          name, email, adminRole, targetId
        ]);
      }
      res.json({ success: true, message: "Admin account updated successfully!" });
    } else {
      const hash = bcrypt.hashSync(password, 10);
      await pool.query("INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)", [
        name, email, hash, adminRole
      ]);
      res.json({ success: true, message: "Admin account added successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/admins.php', checkAuth, async (req, res) => {
  if (req.user.role !== 'Super Admin') {
    return res.status(403).json({ error: "Access denied. Only Super Admin can manage admin accounts." });
  }

  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Admin ID." });

  try {
    await pool.query("DELETE FROM admins WHERE id = ?", [id]);
    res.json({ success: true, message: "Admin account deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 12. Audit Logs API
// ==========================================

app.get('/api/audit-logs.php', checkAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM audit_logs ORDER BY timestamp DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs: " + err.message });
  }
});

// ==========================================
// 13. Interior CRUD
// ==========================================

app.get('/api/interior.php', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM interior ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interior items: " + err.message });
  }
});

app.post('/api/interior.php', checkAuth, async (req, res) => {
  const { id, title, description, image, category, style, materials, year } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: "Title, Description, and Category are required." });
  }

  try {
    if (parseInt(id) > 0) {
      await pool.query("UPDATE interior SET title = ?, description = ?, image = ?, category = ?, style = ?, materials = ?, year = ? WHERE id = ?", [
        title, description, image || 'assets/images/interior_living.jpg', category, style || '', materials || '', year || '', id
      ]);
      res.json({ success: true, message: "Interior item updated successfully!" });
    } else {
      await pool.query("INSERT INTO interior (title, description, image, category, style, materials, year) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        title, description, image || 'assets/images/interior_living.jpg', category, style || '', materials || '', year || ''
      ]);
      res.json({ success: true, message: "Interior item added successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/interior.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Interior ID." });

  try {
    await pool.query("DELETE FROM interior WHERE id = ?", [id]);
    res.json({ success: true, message: "Interior item deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 14. Interior Videos CRUD
// ==========================================

app.get('/api/interior_videos.php', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM interior_videos ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interior videos: " + err.message });
  }
});

app.post('/api/interior_videos.php', checkAuth, async (req, res) => {
  const { id, title, video_path } = req.body;

  if (!title || !video_path) {
    return res.status(400).json({ error: "Title and Video Path are required." });
  }

  try {
    if (parseInt(id) > 0) {
      await pool.query("UPDATE interior_videos SET title = ?, video_path = ? WHERE id = ?", [title, video_path, id]);
      res.json({ success: true, message: "Interior video updated successfully!" });
    } else {
      await pool.query("INSERT INTO interior_videos (title, video_path) VALUES (?, ?)", [title, video_path]);
      res.json({ success: true, message: "Interior video added successfully!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

app.delete('/api/interior_videos.php', checkAuth, async (req, res) => {
  const id = parseInt(req.query.id) || 0;
  if (id <= 0) return res.status(400).json({ error: "Invalid Video ID." });

  try {
    await pool.query("DELETE FROM interior_videos WHERE id = ?", [id]);
    res.json({ success: true, message: "Interior video deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================================
// 15. Multer Image/Video Upload Endpoint
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const section = req.body.section ? req.body.section.replace(/[^a-zA-Z0-9_\-]/g, '') : 'general';
    const ext = path.extname(file.originalname).toLowerCase();
    const isVid = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);
    
    const subDir = isVid ? 'videos' : `images/${section}`;
    const targetDir = path.join(__dirname, 'public', 'assets', subDir);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isVid = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);
    const prefix = isVid ? 'vid_' : 'img_';
    const uniqueName = prefix + Date.now() + '_' + Math.random().toString(36).substring(2, 9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

app.post('/api/upload.php', checkAuth, upload.any(), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const file = req.files[0];
  const section = req.body.section ? req.body.section.replace(/[^a-zA-Z0-9_\-]/g, '') : 'general';
  const ext = path.extname(file.originalname).toLowerCase();
  const isVid = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);
  const subDir = isVid ? 'videos' : `images/${section}`;

  const relativePath = `assets/${subDir}/${file.filename}`;
  const distDest = path.join(__dirname, 'build', relativePath);

  // Copy to build folder (build/) as well to serve instantly in production
  try {
    const distSubdirPath = path.join(__dirname, 'build', 'assets', subDir);
    if (!fs.existsSync(distSubdirPath)) {
      fs.mkdirSync(distSubdirPath, { recursive: true });
    }
    fs.copyFileSync(file.path, distDest);
  } catch (err) {
    console.error("Failed to copy uploaded asset to build:", err.message);
  }

  res.json({
    success: true,
    message: "File uploaded successfully!",
    path: relativePath
  });
});

// ==========================================
// 16. Static Files & Single Page App Fallback
// ==========================================

// Serve static React production build files from build/
app.use(express.static(path.join(__dirname, 'build')));

// Fallback SPA routing (redirect all non-matched browser queries like /admin to build/index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start Gateway Server
app.listen(port, () => {
  console.log(`Node.js/Express.js Server running on port ${port}`);
});
