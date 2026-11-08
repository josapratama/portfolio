import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, MapPin, Download } from "lucide-react";
import { getText } from "@/types";
import { PLATFORM_ICONS } from "./platformIcons";
import { pdf } from "@react-pdf/renderer";
import { CVDocument } from "@/features/cv";
import type { HeroContent, SocialLink, Lang, ResumeSettings } from "@/types";
import type { CVData, CVTemplate, CVPageSize } from "@/features/cv/types";

interface Props {
  hero: HeroContent;
  lang: Lang;
  fullName: string;
  location: string;
  ctaPrimary: string;
  ctaSecondary: string;
  socialLinks: SocialLink[];
  resume?: ResumeSettings | null;
}

export default function HeroSection({
  hero,
  lang,
  fullName,
  location,
  ctaPrimary,
  ctaSecondary,
  socialLinks,
  resume,
}: Props) {
  const [generatingCV, setGeneratingCV] = useState(false);

  const handleBuilderDownload = async () => {
    if (!resume?.cv_builder_data) return;
    setGeneratingCV(true);
    try {
      const cvData = resume.cv_builder_data as unknown as CVData;
      const template = (resume.cv_template || "classic") as CVTemplate;
      const pageSize = (resume.cv_page_size || "A4") as CVPageSize;
      const blob = await pdf(
        <CVDocument cv={cvData} template={template} pageSize={pageSize} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvData.name || "cv"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGeneratingCV(false);
    }
  };
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "80px 0 40px",
      }}
    >
      {/* bg blobs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.06)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.05)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
          width: "100%",
        }}
      >
        <div className="hero-grid">
          {/* Text */}
          <div className="hero-text animate-fade-in-left">
            {hero.show_availability_badge && (
              <div
                className="status-badge"
                style={{ marginBottom: 20, width: "fit-content" }}
              >
                {getText(hero.availability_badge, lang)}
              </div>
            )}
            {fullName && (
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-text-muted)",
                  marginBottom: 8,
                }}
              >
                {lang === "en" ? "Hi, I'm " : "Halo, saya "}
                <span
                  style={{
                    color: "var(--color-accent-bright)",
                    fontWeight: 600,
                  }}
                >
                  {fullName}
                </span>
              </p>
            )}
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: 16,
                color: "var(--color-text-primary)",
              }}
            >
              {getText(hero.headline, lang) || "Building Digital Experiences"}
            </h1>
            {hero.subheadline && (
              <p
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.375rem)",
                  fontWeight: 600,
                  color: "var(--color-accent-bright)",
                  marginBottom: 16,
                }}
              >
                {getText(hero.subheadline, lang)}
              </p>
            )}
            <p
              style={{
                fontSize: 15,
                color: "var(--color-text-secondary)",
                lineHeight: 1.75,
                marginBottom: 28,
                maxWidth: 480,
              }}
            >
              {getText(hero.short_intro, lang)}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 28,
              }}
              className="hero-cta-center"
            >
              <Link to="/projects" className="btn-primary">
                {ctaPrimary} <ArrowRight size={15} />
              </Link>
              <Link to="/contact" className="btn-secondary">
                {ctaSecondary}
              </Link>
              {resume?.enable_cv_download &&
                resume.cv_source === "url" &&
                resume.cv_url && (
                  <a
                    href={resume.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Download size={14} />
                    {getText(resume.button_label, lang) ||
                      (lang === "en" ? "Download CV" : "Unduh CV")}
                  </a>
                )}
              {resume?.enable_cv_download && resume.cv_source === "builder" && (
                <button
                  type="button"
                  onClick={handleBuilderDownload}
                  disabled={generatingCV}
                  className="btn-secondary"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Download size={14} />
                  {generatingCV
                    ? lang === "en"
                      ? "Generating..."
                      : "Membuat..."
                    : getText(resume.button_label, lang) ||
                      (lang === "en" ? "Download CV" : "Unduh CV")}
                </button>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div
                style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                className="hero-social-center"
              >
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.open_in_new_tab ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    title={link.label}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      border: "1px solid var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    className="social-icon-btn"
                  >
                    {PLATFORM_ICONS[link.platform.toLowerCase()] || (
                      <ExternalLink size={15} />
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div
            className="hero-image animate-fade-in-right"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: -16,
                  borderRadius: 28,
                  background: "rgba(59,130,246,0.06)",
                  filter: "blur(24px)",
                }}
              />
              <div
                className="animate-float"
                style={{
                  position: "relative",
                  width: "clamp(200px, 30vw, 300px)",
                  height: "clamp(200px, 30vw, 300px)",
                  borderRadius: 24,
                  border: "1px solid var(--color-border-glow)",
                  overflow: "hidden",
                  background: "var(--color-surface-2)",
                  boxShadow:
                    "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1)",
                }}
              >
                {hero.profile_image_url ? (
                  <img
                    src={hero.profile_image_url}
                    alt={fullName || "Profile"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 32,
                        fontWeight: 900,
                      }}
                    >
                      {(fullName || "A")[0]}
                    </div>
                    <p
                      style={{ fontSize: 12, color: "var(--color-text-muted)" }}
                    >
                      Profile Photo
                    </p>
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, var(--color-surface-alt), transparent)",
                  }}
                />
              </div>
              {location && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -12,
                    right: -12,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    padding: "8px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "var(--color-text-secondary)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <MapPin
                    size={12}
                    style={{ color: "var(--color-accent)", flexShrink: 0 }}
                  />
                  {location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
