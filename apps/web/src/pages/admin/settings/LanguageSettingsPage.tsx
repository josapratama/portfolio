import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { SettingsForm } from "./_shared";

export default function LanguageSettingsPage() {
  const { lang } = useLanguageStore();
  return (
    <SettingsForm
      title={lang === "en" ? "Language Settings" : "Pengaturan Bahasa"}
      subtitle={
        lang === "en"
          ? "Control language switcher and default language"
          : "Kontrol pemilih bahasa dan bahasa default"
      }
      queryKey={["admin-language-settings"]}
      queryFn={adminAPI.getLanguageSettings}
      mutateFn={(data) => adminAPI.updateLanguageSettings(data)}
      fields={[
        {
          key: "enable_language_switcher",
          label:
            lang === "en"
              ? "Enable Language Switcher on Public Site"
              : "Aktifkan Pemilih Bahasa di Situs Publik",
          type: "toggle",
        },
        {
          key: "default_language",
          label: lang === "en" ? "Default Language" : "Bahasa Default",
          type: "select",
          options: [
            { value: "en", label: "English" },
            { value: "id", label: "Indonesia" },
          ],
        },
      ]}
    />
  );
}
