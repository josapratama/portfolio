import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import {
  PageLoadSkeleton,
  EmptyState,
} from "@/components/public/LoadingStates";

export default function ProjectsPage() {
  const { lang } = useLanguageStore();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: publicAPI.getProjects,
  });

  if (isLoading) return <PageLoadSkeleton />;

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero header */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "clamp(40px, 6vw, 72px) 0 clamp(32px, 5vw, 56px)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 12,
            }}
          >
            Portfolio
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
              marginBottom: 16,
            }}
          >
            {lang === "en" ? (
              <>
                My{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Projects
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Proyek
                </span>{" "}
                Saya
              </>
            )}
          </h1>
          <p
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              color: "var(--color-text-secondary)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {lang === "en"
              ? "A collection of projects I have built, contributed to, or am currently working on."
              : "Kumpulan proyek yang telah saya bangun, kontribusikan, atau sedang kerjakan."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 64px) 24px",
        }}
      >
        {(projects || []).length === 0 ? (
          <EmptyState
            message={lang === "en" ? "No projects yet" : "Belum ada proyek"}
          />
        ) : (
          <div className="projects-grid">
            {(projects || []).map((project) => (
              <div
                key={project.id}
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  backdropFilter: "blur(16px)",
                  transition:
                    "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "var(--color-border-glow)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 12px 40px rgba(59,130,246,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "var(--color-border)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Cover image */}
                <div
                  style={{
                    height: 180,
                    background:
                      "linear-gradient(135deg, var(--color-surface), var(--color-surface-2))",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={getText(project.title, lang)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s",
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
                      }}
                    >
                      <span
                        style={{
                          fontSize: 56,
                          fontWeight: 900,
                          color: "var(--color-border-glow)",
                          opacity: 0.4,
                        }}
                      >
                        {getText(project.title, lang)[0]}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, var(--color-surface-alt) 0%, transparent 60%)",
                    }}
                  />
                  {project.is_featured && (
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <span className="tag" style={{ fontSize: 10 }}>
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: "20px 20px 16px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <h2
                    style={{
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      fontSize: 15,
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {getText(project.title, lang)}
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                      marginBottom: 14,
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {getText(project.short_description, lang)}
                  </p>

                  {/* Tech stack */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 16,
                    }}
                  >
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <span key={tech} className="tag" style={{ fontSize: 10 }}>
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="tag" style={{ fontSize: 10 }}>
                        +{project.tech_stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      paddingTop: 14,
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "var(--color-accent-bright)",
                        textDecoration: "none",
                        fontWeight: 600,
                        transition: "gap 0.2s",
                      }}
                    >
                      {lang === "en" ? "Details" : "Detail"}{" "}
                      <ArrowRight size={13} />
                    </Link>
                    <div
                      style={{ display: "flex", gap: 8, marginLeft: "auto" }}
                    >
                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Live Demo"
                          style={{
                            padding: "6px",
                            borderRadius: 6,
                            color: "var(--color-text-muted)",
                            textDecoration: "none",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color =
                              "var(--color-accent-bright)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color =
                              "var(--color-text-muted)";
                          }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Repository"
                          style={{
                            padding: "6px",
                            borderRadius: 6,
                            color: "var(--color-text-muted)",
                            textDecoration: "none",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color =
                              "var(--color-accent-bright)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color =
                              "var(--color-text-muted)";
                          }}
                        >
                          <FaGithub size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
