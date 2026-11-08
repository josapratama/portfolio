import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useLanguageStore } from "@/store/languageStore";
import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { getText } from "@/types";

const DEFAULT_NAV = [
  {
    id: "home",
    label: { en: "Home", id: "Beranda", ja: "ホーム" },
    href: "/",
    is_external: false,
  },
  {
    id: "about",
    label: { en: "About", id: "Tentang", ja: "概要" },
    href: "/about",
    is_external: false,
  },
  {
    id: "projects",
    label: { en: "Projects", id: "Proyek", ja: "プロジェクト" },
    href: "/projects",
    is_external: false,
  },
  {
    id: "experience",
    label: { en: "Experience", id: "Pengalaman", ja: "経歴" },
    href: "/experience",
    is_external: false,
  },
  {
    id: "blog",
    label: { en: "Blog", id: "Blog", ja: "ブログ" },
    href: "/blog",
    is_external: false,
  },
  {
    id: "contact",
    label: { en: "Contact", id: "Kontak", ja: "お問い合わせ" },
    href: "/contact",
    is_external: false,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useThemeStore();
  const { lang, setLang } = useLanguageStore();
  const location = useLocation();

  const { data: nav } = useQuery({
    queryKey: ["navigation"],
    queryFn: publicAPI.getNavigation,
    staleTime: 5 * 60 * 1000,
  });
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: publicAPI.getSettings,
    staleTime: 10 * 60 * 1000,
  });
  const { data: sections } = useQuery({
    queryKey: ["sections"],
    queryFn: publicAPI.getSections,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const brandName = settings?.site?.brand_name || "DevPortfolio";
  const enableThemeSwitcher = settings?.theme?.enable_theme_switcher !== false;
  const enableLangSwitcher =
    settings?.language?.enable_language_switcher !== false;
  const showBlog = sections?.["blog_page"] !== false;

  const rawNav = nav && nav.length > 0 ? nav : DEFAULT_NAV;
  const filteredNav = rawNav.filter(
    (item) => !(item.href === "/blog" && !showBlog),
  );

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  const iconBtnStyle: React.CSSProperties = {
    padding: "7px 8px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "var(--color-text-secondary)",
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    fontWeight: 600,
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          background: scrolled ? "var(--color-surface-overlay)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--color-border)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.15)" : "none",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: "0 0 16px rgba(59,130,246,0.4)",
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

            {/* Desktop nav */}
            <nav
              style={{ display: "flex", alignItems: "center", gap: 2 }}
              className="navbar-desktop"
            >
              {filteredNav.map((item) => {
                const active = isActive(item.href);
                const label = getText(item.label, lang);
                return item.is_external ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "6px 13px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--color-text-secondary)",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                    className="navbar-link"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.href}
                    style={{
                      padding: "6px 13px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                      color: active
                        ? "var(--color-accent-bright)"
                        : "var(--color-text-secondary)",
                      textDecoration: "none",
                      background: active
                        ? "rgba(59,130,246,0.1)"
                        : "transparent",
                      transition: "all 0.15s ease",
                    }}
                    className="navbar-link"
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {/* Language toggle */}
              {enableLangSwitcher && (
                <button
                  onClick={() => setLang(lang === "en" ? "id" : (lang === "id" ? "ja" : "en"))}
                  style={iconBtnStyle}
                  className="navbar-icon-btn"
                  title="Switch language"
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {lang.toUpperCase()}
                  </span>
                </button>
              )}

              {/* Theme toggle */}
              {enableThemeSwitcher && (
                <button
                  onClick={toggle}
                  style={iconBtnStyle}
                  className="navbar-icon-btn"
                  title="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setOpen(!open)}
                style={{ ...iconBtnStyle, display: "none" }}
                className="navbar-hamburger"
                aria-label="Toggle menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            background: "var(--color-surface-overlay)",
            backdropFilter: "blur(24px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              height: 64,
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                {brandName[0]}
              </div>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  fontSize: 14,
                }}
              >
                {brandName}
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              style={{ ...iconBtnStyle, padding: 8 }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ flex: 1, padding: "16px 16px 0", overflowY: "auto" }}>
            {filteredNav.map((item) => {
              const active = isActive(item.href);
              const label = getText(item.label, lang);
              return item.is_external ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 16px",
                    borderRadius: 12,
                    marginBottom: 4,
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 16px",
                    borderRadius: 12,
                    marginBottom: 4,
                    fontSize: 15,
                    fontWeight: active ? 700 : 500,
                    color: active
                      ? "var(--color-accent-bright)"
                      : "var(--color-text-secondary)",
                    textDecoration: "none",
                    background: active ? "rgba(59,130,246,0.1)" : "transparent",
                  }}
                >
                  {label}
                  {active && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom controls */}
          <div
            style={{
              padding: "16px 16px 32px",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              {enableLangSwitcher && (
                <button
                  onClick={() => setLang(lang === "en" ? "id" : (lang === "id" ? "ja" : "en"))}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {lang === "en" ? "🇮🇩 ID" : (lang === "id" ? "🇯🇵 JA" : "🇬🇧 EN")}
                </button>
              )}
              {enableThemeSwitcher && (
                <button
                  onClick={toggle}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
