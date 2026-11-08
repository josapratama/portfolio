import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getText } from "@/types";
import { Section, SectionLabel } from "./SectionWrapper";
import type { AboutContent, Skill, Lang } from "@/types";

interface Props {
  about: AboutContent;
  featuredSkills: Skill[];
  lang: Lang;
}

export default function AboutPreviewSection({
  about,
  featuredSkills,
  lang,
}: Props) {
  return (
    <Section>
      <div className="two-col-grid">
        <div>
          <SectionLabel text={lang === "en" ? "About Me" : "Tentang Saya"} />
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            {lang === "en" ? (
              <>
                The <span>Engineer</span> Behind the Code
              </>
            ) : (
              <>
                Engineer <span>di Balik</span> Kode
              </>
            )}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--color-text-secondary)",
              lineHeight: 1.75,
              marginBottom: 20,
            }}
          >
            {getText(about.short_bio, lang)}
          </p>
          {(about.highlights || []).length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {(about.highlights || []).slice(0, 4).map((h, i) => (
                <span key={i} className="tag">
                  {h}
                </span>
              ))}
            </div>
          )}
          <Link to="/about" className="btn-secondary" style={{ fontSize: 13 }}>
            {lang === "en" ? "More About Me" : "Lebih Lanjut"}{" "}
            <ArrowRight size={13} />
          </Link>
        </div>

        {featuredSkills.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 14,
              }}
            >
              {lang === "en" ? "Featured Skills" : "Keahlian Utama"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {featuredSkills.slice(0, 18).map((skill) => (
                <span key={skill.id} className="tag" style={{ fontSize: 12 }}>
                  {getText(skill.name, lang)}
                </span>
              ))}
            </div>
            <Link
              to="/about#skills"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 16,
                fontSize: 12,
                color: "var(--color-accent-bright)",
                textDecoration: "none",
              }}
            >
              {lang === "en" ? "View all skills" : "Lihat semua"}{" "}
              <ArrowRight size={11} />
            </Link>
          </div>
        )}
      </div>
    </Section>
  );
}
