// Shared UI primitives for admin manager pages
import type { ReactNode } from "react";
import { btnStyle } from "./_styles";

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
        gap: 10,
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? "var(--color-accent)" : "var(--color-border)",
          transition: "background 0.2s",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
        {label}
      </span>
    </label>
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

export function IconBtn({
  onClick,
  variant = "default",
  title,
  children,
}: {
  onClick: () => void;
  variant?: "default" | "danger" | "accent";
  title?: string;
  children: ReactNode;
}) {
  const accentColor =
    variant === "danger" ? "#f87171" : "var(--color-accent-bright)";
  const accentBorder =
    variant === "danger" ? "rgba(248,113,113,0.4)" : "var(--color-accent)";
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        ...btnStyle,
        ...(variant === "accent"
          ? {
              color: "var(--color-accent-bright)",
              borderColor: "var(--color-accent)",
            }
          : {}),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = accentColor;
        e.currentTarget.style.borderColor = accentBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color =
          variant === "accent"
            ? "var(--color-accent-bright)"
            : "var(--color-text-muted)";
        e.currentTarget.style.borderColor =
          variant === "accent" ? "var(--color-accent)" : "var(--color-border)";
      }}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  icon,
  message,
  action,
}: {
  icon: ReactNode;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-muted)",
        }}
      >
        {icon}
      </div>
      <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
        {message}
      </p>
      {action}
    </div>
  );
}

export function ModalShell({
  title,
  onClose,
  headerRight,
  children,
  maxWidth = 480,
}: {
  title: string;
  onClose: () => void;
  headerRight?: ReactNode;
  children: ReactNode;
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 50,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          backdropFilter: "blur(16px)",
          width: "100%",
          maxWidth,
          margin: "32px auto",
          padding: "clamp(20px, 3vw, 32px)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            {title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {headerRight}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: 6,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                display: "flex",
                alignItems: "center",
                borderRadius: 6,
              }}
            >
              ✕
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormActions({
  isPending,
  onCancel,
  saveLabel,
  cancelLabel = "Cancel",
}: {
  isPending: boolean;
  onCancel: () => void;
  saveLabel: string;
  cancelLabel?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        paddingTop: 16,
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
        style={{ flex: 1, justifyContent: "center" }}
      >
        {isPending ? "Saving..." : saveLabel}
      </button>
      <button type="button" onClick={onCancel} className="btn-secondary">
        {cancelLabel}
      </button>
    </div>
  );
}
