import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { getText } from "@/types";
import { Section, SectionLabel } from "./SectionWrapper";
import type { ContactSettings, SocialLink, Lang } from "@/types";

interface Props {
  contactSettings?: ContactSettings | null;
  socialLinks: SocialLink[];
  contactEmail?: string;
  lang: Lang;
}

export default function ContactCTASection({
  contactSettings,
  socialLinks,
  contactEmail,
  lang,
}: Props) {
  const emailLink = socialLinks.find((l) => l.platform === "email");

  return (
    <Section>
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.06), var(--color-surface-card), rgba(99,102,241,0.06))",
          padding: "clamp(32px, 6vw, 64px) clamp(24px, 5vw, 80px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)",
          }}
        />
        <SectionLabel
          text={lang === "en" ? "Let's Work Together" : "Mari Berkolaborasi"}
        />
        <h2
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 900,
            color: "var(--color-text-primary)",
            marginBottom: 12,
            lineHeight: 1.15,
          }}
        >
          {getText(contactSettings?.section_title, lang) ||
            (lang === "en" ? "Have a project in mind?" : "Punya proyek?")}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--color-text-secondary)",
            maxWidth: 480,
            margin: "0 auto 28px",
            lineHeight: 1.7,
          }}
        >
          {getText(contactSettings?.section_subtitle, lang) ||
            (lang === "en"
              ? "I'm always open to discussing new opportunities."
              : "Saya selalu terbuka untuk peluang baru.")}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <Link to="/contact" className="btn-primary">
            {lang === "en" ? "Send a Message" : "Kirim Pesan"}{" "}
            <ArrowRight size={15} />
          </Link>
          {emailLink && (
            <a href={emailLink.url} className="btn-secondary">
              <Mail size={14} /> {contactEmail || "Email Me"}
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
