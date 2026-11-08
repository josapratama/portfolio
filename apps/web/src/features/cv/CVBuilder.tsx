import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { CVDocument } from "@/features/cv";
import type { CVTemplate, CVPageSize } from "@/features/cv";
import {
  Plus,
  Trash2,
  Download,
  Database,
  PenLine,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import type { Experience, SkillCategory } from "@/types";
import type {
  CVData,
  CVExperience,
  CVSkillGroup,
  CVEducation,
} from "@/features/cv";

const BLANK_CV: CVData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  photo_url: "",
  summary: "",
  experiences: [],
  skills: [],
  education: [],
};

function uid() {
  return Math.random().toString(36).slice(2);
}

// ── Shared UI helpers ────────────────────────────────────────────────────────
function FieldLabel({ text }: { text: string }) {
  return (
    <label
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--color-text-muted)",
        display: "block",
        marginBottom: 6,
      }}
    >
      {text}
    </label>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--color-accent-bright)",
        borderBottom: "1px solid var(--color-border)",
        paddingBottom: 8,
        marginBottom: 14,
      }}
    >
      {text}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      className="input-cyber"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      className="input-cyber"
      rows={rows}
      value={value}
      style={{ resize: "vertical" }}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function SourceSelector({
  source,
  setSource,
  lang,
}: {
  source: "db" | "manual";
  setSource: (s: "db" | "manual") => void;
  lang: string;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["db", "manual"] as const).map((s) => {
        const active = source === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => setSource(s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 10,
              border: active
                ? "1px solid var(--color-accent)"
                : "1px solid var(--color-border)",
              background: active
                ? "rgba(59,130,246,0.12)"
                : "var(--color-surface-2)",
              color: active
                ? "var(--color-accent-bright)"
                : "var(--color-text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              transition: "all 0.15s",
            }}
          >
            {s === "db" ? <Database size={14} /> : <PenLine size={14} />}
            {s === "db"
              ? lang === "en"
                ? "From Database"
                : "Dari Database"
              : lang === "en"
                ? "Fill Manually"
                : "Isi Manual"}
          </button>
        );
      })}
    </div>
  );
}

// ── Template selector ────────────────────────────────────────────────────────
const TEMPLATES: {
  id: CVTemplate;
  label: string;
  accent: string;
  bg: string;
}[] = [
  { id: "classic", label: "Classic", accent: "#2563eb", bg: "#0f172a" },
  { id: "minimal", label: "Minimal", accent: "#6b7280", bg: "#f9fafb" },
  { id: "modern", label: "Modern", accent: "#0ea5e9", bg: "#1e293b" },
  { id: "bold", label: "Bold", accent: "#7c3aed", bg: "#7c3aed" },
  { id: "elegant", label: "Elegant", accent: "#a16207", bg: "#fffdf9" },
  { id: "tech", label: "Tech", accent: "#3fb950", bg: "#0d1117" },
  { id: "executive", label: "Executive", accent: "#1e3a5f", bg: "#1e3a5f" },
  { id: "creative", label: "Creative", accent: "#ec4899", bg: "#ec4899" },
  { id: "compact", label: "Compact", accent: "#374151", bg: "#f9fafb" },
  { id: "timeline", label: "Timeline", accent: "#6366f1", bg: "#1e1b4b" },
  { id: "academic", label: "Academic", accent: "#111827", bg: "#ffffff" },
  { id: "nordic", label: "Nordic", accent: "#e2e8f0", bg: "#1a1a2e" },
  { id: "dark", label: "Dark", accent: "#a78bfa", bg: "#09090b" },
  { id: "split", label: "Split", accent: "#0f4c75", bg: "#0f4c75" },
  { id: "corporate", label: "Corporate", accent: "#111827", bg: "#f9fafb" },
  { id: "infographic", label: "Infographic", accent: "#f97316", bg: "#f97316" },
  { id: "pastel", label: "Pastel", accent: "#9333ea", bg: "#fdf4ff" },
  { id: "mono", label: "Mono", accent: "#111827", bg: "#ffffff" },
  { id: "midnight", label: "Midnight", accent: "#38bdf8", bg: "#020617" },
  { id: "gradient", label: "Gradient", accent: "#4f46e5", bg: "#4f46e5" },
];

