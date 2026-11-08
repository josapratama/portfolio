// Shared TypeScript types for the portfolio platform

export interface LocalizedString {
  en: string;
  id: string;
  ja?: string;
  [key: string]: string | undefined;
}

export type Lang = "en" | "id" | "ja";

export function getText(
  field: LocalizedString | undefined,
  lang: Lang,
): string {
  if (!field) return "";
  return field[lang] || field.en || field.id || "";
}

// ============================================================
// Settings
// ============================================================
export interface SiteSettings {
  site_name: string;
  brand_name: string;
  full_name: string;
  title: string;
  contact_email: string;
  location: string;
  availability_status: string;
  is_available: boolean;
  footer_text: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  default_language: string;
  default_theme: string;
  logo_url: string;
  favicon_url: string;
}

export interface ThemeSettings {
  enable_theme_switcher: boolean;
  default_theme: "dark" | "light";
  accent_preset: string;
}

export interface LanguageSettings {
  default_language: string;
  enable_language_switcher: boolean;
  active_languages: string[];
}

export interface PublicSettings {
  site: SiteSettings;
  theme: ThemeSettings;
  language: LanguageSettings;
}

// ============================================================
// Hero
// ============================================================
export interface HeroContent {
  headline: LocalizedString;
  subheadline: LocalizedString;
  short_intro: LocalizedString;
  availability_badge: LocalizedString;
  show_availability_badge: boolean;
  profile_image_url: string;
}

// ============================================================
// About
// ============================================================
export interface AboutContent {
  short_bio: LocalizedString;
  full_bio: LocalizedString;
  highlights: string[];
  profile_image_url: string;
  years_of_experience: number;
}

// ============================================================
// Skills
// ============================================================
export interface Skill {
  id: string;
  name: LocalizedString;
  icon: string;
  proficiency_level: string;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  category_id?: string;
  category_name?: LocalizedString;
}

export interface SkillCategory {
  id: string;
  name: LocalizedString;
  sort_order: number;
  skills: Skill[];
}

// ============================================================
// Social Links
// ============================================================
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  is_visible: boolean;
  open_in_new_tab: boolean;
  sort_order?: number;
}

// ============================================================
// Projects
// ============================================================
export interface Project {
  id: string;
  slug: string;
  title: LocalizedString;
  short_description: LocalizedString;
  full_description?: LocalizedString;
  cover_image_url: string;
  tech_stack: string[];
  role?: LocalizedString;
  tags: string[];
  is_featured: boolean;
  sort_order: number;
  live_demo_url: string;
  repo_url: string;
  images?: { url: string; alt: string }[];
  meta_title?: string;
  meta_description?: string;
}

// ============================================================
// Experience
// ============================================================
export interface Experience {
  id: string;
  organization: LocalizedString;
  role: LocalizedString;
  location: LocalizedString;
  employment_type: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  is_visible: boolean;
  description: LocalizedString;
  achievements: string[];
}

// ============================================================
// Blog
// ============================================================
export interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content?: LocalizedString;
  cover_image_url: string;
  tags: string[];
  is_featured: boolean;
  published_at?: string | null;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
}

// ============================================================
// Navigation
// ============================================================
export interface NavItem {
  id: string;
  label: LocalizedString;
  href: string;
  is_external: boolean;
}

// ============================================================
// Sections
// ============================================================
export type SectionsMap = Record<string, boolean>;

// ============================================================
// Contact
// ============================================================
export interface ContactSettings {
  section_title: LocalizedString;
  section_subtitle: LocalizedString;
  success_message: LocalizedString;
  error_message: LocalizedString;
  enable_contact_form: boolean;
  show_social_links: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ============================================================
// Resume
// ============================================================
export interface ResumeSettings {
  enable_cv_download: boolean;
  cv_url: string;
  cv_url_id: string;
  cv_source: "url" | "builder";
  cv_template: string;
  cv_page_size: string;
  cv_builder_data: Record<string, unknown>;
  button_label: LocalizedString;
}

// ============================================================
// Admin
// ============================================================
export interface DashboardStats {
  projects: number;
  blog_posts: number;
  skills: number;
  submissions: number;
  unread_submissions: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface AdminNavSection {
  id: string;
  section_key: string;
  label: string;
  is_visible: boolean;
  sort_order: number;
}
