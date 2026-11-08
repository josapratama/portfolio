-- 002_seed_data.sql
-- Initial seed data for development

-- ============================================================
-- SEED: Admin Account
-- Password: Admin@12345 (bcrypt hashed)
-- CHANGE THIS IN PRODUCTION
-- ============================================================
INSERT INTO admins (id, email, password_hash, name)
VALUES (
    gen_random_uuid(),
    'admin@portfolio.dev',
    '$2a$12$OZLnynEev/xeePRyn5oeq./UgWbDWT57Mt1r4Lp5/Htq0eNl.6d/y',
    'Site Administrator'
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SEED: Site Settings
-- ============================================================
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO theme_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO language_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO seo_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO resume_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO hero_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO about_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO contact_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED: Section Visibility
-- ============================================================
INSERT INTO section_settings (section_key, label, is_visible, sort_order) VALUES
    ('hero',              'Hero Section',           true, 1),
    ('about_preview',     'About Preview',          true, 2),
    ('skills',            'Skills Section',         true, 3),
    ('featured_projects', 'Featured Projects',      true, 4),
    ('experience_preview','Experience Preview',     true, 5),
    ('blog_preview',      'Blog Preview',           true, 6),
    ('contact_cta',       'Contact CTA',            true, 7),
    ('blog_page',         'Blog Page (Global)',     true, 8)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- SEED: Navigation
-- ============================================================
INSERT INTO navigation_items (label, href, is_visible, sort_order) VALUES
    ('{"en": "Home", "id": "Beranda"}',       '/',           false, 1),
    ('{"en": "About", "id": "Tentang"}',      '/about',      false, 2),
    ('{"en": "Projects", "id": "Proyek"}',    '/projects',   false, 3),
    ('{"en": "Experience", "id": "Pengalaman"}', '/experience', false, 4),
    ('{"en": "Blog", "id": "Blog"}',          '/blog',       false, 5),
    ('{"en": "Contact", "id": "Kontak"}',     '/contact',    false, 6);

-- ============================================================
-- SEED: Skill Categories
-- ============================================================
WITH cat_frontend AS (
    INSERT INTO skill_categories (name, sort_order)
    VALUES ('{"en": "Frontend", "id": "Frontend"}', 1)
    RETURNING id
),
cat_backend AS (
    INSERT INTO skill_categories (name, sort_order)
    VALUES ('{"en": "Backend", "id": "Backend"}', 2)
    RETURNING id
),
cat_devops AS (
    INSERT INTO skill_categories (name, sort_order)
    VALUES ('{"en": "DevOps & Cloud", "id": "DevOps & Cloud"}', 3)
    RETURNING id
),
cat_tools AS (
    INSERT INTO skill_categories (name, sort_order)
    VALUES ('{"en": "Tools & Workflow", "id": "Alat & Alur Kerja"}', 4)
    RETURNING id
)
INSERT INTO skills (category_id, name, proficiency_level, is_featured, is_visible, sort_order)
SELECT id, '{"en": "React", "id": "React"}'::jsonb, 'expert', true, true, 1 FROM cat_frontend UNION ALL
SELECT id, '{"en": "TypeScript", "id": "TypeScript"}'::jsonb, 'expert', true, true, 2 FROM cat_frontend UNION ALL
SELECT id, '{"en": "Next.js", "id": "Next.js"}'::jsonb, 'advanced', true, true, 3 FROM cat_frontend UNION ALL
SELECT id, '{"en": "Tailwind CSS", "id": "Tailwind CSS"}'::jsonb, 'expert', false, true, 4 FROM cat_frontend UNION ALL
SELECT id, '{"en": "Go (Golang)", "id": "Go (Golang)"}'::jsonb, 'expert', true, true, 1 FROM cat_backend UNION ALL
SELECT id, '{"en": "Node.js", "id": "Node.js"}'::jsonb, 'advanced', true, true, 2 FROM cat_backend UNION ALL
SELECT id, '{"en": "PostgreSQL", "id": "PostgreSQL"}'::jsonb, 'advanced', true, true, 3 FROM cat_backend UNION ALL
SELECT id, '{"en": "REST APIs", "id": "REST API"}'::jsonb, 'expert', false, true, 4 FROM cat_backend UNION ALL
SELECT id, '{"en": "Docker", "id": "Docker"}'::jsonb, 'advanced', true, true, 1 FROM cat_devops UNION ALL
SELECT id, '{"en": "AWS", "id": "AWS"}'::jsonb, 'intermediate', false, true, 2 FROM cat_devops UNION ALL
SELECT id, '{"en": "GitHub Actions", "id": "GitHub Actions"}'::jsonb, 'advanced', false, true, 3 FROM cat_devops UNION ALL
SELECT id, '{"en": "Git", "id": "Git"}'::jsonb, 'expert', false, true, 1 FROM cat_tools UNION ALL
SELECT id, '{"en": "Linux", "id": "Linux"}'::jsonb, 'advanced', false, true, 2 FROM cat_tools;

-- ============================================================
-- SEED: Social Links
-- ============================================================
INSERT INTO social_links (platform, url, label, is_visible, sort_order) VALUES
    ('github',   'https://github.com/alexjohnson',   'GitHub',   true, 1),
    ('linkedin', 'https://linkedin.com/in/alexjohnson', 'LinkedIn', true, 2),
    ('twitter',  'https://twitter.com/alexjohnson',  'X (Twitter)', true, 3),
    ('email',    'mailto:hello@alexdev.io',           'Email',    true, 4);

-- ============================================================
-- SEED: Project Categories
-- ============================================================
INSERT INTO project_categories (name, slug) VALUES
    ('Web Application', 'web-application'),
    ('API & Backend',   'api-backend'),
    ('Open Source',     'open-source'),
    ('Mobile',          'mobile')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: Projects
-- ============================================================
WITH webcat AS (SELECT id FROM project_categories WHERE slug = 'web-application')
INSERT INTO projects (slug, title, short_description, full_description, tech_stack, role, is_featured, is_visible, sort_order, live_demo_url, repo_url)
VALUES
(
    'devflow-saas',
    '{"en": "DevFlow — Developer Productivity SaaS", "id": "DevFlow — SaaS Produktivitas Developer"}',
    '{"en": "A full-stack SaaS platform that helps development teams manage sprints, track velocity, and ship faster.", "id": "Platform SaaS full-stack yang membantu tim pengembang mengelola sprint, melacak kecepatan, dan merilis lebih cepat."}',
    '{"en": "## Overview\n\nDevFlow is a developer productivity platform built to solve the real pain points of software teams. It provides a unified workspace for sprint planning, code review analytics, deployment tracking, and team performance insights.\n\n## Key Features\n\n- Real-time sprint board with customizable workflows\n- Integration with GitHub, GitLab, and Jira\n- Team velocity tracking and analytics dashboard\n- Automated deployment pipeline status\n- Slack and email notifications", "id": "## Gambaran Umum\n\nDevFlow adalah platform produktivitas developer yang dibangun untuk memecahkan masalah nyata tim perangkat lunak."}',
    ARRAY['React', 'TypeScript', 'Go', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    '{"en": "Lead Full-Stack Engineer", "id": "Lead Engineer Full-Stack"}',
    true,
    true,
    1,
    'https://devflow.demo',
    'https://github.com/alexjohnson/devflow'
),
(
    'nexus-api-gateway',
    '{"en": "Nexus — High-Performance API Gateway", "id": "Nexus — API Gateway Berkinerja Tinggi"}',
    '{"en": "An open-source API gateway built in Go, supporting rate limiting, auth, load balancing, and observability out of the box.", "id": "API gateway open-source yang dibangun dengan Go, mendukung rate limiting, auth, load balancing, dan observabilitas."}',
    '{"en": "## Overview\n\nNexus is a lightweight, high-performance API gateway designed for microservices architectures. Written entirely in Go, it handles tens of thousands of requests per second with minimal latency.\n\n## Key Features\n\n- JWT and API key authentication\n- Rate limiting (token bucket algorithm)\n- Round-robin and least-connections load balancing\n- Request/response transformation\n- Prometheus metrics integration\n- OpenAPI spec generation", "id": "## Gambaran Umum\n\nNexus adalah API gateway ringan dan berkinerja tinggi yang dirancang untuk arsitektur layanan mikro."}',
    ARRAY['Go', 'Redis', 'Docker', 'Prometheus', 'Grafana'],
    '{"en": "Author & Maintainer", "id": "Penulis & Maintainer"}',
    true,
    true,
    2,
    '',
    'https://github.com/alexjohnson/nexus'
),
(
    'lunara-ecommerce',
    '{"en": "Lunara — Modern E-Commerce Platform", "id": "Lunara — Platform E-Commerce Modern"}',
    '{"en": "A headless e-commerce platform with a React storefront, Go backend, and Stripe payment integration.", "id": "Platform e-commerce headless dengan storefront React, backend Go, dan integrasi pembayaran Stripe."}',
    '{"en": "## Overview\n\nLunara is a modern headless e-commerce solution designed for performance and flexibility. The decoupled architecture allows teams to iterate on the storefront independently from the backend.\n\n## Key Features\n\n- Server-side rendered storefront with Next.js\n- Inventory and order management system\n- Stripe payment gateway integration\n- Multi-currency and multi-language support\n- Admin dashboard with analytics", "id": "## Gambaran Umum\n\nLunara adalah solusi e-commerce headless modern yang dirancang untuk performa dan fleksibilitas."}',
    ARRAY['Next.js', 'Go', 'PostgreSQL', 'Stripe', 'Redis', 'Tailwind CSS'],
    '{"en": "Full-Stack Engineer", "id": "Engineer Full-Stack"}',
    true,
    true,
    3,
    'https://lunara.demo',
    'https://github.com/alexjohnson/lunara'
);

-- ============================================================
-- SEED: Experiences
-- ============================================================
INSERT INTO experiences (organization, role, location, employment_type, start_date, end_date, is_current, description, achievements, is_visible, sort_order)
VALUES
(
    '{"en": "TechVenture Studio", "id": "TechVenture Studio"}',
    '{"en": "Senior Full-Stack Engineer", "id": "Senior Engineer Full-Stack"}',
    '{"en": "Jakarta, Indonesia (Hybrid)", "id": "Jakarta, Indonesia (Hybrid)"}',
    'Full-time',
    '2022-01-01',
    NULL,
    true,
    '{"en": "Leading the architecture and development of multiple SaaS products. Responsible for technical direction, code quality, and team mentorship across frontend and backend stacks.", "id": "Memimpin arsitektur dan pengembangan beberapa produk SaaS. Bertanggung jawab atas arah teknis, kualitas kode, dan mentoring tim di berbagai stack."}',
    '["Architected a multi-tenant SaaS platform serving 10k+ users", "Reduced API response time by 60% through query optimization and caching", "Established CI/CD pipelines across all company products", "Mentored 3 junior engineers to mid-level positions"]',
    true,
    1
),
(
    '{"en": "Pixel & Code Agency", "id": "Pixel & Code Agency"}',
    '{"en": "Full-Stack Developer", "id": "Developer Full-Stack"}',
    '{"en": "Bandung, Indonesia (On-site)", "id": "Bandung, Indonesia (On-site)"}',
    'Full-time',
    '2020-03-01',
    '2021-12-31',
    false,
    '{"en": "Developed custom web applications for clients across e-commerce, fintech, and media sectors. Worked closely with designers and product managers to deliver high-quality digital experiences.", "id": "Mengembangkan aplikasi web kustom untuk klien di sektor e-commerce, fintech, dan media."}',
    '["Delivered 15+ client projects on time and within budget", "Built a reusable component library that cut development time by 30%", "Integrated payment gateways for 5 e-commerce clients"]',
    true,
    2
),
(
    '{"en": "StartupID (YC W20)", "id": "StartupID (YC W20)"}',
    '{"en": "Frontend Engineer Intern", "id": "Intern Engineer Frontend"}',
    '{"en": "Jakarta, Indonesia", "id": "Jakarta, Indonesia"}',
    'Internship',
    '2019-06-01',
    '2019-12-31',
    false,
    '{"en": "Contributed to the consumer-facing React application, implementing feature flags, A/B testing infrastructure, and performance optimizations.", "id": "Berkontribusi pada aplikasi React consumer-facing, mengimplementasikan feature flags, infrastruktur A/B testing, dan optimasi performa."}',
    '["Implemented feature flag system used across all frontend teams", "Improved Lighthouse performance score from 62 to 94"]',
    true,
    3
);

-- ============================================================
-- SEED: Blog Categories
-- ============================================================
INSERT INTO blog_categories (name, slug) VALUES
    ('Engineering',    'engineering'),
    ('Career',         'career'),
    ('Open Source',    'open-source'),
    ('Productivity',   'productivity')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: Blog Posts
-- ============================================================
WITH eng_cat AS (SELECT id FROM blog_categories WHERE slug = 'engineering'),
     career_cat AS (SELECT id FROM blog_categories WHERE slug = 'career')
INSERT INTO blog_posts (slug, title, excerpt, content, category_id, tags, status, is_featured, is_visible, published_at)
VALUES
(
    'building-scalable-go-apis',
    '{"en": "Building Scalable REST APIs with Go and PostgreSQL", "id": "Membangun REST API Skalabel dengan Go dan PostgreSQL"}',
    '{"en": "A deep dive into building production-ready REST APIs with Go.", "id": "Pembahasan mendalam tentang membangun REST API siap produksi dengan Go."}',
    '{"en": "# Building Scalable REST APIs with Go and PostgreSQL\n\nGo has become my go-to language for backend services.", "id": "# Membangun REST API Skalabel dengan Go dan PostgreSQL\n\nGo telah menjadi bahasa utama saya untuk layanan backend."}',
    (SELECT id FROM eng_cat),
    ARRAY['go', 'postgresql', 'api', 'backend'],
    'published',
    true,
    true,
    NOW() - INTERVAL '7 days'
),
(
    'react-performance-patterns',
    '{"en": "React Performance Patterns You Should Know in 2025", "id": "Pola Performa React yang Harus Anda Ketahui di 2025"}',
    '{"en": "Practical techniques for optimizing React applications: memo, useMemo, code splitting, and more.", "id": "Teknik praktis untuk mengoptimalkan aplikasi React: memo, useMemo, code splitting, dan lainnya."}',
    '{"en": "# React Performance Patterns for 2025\n\nAs React applications grow in complexity, performance becomes critical.", "id": "# Pola Performa React untuk 2025\n\nSeiring aplikasi React tumbuh, performa menjadi kritis."}',
    (SELECT id FROM eng_cat),
    ARRAY['react', 'performance', 'frontend', 'javascript'],
    'published',
    true,
    true,
    NOW() - INTERVAL '14 days'
),
(
    'lessons-from-5-years-software-engineering',
    '{"en": "5 Years as a Software Engineer: Lessons I Wish I Knew Earlier", "id": "5 Tahun Sebagai Software Engineer: Pelajaran yang Ingin Saya Ketahui Lebih Awal"}',
    '{"en": "Honest reflections on career growth, technical learning, and communication.", "id": "Refleksi jujur tentang pertumbuhan karier, pembelajaran teknis, dan komunikasi."}',
    '{"en": "# 5 Years as a Software Engineer\n\nTime flies. I recently crossed my 5-year mark as a professional software engineer.", "id": "# 5 Tahun Sebagai Software Engineer\n\nWaktu berlalu begitu cepat. Saya baru saja melewati tonggak 5 tahun."}',
    (SELECT id FROM career_cat),
    ARRAY['career', 'engineering', 'growth', 'lessons'],
    'published',
    false,
    true,
    NOW() - INTERVAL '21 days'
);
