import { useState } from "react";
import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { useAdminForm, str, loc, bool } from "./_helpers";
import { Toggle, FieldLabel, SaveBtn, FormCard, LangPill } from "./_shared";

export default function ContactSettingsPage() {
  const { lang: uiLang } = useLanguageStore();
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin", "contact-settings"],
      () => adminAPI.getContactSettings(),
      (data) => adminAPI.updateContactSettings(data),
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
            {uiLang === "en" ? "Contact Settings" : "Pengaturan Kontak"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Configure your contact section"
              : "Konfigurasi bagian kontak Anda"}
          </p>
        </div>
      </div>

      <form onSubmit={save}>
        <FormCard>
          <div>
            <FieldLabel
              text={uiLang === "en" ? "Contact Email" : "Email Kontak"}
            />
            <input
              className="input-cyber"
              type="email"
              value={str(values, "recipient_email") || str(values, "email")}
              onChange={(e) => {
                handleChange("recipient_email", e.target.value);
                handleChange("email", e.target.value);
              }}
            />
          </div>

          <div>
            <FieldLabel
              text={uiLang === "en" ? "Phone / WhatsApp" : "Telepon / WhatsApp"}
            />
            <input
              className="input-cyber"
              value={str(values, "phone")}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+62..."
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
              text={`${uiLang === "en" ? "Section Heading" : "Judul Bagian"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={loc(values, "section_title", contentLang) || loc(values, "heading", contentLang)}
              onChange={(e) => {
                handleLocChange("section_title", contentLang, e.target.value);
                handleLocChange("heading", contentLang, e.target.value);
              }}
            />
          </div>

          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Subheading" : "Subjudul"} (${contentLang.toUpperCase()})`}
            />
            <textarea
              className="input-cyber"
              rows={3}
              value={loc(values, "section_subtitle", contentLang) || loc(values, "subheading", contentLang)}
              onChange={(e) => {
                handleLocChange("section_subtitle", contentLang, e.target.value);
                handleLocChange("subheading", contentLang, e.target.value);
              }}
            />
          </div>

          <Toggle
            checked={
              values["enable_contact_form"] !== undefined
                ? bool(values, "enable_contact_form")
                : bool(values, "form_enabled")
            }
            onChange={(v) => {
              handleChange("enable_contact_form", v);
              handleChange("form_enabled", v);
            }}
            label={
              uiLang === "en"
                ? "Enable contact form"
                : "Aktifkan formulir kontak"
            }
          />

          <SaveBtn pending={mutation.isPending} lang={uiLang} />
        </FormCard>
      </form>
    </div>
  );
}
