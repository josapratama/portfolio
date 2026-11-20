import { useState } from "react";
import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { Link2, ExternalLink } from "lucide-react";
import { useAdminForm, str, loc, bool } from "./_helpers";
import { Toggle, FieldLabel, SaveBtn, FormCard, LangPill } from "./_shared";

export default function ResumeAdminPage() {
  const { lang: uiLang } = useLanguageStore();
  const [contentLang, setContentLang] = useState<"en" | "id">("en");

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

  const showButton = bool(values, "enable_cv_download");
  const cvUrl = str(values, "cv_url");

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Resume / CV</h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Manage your resume link created via ResumeCraft AI"
              : "Kelola tautan resume Anda yang dibuat melalui ResumeCraft AI"}
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(undefined, { ...values, cv_source: "url" });
        }}
      >
        <FormCard>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <FieldLabel
                text={
                  uiLang === "en"
                    ? "Resume URL (ResumeCraft AI / PDF link)"
                    : "URL Resume / CV (dari ResumeCraft AI / Tautan PDF)"
                }
              />
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    color: "var(--color-accent, #3b82f6)",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={12} />
                  {uiLang === "en" ? "Test link" : "Buka tautan"}
                </a>
              )}
            </div>
            <input
              className="input-cyber"
              value={cvUrl}
              onChange={(e) => handleChange("cv_url", e.target.value)}
              placeholder="https://resumecraft-ai.josapratama.com/cv/... atau tautan file PDF"
            />
            <p
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                marginTop: 6,
              }}
            >
              <Link2 size={11} style={{ display: "inline", marginRight: 4 }} />
              {uiLang === "en"
                ? "Paste the public URL of your CV created in ResumeCraft AI or cloud storage"
                : "Tempel tautan publik resume yang Anda buat di ResumeCraft AI atau penyimpanan online"}
            </p>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <FieldLabel
                text={`${
                  uiLang === "en" ? "Download Button Label" : "Label Tombol Unduh"
                } (${contentLang.toUpperCase()})`}
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
          </div>

          <Toggle
            checked={showButton}
            onChange={(v) => handleChange("enable_cv_download", v)}
            label={
              uiLang === "en"
                ? "Show download / view resume button on site"
                : "Tampilkan tombol unduh / lihat resume di situs"
            }
          />

          <SaveBtn pending={mutation.isPending} lang={uiLang} />
        </FormCard>
      </form>
    </div>
  );
}
