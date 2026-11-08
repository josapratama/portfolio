import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Send, Mail, Globe, ExternalLink, Clock } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import type { ContactFormData } from "@/types";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <FaGithub size={18} />,
  linkedin: <FaLinkedin size={18} />,
  twitter: <FaXTwitter size={18} />,
  x: <FaXTwitter size={18} />,
  instagram: <FaInstagram size={18} />,
  email: <Mail size={18} />,
  whatsapp: <FaWhatsapp size={18} />,
  website: <Globe size={18} />,
};

export default function ContactPage() {
  const { lang } = useLanguageStore();
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: contactSettings, isLoading } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: publicAPI.getContactSettings,
  });
  const { data: socialLinks } = useQuery({
    queryKey: ["social-links"],
    queryFn: publicAPI.getSocialLinks,
  });

  const submitMutation = useMutation({
    mutationFn: (data: ContactFormData) => publicAPI.submitContact(data),
    onSuccess: () => setSubmitted(true),
  });

  if (isLoading) return <PageLoadSkeleton />;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    submitMutation.mutate(form);
  };

  const title =
    getText(contactSettings?.section_title, lang) ||
    (lang === "en" ? "Get In Touch" : "Hubungi Saya");
  const subtitle = getText(contactSettings?.section_subtitle, lang);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero header */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "48px 0 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
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
            Contact
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
              marginBottom: 12,
            }}
          >
            {title.includes(" ") ? (
              <>
                {title.split(" ").slice(0, -1).join(" ")}{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {title.split(" ").slice(-1)[0]}
                </span>
              </>
            ) : (
              title
            )}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                color: "var(--color-text-secondary)",
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 64px) 24px",
        }}
      >
        <div className="contact-grid">
          {/* Left: Form */}
          {contactSettings?.enable_contact_form !== false && (
            <div
              style={{
                background: "var(--color-surface-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 20,
                padding: "clamp(24px, 4vw, 40px)",
                backdropFilter: "blur(16px)",
              }}
            >
              {submitted ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4ade80",
                      fontSize: 28,
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      fontSize: 18,
                    }}
                  >
                    {lang === "en" ? "Message Sent!" : "Pesan Terkirim!"}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: 14,
                    }}
                  >
                    {getText(contactSettings?.success_message, lang) ||
                      (lang === "en"
                        ? "I'll get back to you soon."
                        : "Saya akan segera membalas.")}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        marginBottom: 4,
                      }}
                    >
                      {lang === "en" ? "Send a Message" : "Kirim Pesan"}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {lang === "en"
                        ? "Fill in the form below and I'll respond shortly."
                        : "Isi formulir di bawah dan saya akan segera merespons."}
                    </p>
                  </div>

                  <div className="contact-form-row">
                    <div>
                      <label
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--color-text-muted)",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        {lang === "en" ? "Name *" : "Nama *"}
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="input-cyber"
                        placeholder={lang === "en" ? "Your name" : "Nama Anda"}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--color-text-muted)",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="input-cyber"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      {lang === "en" ? "Subject" : "Subjek"}
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="input-cyber"
                      placeholder={
                        lang === "en" ? "What's this about?" : "Tentang apa?"
                      }
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      {lang === "en" ? "Message *" : "Pesan *"}
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-cyber"
                      style={{ resize: "none" }}
                      placeholder={
                        lang === "en"
                          ? "Tell me about your project or idea..."
                          : "Ceritakan proyek atau ide Anda..."
                      }
                    />
                  </div>

                  {submitMutation.isError && (
                    <p style={{ color: "#f87171", fontSize: 13 }}>
                      {getText(contactSettings?.error_message, lang) ||
                        "Something went wrong. Please try again."}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="btn-primary"
                    style={{ justifyContent: "center" }}
                  >
                    {submitMutation.isPending ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: "2px solid white",
                            borderTopColor: "transparent",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />
                        {lang === "en" ? "Sending..." : "Mengirim..."}
                      </span>
                    ) : (
                      <>
                        <Send size={16} />{" "}
                        {lang === "en" ? "Send Message" : "Kirim Pesan"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Right: Info */}
          {contactSettings?.show_social_links !== false && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Social links */}
              <div
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 20,
                  padding: "24px",
                  backdropFilter: "blur(16px)",
                }}
              >
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
                  {lang === "en" ? "Connect With Me" : "Terhubung Dengan Saya"}
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {(socialLinks || []).map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.open_in_new_tab ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-secondary)",
                        textDecoration: "none",
                        transition: "all 0.2s",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "var(--color-accent)";
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--color-accent-bright)";
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "rgba(59,130,246,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--color-text-secondary)";
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "transparent";
                      }}
                    >
                      <span
                        style={{ color: "var(--color-accent)", flexShrink: 0 }}
                      >
                        {PLATFORM_ICONS[link.platform.toLowerCase()] || (
                          <ExternalLink size={16} />
                        )}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "inherit",
                          }}
                        >
                          {link.label}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--color-text-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {link.url.replace("mailto:", "")}
                        </p>
                      </div>
                    </a>
                  ))}
                  {(socialLinks || []).length === 0 && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      {lang === "en" ? "No links yet." : "Belum ada link."}
                    </p>
                  )}
                </div>
              </div>

              {/* Response time */}
              <div
                style={{
                  background: "rgba(59,130,246,0.04)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  borderRadius: 20,
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <Clock size={16} style={{ color: "var(--color-accent)" }} />
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {lang === "en" ? "Response Time" : "Waktu Respons"}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {lang === "en"
                    ? "I typically respond within 24–48 hours. For urgent matters, reach out via email or LinkedIn."
                    : "Saya biasanya merespons dalam 24–48 jam. Untuk hal mendesak, hubungi via email atau LinkedIn."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
