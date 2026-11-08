import { adminApi } from './client'

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data

export const adminAPI = {
  // Auth
  login: (email: string, password: string) =>
    adminApi.post('/auth/login', { email, password }),
  authHubCallback: (code: string, redirect_uri: string) =>
    adminApi.post('/auth/authhub/callback', { code, redirect_uri }),
  getAuthHubConfig: () =>
    adminApi.get('/auth/authhub/config').then(unwrap<{ authhub_url: string; client_id: string; client_slug: string }>),
  logout: () => adminApi.post('/auth/logout'),
  me: () => adminApi.get('/auth/me').then(unwrap<{ id: string; email: string; name: string }>),

  // Dashboard
  getDashboard: () => adminApi.get('/admin/dashboard').then(unwrap),

  // Site Settings
  getSiteSettings: () => adminApi.get('/admin/settings/site').then(unwrap),
  updateSiteSettings: (data: object) => adminApi.put('/admin/settings/site', data),

  // Theme Settings
  getThemeSettings: () => adminApi.get('/admin/settings/theme').then(unwrap),
  updateThemeSettings: (data: object) => adminApi.put('/admin/settings/theme', data),

  // Language Settings
  getLanguageSettings: () => adminApi.get('/admin/settings/language').then(unwrap),
  updateLanguageSettings: (data: object) => adminApi.put('/admin/settings/language', data),

  // SEO Settings
  getSEOSettings: () => adminApi.get('/admin/settings/seo').then(unwrap),
  updateSEOSettings: (data: object) => adminApi.put('/admin/settings/seo', data),

  // Sections
  getSections: () => adminApi.get('/admin/sections').then(unwrap),
  updateSection: (key: string, data: { is_visible: boolean }) =>
    adminApi.put(`/admin/sections/${key}`, data),

  // Hero
  getHero: () => adminApi.get('/admin/hero').then(unwrap),
  updateHero: (data: object) => adminApi.put('/admin/hero', data),

  // About
  getAbout: () => adminApi.get('/admin/about').then(unwrap),
  updateAbout: (data: object) => adminApi.put('/admin/about', data),

  // Skills
  getSkills: () => adminApi.get('/admin/skills').then(unwrap),
  createSkill: (data: object) => adminApi.post('/admin/skills', data),
  updateSkill: (id: string, data: object) => adminApi.put(`/admin/skills/${id}`, data),
  deleteSkill: (id: string) => adminApi.delete(`/admin/skills/${id}`),
  getSkillCategories: () => adminApi.get('/admin/skill-categories').then(unwrap),
  createSkillCategory: (data: object) => adminApi.post('/admin/skill-categories', data),
  deleteSkillCategory: (id: string) => adminApi.delete(`/admin/skill-categories/${id}`),

  // Social Links
  getSocialLinks: () => adminApi.get('/admin/social-links').then(unwrap),
  createSocialLink: (data: object) => adminApi.post('/admin/social-links', data),
  updateSocialLink: (id: string, data: object) => adminApi.put(`/admin/social-links/${id}`, data),
  deleteSocialLink: (id: string) => adminApi.delete(`/admin/social-links/${id}`),

  // Navigation
  getNavigation: () => adminApi.get('/admin/navigation').then(unwrap),
  createNavItem: (data: object) => adminApi.post('/admin/navigation', data),
  updateNavItem: (id: string, data: object) => adminApi.put(`/admin/navigation/${id}`, data),
  deleteNavItem: (id: string) => adminApi.delete(`/admin/navigation/${id}`),

  // Projects
  getProjects: () => adminApi.get('/admin/projects').then(unwrap),
  getProject: (id: string) => adminApi.get(`/admin/projects/${id}`).then(unwrap),
  createProject: (data: object) => adminApi.post('/admin/projects', data),
  updateProject: (id: string, data: object) => adminApi.put(`/admin/projects/${id}`, data),
  deleteProject: (id: string) => adminApi.delete(`/admin/projects/${id}`),

  // Experiences
  getExperiences: () => adminApi.get('/admin/experiences').then(unwrap),
  createExperience: (data: object) => adminApi.post('/admin/experiences', data),
  updateExperience: (id: string, data: object) => adminApi.put(`/admin/experiences/${id}`, data),
  deleteExperience: (id: string) => adminApi.delete(`/admin/experiences/${id}`),

  // Blog
  getBlogPosts: () => adminApi.get('/admin/blog').then(unwrap),
  getBlogPost: (id: string) => adminApi.get(`/admin/blog/${id}`).then(unwrap),
  createBlogPost: (data: object) => adminApi.post('/admin/blog', data),
  updateBlogPost: (id: string, data: object) => adminApi.put(`/admin/blog/${id}`, data),
  deleteBlogPost: (id: string) => adminApi.delete(`/admin/blog/${id}`),

  // Contact Settings
  getContactSettings: () => adminApi.get('/admin/contact/settings').then(unwrap),
  updateContactSettings: (data: object) => adminApi.put('/admin/contact/settings', data),

  // Contact Submissions
  getSubmissions: (page = 1) => adminApi.get(`/admin/contact/submissions?page=${page}`).then(unwrap),
  markSubmissionRead: (id: string) => adminApi.patch(`/admin/contact/submissions/${id}/read`),
  archiveSubmission: (id: string) => adminApi.patch(`/admin/contact/submissions/${id}/archive`),
  deleteSubmission: (id: string) => adminApi.delete(`/admin/contact/submissions/${id}`),

  // Resume
  getResumeSettings: () => adminApi.get('/admin/resume').then(unwrap),
  updateResumeSettings: (data: object) => adminApi.put('/admin/resume', data),
}
