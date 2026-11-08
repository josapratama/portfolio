import { useState } from "react";
import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { useAdminForm, str, loc } from "./_helpers";
import { FieldLabel, SaveBtn, FormCard, LangPill } from "./_shared";

export default function AboutPage() {
  const { lang: uiLang } = useLanguageStore();
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin", "about"],
      () => adminAPI.getAbout(),
      (data) => adminAPI.updateAbout(data),
    );

  if (isLoading)
    return (
      <div className="admin-page">
        <div className="skeleton" style={{ height: 32, width: 200 }} />
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {uiLang === "en" ? "About Section" : "Bagian Tentang"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Edit your about section content"
              : "Edit konten bagian tentang"}
          </p>
        </div>
      </div>

      <form onSubmit={save}>
        <FormCard>
          <div>
            <FieldLabel
              text={uiLang === "en" ? "Profile Image URL" : "URL Foto Profil"}
            />
            <input
              className="input-cyber"
              value={str(values, "profile_image_url")}
              onChange={(e) =>
                handleChange("profile_image_url", e.target.value)
              }
              placeholder="https://..."
            />
          </div>

          <div>
            <FieldLabel
              text={
                uiLang === "en" ? "Years of Experience" : "Tahun Pengalaman"
              }
            />
            <input
              className="input-cyber"
              type="number"
              min={0}
              value={(values["years_of_experience"] as number) ?? 0}
              onChange={(e) =>
                handleChange(
                  "years_of_experience",
                  parseInt(e.target.value) || 0,
                )
              }
            />
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
              text={uiLang === "en" ? "Bilingual Fields" : "Field Dua Bahasa"}
            />
            <LangPill lang={contentLang} setLang={setContentLang} />
          </div>

          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Short Bio" : "Bio Singkat"} (${contentLang.toUpperCase()})`}
            />
            <textarea
              className="input-cyber"
              rows={3}
              value={loc(values, "short_bio", contentLang)}
              onChange={(e) =>
                handleLocChange("short_bio", contentLang, e.target.value)
              }
            />
          </div>

          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Full Bio (Markdown)" : "Bio Lengkap (Markdown)"} (${contentLang.toUpperCase()})`}
            />
            <textarea
              className="input-cyber"
              rows={8}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                resize: "vertical",
              }}
              value={loc(values, "full_bio", contentLang)}
              onChange={(e) =>
                handleLocChange("full_bio", contentLang, e.target.value)
              }
            />
          </div>

          <SaveBtn pending={mutation.isPending} lang={uiLang} />
        </FormCard>
      </form>
    </div>
  );
}
