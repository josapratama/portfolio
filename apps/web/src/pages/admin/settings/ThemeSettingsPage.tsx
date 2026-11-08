import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { SettingsForm } from "./_shared";

export default function ThemeSettingsPage() {
  const { lang } = useLanguageStore();
  return (
    <SettingsForm
      title={lang === "en" ? "Theme Settings" : "Pengaturan Tema"}
      subtitle={
        lang === "en"
          ? "Control theme and accent colors"
          : "Kontrol tema dan warna aksen"
      }
      queryKey={["admin-theme-settings"]}
      queryFn={adminAPI.getThemeSettings}
      mutateFn={(data) => adminAPI.updateThemeSettings(data)}
      fields={[
        {
          key: "enable_theme_switcher",
          label:
            lang === "en"
              ? "Enable Theme Switcher on Public Site"
              : "Aktifkan Pemilih Tema di Situs Publik",
          type: "toggle",
        },
        {
          key: "default_theme",
          label: lang === "en" ? "Default Theme" : "Tema Default",
          type: "select",
          options: [
            { value: "dark", label: lang === "en" ? "Dark" : "Gelap (Dark)" },
            {
              value: "light",
              label: lang === "en" ? "Light" : "Terang (Light)",
            },
          ],
        },
        {
          key: "accent_preset",
          label: lang === "en" ? "Accent Color Preset" : "Preset Warna Aksen",
          type: "select",
          options: [
            {
              value: "blue",
              label: lang === "en" ? "Blue (Cyber)" : "Biru (Cyber)",
            },
            { value: "indigo", label: "Indigo" },
            { value: "cyan", label: "Cyan" },
          ],
        },
      ]}
    />
  );
}
