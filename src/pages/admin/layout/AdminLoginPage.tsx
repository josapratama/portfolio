import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { adminAPI } from "@/api/admin";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminLoginPage() {
  const { isAuthenticated, setAccessToken, setAdmin } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDirectLogin, setShowDirectLogin] = useState(false);
  const [authHubUrl, setAuthHubUrl] = useState("https://auth.josapratama.com");
  const [clientId, setClientId] = useState("ah_client_portfolio_8d9e0f");

  useEffect(() => {
    adminAPI
      .getAuthHubConfig()
      .then((cfg) => {
        if (cfg?.authhub_url) setAuthHubUrl(cfg.authhub_url);
        if (cfg?.client_id) setClientId(cfg.client_id);
      })
      .catch(() => {
        // Use default fallback
      });
  }, []);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleAuthHubSSO = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const ssoUrl = `${authHubUrl}/?oauth=1&client_id=${clientId}&client_slug=portfolio&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=portfolio_sso&response_type=code`;
    window.location.href = ssoUrl;
  };

  const handleDirectSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminAPI.login(email, password);
      const { access_token, admin } = res.data.data;
      setAccessToken(access_token);
      setAdmin(admin);
    } catch {
      setError("Email atau password salah. Pastikan menggunakan akun yang valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background, #090d16)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial gradient glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.08)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "10%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.07)",
            filter: "blur(70px)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Icon & Title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              margin: "0 auto 16px",
              boxShadow: "0 0 35px rgba(59,130,246,0.4)",
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--color-text-primary, #f8fafc)",
              marginBottom: 6,
              letterSpacing: "-0.02em",
            }}
          >
            Admin Portfolio Portal
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text-muted, #94a3b8)" }}>
            Autentikasi terpusat ekosistem cloud Josa Pratama
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: "var(--color-surface-card, #0f172a)",
            border: "1px solid var(--color-border, #1e293b)",
            borderRadius: 22,
            padding: "32px 28px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
          }}
        >
          {/* SSO Info Notice */}
          <div
            style={{
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 24,
              fontSize: 12,
              lineHeight: 1.6,
              color: "#93c5fd",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <span>🔐</span>
              <span>Proteksi AuthHub SSO & RBAC</span>
            </div>
            Login dashboard ini hanya menerima <strong>Akun Utama AuthHub</strong> (<code style={{ background: "rgba(0,0,0,0.3)", padding: "1px 4px", borderRadius: 4 }}>josapratama</code>). Pendaftaran publik dinonaktifkan.
          </div>

          {/* Primary SSO Action */}
          <button
            onClick={handleAuthHubSSO}
            type="button"
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.35)",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span>Masuk dengan AuthHub SSO</span>
            <ExternalLink size={16} />
          </button>

          {/* Toggle Direct Login */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              type="button"
              onClick={() => setShowDirectLogin(!showDirectLogin)}
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                fontSize: 12,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{showDirectLogin ? "Sembunyikan Login Manual" : "Login Manual / Darurat"}</span>
              {showDirectLogin ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>

          {showDirectLogin && (
            <form
              onSubmit={handleDirectSubmit}
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#94a3b8",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Email Admin
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={14}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b",
                    }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 38px",
                      borderRadius: 10,
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid #334155",
                      color: "white",
                      fontSize: 13,
                    }}
                    placeholder="admin@josapratama.com"
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#94a3b8",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={14}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b",
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 38px 10px 38px",
                      borderRadius: 10,
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid #334155",
                      color: "white",
                      fontSize: 13,
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    color: "#f87171",
                    fontSize: 12,
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px",
                  borderRadius: 10,
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#cbd5e1",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {loading ? "Memproses..." : "Masuk Manual"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
