import { publicApi } from './client'
import type {
  PublicSettings, HeroContent, AboutContent, SkillCategory,
  Project, Experience, BlogPost, SocialLink, NavItem,
  SectionsMap, ContactSettings, ContactFormData, ResumeSettings
} from '@/types'

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data

export const publicAPI = {
  getSettings: () => publicApi.get<{ data: PublicSettings }>('/settings').then(unwrap),
  getHero: () => publicApi.get<{ data: HeroContent }>('/hero').then(unwrap),
  getAbout: () => publicApi.get<{ data: AboutContent }>('/about').then(unwrap),
  getSkills: () => publicApi.get<{ data: SkillCategory[] }>('/skills').then(unwrap),
  getProjects: () => publicApi.get<{ data: Project[] }>('/projects').then(unwrap),
  getProject: (slug: string) => publicApi.get<{ data: Project }>(`/projects/${slug}`).then(unwrap),
  getExperiences: () => publicApi.get<{ data: Experience[] }>('/experiences').then(unwrap),
  getBlogPosts: () => publicApi.get<{ data: BlogPost[] }>('/blog').then(unwrap),
  getBlogPost: (slug: string) => publicApi.get<{ data: BlogPost }>(`/blog/${slug}`).then(unwrap),
  getSocialLinks: () => publicApi.get<{ data: SocialLink[] }>('/social-links').then(unwrap),
  getNavigation: () => publicApi.get<{ data: NavItem[] }>('/navigation').then(unwrap),
  getSections: () => publicApi.get<{ data: SectionsMap }>('/sections').then(unwrap),
  getContactSettings: () => publicApi.get<{ data: ContactSettings }>('/contact-settings').then(unwrap),
  getResume: () => publicApi.get<{ data: ResumeSettings }>('/resume').then(unwrap),
  submitContact: (data: ContactFormData) => publicApi.post('/contact', data),
}
