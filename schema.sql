-- Apex Builders & Architects - Complete Database Schema Dump
CREATE DATABASE IF NOT EXISTS u997632379_infravision;
USE u997632379_infravision;

-- --------------------------------------------------------
-- Table structure for table `admin_users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump data for table `admin_users`
INSERT IGNORE INTO `admin_users` (`id`, `username`, `password`, `created_at`) VALUES ('1', 'admin', 'admin123', '2026-07-06 11:37:53');

-- --------------------------------------------------------
-- Table structure for table `admins`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Viewer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump data for table `admins`
INSERT IGNORE INTO `admins` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES ('1', 'Administrator', 'admin', '$2y$10$LynOq7Np57uLlEumy94DlezTWio9ry2N9RYkRc.e7zM6J0JYuTAV.', 'Super Admin', '2026-07-07 13:18:02');

-- --------------------------------------------------------
-- Table structure for table `audit_logs`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username_attempted` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `ip_address` varchar(100) DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `blogs`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `featured_image` varchar(255) NOT NULL,
  `author` varchar(100) NOT NULL,
  `published_date` date NOT NULL,
  `status` varchar(50) DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `clients`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `cms_about`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cms_about` (
  `id` int(11) NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL,
  `text1` text NOT NULL,
  `text2` text NOT NULL,
  `experience` int(11) NOT NULL,
  `projects` int(11) NOT NULL,
  `awards` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `check_single_row_about` CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump data for table `cms_about`
INSERT IGNORE INTO `cms_about` (`id`, `title`, `text1`, `text2`, `experience`, `projects`, `awards`) VALUES ('1', 'Pioneering Premium Construction & Architecture', 'For over 15 years, Apex Builders & Architects has stood at the intersection of aesthetic design and structural integrity. We treat every project not just as a building, but as a monument to precision engineering.', 'Our collaborative team of architects, project managers, and expert builders ensure that each detail aligns with our client\'s vision. From ground breaking to key handover, our commitment to green practices, safety, and modern design stands unmatched.', '15', '120', '45');

-- --------------------------------------------------------
-- Table structure for table `cms_features`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cms_features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `icon` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump data for table `cms_features`
INSERT IGNORE INTO `cms_features` (`id`, `icon`, `title`, `description`) VALUES ('1', 'fa-screwdriver-wrench', 'END-TO-END SOLUTIONS', 'From initial architectural blueprints and zoning clearances to final handover structural compliance inspections.');
INSERT IGNORE INTO `cms_features` (`id`, `icon`, `title`, `description`) VALUES ('2', 'fa-shield-halved', 'SAFETY INTEGRITY', 'Enforcing a zero-incident safety culture backed by certified OSHA-regulated audits and strict weekly site reviews.');
INSERT IGNORE INTO `cms_features` (`id`, `icon`, `title`, `description`) VALUES ('3', 'fa-leaf', 'SUSTAINABLE ENGINEERING', 'Incorporating green eco-concrete mixtures, thermal insulation systems, and LEED-compliant energy-efficient layouts.');

-- --------------------------------------------------------
-- Table structure for table `cms_tagline`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cms_tagline` (
  `id` int(11) NOT NULL DEFAULT 1,
  `heading` varchar(255) NOT NULL,
  `subtext` text NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `check_single_row` CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump data for table `cms_tagline`
INSERT IGNORE INTO `cms_tagline` (`id`, `heading`, `subtext`) VALUES ('1', 'Crafting Excellence in Every Project', 'We combine cutting-edge building technology with timeless craftsmanship to deliver premium structures that exceed the highest industry standards of quality, safety, and durability.');

-- --------------------------------------------------------
-- Table structure for table `contact_proposals`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `contact_proposals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `service` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `interior`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `interior` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `style` varchar(100) NOT NULL,
  `materials` varchar(255) NOT NULL,
  `year` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `interior_videos`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `interior_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `video_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `notifications`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `image` varchar(255) DEFAULT '',
  `is_active` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `partners`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `partners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `projects`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `location` varchar(100) NOT NULL,
  `year` varchar(10) NOT NULL,
  `client` varchar(100) NOT NULL,
  `area` varchar(50) NOT NULL,
  `concrete` varchar(100) NOT NULL,
  `framing` varchar(100) NOT NULL,
  `leed` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `services`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  `timeline` varchar(100) NOT NULL,
  `materials` text NOT NULL,
  `rating` varchar(100) NOT NULL,
  `solar` text NOT NULL,
  `costIndex` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `testimonials`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) NOT NULL,
  `client_designation` varchar(100) DEFAULT '',
  `testimonial_text` text NOT NULL,
  `rating` int(11) DEFAULT 5,
  `client_image` varchar(255) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

