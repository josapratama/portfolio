import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, Tag, BookOpen } from "lucide-react";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguageStore();
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => publicAPI.getBlogPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PageLoadSkeleton />;

  if (isError || !post)
    return (
      <div
        style={{
          paddingTop: 80,
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
          <h2
            style={{
              fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              marginBottom: 8,
            }}
          >
            {lang === "en" ? "Article Not Found" : "Artikel Tidak Ditemukan"}
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            {lang === "en"
              ? "This article may have been removed or doesn't exist."
              : "Artikel ini mungkin telah dihapus atau tidak ada."}
          </p>
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            <ArrowLeft size={14} />
            {lang === "en" ? "Back to Blog" : "Kembali ke Blog"}
          </Link>
        </div>
      </div>
    );

  const content = getText(post.content, lang) || "";
  const excerpt = getText(post.excerpt, lang) || "";
  const title = getText(post.title, lang) || "";
  const readTime = Math.max(
    1,
    Math.ceil((content || excerpt).split(/\s+/).length / 200),
  );

  return (
    <div
      style={{
        paddingTop: 80,
        minHeight: "100vh",
        background: "var(--color-background)",
      }}
    >
      {/* ── Cover image ── */}
      {post.cover_image_url && (
        <div
          style={{
            width: "100%",
            height: "clamp(200px, 35vw, 440px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={post.cover_image_url}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 50%, var(--color-background) 100%)",
            }}
          />
        </div>
      )}

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 32px)",
        }}
      >
        {/* ── Back link ── */}
        <div
          style={{
            paddingTop: post.cover_image_url ? 0 : 40,
            paddingBottom: 24,
          }}
        >
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--color-text-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-accent-bright)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-text-muted)")
            }
          >
            <ArrowLeft size={14} />
            {lang === "en" ? "Back to Blog" : "Kembali ke Blog"}
          </Link>
        </div>

        {/* ── Two-column layout ── */}
        <div className="blog-detail-layout">
          {/* ── Main content ── */}
          <main style={{ minWidth: 0 }}>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 16,
                }}
              >
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      background: "var(--color-accent-glow)",
                      color: "var(--color-accent-bright)",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}
                  >
                    <Tag size={9} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "var(--color-text-primary)",
                marginBottom: 16,
              }}
            >
              {title}
            </h1>

            {/* Excerpt / subtitle */}
            {excerpt && (
              <p
                style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                  paddingBottom: 24,
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {excerpt}
              </p>
            )}

            {/* Article body */}
            <div
              style={{
                background: "var(--color-surface-alt)",
                border: "1px solid var(--color-border)",
                borderRadius: 16,
                padding: "clamp(20px, 4vw, 40px)",
                marginBottom: 40,
              }}
            >
              {content ? (
                <div className="prose-cyber">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <BookOpen
                    size={40}
                    style={{ marginBottom: 12, opacity: 0.4 }}
                  />
                  <p style={{ fontSize: 14 }}>
                    {lang === "en"
                      ? "No content available yet."
                      : "Konten belum tersedia."}
                  </p>
                </div>
              )}
            </div>

            {/* Footer back link */}
            <Link
              to="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 10,
                border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                fontSize: 14,
                marginBottom: 60,
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--color-accent)";
                el.style.color = "var(--color-accent-bright)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--color-border)";
                el.style.color = "var(--color-text-secondary)";
              }}
            >
              <ArrowLeft size={14} />
              {lang === "en" ? "More Articles" : "Artikel Lainnya"}
            </Link>
          </main>

          {/* ── Sidebar ── */}
          <aside>
            <div
              style={{
                position: "sticky",
                top: 100,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Meta card */}
              <div
                style={{
                  background: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: 14,
                  }}
                >
                  {lang === "en" ? "Article Info" : "Info Artikel"}
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {post.published_at && (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "var(--color-accent-glow)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Calendar
                          size={14}
                          style={{ color: "var(--color-accent-bright)" }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            color: "var(--color-text-muted)",
                            marginBottom: 2,
                          }}
                        >
                          {lang === "en" ? "Published" : "Diterbitkan"}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--color-text-primary)",
                            fontWeight: 500,
                          }}
                        >
                          {format(new Date(post.published_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  )}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "var(--color-accent-glow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Clock
                        size={14}
                        style={{ color: "var(--color-accent-bright)" }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--color-text-muted)",
                          marginBottom: 2,
                        }}
                      >
                        {lang === "en" ? "Read time" : "Waktu baca"}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--color-text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {readTime} {lang === "en" ? "min" : "menit"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags card */}
              {post.tags && post.tags.length > 0 && (
                <div
                  style={{
                    background: "var(--color-surface-alt)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                      marginBottom: 12,
                    }}
                  >
                    {lang === "en" ? "Tags" : "Label"}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          background: "var(--color-surface-2)",
                          color: "var(--color-text-secondary)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
