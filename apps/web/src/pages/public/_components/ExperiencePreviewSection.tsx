import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import { getText } from "@/types";
import { Section, SectionLabel } from "./SectionWrapper";
import type { Experience, Lang } from "@/types";

interface Props {
  experiences: Experience[];
  lang: Lang;
}

export default function ExperiencePreviewSection({ experiences, lang }: Props) {
  return (
    <Section>
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
          <SectionLabel text={lang === "en" ? "Career" : "Karier"} />
          <h2 className="section-title">
            {lang === "en" ? (
              <>
                Work <span>Experience</span>
              </>
            ) : (
              <>
                <span>Pengalaman</span> Kerja
              </>
            )}
          </h2>
        </div>
        <Link
          to="/experience"
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
          {lang === "en" ? "Full history" : "Riwayat lengkap"}{" "}
          <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="card-glass"
            style={{
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Briefcase size={18} style={{ color: "var(--color-accent)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {getText(exp.role, lang)}
                </span>
                {exp.is_current && (
                  <span
                    className="status-badge"
                    style={{ fontSize: 10, padding: "2px 8px" }}
                  >
                    {lang === "en" ? "Current" : "Sekarang"}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-accent-bright)",
                  fontWeight: 500,
                }}
              >
                {getText(exp.organization, lang)}
              </p>
              {exp.location && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <MapPin size={10} />
                  {getText(exp.location, lang)}
                </p>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span className="tag" style={{ fontSize: 11 }}>
                {exp.employment_type}
              </span>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 6,
                }}
              >
                {exp.start_date?.slice(0, 7)} —{" "}
                {exp.is_current
                  ? lang === "en"
                    ? "Present"
                    : "Sekarang"
                  : exp.end_date?.slice(0, 7)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
