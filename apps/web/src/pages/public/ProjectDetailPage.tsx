import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  Code2,
  Tag,
  Briefcase,
  FileText,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguageStore();
  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => publicAPI.getProject(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PageLoadSkeleton />;

  if (isError || !project)
    return (
      <div
        style={{
          paddingTop: 80,
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <h2
            style={{
              fontSize: "clamp(1.4rem,4vw,1.8rem)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              marginBottom: 8,
            }}
          >
            {lang === "en" ? "Project Not Found" : "Proyek Tidak Ditemukan"}
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            {lang === "en"
              ? "This project may have been removed."
              : "Proyek ini mungkin telah dihapus."}
          </p>
          <Link
            to="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            <ArrowLeft size={14} />{" "}
            {lang === "en" ? "Back to Projects" : "Kembali"}
          </Link>
        </div>
      </div>
    );

  const title = getText(project.title, lang);
  const shortDesc = getText(project.short_description, lang);
  const fullDesc = getText(project.full_description, lang);
  const role = project.role ? getText(project.role, lang) : "";
  const techStack: string[] = project.tech_stack ?? [];
  const tags: string[] = project.tags ?? [];

  const sideCard = {
    background: "var(--color-surface-alt)",
    border: "1px solid var(--color-border)",
    borderRadius: 14,
    padding: "16px 18px",
  };
  const sectionLabel = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-muted)",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      {/* ── Cover image — full width flush ── */}
      {project.cover_image_url && (
        <div
          style={{
            width: "100%",
            height: "clamp(200px,38vw,460px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={project.cover_image_url}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 40%, var(--color-background) 100%)",
            }}
          />
        </div>
      )}

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 clamp(16px,4vw,32px)",
        }}
      >
        {/* ── Back link ── */}
        <div
          style={{
            paddingTop: project.cover_image_url ? 0 : 40,
            paddingBottom: 20,
          }}
        >
          <Link
            to="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--color-text-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-accent-bright)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-text-muted)")
            }
          >
            <ArrowLeft size={14} />
            {lang === "en" ? "Back to Projects" : "Kembali ke Proyek"}
          </Link>
        </div>

        {/* ── Two-column layout ── */}
        <div className="project-detail-grid" style={{ paddingBottom: 60 }}>
          {/* ── Main content ── */}
          <main style={{ minWidth: 0 }}>
            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(1.8rem,4vw,2.6rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "var(--color-text-primary)",
                marginBottom: 12,
              }}
            >
              {title}
            </h1>

            {/* Badges row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 20,
              }}
            >
              {project.is_featured && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(250,204,21,0.1)",
                    border: "1px solid rgba(250,204,21,0.25)",
                    color: "#facc15",
                  }}
                >
                  ★ {lang === "en" ? "Featured" : "Unggulan"}
                </span>
              )}
              {techStack.slice(0, 5).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.18)",
                    color: "var(--color-accent-bright)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Short description */}
            {shortDesc && (
              <p
                style={{
                  fontSize: "clamp(0.9rem,2vw,1.05rem)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.8,
                  marginBottom: 28,
                  paddingBottom: 28,
                  borderBottom: "1px solid var(--color-border)",
                  wordBreak: "break-word",
                }}
              >
                {shortDesc}
              </p>
            )}

            {/* Full description (markdown) */}
            {fullDesc && fullDesc !== shortDesc ? (
              <div
                style={{
                  background: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: "clamp(20px,3vw,36px)",
                  marginBottom: 32,
                }}
              >
                <div className="prose-cyber">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {fullDesc}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              !shortDesc && (
                <div
                  style={{
                    background: "var(--color-surface-alt)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 16,
                    padding: "40px 24px",
                    marginBottom: 32,
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <FileText
                    size={36}
                    style={{ marginBottom: 12, opacity: 0.4 }}
                  />
                  <p style={{ fontSize: 14 }}>
                    {lang === "en"
                      ? "No description available."
                      : "Deskripsi belum tersedia."}
                  </p>
                </div>
              )
            )}

            {/* Mobile-only action links */}
            <div className="project-mobile-links">
              {project.live_demo_url && (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ justifyContent: "center", fontSize: 13 }}
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ justifyContent: "center", fontSize: 13 }}
                >
                  <FaGithub size={14} /> View Code
                </a>
              )}
            </div>
          </main>

          {/* ── Sidebar ── */}
          <aside>
            <div
              style={{
                position: "sticky",
                top: 100,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Links */}
              {(project.live_demo_url || project.repo_url) && (
                <div style={sideCard}>
                  <p style={sectionLabel}>🔗 Links</p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ justifyContent: "center", fontSize: 13 }}
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ justifyContent: "center", fontSize: 13 }}
                      >
                        <FaGithub size={14} /> View Code
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tech stack */}
              {techStack.length > 0 && (
                <div style={sideCard}>
                  <p style={sectionLabel}>
                    <Code2 size={11} /> Tech Stack
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: "rgba(59,130,246,0.08)",
                          border: "1px solid rgba(59,130,246,0.18)",
                          color: "var(--color-accent-bright)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Role */}
              {role && (
                <div style={sideCard}>
                  <p style={sectionLabel}>
                    <Briefcase size={11} />{" "}
                    {lang === "en" ? "My Role" : "Peran Saya"}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-accent-bright)",
                      fontWeight: 600,
                    }}
                  >
                    {role}
                  </p>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div style={sideCard}>
                  <p style={sectionLabel}>
                    <Tag size={11} /> Tags
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: "rgba(99,102,241,0.08)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          color: "#a5b4fc",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back */}
              <Link
                to="/projects"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-text-primary)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-text-muted)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "var(--color-border)";
                }}
              >
                <ArrowLeft size={13} />{" "}
                {lang === "en" ? "All Projects" : "Semua Proyek"}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
