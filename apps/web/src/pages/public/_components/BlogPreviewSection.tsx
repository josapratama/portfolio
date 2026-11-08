import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { getText } from "@/types";
import { Section, SectionLabel } from "./SectionWrapper";
import type { BlogPost, Lang } from "@/types";

interface Props {
  posts: BlogPost[];
  lang: Lang;
}

export default function BlogPreviewSection({ posts, lang }: Props) {
  return (
    <Section alt>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <SectionLabel text="Writing" />
          <h2 className="section-title">
            {lang === "en" ? (
              <>
                Latest <span>Articles</span>
              </>
            ) : (
              <>
                <span>Artikel</span> Terbaru
              </>
            )}
          </h2>
        </div>
        <Link
          to="/blog"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--color-accent-bright)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          {lang === "en" ? "All articles" : "Semua artikel"}{" "}
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="card-grid">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="card-glass"
            style={{
              textDecoration: "none",
              display: "block",
              overflow: "hidden",
            }}
          >
            {post.cover_image_url && (
              <div style={{ height: 160, overflow: "hidden" }}>
                <img
                  src={post.cover_image_url}
                  alt={getText(post.title, lang)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                  className="card-img-hover"
                />
              </div>
            )}
            <div style={{ padding: "16px 18px" }}>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                {(Array.isArray(post.tags) ? post.tags : [])
                  .slice(0, 2)
                  .map((tag) => (
                    <span key={tag} className="tag" style={{ fontSize: 11 }}>
                      {tag}
                    </span>
                  ))}
              </div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
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
                  marginBottom: 12,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {getText(post.excerpt, lang)}
              </p>
              {post.published_at && (
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Calendar size={11} />
                  {format(new Date(post.published_at), "MMM d, yyyy")}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
