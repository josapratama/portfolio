import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getText } from "@/types";
import { Section, SectionLabel } from "./SectionWrapper";
import type { Project, Lang } from "@/types";

interface Props {
  projects: Project[];
  lang: Lang;
}

export default function FeaturedProjectsSection({ projects, lang }: Props) {
  return (
    <Section alt>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <SectionLabel text={lang === "en" ? "Portfolio" : "Portofolio"} />
          <h2 className="section-title">
            {lang === "en" ? (
              <>
                Featured <span>Projects</span>
              </>
            ) : (
              <>
                <span>Proyek</span> Unggulan
              </>
            )}
          </h2>
        </div>
        <Link
          to="/projects"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--color-accent-bright)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          {lang === "en" ? "View all" : "Lihat semua"} <ArrowRight size={13} />
        </Link>
      </div>

      <div className="card-grid">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.slug}`}
            className="card-glass"
            style={{
              textDecoration: "none",
              display: "block",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 180,
                background:
                  "linear-gradient(135deg, var(--color-surface-2), var(--color-surface))",
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
                    transition: "transform 0.4s ease",
                  }}
                  className="card-img-hover"
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
                      fontSize: 48,
                      fontWeight: 900,
                      color: "var(--color-border-glow)",
                      opacity: 0.5,
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
                    "linear-gradient(to top, var(--color-surface-alt), transparent)",
                }}
              />
            </div>
            <div style={{ padding: "16px 18px" }}>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}
              >
                {getText(project.title, lang)}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  marginBottom: 12,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {getText(project.short_description, lang)}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(Array.isArray(project.tech_stack) ? project.tech_stack : [])
                  .slice(0, 3)
                  .map((tech) => (
                    <span key={tech} className="tag" style={{ fontSize: 11 }}>
                      {tech}
                    </span>
                  ))}
                {project.tech_stack?.length > 3 && (
                  <span className="tag" style={{ fontSize: 11 }}>
                    +{project.tech_stack.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
