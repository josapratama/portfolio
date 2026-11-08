import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Public
import PublicLayout from "@/components/public/PublicLayout";
import HomePage from "@/pages/public/HomePage";
import AboutPage from "@/pages/public/AboutPage";
import ProjectsPage from "@/pages/public/ProjectsPage";
import ProjectDetailPage from "@/pages/public/ProjectDetailPage";
import ExperiencePage from "@/pages/public/ExperiencePage";
import BlogPage from "@/pages/public/BlogPage";
import BlogDetailPage from "@/pages/public/BlogDetailPage";
import ContactPage from "@/pages/public/ContactPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

// Admin — layout
import AdminLoginPage from "@/pages/admin/layout/AdminLoginPage";
import AuthCallbackPage from "@/pages/admin/layout/AuthCallbackPage";
import AdminLayout from "@/pages/admin/layout/AdminLayout";

// Admin — dashboard & misc
import DashboardPage from "@/pages/admin/DashboardPage";
import SectionVisibilityPage from "@/pages/admin/SectionVisibilityPage";
import ContactSubmissionsPage from "@/pages/admin/ContactSubmissionsPage";

// Admin — content
import HeroPage from "@/pages/admin/content/HeroPage";
import AboutAdminPage from "@/pages/admin/content/AboutPage";
import ResumeAdminPage from "@/pages/admin/content/ResumeAdminPage";
import ContactSettingsPage from "@/pages/admin/content/ContactSettingsPage";

// Admin — settings
import SiteSettingsPage from "@/pages/admin/settings/SiteSettingsPage";
import ThemeSettingsPage from "@/pages/admin/settings/ThemeSettingsPage";
import LanguageSettingsPage from "@/pages/admin/settings/LanguageSettingsPage";
import SEOSettingsPage from "@/pages/admin/settings/SEOSettingsPage";

// Admin — managers
import SkillsManagerPage from "@/pages/admin/managers/SkillsManagerPage";
import ProjectsManagerPage from "@/pages/admin/managers/ProjectsManagerPage";
import ExperienceManagerPage from "@/pages/admin/managers/ExperienceManagerPage";
import BlogManagerPage from "@/pages/admin/managers/BlogManagerPage";
import SocialLinksManagerPage from "@/pages/admin/managers/SocialLinksManagerPage";
import NavigationPage from "@/pages/admin/managers/NavigationPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" theme="dark" richColors />
        <Routes>
          {/* ── Public ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ── Admin ── */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />

            {/* Content */}
            <Route path="hero" element={<HeroPage />} />
            <Route path="about" element={<AboutAdminPage />} />
            <Route path="skills" element={<SkillsManagerPage />} />
            <Route path="social-links" element={<SocialLinksManagerPage />} />
            <Route path="projects" element={<ProjectsManagerPage />} />
            <Route path="experience" element={<ExperienceManagerPage />} />
            <Route path="blog" element={<BlogManagerPage />} />

            {/* Site */}
            <Route path="sections" element={<SectionVisibilityPage />} />
            <Route path="navigation" element={<NavigationPage />} />
            <Route path="resume" element={<ResumeAdminPage />} />

            {/* Settings */}
            <Route path="settings/site" element={<SiteSettingsPage />} />
            <Route path="settings/theme" element={<ThemeSettingsPage />} />
            <Route
              path="settings/language"
              element={<LanguageSettingsPage />}
            />
            <Route path="settings/seo" element={<SEOSettingsPage />} />

            {/* Contact */}
            <Route path="contact/settings" element={<ContactSettingsPage />} />
            <Route
              path="contact/submissions"
              element={<ContactSubmissionsPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
