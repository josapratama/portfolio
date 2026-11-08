-- 001_initial_schema.sql
-- Run this against your PostgreSQL database to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- AUTHENTICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) DEFAULT 'Admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SETTINGS (singleton rows, id=1 convention)
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name VARCHAR(255) DEFAULT 'DevPortfolio',
    brand_name VARCHAR(255) DEFAULT 'Alex Dev',
    full_name VARCHAR(255) DEFAULT 'Alex Johnson',
    title VARCHAR(255) DEFAULT 'Full-Stack Software Engineer',
    contact_email VARCHAR(255) DEFAULT 'hello@alexdev.io',
    location VARCHAR(255) DEFAULT 'Jakarta, Indonesia',
    availability_status VARCHAR(100) DEFAULT 'Available for selected work',
    is_available BOOLEAN DEFAULT TRUE,
    footer_text TEXT DEFAULT '© 2025 Alex Johnson. All rights reserved.',
    cta_primary_label VARCHAR(100) DEFAULT 'View My Work',
    cta_secondary_label VARCHAR(100) DEFAULT 'Get In Touch',
    default_language VARCHAR(10) DEFAULT 'en',
    default_theme VARCHAR(50) DEFAULT 'dark',
    logo_url VARCHAR(500) DEFAULT '',
    favicon_url VARCHAR(500) DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS theme_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    enable_theme_switcher BOOLEAN DEFAULT TRUE,
    default_theme VARCHAR(50) DEFAULT 'dark',
    accent_preset VARCHAR(50) DEFAULT 'blue',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS language_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    default_language VARCHAR(10) DEFAULT 'en',
    enable_language_switcher BOOLEAN DEFAULT TRUE,
    active_languages TEXT[] DEFAULT ARRAY['en', 'id'],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    meta_title VARCHAR(255) DEFAULT 'Alex Johnson — Full-Stack Software Engineer',
    meta_description TEXT DEFAULT 'Personal portfolio and blog of Alex Johnson, Full-Stack Software Engineer.',
    og_title VARCHAR(255) DEFAULT '',
    og_description TEXT DEFAULT '',
    og_image_url VARCHAR(500) DEFAULT '',
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    canonical_url VARCHAR(500) DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    enable_cv_download BOOLEAN DEFAULT TRUE,
    cv_url VARCHAR(500) DEFAULT '',
    cv_url_id VARCHAR(500) DEFAULT '',
    button_label JSONB DEFAULT '{"en": "Download CV", "id": "Unduh CV"}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NAVIGATION & SECTION CONTROL
-- ============================================================

CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label JSONB NOT NULL DEFAULT '{"en": "Link", "id": "Tautan"}'::jsonb,
    href VARCHAR(500) NOT NULL,
    is_external BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS section_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL DEFAULT '',
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTENT SECTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS hero_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    headline JSONB DEFAULT '{"en": "Building Digital Experiences That Matter", "id": "Membangun Pengalaman Digital yang Berarti"}'::jsonb,
    subheadline JSONB DEFAULT '{"en": "Full-Stack Engineer & Open Source Contributor", "id": "Engineer Full-Stack & Kontributor Open Source"}'::jsonb,
    short_intro JSONB DEFAULT '{"en": "I design and build scalable web applications with a focus on performance, accessibility, and elegant user experience.", "id": "Saya merancang dan membangun aplikasi web yang skalabel dengan fokus pada performa, aksesibilitas, dan pengalaman pengguna yang elegan."}'::jsonb,
    availability_badge JSONB DEFAULT '{"en": "Available for selected work", "id": "Tersedia untuk proyek terpilih"}'::jsonb,
    show_availability_badge BOOLEAN DEFAULT TRUE,
    profile_image_url VARCHAR(500) DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    short_bio JSONB DEFAULT '{"en": "A passionate software engineer with 5+ years of experience building products that scale. I specialize in React, Go, and cloud infrastructure.", "id": "Engineer perangkat lunak yang bersemangat dengan pengalaman 5+ tahun membangun produk yang skalabel. Saya spesialis dalam React, Go, dan infrastruktur cloud."}'::jsonb,
    full_bio JSONB DEFAULT '{"en": "## About Me\n\nHello! I am Alex Johnson, a Full-Stack Software Engineer based in Jakarta, Indonesia...", "id": "## Tentang Saya\n\nHalo! Saya Alex Johnson, seorang Full-Stack Software Engineer yang berbasis di Jakarta, Indonesia..."}'::jsonb,
    highlights JSONB DEFAULT '["5+ years of professional experience", "Open source contributor", "Speaker at local tech events", "Passionate about clean code and DX"]'::jsonb,
    profile_image_url VARCHAR(500) DEFAULT '',
    years_of_experience INTEGER DEFAULT 5,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    section_title JSONB DEFAULT '{"en": "Get In Touch", "id": "Hubungi Saya"}'::jsonb,
    section_subtitle JSONB DEFAULT '{"en": "Have a project in mind or just want to chat? My inbox is always open.", "id": "Punya proyek atau sekadar ingin ngobrol? Kotak masuk saya selalu terbuka."}'::jsonb,
    recipient_email VARCHAR(255) DEFAULT 'hello@alexdev.io',
    success_message JSONB DEFAULT '{"en": "Your message has been sent! I will get back to you shortly.", "id": "Pesan Anda telah terkirim! Saya akan segera membalas."}'::jsonb,
    error_message JSONB DEFAULT '{"en": "Something went wrong. Please try again or email me directly.", "id": "Terjadi kesalahan. Silakan coba lagi atau email langsung ke saya."}'::jsonb,
    enable_contact_form BOOLEAN DEFAULT TRUE,
    show_social_links BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILLS
-- ============================================================

CREATE TABLE IF NOT EXISTS skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name JSONB NOT NULL DEFAULT '{"en": "Category", "id": "Kategori"}'::jsonb,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent duplicate category names
CREATE UNIQUE INDEX IF NOT EXISTS skill_categories_name_en_idx
    ON skill_categories ((name->>'en'));

CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
    name JSONB NOT NULL,
    icon VARCHAR(255) DEFAULT '',
    proficiency_level VARCHAR(50) DEFAULT 'advanced',
    is_featured BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SOCIAL LINKS
-- ============================================================

CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    label VARCHAR(255) DEFAULT '',
    is_visible BOOLEAN DEFAULT TRUE,
    open_in_new_tab BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title JSONB NOT NULL,
    short_description JSONB DEFAULT '{}'::jsonb,
    full_description JSONB DEFAULT '{}'::jsonb,
    cover_image_url VARCHAR(500) DEFAULT '',
    tech_stack TEXT[] DEFAULT '{}',
    role JSONB DEFAULT '{}'::jsonb,
    category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    live_demo_url VARCHAR(500) DEFAULT '',
    repo_url VARCHAR(500) DEFAULT '',
    meta_title VARCHAR(255) DEFAULT '',
    meta_description TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- EXPERIENCES
-- ============================================================

CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization JSONB NOT NULL,
    role JSONB NOT NULL,
    location JSONB DEFAULT '{}'::jsonb,
    employment_type VARCHAR(100) DEFAULT 'Full-time',
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description JSONB DEFAULT '{}'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOG
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title JSONB NOT NULL,
    excerpt JSONB DEFAULT '{}'::jsonb,
    content JSONB DEFAULT '{}'::jsonb,
    cover_image_url VARCHAR(500) DEFAULT '',
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ,
    meta_title VARCHAR(255) DEFAULT '',
    meta_description TEXT DEFAULT '',
    og_image_url VARCHAR(500) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) DEFAULT '',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(50) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_read ON contact_submissions(is_read);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);
