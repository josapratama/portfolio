import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { FolderOpen, BookOpen, Code2, Inbox, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useLanguageStore } from "@/store/languageStore";

interface DashboardData {
  stats: {
    projects?: number;
    blog_posts?: number;
    skills?: number;
    unread_submissions?: number;
  };
  recent_submissions: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    is_read: boolean;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const { lang } = useLanguageStore();
  const { data: rawData } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminAPI.getDashboard,
  });
  const data = rawData as DashboardData | undefined;
  const stats = data?.stats || {};
  const recentSubs = data?.recent_submissions ?? [];

  const cards = [
    {
      label: lang === "en" ? "Published Projects" : "Proyek Dipublikasi",
      value: stats.projects ?? "—",
      icon: <FolderOpen size={22} />,
      to: "/admin/projects",
    },
    {
      label: lang === "en" ? "Blog Posts" : "Postingan Blog",
      value: stats.blog_posts ?? "—",
      icon: <BookOpen size={22} />,
      to: "/admin/blog",
    },
    {
      label: lang === "en" ? "Skills" : "Keahlian",
      value: stats.skills ?? "—",
      icon: <Code2 size={22} />,
      to: "/admin/skills",
    },
    {
      label: lang === "en" ? "Unread Messages" : "Pesan Belum Dibaca",
      value: stats.unread_submissions ?? "—",
      icon: <Inbox size={22} />,
      to: "/admin/contact/submissions",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-secondary)",
            marginTop: "6px",
          }}
        >
          {lang === "en"
            ? "Overview of your portfolio content"
            : "Ringkasan konten portofolio Anda"}
        </p>
      </div>

      {/* Stats cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            style={{ textDecoration: "none" }}
          >
            <div
              className="card-glass"
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    background: "rgba(59,130,246,0.1)",
                    color: "var(--color-accent-bright)",
                  }}
                >
                  {card.icon}
                </div>
                <TrendingUp
                  size={14}
                  style={{ color: "var(--color-text-muted)" }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "var(--color-text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    marginTop: "6px",
                  }}
                >
                  {card.label}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="card-glass" style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            {lang === "en"
              ? "Recent Contact Submissions"
              : "Pesan Kontak Terbaru"}
          </h2>
          <Link
            to="/admin/contact/submissions"
            style={{
              fontSize: "0.75rem",
              color: "var(--color-accent-bright)",
              textDecoration: "none",
            }}
          >
            {lang === "en" ? "View all" : "Lihat semua"}
          </Link>
        </div>
        {recentSubs.length === 0 ? (
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            {lang === "en" ? "No submissions yet" : "Belum ada pesan"}
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {recentSubs.map((sub) => (
              <div
                key={sub.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    minWidth: 0,
                  }}
                >
                  {!sub.is_read && (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                        marginTop: "6px",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sub.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sub.email} —{" "}
                      {sub.subject ||
                        (lang === "en" ? "(no subject)" : "(tanpa subjek)")}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {format(new Date(sub.created_at), "MMM d")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
