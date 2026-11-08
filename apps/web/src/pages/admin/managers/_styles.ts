// Shared style constants for admin manager pages

export const cardStyle = {
  background: "var(--color-surface-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  backdropFilter: "blur(16px)",
  overflow: "hidden" as const,
};

export const cardStyleNoOverflow = {
  background: "var(--color-surface-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  backdropFilter: "blur(16px)",
};

export const btnStyle = {
  padding: 7,
  borderRadius: 7,
  border: "1px solid var(--color-border)",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "var(--color-text-muted)",
  transition: "all 0.15s",
} as const;

export const modalOverlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  zIndex: 50,
  overflowY: "auto" as const,
  padding: "16px",
  display: "flex",
  alignItems: "flex-start" as const,
  justifyContent: "center",
};
