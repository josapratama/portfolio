// Shared UI components for content admin pages

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: 40,
          height: 22,
          borderRadius: 999,
          background: checked ? "var(--color-accent)" : "var(--color-border)",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
        {label}
      </span>
    </label>
  );
}

export function FieldLabel({ text }: { text: string }) {
  return (
    <label
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--color-text-muted)",
        display: "block",
        marginBottom: 8,
      }}
    >
      {text}
    </label>
  );
}

import type { Lang } from "@/types";

export function SaveBtn({
  pending,
  lang,
}: {
  pending: boolean;
  lang?: Lang;
}) {
  return (
    <div style={{ paddingTop: 16, borderTop: "1px solid var(--color-border)" }}>
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid white",
                borderTopColor: "transparent",
                animation: "spin 0.7s linear infinite",
              }}
            />
            {lang === "id" ? "Menyimpan..." : (lang === "ja" ? "保存中..." : "Saving...")}
          </span>
        ) : lang === "id" ? (
          "Simpan Perubahan"
        ) : lang === "ja" ? (
          "変更を保存"
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--color-surface-card)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        padding: "clamp(20px, 3vw, 28px)",
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 680,
      }}
    >
      {children}
    </div>
  );
}

export function LangPill({
  lang,
  setLang,
}: {
  lang: "en" | "id";
  setLang: (l: "en" | "id") => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        borderRadius: 6,
        padding: 2,
      }}
    >
      {(["en", "id"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          style={{
            padding: "3px 10px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: lang === l ? "var(--color-accent)" : "transparent",
            color: lang === l ? "white" : "var(--color-text-muted)",
            transition: "all 0.15s",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
