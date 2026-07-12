const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs/promises');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10kb' }));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/downloads/resume', (req, res) => {
  res.download(path.join(__dirname, '../pictures/Jagadesh_Resume (5).pdf'), 'Jagadesh_Resume.pdf');
});

// ─── API Routes ───────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Portfolio data endpoint
app.get('/api/portfolio', (req, res) => {
  const portfolioData = {
    hero: {
    name: "Jagadesh R",
    title: "Full Stack Developer | Associate Software Engineer Aspirant",
    tagline: "Building scalable web applications with React, Node.js and modern technologies",
    location: "Tamil Nadu, India",
    availability: "Open to Internships & Full-Time Opportunities"
},
    stats: [
    { label: "Major Projects", value: "3+", icon: "🚀" },
    { label: "Technical Skills", value: "12+", icon: "⚡" },
    { label: "Certifications", value: "6+", icon: "🏆" },
    { label: "Hackathons", value: "1+", icon: "💡" }
],
    about: {
    bio: "I am a Computer Science and Engineering student at PPG Institute of Technology with strong skills in Full Stack Development, JavaScript, React, Node.js, PHP and MySQL. I enjoy building real-world software solutions, participating in hackathons, and developing scalable applications that solve practical problems.",

    skills: {
        frontend: [
            "HTML",
            "CSS",
            "JavaScript",
            "React"
        ],

        backend: [
            "Node.js",
            "PHP",
            "MySQL"
        ],

        tools: [
            "Git",
            "GitHub",
            "MongoDB",
            "Java",
            "Python",
            "C++"
        ]
    }
},
    projects: [
{
    id: 1,
    title: "GreenGrid AI",
    category: "AI + IoT",
    description: "AI-powered smart agricultural system using IoT sensors, weather analytics and machine learning to provide intelligent farming recommendations.",
    tech: ["React", "Node.js", "Python", "IoT", "MongoDB"],
    year: "2026",
    color: "#00ff87",
    featured: true
},
{
    id: 2,
    title: "Smart Ambulance System",
    category: "IoT Platform",
    description: "Real-time ambulance tracking and patient vital monitoring platform developed for Smart India Hackathon.",
    tech: ["Node.js", "IoT", "JavaScript", "MySQL"],
    year: "2024",
    color: "#ff6b35",
    featured: true
},
{
    id: 3,
    title: "News Bias Detection",
    category: "AI/ML",
    description: "Machine learning based system for detecting bias in news articles using NLP and deep learning techniques.",
    tech: ["Python", "Machine Learning", "NLP"],
    year: "2025",
    color: "#a855f7",
    featured: true
},
      {
        id: 4,
        title: "Meridian CMS",
        category: "Backend",
        description: "Headless CMS handling 2M+ content requests daily. Built with a GraphQL API, Redis caching layers, and Postgres full-text search.",
        tech: ["Node.js", "GraphQL", "PostgreSQL", "Redis"],
        year: "2024",
        color: "#ff6b35",
        accent: "#0a0a0a",
        featured: true
      },
      {
        id: 5,
        title: "Spatial UI Kit",
        category: "Frontend",
        description: "Open-source component library for spatial/AR interfaces. 2k+ GitHub stars, used in production by 15+ companies.",
        tech: ["React", "TypeScript", "CSS Custom Properties", "Storybook"],
        year: "2023",
        color: "#a855f7",
        accent: "#0a0a0a",
        featured: true
      },
      {
        id: 6,
        title: "FinFlow Dashboard",
        category: "Full-Stack",
        description: "Real-time financial analytics dashboard with live market data, portfolio tracking, and AI-powered insights.",
        tech: ["Next.js", "D3.js", "Prisma", "tRPC"],
        year: "2023",
        color: "#06b6d4",
        accent: "#0a0a0a",
        featured: false
      },
      {
        id: 7,
        title: "Echelon E-Commerce",
        category: "Full-Stack",
        description: "High-performance e-commerce platform processing $2M+ monthly transactions with 99.9% uptime SLA.",
        tech: ["Next.js", "Stripe", "PostgreSQL", "Vercel"],
        year: "2023",
        color: "#f59e0b",
        accent: "#0a0a0a",
        featured: false
      },
      {
        id: 8,
        title: "Luminary Mobile",
        category: "Mobile",
        description: "Cross-platform wellness app with AI coaching, biometric integrations, and 50k+ active users.",
        tech: ["React Native", "Expo", "Node.js", "ML Kit"],
        year: "2022",
        color: "#10b981",
        accent: "#0a0a0a",
        featured: false
      }
    ],
    experience: [
      {
        role: "Senior Frontend Engineer",
        company: "Vercel",
        period: "2023 – Present",
        desc: "Leading performance initiatives across the dashboard product. Reduced bundle size by 40% and improved Core Web Vitals scores."
      },
      {
        role: "Full-Stack Developer",
        company: "Stripe",
        period: "2021 – 2023",
        desc: "Built merchant dashboard features used by 1M+ businesses. Owned the payment analytics visualization system end-to-end."
      },
      {
        role: "Frontend Developer",
        company: "Linear",
        period: "2019 – 2021",
        desc: "Shipped the collaborative editing and keyboard shortcut systems. Core contributor to the design system."
      }
    ],
    social: {
    github: "https://github.com/Jagadesh-RV",
    linkedin: "https://www.linkedin.com/in/jagadesh-r-b6aba62a8",
    email: "mailto:jagadeshrvs@gmail.com"
}
  };

  res.json(portfolioData);
});

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  if (message.length < 2 || message.length > 2000) {
    return res.status(400).json({ success: false, message: 'Message must be at least 2 characters.' });
  }

  try {
    const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    if (smtpConfigured) {
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `[Portfolio] ${subject || 'New Message'} from ${name}`,
        html: `
          <div style="font-family: 'Courier New', monospace; max-width: 600px; background: #0a0a0a; color: #f0f0f0; padding: 40px; border-radius: 8px;">
            <h2 style="color: #00ff87; margin-top: 0;">New Portfolio Message</h2>
            <p><strong style="color: #888;">From:</strong> ${escapeHtml(name)}</p>
            <p><strong style="color: #888;">Email:</strong> ${escapeHtml(email)}</p>
            <p><strong style="color: #888;">Subject:</strong> ${escapeHtml(subject || 'N/A')}</p>
            <hr style="border-color: #222; margin: 24px 0;">
            <p style="line-height: 1.7;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
          </div>
        `
      });
    }

    // Save message locally to messages.json
    const messagesFile = path.join(__dirname, 'messages.json');
    const newMessage = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name, email, subject, message
    };
    
    let existingMessages = [];
    try {
      const data = await fs.readFile(messagesFile, 'utf8');
      existingMessages = JSON.parse(data);
    } catch (err) {
      // File doesn't exist yet, which is fine
    }
    
    existingMessages.push(newMessage);
    await fs.writeFile(messagesFile, JSON.stringify(existingMessages, null, 2));

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Contact Form]', { name, email, subject, message: message.substring(0, 100) });
    }

    res.json({ success: true, message: 'Message sent successfully! I\'ll get back to you soon.' });
  } catch (error) {
    console.error('[Contact Error]', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// Catch-all: serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ◈ Portfolio server running on http://localhost:${PORT}`);
  console.log(`  ◈ API available at http://localhost:${PORT}/api\n`);
});

module.exports = app;
