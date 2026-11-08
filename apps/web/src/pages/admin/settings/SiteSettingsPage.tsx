import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { SettingsForm } from "./_shared";

export default function SiteSettingsPage() {
  const { lang } = useLanguageStore();
  return (
    <SettingsForm
      title={lang === "en" ? "Site Settings" : "Pengaturan Situs"}
      subtitle={
        lang === "en"
          ? "Identity and main branding"
          : "Identitas dan branding utama"
      }
      queryKey={["admin-site-settings"]}
      queryFn={adminAPI.getSiteSettings}
      mutateFn={(data) => adminAPI.updateSiteSettings(data)}
      fields={[
        {
          key: "site_name",
          label: lang === "en" ? "Site Name" : "Nama Situs",
          placeholder: "DevPortfolio",
        },
        {
          key: "brand_name",
          label: lang === "en" ? "Brand Name" : "Nama Brand",
          placeholder: "Alex Dev",
        },
        {
          key: "full_name",
          label: lang === "en" ? "Full Name" : "Nama Lengkap",
          placeholder: "Alex Johnson",
        },
        {
          key: "title",
          label: lang === "en" ? "Professional Title" : "Jabatan Profesional",
          placeholder: "Full-Stack Software Engineer",
        },
        {
          key: "contact_email",
          label: lang === "en" ? "Contact Email" : "Email Kontak",
          type: "email",
          placeholder: "hello@alexdev.io",
        },
        {
          key: "location",
          label: lang === "en" ? "Location" : "Lokasi",
          placeholder: "Jakarta, Indonesia",
        },
        {
          key: "availability_status",
          label: lang === "en" ? "Availability Status" : "Status Ketersediaan",
          placeholder: "Available for selected work",
        },
        {
          key: "is_available",
          label:
            lang === "en" ? "Show as Available" : "Tampilkan sebagai Tersedia",
          type: "toggle",
        },
        {
          key: "footer_text",
          label: lang === "en" ? "Footer Text" : "Teks Footer",
          placeholder: "© 2025 Alex Johnson",
        },
        {
          key: "cta_primary_label",
          label: lang === "en" ? "Primary CTA Label" : "Label CTA Utama",
          placeholder: "View My Work",
        },
        {
          key: "cta_secondary_label",
          label: lang === "en" ? "Secondary CTA Label" : "Label CTA Sekunder",
          placeholder: "Get In Touch",
        },
        {
          key: "logo_url",
          label: "Logo URL",
          type: "url",
          placeholder: "https://...",
        },
      ]}
    />
  );
}
