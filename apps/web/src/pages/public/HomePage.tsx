import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import HeroSection from "./_components/HeroSection";
import StatsStrip from "./_components/StatsStrip";
import AboutPreviewSection from "./_components/AboutPreviewSection";
import FeaturedProjectsSection from "./_components/FeaturedProjectsSection";
import ExperiencePreviewSection from "./_components/ExperiencePreviewSection";
import BlogPreviewSection from "./_components/BlogPreviewSection";
import ContactCTASection from "./_components/ContactCTASection";

export default function HomePage() {
  const { lang } = useLanguageStore();

  const { data: hero, isLoading: heroLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: publicAPI.getHero,
    staleTime: 5 * 60 * 1000,
  });
  const { data: about } = useQuery({
    queryKey: ["about"],
    queryFn: publicAPI.getAbout,
    staleTime: 5 * 60 * 1000,
  });
  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: publicAPI.getSkills,
    staleTime: 5 * 60 * 1000,
  });
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: publicAPI.getProjects,
    staleTime: 5 * 60 * 1000,
  });
  const { data: experiences } = useQuery({
    queryKey: ["experiences"],
    queryFn: publicAPI.getExperiences,
    staleTime: 5 * 60 * 1000,
  });
  const { data: blogPosts } = useQuery({
    queryKey: ["blog"],
    queryFn: publicAPI.getBlogPosts,
    staleTime: 5 * 60 * 1000,
  });
  const { data: socialLinks } = useQuery({
    queryKey: ["social-links"],
    queryFn: publicAPI.getSocialLinks,
    staleTime: 10 * 60 * 1000,
  });
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: publicAPI.getSettings,
    staleTime: 10 * 60 * 1000,
  });
  const { data: sections } = useQuery({
    queryKey: ["sections"],
    queryFn: publicAPI.getSections,
    staleTime: 5 * 60 * 1000,
  });
  const { data: contactSettings } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: publicAPI.getContactSettings,
    staleTime: 10 * 60 * 1000,
  });
  const { data: resume } = useQuery({
    queryKey: ["resume"],
    queryFn: publicAPI.getResume,
    staleTime: 10 * 60 * 1000,
  });

  if (heroLoading) return <PageLoadSkeleton />;

  const s = sections || {};
  const allProjects = projects || [];
  const allSkills = skills || [];
  const allExperiences = experiences || [];
  const allPosts = blogPosts || [];
  const links = socialLinks || [];

  const featuredProjects = allProjects.filter((p) => p.is_featured);
  const featuredPosts = allPosts.filter((p) => p.is_featured).slice(0, 3);
  const recentExperiences = allExperiences.slice(0, 3);
  const featuredSkills = allSkills
    .flatMap((cat) => cat.skills || [])
    .filter((sk) => sk?.is_featured);

  const ctaPrimary =
    settings?.site?.cta_primary_label ||
    (lang === "en" ? "View My Work" : "Lihat Karya");
  const ctaSecondary =
    settings?.site?.cta_secondary_label ||
    (lang === "en" ? "Get In Touch" : "Hubungi Saya");
  const fullName =
    settings?.site?.full_name || settings?.site?.brand_name || "";
  const location = settings?.site?.location || "";

  return (
    <div style={{ overflowX: "hidden" }}>
      {s["hero"] !== false && hero && (
        <HeroSection
          hero={hero}
          lang={lang}
          fullName={fullName}
          location={location}
          ctaPrimary={ctaPrimary}
          ctaSecondary={ctaSecondary}
          socialLinks={links}
          resume={resume}
        />
      )}

      {about && (
        <StatsStrip
          yearsExp={about.years_of_experience || 0}
          projectCount={allProjects.length}
          techCount={allSkills.flatMap((c) => c.skills || []).length}
          articleCount={allPosts.length}
          lang={lang}
        />
      )}

      {s["about_preview"] !== false && about && (
        <AboutPreviewSection
          about={about}
          featuredSkills={featuredSkills}
          lang={lang}
        />
      )}

      {s["featured_projects"] !== false && featuredProjects.length > 0 && (
        <FeaturedProjectsSection projects={featuredProjects} lang={lang} />
      )}

      {s["experience_preview"] !== false && recentExperiences.length > 0 && (
        <ExperiencePreviewSection experiences={recentExperiences} lang={lang} />
      )}

      {s["blog_preview"] !== false &&
        s["blog_page"] !== false &&
        featuredPosts.length > 0 && (
          <BlogPreviewSection posts={featuredPosts} lang={lang} />
        )}

      {s["contact_cta"] !== false && (
        <ContactCTASection
          contactSettings={contactSettings}
          socialLinks={links}
          contactEmail={settings?.site?.contact_email}
          lang={lang}
        />
      )}
    </div>
  );
}
