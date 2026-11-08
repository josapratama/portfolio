interface Props {
  yearsExp: number;
  projectCount: number;
  techCount: number;
  articleCount: number;
  lang: string;
}

export default function StatsStrip({
  yearsExp,
  projectCount,
  techCount,
  articleCount,
  lang,
}: Props) {
  const stats = [
    {
      num: `${yearsExp}+`,
      label: lang === "en" ? "Years Exp." : "Tahun Pengalaman",
    },
    { num: `${projectCount}+`, label: lang === "en" ? "Projects" : "Proyek" },
    {
      num: `${techCount}+`,
      label: lang === "en" ? "Technologies" : "Teknologi",
    },
    { num: `${articleCount}+`, label: lang === "en" ? "Articles" : "Artikel" },
  ];

  return (
    <div
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface-alt)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "20px 16px",
                textAlign: "center",
                borderRight:
                  i < stats.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                  fontWeight: 900,
                  color: "var(--color-accent-bright)",
                  lineHeight: 1,
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
