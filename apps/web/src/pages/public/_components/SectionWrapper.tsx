export function Section({
  children,
  alt = false,
}: {
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section
      style={{
        background: alt ? "var(--color-surface-alt)" : "transparent",
        padding: "64px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {children}
      </div>
    </section>
  );
}

export function SectionLabel({ text }: { text: string }) {
  return (
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
      {text}
    </p>
  );
}

export function SectionHeader({
  label,
  title,
  viewAllHref,
  viewAllLabel,
}: {
  label: string;
  title: React.ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  // Lazy import to avoid circular deps — consumers pass Link if needed
  return (
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
        <SectionLabel text={label} />
        <h2 className="section-title">{title}</h2>
      </div>
      {viewAllHref && viewAllLabel && (
        <a
          href={viewAllHref}
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
          {viewAllLabel}
        </a>
      )}
    </div>
  );
}
