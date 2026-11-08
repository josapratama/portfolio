import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import {
  PageLoadSkeleton,
  EmptyState,
} from "@/components/public/LoadingStates";
import { format } from "date-fns";

export default function BlogPage() {
  const { lang } = useLanguageStore();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: publicAPI.getBlogPosts,
  });
  const { data: sections } = useQuery({
    queryKey: ["sections"],
    queryFn: publicAPI.getSections,
  });

  if (isLoading) return <PageLoadSkeleton />;

  if (sections?.["blog_page"] === false)
    return (
      <div
        style={{ paddingTop: 80, textAlign: "center", padding: "160px 24px" }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: 12,
          }}
        >
          {lang === "en" ? "Blog Unavailable" : "Blog Tidak Tersedia"}
        </h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
          {lang === "en"
            ? "The blog section is currently disabled."
            : "Bagian blog saat ini dinonaktifkan."}
        </p>
      </div>
    );

  const featured = (posts || []).filter((p) => p.is_featured);
  const regular = (posts || []).filter((p) => !p.is_featured);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero header */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "clamp(40px, 6vw, 72px) 0 clamp(32px, 5vw, 56px)",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 12,
            }}
          >
            Writing
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
              marginBottom: 16,
            }}
          >
            {lang === "en" ? (
              <>
                The{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Blog
                </span>
              </>
            ) : (
              <>
                Blog{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Artikel
                </span>
              </>
            )}
          </h1>
          <p
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              color: "var(--color-text-secondary)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {lang === "en"
              ? "Thoughts on software engineering, career, and technology."
              : "Pemikiran tentang rekayasa perangkat lunak, karier, dan teknologi."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 64px) 24px",
        }}
      >
        {(posts || []).length === 0 ? (
          <EmptyState
            message={
              lang === "en" ? "No articles published yet" : "Belum ada artikel"
            }
          />
        ) : (
          <>
            {/* Featured posts */}
            {featured.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: 20,
                  }}
                >
                  {lang === "en" ? "Featured" : "Unggulan"}
                </p>
                <div className="blog-featured-grid">
                  {featured.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      style={{
                        background: "var(--color-surface-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 16,
                        overflow: "hidden",
                        display: "block",
                        textDecoration: "none",
                        backdropFilter: "blur(16px)",
                        transition:
                          "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "var(--color-border-glow)";
                        (e.currentTarget as HTMLAnchorElement).style.transform =
                          "translateY(-3px)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                          "0 12px 40px rgba(59,130,246,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLAnchorElement).style.transform =
                          "translateY(0)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                          "none";
                      }}
                    >
                      {post.cover_image_url && (
                        <div style={{ height: 200, overflow: "hidden" }}>
                          <img
                            src={post.cover_image_url}
                            alt={getText(post.title, lang)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s",
                            }}
                          />
                        </div>
                      )}
                      <div style={{ padding: "20px 20px 18px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginBottom: 10,
                          }}
                        >
                          {post.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="tag"
                              style={{ fontSize: 10 }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <h3
                          style={{
                            fontWeight: 700,
                            fontSize: 16,
                            color: "var(--color-text-primary)",
                            marginBottom: 8,
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {getText(post.title, lang)}
                        </h3>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--color-text-secondary)",
                            lineHeight: 1.6,
                            marginBottom: 14,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {getText(post.excerpt, lang)}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {post.published_at && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--color-text-muted)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Calendar size={11} />
                              {format(
                                new Date(post.published_at),
                                "MMM d, yyyy",
                              )}
                            </span>
                          )}
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 12,
                              color: "var(--color-accent-bright)",
                              fontWeight: 600,
                            }}
                          >
                            {lang === "en" ? "Read" : "Baca"}{" "}
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular posts */}
            {regular.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: 20,
                  }}
                >
                  {lang === "en" ? "All Articles" : "Semua Artikel"}
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {regular.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      style={{
                        background: "var(--color-surface-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 14,
                        padding: "16px 18px",
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                        textDecoration: "none",
                        backdropFilter: "blur(16px)",
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "var(--color-border-glow)";
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "rgba(59,130,246,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "var(--color-border)";
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "var(--color-surface-card)";
                      }}
                    >
                      {post.cover_image_url && (
                        <div
                          style={{
                            width: 72,
                            height: 60,
                            borderRadius: 10,
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={post.cover_image_url}
                            alt={getText(post.title, lang)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 5,
                            marginBottom: 6,
                          }}
                        >
                          {post.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="tag"
                              style={{ fontSize: 10 }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <h3
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "var(--color-text-primary)",
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {getText(post.title, lang)}
                        </h3>
                      </div>
                      {post.published_at && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--color-text-muted)",
                            flexShrink: 0,
                            paddingTop: 2,
                          }}
                        >
                          {format(new Date(post.published_at), "MMM d")}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
