import { useState, lazy, Suspense } from "react";
import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { Link2, FileText, CheckCircle2 } from "lucide-react";
import { useAdminForm, str, loc, bool } from "./_helpers";
import { Toggle, FieldLabel, SaveBtn, FormCard, LangPill } from "./_shared";
import type { CVData, CVTemplate, CVPageSize } from "@/features/cv/types";

const CVBuilder = lazy(() => import("@/features/cv/CVBuilder"));

export default function ResumeAdminPage() {
  const { lang: uiLang } = useLanguageStore();
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  // null = user hasn't manually switched tabs yet
  const [tab, setTab] = useState<"url" | "builder" | null>(null);

  const {
    values,
    isLoading,
    isSuccess,
    mutation,
    handleChange,
    handleLocChange,
    save,
  } = useAdminForm(
    ["admin", "resume"],
    () => adminAPI.getResumeSettings(),
    (data) => adminAPI.updateResumeSettings(data),
  );

  if (isLoading || !isSuccess)
    return (
      <div className="admin-page">
        <div className="skeleton" style={{ height: 32, width: 200 }} />
      </div>
    );

  const activeSource = (values.cv_source as string) || "url";
  // Fall back to saved cv_source until user manually clicks a tab
  const resolvedTab: "url" | "builder" =
    tab ?? (activeSource as "url" | "builder");
  const showButton = bool(values, "enable_cv_download");

  const tabBtnStyle = (active: boolean) => ({
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 8,
    padding: "10px 20px",
    borderRadius: "10px 10px 0 0",
    border: active ? "1px solid var(--color-border)" : "1px solid transparent",
    borderBottom: active
      ? "1px solid var(--color-surface-card)"
      : "1px solid var(--color-border)",
    background: active ? "var(--color-surface-card)" : "transparent",
    color: active ? "var(--color-text-primary)" : "var(--color-text-muted)",
    cursor: "pointer" as const,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    marginBottom: -1,
    transition: "all 0.15s",
  });

  const activeBadge = (source: "url" | "builder") =>
    activeSource === source ? (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-success, #22c55e)",
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 20,
          padding: "2px 8px",
        }}
      >
        <CheckCircle2 size={11} />
        {uiLang === "en" ? "Active" : "Aktif"}
      </span>
    ) : null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Resume / CV</h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Manage your resume — use a URL or build one here"
              : "Kelola resume Anda — gunakan URL atau buat di sini"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <button
          type="button"
          onClick={() => setTab("url")}
          style={tabBtnStyle(resolvedTab === "url")}
        >
          <Link2 size={14} />
          {uiLang === "en" ? "Use URL" : "Gunakan URL"}
          <span style={{ marginLeft: 4 }}>{activeBadge("url")}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("builder")}
          style={tabBtnStyle(resolvedTab === "builder")}
        >
          <FileText size={14} />
          {uiLang === "en" ? "CV Builder" : "Buat CV"}
          <span style={{ marginLeft: 4 }}>{activeBadge("builder")}</span>
        </button>
      </div>

      {/* URL tab */}
      {resolvedTab === "url" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(undefined, { ...values, cv_source: "url" });
          }}
        >
          <FormCard>
            <div>
              <FieldLabel
                text={uiLang === "en" ? "Resume File URL" : "URL File Resume"}
              />
              <input
                className="input-cyber"
                value={str(values, "cv_url")}
                onChange={(e) => handleChange("cv_url", e.target.value)}
                placeholder="https://drive.google.com/..."
              />
              <p
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 6,
                }}
              >
                {uiLang === "en"
                  ? "Paste a direct link to your PDF (Google Drive, Dropbox, etc.)"
                  : "Tempel tautan langsung ke PDF Anda (Google Drive, Dropbox, dll.)"}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <FieldLabel
                text={`${uiLang === "en" ? "Download Button Label" : "Label Tombol Unduh"} (${contentLang.toUpperCase()})`}
              />
              <LangPill lang={contentLang} setLang={setContentLang} />
            </div>
            <input
              className="input-cyber"
              value={loc(values, "button_label", contentLang)}
              onChange={(e) =>
                handleLocChange("button_label", contentLang, e.target.value)
              }
              placeholder={contentLang === "en" ? "Download CV" : "Unduh CV"}
            />

            <Toggle
              checked={showButton}
              onChange={(v) => handleChange("enable_cv_download", v)}
              label={
                uiLang === "en"
                  ? "Show download button on site"
                  : "Tampilkan tombol unduh di situs"
              }
            />

            <SaveBtn pending={mutation.isPending} lang={uiLang} />
          </FormCard>
        </form>
      )}

      {/* Builder tab */}
      {resolvedTab === "builder" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 10,
              background: "var(--color-surface-card)",
              border: "1px solid var(--color-border)",
              marginTop: 16,
              marginBottom: 4,
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: 2,
                }}
              >
                {uiLang === "en"
                  ? "Use CV Builder as download source"
                  : "Gunakan CV Builder sebagai sumber unduhan"}
              </p>
              <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                {uiLang === "en"
                  ? "When active, the download button will use the CV you build below"
                  : "Saat aktif, tombol unduh akan menggunakan CV yang Anda buat di bawah"}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {activeBadge("builder")}
              <button
                type="button"
                onClick={() => {
                  save(undefined, {
                    ...values,
                    cv_source: "builder",
                    enable_cv_download: true,
                  });
                }}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    activeSource === "builder"
                      ? "rgba(34,197,94,0.15)"
                      : "var(--color-accent)",
                  color:
                    activeSource === "builder"
                      ? "var(--color-success, #22c55e)"
                      : "white",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {activeSource === "builder"
                  ? uiLang === "en"
                    ? "Already Active"
                    : "Sudah Aktif"
                  : uiLang === "en"
                    ? "Set as Active"
                    : "Jadikan Aktif"}
              </button>
            </div>
          </div>

          <Suspense
            fallback={
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: 80, borderRadius: 12 }}
                  />
                ))}
              </div>
            }
          >
            <CVBuilder
              initialData={values.cv_builder_data as Partial<CVData>}
              initialTemplate={(values.cv_template as CVTemplate) || "classic"}
              initialPageSize={(values.cv_page_size as CVPageSize) || "A4"}
              onSave={(cvData, tmpl, pgSize) => {
                save(undefined, {
                  ...values,
                  cv_builder_data: cvData,
                  cv_template: tmpl,
                  cv_page_size: pgSize,
                });
              }}
              saving={mutation.isPending}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}
