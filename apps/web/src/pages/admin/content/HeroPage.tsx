import { useState } from "react";
import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { useAdminForm, str, loc, bool } from "./_helpers";
import { Toggle, FieldLabel, SaveBtn, FormCard, LangPill } from "./_shared";

export default function HeroPage() {
  const { lang: uiLang } = useLanguageStore();
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin", "hero"],
      () => adminAPI.getHero(),
      (data) => adminAPI.updateHero(data),
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
            {uiLang === "en" ? "Hero Section" : "Bagian Hero"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Edit your hero section content"
              : "Edit konten bagian hero"}
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
              text={`${uiLang === "en" ? "Headline" : "Judul Utama"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={loc(values, "headline", contentLang)}
              onChange={(e) =>
                handleLocChange("headline", contentLang, e.target.value)
              }
              placeholder={
                uiLang === "en"
                  ? "Building Digital Experiences..."
                  : "Membangun Pengalaman Digital..."
              }
            />
          </div>

          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Subheadline" : "Subjudul"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={loc(values, "subheadline", contentLang)}
              onChange={(e) =>
                handleLocChange("subheadline", contentLang, e.target.value)
              }
              placeholder={
                uiLang === "en"
                  ? "Full-Stack Engineer & ..."
                  : "Engineer Full-Stack & ..."
              }
            />
          </div>

          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Short Introduction" : "Intro Singkat"} (${contentLang.toUpperCase()})`}
            />
            <textarea
              className="input-cyber"
              rows={3}
              value={loc(values, "short_intro", contentLang)}
              onChange={(e) =>
                handleLocChange("short_intro", contentLang, e.target.value)
              }
            />
          </div>

          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Availability Badge Text" : "Teks Badge Ketersediaan"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={loc(values, "availability_badge", contentLang)}
              onChange={(e) =>
                handleLocChange(
                  "availability_badge",
                  contentLang,
                  e.target.value,
                )
              }
              placeholder={
                uiLang === "en"
                  ? "Available for selected work"
                  : "Tersedia untuk proyek terpilih"
              }
            />
          </div>

          <Toggle
            checked={bool(values, "show_availability_badge")}
            onChange={(v) => handleChange("show_availability_badge", v)}
            label={
              uiLang === "en"
                ? "Show availability badge"
                : "Tampilkan badge ketersediaan"
            }
          />

          <SaveBtn pending={mutation.isPending} lang={uiLang} />
        </FormCard>
      </form>
    </div>
  );
}
