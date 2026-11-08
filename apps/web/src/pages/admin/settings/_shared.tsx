// Shared SettingsForm component for settings pages
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";

export interface Field {
  key: string;
  label: string;
  type?: "text" | "email" | "url" | "textarea" | "toggle" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export function SettingsForm({
  title,
  subtitle,
  queryKey,
  queryFn,
  mutateFn,
  fields,
}: {
  title: string;
  subtitle?: string;
  queryKey: string[];
  queryFn: () => Promise<unknown>;
  mutateFn: (data: Record<string, unknown>) => Promise<unknown>;
  fields: Field[];
}) {
  const { data, isLoading } = useQuery({ queryKey, queryFn });
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const [local, setLocal] = useState<Record<string, unknown>>({});
  const values: Record<string, unknown> = {
    ...(data as Record<string, unknown>),
    ...local,
  };

  const mutation = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success(lang === "en" ? "Saved!" : "Tersimpan!");
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to save" : "Gagal menyimpan"),
  });

  const handleChange = (key: string, value: unknown) =>
    setLocal((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    mutation.mutate(values);
  };

  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">{title}</h1>
            {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
          </div>
        </div>

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
          {fields.map((field) => (
            <div key={field.key}>
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
                {field.label}
              </label>

              {field.type === "toggle" ? (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 40,
                      height: 22,
                      borderRadius: 999,
                      background: values[field.key]
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                      transition: "background 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: 0,
                        height: 0,
                      }}
                      checked={!!values[field.key]}
                      onChange={(e) =>
                        handleChange(field.key, e.target.checked)
                      }
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        left: values[field.key] ? 21 : 3,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {values[field.key]
                      ? lang === "en"
                        ? "Active"
                        : "Aktif"
                      : lang === "en"
                        ? "Inactive"
                        : "Nonaktif"}
                  </span>
                </label>
              ) : field.type === "textarea" ? (
                <textarea
                  className="input-cyber"
                  rows={4}
                  style={{ resize: "vertical" }}
                  value={(values[field.key] as string) || ""}
                  placeholder={field.placeholder}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  className="input-cyber"
                  value={(values[field.key] as string) || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  className="input-cyber"
                  value={(values[field.key] as string) || ""}
                  placeholder={field.placeholder}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}

          <div
            style={{
              paddingTop: 16,
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary"
            >
              {mutation.isPending ? (
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
                  {lang === "en" ? "Saving..." : "Menyimpan..."}
                </span>
              ) : lang === "en" ? (
                "Save Changes"
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