function TemplateSelector({
  value,
  onChange,
  lang,
}: {
  value: CVTemplate;
  onChange: (t: CVTemplate) => void;
  lang: string;
}) {
  return (
    <div>
      <div
        style={{
          marginBottom: 10,
          fontSize: 13,
          color: "var(--color-text-secondary)",
        }}
      >
        {lang === "en" ? "Choose a template:" : "Pilih template:"}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {TEMPLATES.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 10,
                border: active
                  ? `2px solid ${t.accent}`
                  : "1px solid var(--color-border)",
                background: active ? `${t.accent}18` : "var(--color-surface-2)",
                cursor: "pointer",
                transition: "all 0.15s",
                minWidth: 72,
              }}
            >
              {/* Mini preview swatch */}
              <div
                style={{
                  width: 40,
                  height: 52,
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                  flexShrink: 0,
                }}
              >
                <div style={{ height: 14, background: t.bg }} />
                <div
                  style={{
                    padding: "3px 4px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      height: 2,
                      background: t.accent,
                      borderRadius: 1,
                      width: "70%",
                    }}
                  />
                  <div
                    style={{
                      height: 1.5,
                      background: "#e2e8f0",
                      borderRadius: 1,
                    }}
                  />
                  <div
                    style={{
                      height: 1.5,
                      background: "#e2e8f0",
                      borderRadius: 1,
                      width: "80%",
                    }}
                  />
                  <div
                    style={{
                      height: 1.5,
                      background: "#e2e8f0",
                      borderRadius: 1,
                      width: "60%",
                    }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 400,
                  color: active ? t.accent : "var(--color-text-secondary)",
                }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Page size selector ───────────────────────────────────────────────────────
function PageSizeSelector({
  value,
  onChange,
  lang,
}: {
  value: CVPageSize;
  onChange: (s: CVPageSize) => void;
  lang: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
        {lang === "en" ? "Page size:" : "Ukuran kertas:"}
      </span>
      {(["A4", "LETTER"] as CVPageSize[]).map((s) => {
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              border: active
                ? "1px solid var(--color-accent)"
                : "1px solid var(--color-border)",
              background: active
                ? "rgba(59,130,246,0.12)"
                : "var(--color-surface-2)",
              color: active
                ? "var(--color-accent-bright)"
                : "var(--color-text-secondary)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: active ? 700 : 400,
              transition: "all 0.15s",
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

// ── Preview modal (full-screen overlay with PDFViewer) ───────────────────────
function PreviewModal({
  cv,
  template,
  pageSize,
  onClose,
  lang,
}: {
  cv: CVData;
  template: CVTemplate;
  pageSize: CVPageSize;
  onClose: () => void;
  lang: string;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Modal topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "var(--color-surface-card)",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          {lang === "en" ? "CV Preview" : "Pratinjau CV"}
        </span>
        <button
          onClick={onClose}
          style={{
            padding: 7,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            display: "flex",
            alignItems: "center",
            borderRadius: 6,
          }}
        >
          <X size={18} />
        </button>
      </div>
      {/* PDF viewer fills remaining space */}
      <PDFViewer style={{ flex: 1, width: "100%", border: "none" }}>
        <CVDocument cv={cv} template={template} pageSize={pageSize} />
      </PDFViewer>
    </div>
  );
}

// ── Main CVBuilder ───────────────────────────────────────────────────────────
interface CVBuilderProps {
  initialData?: Partial<CVData>;
  initialTemplate?: CVTemplate;
  initialPageSize?: CVPageSize;
  onSave?: (data: CVData, template: CVTemplate, pageSize: CVPageSize) => void;
  saving?: boolean;
}

export default function CVBuilder({
  initialData,
  initialTemplate = "classic",
  initialPageSize = "A4",
  onSave,
  saving = false,
}: CVBuilderProps) {
  const { lang } = useLanguageStore();
  const [source, setSource] = useState<"db" | "manual">("db");
  const [cv, setCv] = useState<CVData>(() => ({
    ...BLANK_CV,
    ...(initialData ?? {}),
  }));
  const [generating, setGenerating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [template, setTemplate] = useState<CVTemplate>(initialTemplate);
  const [pageSize, setPageSize] = useState<CVPageSize>(initialPageSize);

  // DB queries
  const { data: siteRaw } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: adminAPI.getSiteSettings,
  });
  const { data: aboutRaw } = useQuery({
    queryKey: ["admin-about"],
    queryFn: adminAPI.getAbout,
    staleTime: 0,
  });
  const { data: heroRaw } = useQuery({
    queryKey: ["admin-hero"],
    queryFn: adminAPI.getHero,
    staleTime: 0,
  });
  const { data: expRaw } = useQuery({
    queryKey: ["admin-experiences"],
    queryFn: adminAPI.getExperiences,
  });
  const { data: skillsRaw } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: adminAPI.getSkills,
  });

  const site = siteRaw as Record<string, string> | undefined;
  const about = aboutRaw as Record<string, unknown> | undefined;
  const hero = heroRaw as Record<string, unknown> | undefined;

  const loadFromDB = useCallback(() => {
    const exps = (expRaw as Experience[] | undefined) ?? [];
    const cats = (skillsRaw as SkillCategory[] | undefined) ?? [];
    const bio = about?.short_bio as { en: string; id: string } | undefined;
    // profile_image_url can come from about_content or hero_content
    const profileImg =
      (about?.profile_image_url as string) ||
      (hero?.profile_image_url as string) ||
      "";
    setCv({
      name: site?.full_name ?? "",
      title: site?.title ?? "",
      email: site?.contact_email ?? "",
      phone: "",
      location: site?.location ?? "",
      website: "",
      photo_url: profileImg,
      summary: (lang === "en" ? bio?.en : bio?.id) ?? "",
      experiences: exps.map((e) => ({
        id: e.id,
        role: (lang === "en" ? e.role?.en : e.role?.id) ?? "",
        company:
          (lang === "en" ? e.organization?.en : e.organization?.id) ?? "",
        period: e.is_current
          ? `${e.start_date} \u2013 ${lang === "en" ? "Present" : "Sekarang"}`
          : `${e.start_date} \u2013 ${e.end_date ?? ""}`,
        description:
          (lang === "en" ? e.description?.en : e.description?.id) ?? "",
      })),
      skills: cats.map((cat) => ({
        id: cat.id,
        category: (lang === "en" ? cat.name?.en : cat.name?.id) ?? "",
        items: (cat.skills ?? [])
          .map((s) => (lang === "en" ? s.name?.en : s.name?.id) ?? "")
          .join(", "),
      })),
      education: [],
    });
    setLoaded(true);
  }, [site, about, hero, expRaw, skillsRaw, lang]);

  const set = (key: keyof CVData, val: unknown) =>
    setCv((p) => ({ ...p, [key]: val }));

  const addExp = () =>
    set("experiences", [
      ...cv.experiences,
      { id: uid(), role: "", company: "", period: "", description: "" },
    ]);
  const setExp = (id: string, key: keyof CVExperience, val: string) =>
    set(
      "experiences",
      cv.experiences.map((e) => (e.id === id ? { ...e, [key]: val } : e)),
    );
  const delExp = (id: string) =>
    set(
      "experiences",
      cv.experiences.filter((e) => e.id !== id),
    );

  const addSkill = () =>
    set("skills", [...cv.skills, { id: uid(), category: "", items: "" }]);
  const setSkill = (id: string, key: keyof CVSkillGroup, val: string) =>
    set(
      "skills",
      cv.skills.map((s) => (s.id === id ? { ...s, [key]: val } : s)),
    );
  const delSkill = (id: string) =>
    set(
      "skills",
      cv.skills.filter((s) => s.id !== id),
    );

  const addEdu = () =>
    set("education", [
      ...cv.education,
      { id: uid(), degree: "", school: "", period: "", description: "" },
    ]);
  const setEdu = (id: string, key: keyof CVEducation, val: string) =>
    set(
      "education",
      cv.education.map((e) => (e.id === id ? { ...e, [key]: val } : e)),
    );
  const delEdu = (id: string) =>
    set(
      "education",
      cv.education.filter((e) => e.id !== id),
    );

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const blob = await pdf(
        <CVDocument cv={cv} template={template} pageSize={pageSize} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.name || "cv"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  };

  const cardStyle = {
    background: "var(--color-surface-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 16,
    padding: "clamp(16px, 2.5vw, 22px)",
  };

  const itemCard = {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    padding: "14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  };

  const delBtn = (onClick: () => void) => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          padding: "5px 10px",
          borderRadius: 7,
          border: "1px solid rgba(248,113,113,0.3)",
          background: "transparent",
          cursor: "pointer",
          color: "#f87171",
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12,
        }}
      >
        <Trash2 size={12} />
        {lang === "en" ? "Remove" : "Hapus"}
      </button>
    </div>
  );

  return (
    <>
      {showPreview && (
        <PreviewModal
          cv={cv}
          template={template}
          pageSize={pageSize}
          onClose={() => setShowPreview(false)}
          lang={lang}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Source selector */}
        <div style={cardStyle}>
          <div
            style={{
              marginBottom: 12,
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            {lang === "en"
              ? "Choose data source for your CV:"
              : "Pilih sumber data untuk CV Anda:"}
          </div>
          <SourceSelector
            source={source}
            setSource={(s) => {
              setSource(s);
              setLoaded(false);
            }}
            lang={lang}
          />
          {source === "db" && (
            <button
              type="button"
              onClick={loadFromDB}
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 16px",
                borderRadius: 8,
                border: "1px solid var(--color-accent)",
                background: "rgba(59,130,246,0.1)",
                color: "var(--color-accent-bright)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <RefreshCw size={13} />
              {loaded
                ? lang === "en"
                  ? "Reload from Database"
                  : "Muat Ulang dari Database"
                : lang === "en"
                  ? "Load from Database"
                  : "Muat dari Database"}
            </button>
          )}
        </div>

        {/* Template & page size */}
        <div style={cardStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TemplateSelector
              value={template}
              onChange={setTemplate}
              lang={lang}
            />
            <PageSizeSelector
              value={pageSize}
              onChange={setPageSize}
              lang={lang}
            />
          </div>
        </div>

        {/* Personal Info */}
        <div style={cardStyle}>
          <SectionTitle
            text={lang === "en" ? "Personal Information" : "Informasi Pribadi"}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <FieldLabel text={lang === "en" ? "Full Name" : "Nama Lengkap"} />
              <Input
                value={cv.name}
                onChange={(v) => set("name", v)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <FieldLabel
                text={lang === "en" ? "Professional Title" : "Jabatan"}
              />
              <Input
                value={cv.title}
                onChange={(v) => set("title", v)}
                placeholder="Full-Stack Engineer"
              />
            </div>
            <div>
              <FieldLabel text="Email" />
              <Input
                value={cv.email}
                onChange={(v) => set("email", v)}
                type="email"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <FieldLabel text={lang === "en" ? "Phone" : "Telepon"} />
              <Input
                value={cv.phone}
                onChange={(v) => set("phone", v)}
                placeholder="+62 812 ..."
              />
            </div>
            <div>
              <FieldLabel text={lang === "en" ? "Location" : "Lokasi"} />
              <Input
                value={cv.location}
                onChange={(v) => set("location", v)}
                placeholder="Jakarta, Indonesia"
              />
            </div>
            <div>
              <FieldLabel text="Website / LinkedIn" />
              <Input
                value={cv.website}
                onChange={(v) => set("website", v)}
                placeholder="https://..."
              />
            </div>
            <div>
              <FieldLabel text={lang === "en" ? "Photo URL" : "URL Foto"} />
              <Input
                value={cv.photo_url}
                onChange={(v) => set("photo_url", v)}
                placeholder="https://..."
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <FieldLabel
              text={
                lang === "en" ? "Professional Summary" : "Ringkasan Profesional"
              }
            />
            <Textarea
              value={cv.summary}
              onChange={(v) => set("summary", v)}
              rows={3}
              placeholder={
                lang === "en"
                  ? "Brief professional summary..."
                  : "Ringkasan profesional singkat..."
              }
            />
          </div>
        </div>

        {/* Experience */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <SectionTitle
              text={lang === "en" ? "Work Experience" : "Pengalaman Kerja"}
            />
            <button
              type="button"
              onClick={addExp}
              className="btn-secondary"
              style={{ gap: 6, fontSize: 12 }}
            >
              <Plus size={13} />
              {lang === "en" ? "Add" : "Tambah"}
            </button>
          </div>
          {cv.experiences.length === 0 && (
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {lang === "en"
                ? "No experience entries yet."
                : "Belum ada pengalaman."}
            </p>
          )}
          {cv.experiences.map((exp) => (
            <div key={exp.id} style={{ ...itemCard, marginBottom: 8 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 10,
                }}
              >
                <div>
                  <FieldLabel
                    text={lang === "en" ? "Role / Position" : "Posisi"}
                  />
                  <Input
                    value={exp.role}
                    onChange={(v) => setExp(exp.id, "role", v)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <FieldLabel text={lang === "en" ? "Company" : "Perusahaan"} />
                  <Input
                    value={exp.company}
                    onChange={(v) => setExp(exp.id, "company", v)}
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <FieldLabel text={lang === "en" ? "Period" : "Periode"} />
                  <Input
                    value={exp.period}
                    onChange={(v) => setExp(exp.id, "period", v)}
                    placeholder="Jan 2022 – Present"
                  />
                </div>
              </div>
              <div>
                <FieldLabel
                  text={lang === "en" ? "Description" : "Deskripsi"}
                />
                <Textarea
                  value={exp.description}
                  onChange={(v) => setExp(exp.id, "description", v)}
                  rows={2}
                />
              </div>
              {delBtn(() => delExp(exp.id))}
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <SectionTitle text={lang === "en" ? "Skills" : "Keahlian"} />
            <button
              type="button"
              onClick={addSkill}
              className="btn-secondary"
              style={{ gap: 6, fontSize: 12 }}
            >
              <Plus size={13} />
              {lang === "en" ? "Add Group" : "Tambah Grup"}
            </button>
          </div>
          {cv.skills.length === 0 && (
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {lang === "en"
                ? "No skill groups yet."
                : "Belum ada grup keahlian."}
            </p>
          )}
          {cv.skills.map((sg) => (
            <div key={sg.id} style={{ ...itemCard, marginBottom: 8 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 10,
                }}
              >
                <div>
                  <FieldLabel text={lang === "en" ? "Category" : "Kategori"} />
                  <Input
                    value={sg.category}
                    onChange={(v) => setSkill(sg.id, "category", v)}
                    placeholder="Frontend"
                  />
                </div>
                <div>
                  <FieldLabel
                    text={
                      lang === "en"
                        ? "Skills (comma separated)"
                        : "Keahlian (pisah koma)"
                    }
                  />
                  <Input
                    value={sg.items}
                    onChange={(v) => setSkill(sg.id, "items", v)}
                    placeholder="React, TypeScript, CSS"
                  />
                </div>
              </div>
              {delBtn(() => delSkill(sg.id))}
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <SectionTitle text={lang === "en" ? "Education" : "Pendidikan"} />
            <button
              type="button"
              onClick={addEdu}
              className="btn-secondary"
              style={{ gap: 6, fontSize: 12 }}
            >
              <Plus size={13} />
              {lang === "en" ? "Add" : "Tambah"}
            </button>
          </div>
          {cv.education.length === 0 && (
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {lang === "en"
                ? "No education entries yet."
                : "Belum ada pendidikan."}
            </p>
          )}
          {cv.education.map((edu) => (
            <div key={edu.id} style={{ ...itemCard, marginBottom: 8 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 10,
                }}
              >
                <div>
                  <FieldLabel
                    text={lang === "en" ? "Degree / Major" : "Gelar / Jurusan"}
                  />
                  <Input
                    value={edu.degree}
                    onChange={(v) => setEdu(edu.id, "degree", v)}
                    placeholder="S.Kom / Computer Science"
                  />
                </div>
                <div>
                  <FieldLabel
                    text={
                      lang === "en"
                        ? "School / University"
                        : "Sekolah / Universitas"
                    }
                  />
                  <Input
                    value={edu.school}
                    onChange={(v) => setEdu(edu.id, "school", v)}
                    placeholder="Universitas Indonesia"
                  />
                </div>
                <div>
                  <FieldLabel text={lang === "en" ? "Period" : "Periode"} />
                  <Input
                    value={edu.period}
                    onChange={(v) => setEdu(edu.id, "period", v)}
                    placeholder="2018 – 2022"
                  />
                </div>
              </div>
              <div>
                <FieldLabel
                  text={
                    lang === "en"
                      ? "Description (optional)"
                      : "Deskripsi (opsional)"
                  }
                />
                <Textarea
                  value={edu.description ?? ""}
                  onChange={(v) => setEdu(edu.id, "description", v)}
                  rows={2}
                />
              </div>
              {delBtn(() => delEdu(edu.id))}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="btn-secondary"
            style={{ gap: 8, fontSize: 14, padding: "11px 22px" }}
          >
            <Eye size={15} />
            {lang === "en" ? "Preview PDF" : "Pratinjau PDF"}
          </button>
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(cv, template, pageSize)}
              disabled={saving}
              className="btn-secondary"
              style={{ gap: 8, fontSize: 14, padding: "11px 22px" }}
            >
              {saving
                ? lang === "en"
                  ? "Saving..."
                  : "Menyimpan..."
                : lang === "en"
                  ? "Save to Database"
                  : "Simpan ke Database"}
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            disabled={generating}
            className="btn-primary"
            style={{ gap: 8, fontSize: 14, padding: "11px 22px" }}
          >
            <Download size={15} />
            {generating
              ? lang === "en"
                ? "Generating..."
                : "Membuat..."
              : lang === "en"
                ? "Download PDF"
                : "Unduh PDF"}
          </button>
        </div>
      </div>
    </>
  );
}
