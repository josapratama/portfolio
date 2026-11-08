import { useState, useEffect } from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useLanguageStore } from "@/store/languageStore";
import { adminAPI } from "@/api/admin";
import { BASE_URL } from "@/api/client";
import axios from "axios";
import {
  LayoutDashboard,
  Settings,
  Globe,
  Palette,
  Navigation,
  Eye,
  Zap,
  User,
  Code2,
  Link2,
  FolderOpen,
  Briefcase,
  BookOpen,
  Mail,
  Inbox,
  FileDown,
  Search,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";

interface NavEntry {
  to: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}
interface NavSection {
  group: string;
  items: NavEntry[];
}

const NAV: NavSection[] = [
  {
    group: "Overview",
    items: [
      {
        to: "/admin",
        label: "Dashboard",
        icon: <LayoutDashboard size={16} />,
        exact: true,
      },
    ],
  },
  {
    group: "Content",
    items: [
      { to: "/admin/hero", label: "Hero", icon: <Zap size={16} /> },
      { to: "/admin/about", label: "About", icon: <User size={16} /> },
      { to: "/admin/skills", label: "Skills", icon: <Code2 size={16} /> },
      {
        to: "/admin/social-links",
        label: "Social Links",
        icon: <Link2 size={16} />,
      },
      {
        to: "/admin/projects",
        label: "Projects",
        icon: <FolderOpen size={16} />,
      },
      {
        to: "/admin/experience",
        label: "Experience",
        icon: <Briefcase size={16} />,
      },
      { to: "/admin/blog", label: "Blog", icon: <BookOpen size={16} /> },
    ],
  },
  {
    group: "Site",
    items: [
      {
        to: "/admin/sections",
        label: "Section Visibility",
        icon: <Eye size={16} />,
      },
      {
        to: "/admin/navigation",
        label: "Navigation",
        icon: <Navigation size={16} />,
      },
      {
        to: "/admin/resume",
        label: "Resume / CV",
        icon: <FileDown size={16} />,
      },
    ],
  },
  {
    group: "Settings",
    items: [
      {
        to: "/admin/settings/site",
        label: "Site Settings",
        icon: <Settings size={16} />,
      },
      {
        to: "/admin/settings/theme",
        label: "Theme",
        icon: <Palette size={16} />,
      },
      {
        to: "/admin/settings/language",
        label: "Language",
        icon: <Globe size={16} />,
      },
      { to: "/admin/settings/seo", label: "SEO", icon: <Search size={16} /> },
    ],
  },
  {
    group: "Contact",
    items: [
      {
        to: "/admin/contact/settings",
        label: "Contact Settings",
        icon: <Mail size={16} />,
      },
      {
        to: "/admin/contact/submissions",
        label: "Submissions",
        icon: <Inbox size={16} />,
      },
    ],
  },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { admin, logout } = useAuthStore();
  const { lang } = useLanguageStore();
  const navigate = useNavigate();

  const NAV_LABELS: Record<string, string> = {
    Overview: lang === "en" ? "Overview" : "Ringkasan",
    Content: lang === "en" ? "Content" : "Konten",
    Site: lang === "en" ? "Site" : "Situs",
    Settings: lang === "en" ? "Settings" : "Pengaturan",
    Contact: lang === "en" ? "Contact" : "Kontak",
  };

  const handleLogout = async () => {
    try {
      await adminAPI.logout();
    } catch (_) {
      // logout regardless of API error
    }
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-sidebar">
      {/* Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 56,
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 13,
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(59,130,246,0.3)",
            }}
          >
            A
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "var(--color-text-primary)",
            }}
          >
            Admin Panel
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: 4,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "4px 10px 12px" }}>
        {NAV.map((section, idx) => (
          <div key={section.group} style={{ marginTop: idx === 0 ? 10 : 20 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                padding: "0 6px",
                marginBottom: 4,
              }}
            >
              {NAV_LABELS[section.group] || section.group}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--color-accent-bright)",
                flexShrink: 0,
              }}
            >
              {(admin?.name || admin?.email || "A")[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {admin?.name || "Admin"}
              </p>
              {admin?.email && (
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--color-text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {admin.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px",
              borderRadius: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s",
              flexShrink: 0,
            }}
            title="Logout"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-muted)")
            }
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const {
    isAuthenticated,
    isInitialized,
    setAccessToken,
    setAdmin,
    setInitialized,
  } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const { lang, setLang } = useLanguageStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isInitialized) return;
    // Try to restore session via refresh token cookie
    axios
      .post(`${BASE_URL}/api/v1/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const { access_token, admin } = res.data.data;
        setAccessToken(access_token);
        if (admin) setAdmin(admin);
      })
      .catch(() => {
        // No valid session, will redirect to login
      })
      .finally(() => setInitialized());
  }, [isInitialized, setAccessToken, setAdmin, setInitialized]);

  // Still trying to restore session
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--color-background)",
      }}
    >
      {/* Desktop sidebar */}
      <div
        style={{ display: "none", flexShrink: 0, width: 220 }}
        className="admin-sidebar-wrapper"
      >
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 w-64">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            height: 56,
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            flexShrink: 0,
            background: "var(--color-surface)",
            backdropFilter: "blur(12px)",
            gap: 8,
          }}
        >
          {/* Mobile hamburger — only visible on small screens */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: "none",
              padding: 8,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
            }}
            className="topbar-hamburger"
          >
            <Menu size={20} />
          </button>

          {/* Spacer — pushes controls to the right */}
          <div style={{ flex: 1 }} />

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              style={{
                padding: "5px 10px",
                borderRadius: 7,
                border: "1px solid var(--color-border)",
                background: "transparent",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--color-text-secondary)",
                transition: "all 0.15s",
              }}
              title="Switch language"
            >
              {lang === "en" ? "ID" : "EN"}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                padding: "6px 8px",
                borderRadius: 7,
                border: "1px solid var(--color-border)",
                background: "transparent",
                cursor: "pointer",
                color: "var(--color-text-secondary)",
                display: "flex",
                alignItems: "center",
                transition: "all 0.15s",
              }}
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* View site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                border: "1px solid var(--color-border)",
                transition: "all 0.15s",
              }}
            >
              <ExternalLink size={12} />
              {lang === "en" ? "View Site" : "Lihat Situs"}
            </a>
          </div>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "clamp(24px, 3vw, 36px) clamp(20px, 3vw, 32px)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
