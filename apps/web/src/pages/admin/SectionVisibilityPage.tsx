import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface Section {
  id: string;
  section_key: string;
  label: string;
  is_visible: boolean;
}

export default function SectionVisibilityPage() {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin-sections"],
    queryFn: adminAPI.getSections,
  });

  const mutation = useMutation({
    mutationFn: ({ key, visible }: { key: string; visible: boolean }) =>
      adminAPI.updateSection(key, { is_visible: visible }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-sections"] });
      qc.invalidateQueries({ queryKey: ["sections"] });
      toast.success(lang === "en" ? "Section updated" : "Bagian diperbarui");
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to update" : "Gagal memperbarui"),
  });

  if (isLoading)
    return (
      <div className="admin-page">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 64, borderRadius: 12 }}
          />
        ))}
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {lang === "en" ? "Section Visibility" : "Visibilitas Bagian"}
          </h1>
          <p className="admin-page-subtitle">
            {lang === "en"
              ? "Control which sections appear on your public site"
              : "Kontrol bagian mana yang muncul di situs publik Anda"}
          </p>
        </div>
      </div>

      <div
        style={{
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          backdropFilter: "blur(16px)",
          overflow: "hidden",
        }}
      >
        {((sections as Section[]) || []).map((section, idx, arr) => (
          <div
            key={section.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom:
                idx < arr.length - 1 ? "1px solid var(--color-border)" : "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(59,130,246,0.02)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: section.is_visible
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(148,163,184,0.08)",
                  border: `1px solid ${section.is_visible ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: section.is_visible
                    ? "#4ade80"
                    : "var(--color-text-muted)",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                {section.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: 2,
                  }}
                >
                  {section.label}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {section.section_key}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: section.is_visible
                    ? "#4ade80"
                    : "var(--color-text-muted)",
                }}
              >
                {section.is_visible
                  ? lang === "en"
                    ? "Visible"
                    : "Tampil"
                  : lang === "en"
                    ? "Hidden"
                    : "Tersembunyi"}
              </span>
              <div
                onClick={() =>
                  mutation.mutate({
                    key: section.section_key,
                    visible: !section.is_visible,
                  })
                }
                style={{
                  position: "relative",
                  width: 40,
                  height: 22,
                  borderRadius: 999,
                  background: section.is_visible
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                  transition: "background 0.2s",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: section.is_visible ? 21 : 3,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
