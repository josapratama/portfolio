import { Link } from "react-router-dom";
import { useLanguageStore } from "@/store/languageStore";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  const { lang } = useLanguageStore();
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      <div
        className="animate-fade-in"
        style={{ textAlign: "center", maxWidth: 480 }}
      >
        {/* 404 number */}
        <div
          style={{
            fontSize: "clamp(6rem, 20vw, 10rem)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            background: "linear-gradient(135deg, #60a5fa, #3b82f6, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 8,
            userSelect: "none",
            filter: "drop-shadow(0 0 40px rgba(59,130,246,0.3))",
          }}
        >
          404
        </div>

        {/* Divider line */}
        <div
          style={{
            height: 1,
            width: 80,
            margin: "0 auto 24px",
            background:
              "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}
        >
          {lang === "en" ? "Page Not Found" : "Halaman Tidak Ditemukan"}
        </h1>
        <p
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          {lang === "en"
            ? "The page you're looking for doesn't exist or has been moved."
            : "Halaman yang Anda cari tidak ada atau telah dipindahkan."}
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" className="btn-primary">
            <Home size={15} /> {lang === "en" ? "Go Home" : "Beranda"}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            <ArrowLeft size={15} /> {lang === "en" ? "Go Back" : "Kembali"}
          </button>
        </div>
      </div>
    </div>
  );
}
