import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import { Mail, Globe, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <FaGithub size={15} />,
  linkedin: <FaLinkedin size={15} />,
  twitter: <FaXTwitter size={15} />,
  x: <FaXTwitter size={15} />,
  instagram: <FaInstagram size={15} />,
  email: <Mail size={15} />,
  whatsapp: <FaWhatsapp size={15} />,
  website: <Globe size={15} />,
};

export default function Footer() {
  const { lang } = useLanguageStore();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: publicAPI.getSettings,
    staleTime: 10 * 60 * 1000,
  });
  const { data: socialLinks } = useQuery({
    queryKey: ["social-links"],
    queryFn: publicAPI.getSocialLinks,
    staleTime: 10 * 60 * 1000,
  });

  const footerText =
    settings?.site?.footer_text ||
    `© ${new Date().getFullYear()} Alex Johnson. All rights reserved.`;
  const brandName = settings?.site?.brand_name || "DevPortfolio";
  const tagline = settings?.site?.title || "";

  const navLinks = [
    { label: lang === "en" ? "Home" : "Beranda", href: "/" },
    { label: lang === "en" ? "About" : "Tentang", href: "/about" },
    { label: lang === "en" ? "Projects" : "Proyek", href: "/projects" },
    { label: lang === "en" ? "Experience" : "Pengalaman", href: "/experience" },
    { label: "Blog", href: "/blog" },
    { label: lang === "en" ? "Contact" : "Kontak", href: "/contact" },
  ];

  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      {/* subtle glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 384,
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(59,130,246,0.4), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 256,
          height: 96,
          background: "rgba(59,130,246,0.03)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 64px) 24px 32px",
        }}
      >
        <div className="footer-grid">
          {/* Brand */}
          <div style={{ gridColumn: "span 2" }} className="footer-brand">
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 900,
                  fontSize: 14,
                  boxShadow: "0 0 12px rgba(59,130,246,0.3)",
                }}
              >
                {brandName[0]}
              </div>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  fontSize: 15,
                }}
              >
                {brandName}
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              {tagline ||
                (lang === "en"
                  ? "Crafting elegant software with a focus on performance and user experience."
                  : "Membangun perangkat lunak elegan dengan fokus pada performa dan pengalaman pengguna.")}
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(socialLinks || []).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.open_in_new_tab ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  title={link.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-muted)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-accent-bright)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-accent)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(59,130,246,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-text-muted)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-border)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                  }}
                >
                  {PLATFORM_ICONS[link.platform.toLowerCase()] || (
                    <ExternalLink size={14} />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Status / Availability */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 16,
              }}
            >
              {lang === "en" ? "Status" : "Status"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Availability badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: settings?.site?.is_available
                      ? "#4ade80"
                      : "#f87171",
                    boxShadow: settings?.site?.is_available
                      ? "0 0 6px rgba(74,222,128,0.6)"
                      : "0 0 6px rgba(248,113,113,0.6)",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{ fontSize: 13, color: "var(--color-text-secondary)" }}
                >
                  {settings?.site?.availability_status ||
                    (lang === "en"
                      ? "Available for work"
                      : "Tersedia untuk kerja")}
                </span>
              </div>

              {/* Email */}
              {settings?.site?.contact_email && (
                <a
                  href={`mailto:${settings.site.contact_email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-accent-bright)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-text-secondary)")
                  }
                >
                  <Mail
                    size={13}
                    style={{ color: "var(--color-text-muted)", flexShrink: 0 }}
                  />
                  {settings.site.contact_email}
                </a>
              )}

              {/* Location */}
              {settings?.site?.location && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Globe
                    size={13}
                    style={{ color: "var(--color-text-muted)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {settings.site.location}
                  </span>
                </div>
              )}

              {/* CTA */}
              <Link
                to="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-accent-bright)",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.opacity =
                    "0.75")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
                }
              >
                {lang === "en" ? "Get in touch →" : "Hubungi saya →"}
              </Link>
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 16,
              }}
            >
              {lang === "en" ? "Navigation" : "Navigasi"}
            </p>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-accent-bright)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-text-secondary)";
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="cyber-divider" style={{ margin: "32px 0 24px" }} />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            {footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}
