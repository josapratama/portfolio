import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { adminAPI } from "@/api/admin";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken, setAdmin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    if (errorParam || errorDesc) {
      setError(errorDesc || errorParam || "Otorisasi SSO AuthHub dibatalkan.");
      setIsProcessing(false);
      return;
    }

    if (!code) {
      setError("Parameter 'code' otorisasi tidak ditemukan.");
      setIsProcessing(false);
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback`;

    adminAPI
      .authHubCallback(code, redirectUri)
      .then((res) => {
        const data = res.data.data;
        if (data && data.access_token) {
          setAccessToken(data.access_token);
          setAdmin(data.admin);
          // Clean history and navigate to admin dashboard
          window.history.replaceState({}, document.title, "/admin");
          navigate("/admin", { replace: true });
        } else {
          throw new Error("Token otorisasi tidak valid");
        }
      })
      .catch((err) => {
        const serverError =
          err?.response?.data?.error ||
          err?.message ||
          "Gagal verifikasi login SSO AuthHub.";
        setError(serverError);
        setIsProcessing(false);
      });
  }, [searchParams, navigate, setAccessToken, setAdmin]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background, #090d16)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--color-surface-card, #0f172a)",
          border: "1px solid var(--color-border, #1e293b)",
          borderRadius: 24,
          padding: "36px 28px",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        {isProcessing ? (
          <div>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                margin: "0 auto 20px",
                boxShadow: "0 0 32px rgba(59,130,246,0.35)",
              }}
            >
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "white",
                marginBottom: 8,
              }}
            >
              Memverifikasi Akun AuthHub...
            </h2>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
              Menghubungkan ke pusat identitas SSO dan memvalidasi hak akses
              administrator Anda.
            </p>
          </div>
        ) : error ? (
          <div>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f87171",
                margin: "0 auto 20px",
              }}
            >
              <AlertCircle size={32} />
            </div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#f87171",
                marginBottom: 10,
              }}
            >
              Autentikasi SSO Ditolak
            </h2>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#fca5a5",
                fontSize: 13,
                lineHeight: 1.5,
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              {error}
            </div>
            <button
              onClick={() => navigate("/admin/login")}
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              Kembali ke Halaman Login
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
