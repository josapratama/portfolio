import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import {
  PageLoadSkeleton,
  EmptyState,
} from "@/components/public/LoadingStates";
import { MapPin, Calendar } from "lucide-react";

export default function ExperiencePage() {
  const { lang } = useLanguageStore();
  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: publicAPI.getExperiences,
  });

  if (isLoading) return <PageLoadSkeleton />;

  const list = experiences || [];

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "clamp(36px,6vw,64px) 0 clamp(28px,4vw,48px)",
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "0 clamp(16px,4vw,32px)",
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
            {lang === "en" ? "Career History" : "Riwayat Karier"}
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem,5vw,3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
            }}
          >
            {lang === "en" ? (
              <>
                Work{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Experience
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Pengalaman
                </span>{" "}
                Kerja
              </>
            )}
          </h1>
          {list.length > 0 && (
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "var(--color-text-muted)",
              }}
            >
              {list.length}{" "}
              {lang === "en"
                ? "position" + (list.length > 1 ? "s" : "")
                : "posisi"}
            </p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "clamp(32px,5vw,64px) clamp(16px,4vw,32px)",
        }}
      >
        {list.length === 0 ? (
          <EmptyState
            message={
              lang === "en"
                ? "No experience listed yet"
                : "Belum ada pengalaman"
            }
          />
        ) : (
          <div className="exp-timeline">
            {list.map((exp, i) => {
              const role = getText(exp.role, lang);
              const org = getText(exp.organization, lang);
              const loc = getText(exp.location, lang);
              const desc = getText(exp.description, lang);
              const startStr =
                exp.start_date?.slice(0, 7).replace("-", "/") || "";
              const endStr = exp.is_current
                ? lang === "en"
                  ? "Present"
                  : "Sekarang"
                : exp.end_date?.slice(0, 7).replace("-", "/") || "";
              const achievements = Array.isArray(exp.achievements)
                ? exp.achievements
                : [];

              return (
                <div
                  key={exp.id}
                  className="exp-item animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {/* Timeline dot */}
                  <div className="exp-dot">
                    <div className="exp-dot-inner" />
                  </div>

                  {/* Card */}
                  <div className="exp-card">
                    {/* Top row: role + meta */}
                    <div className="exp-card-header">
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <h2
                            style={{
                              fontSize: "clamp(0.95rem,2vw,1.1rem)",
                              fontWeight: 700,
                              color: "var(--color-text-primary)",
                              margin: 0,
                            }}
                          >
                            {role}
                          </h2>
                          {exp.is_current && (
                            <span
                              className="status-badge"
                              style={{ fontSize: 10, padding: "2px 8px" }}
                            >
                              {lang === "en" ? "Current" : "Aktif"}
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: "clamp(0.82rem,1.5vw,0.95rem)",
                            color: "var(--color-accent-bright)",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        >
                          {org}
                        </p>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
                        >
                          {loc && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 12,
                                color: "var(--color-text-muted)",
                              }}
                            >
                              <MapPin size={11} style={{ flexShrink: 0 }} />
                              {loc}
                            </span>
                          )}
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 12,
                              color: "var(--color-text-muted)",
                            }}
                          >
                            <Calendar size={11} style={{ flexShrink: 0 }} />
                            {startStr} — {endStr}
                          </span>
                        </div>
                      </div>

                      {/* Employment type badge */}
                      <div style={{ flexShrink: 0 }}>
                        <span className="tag" style={{ fontSize: 11 }}>
                          {exp.employment_type}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {desc && (
                      <p
                        style={{
                          fontSize: "clamp(0.8rem,1.5vw,0.875rem)",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.75,
                          marginBottom: achievements.length > 0 ? 16 : 0,
                          wordBreak: "break-word",
                        }}
                      >
                        {desc}
                      </p>
                    )}

                    {/* Achievements */}
                    {achievements.length > 0 && (
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--color-text-muted)",
                            marginBottom: 10,
                          }}
                        >
                          {lang === "en"
                            ? "Key Achievements"
                            : "Pencapaian Utama"}
                        </p>
                        <ul
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 7,
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          {achievements.map((a, j) => (
                            <li
                              key={j}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 8,
                                fontSize: "clamp(0.78rem,1.5vw,0.875rem)",
                                color: "var(--color-text-secondary)",
                                wordBreak: "break-word",
                              }}
                            >
                              <span
                                style={{
                                  color: "var(--color-accent)",
                                  marginTop: 3,
                                  flexShrink: 0,
                                  fontSize: 10,
                                }}
                              >
                                ▹
                              </span>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
