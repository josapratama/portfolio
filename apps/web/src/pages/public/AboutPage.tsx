import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, MapPin, Mail, Briefcase, Star } from "lucide-react";

export default function AboutPage() {
  const { lang } = useLanguageStore();
  const { data: about, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: publicAPI.getAbout,
  });
  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: publicAPI.getSkills,
  });
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: publicAPI.getSettings,
  });

  if (isLoading) return <PageLoadSkeleton />;

  const fullName = settings?.site?.full_name || "Alex Johnson";
  const title = settings?.site?.title || "";

  return (
    <div style={{ paddingTop: 80 }}>
      {/* ── HERO HEADER ── */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "48px 0 40px",
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
            {lang === "en" ? "Get to know me" : "Kenali Saya"}
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
              marginBottom: 10,
            }}
          >
            {lang === "en" ? "Hi, I'm " : "Halo, Perkenalkan "}
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {fullName}
            </span>
          </h1>
          {title && (
            <p
              style={{
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                fontWeight: 600,
                color: "var(--color-accent-bright)",
                marginBottom: 0,
              }}
            >
              {title}
            </p>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div className="about-main-grid">
          {/* LEFT: Profile card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Avatar */}
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--color-border-glow)",
                background: "var(--color-surface-2)",
                aspectRatio: "1",
                maxWidth: 260,
                width: "100%",
                margin: "0 auto",
              }}
            >
              {about?.profile_image_url ? (
                <img
                  src={about.profile_image_url}
                  alt={fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, var(--color-surface), var(--color-surface-2))",
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
                    {fullName[0]}
                  </div>
                </div>
              )}
            </div>

            {/* Quick info card */}
            <div
              style={{
                background: "var(--color-surface-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 16,
                padding: "20px 20px",
                backdropFilter: "blur(16px)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  marginBottom: 16,
                }}
              >
                {lang === "en" ? "Quick Info" : "Info Singkat"}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  {
                    icon: <MapPin size={13} />,
                    label: lang === "en" ? "Location" : "Lokasi",
                    value: settings?.site?.location,
                  },
                  {
                    icon: <Briefcase size={13} />,
                    label: lang === "en" ? "Experience" : "Pengalaman",
                    value: `${about?.years_of_experience || 0}+ ${lang === "en" ? "years" : "tahun"}`,
                  },
                  {
                    icon: <Mail size={13} />,
                    label: "Email",
                    value: settings?.site?.contact_email,
                  },
                  {
                    icon: <Star size={13} />,
                    label: "Status",
                    value: settings?.site?.availability_status,
                  },
                ].map(
                  (row) =>
                    row.value && (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-accent)",
                            marginTop: 1,
                            flexShrink: 0,
                          }}
                        >
                          {row.icon}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 10,
                              color: "var(--color-text-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginBottom: 1,
                            }}
                          >
                            {row.label}
                          </p>
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--color-text-secondary)",
                              wordBreak: "break-all",
                            }}
                          >
                            {row.value}
                          </p>
                        </div>
                      </div>
                    ),
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Bio + highlights */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Bio */}
            <div>
              <div className="prose-cyber">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {getText(about?.full_bio, lang) ||
                    getText(about?.short_bio, lang) ||
                    ""}
                </ReactMarkdown>
              </div>
            </div>

            {/* Highlights */}
            {(about?.highlights || []).length > 0 && (
              <div
                style={{
                  background: "rgba(59,130,246,0.04)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  borderRadius: 16,
                  padding: "20px 24px",
                }}
              >
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    marginBottom: 14,
                  }}
                >
                  {lang === "en" ? "Highlights" : "Poin Utama"}
                </h3>
                <ul
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {(about?.highlights || []).map((h, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 14,
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      <CheckCircle2
                        size={15}
                        style={{
                          color: "var(--color-accent)",
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      />
                      {typeof h === "string" ? h : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SKILLS ── */}
      {(skills || []).length > 0 && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface-alt)",
          }}
        >
          <div
            style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}
            id="skills"
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: 10,
              }}
            >
              {lang === "en" ? "Technical Skills" : "Keahlian Teknis"}
            </p>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 900,
                color: "var(--color-text-primary)",
                marginBottom: 32,
                letterSpacing: "-0.02em",
              }}
            >
              {lang === "en" ? (
                <>
                  Tools &{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Technologies
                  </span>
                </>
              ) : (
                <>
                  Alat &{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Teknologi
                  </span>
                </>
              )}
            </h2>
            <div className="skills-grid">
              {(skills || []).map(
                (category) =>
                  category.skills.length > 0 && (
                    <div
                      key={category.id}
                      style={{
                        background: "var(--color-surface-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 16,
                        padding: "18px 20px",
                        backdropFilter: "blur(16px)",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--color-accent)",
                          marginBottom: 14,
                        }}
                      >
                        {getText(category.name, lang)}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {category.skills.map((skill) => (
                          <div
                            key={skill.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--color-text-secondary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {getText(skill.name, lang)}
                            </span>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                background: "rgba(59,130,246,0.1)",
                                border: "1px solid rgba(59,130,246,0.2)",
                                borderRadius: 999,
                                fontSize: 10,
                                fontWeight: 500,
                                color: "var(--color-accent-bright)",
                                flexShrink: 0,
                              }}
                            >
                              {skill.proficiency_level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* bottom spacing */}
      <div style={{ height: 64 }} />
    </div>
  );
}
