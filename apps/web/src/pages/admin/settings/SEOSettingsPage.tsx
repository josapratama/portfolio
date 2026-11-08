import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { SettingsForm } from "./_shared";

export default function SEOSettingsPage() {
  const { lang } = useLanguageStore();
  return (
    <SettingsForm
      title={lang === "en" ? "SEO Settings" : "Pengaturan SEO"}
      subtitle={
        lang === "en"
          ? "Meta tags, Open Graph, and Twitter Card"
          : "Meta tags, Open Graph, dan Twitter Card"
      }
      queryKey={["admin-seo-settings"]}
      queryFn={adminAPI.getSEOSettings}
      mutateFn={(data) => adminAPI.updateSEOSettings(data)}
      fields={[
        {
          key: "meta_title",
          label: "Meta Title",
          placeholder: "Alex Johnson — Full-Stack Engineer",
        },
        {
          key: "meta_description",
          label: "Meta Description",
          type: "textarea",
          placeholder: "Portfolio website of Alex Johnson...",
        },
        {
          key: "og_title",
          label: "Open Graph Title",
          placeholder: "Alex Johnson",
        },
        {
          key: "og_description",
          label: "Open Graph Description",
          type: "textarea",
        },
        { key: "og_image_url", label: "OG Image URL", type: "url" },
        {
          key: "twitter_card",
          label: lang === "en" ? "Twitter Card Type" : "Tipe Twitter Card",
          type: "select",
          options: [
            { value: "summary", label: "Summary" },
            { value: "summary_large_image", label: "Summary Large Image" },
          ],
        },
        {
          key: "canonical_url",
          label: "Canonical URL",
          type: "url",
          placeholder: "https://yoursite.com",
        },
      ]}
    />
  );
}
