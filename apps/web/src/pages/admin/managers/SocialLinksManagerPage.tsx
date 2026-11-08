import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ExternalLink,
  Pencil,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import type { SocialLink } from "@/types";
import { FieldLabel, Toggle, IconBtn, EmptyState } from "./_shared";
import { cardStyle, cardStyleNoOverflow } from "./_styles";

const PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "email",
  "whatsapp",
  "website",
  "youtube",
  "tiktok",
  "other",
];

const PLATFORM_COLORS: Record<string, string> = {
  github: "#6e7681",
  linkedin: "#0a66c2",
  twitter: "#1d9bf0",
  instagram: "#e1306c",
  email: "#ea4335",
  whatsapp: "#25d366",
  youtube: "#ff0000",
  tiktok: "#010101",
  website: "#3b82f6",
  other: "#8b5cf6",
};

interface LinkForm {
  platform: string;
  url: string;
  label: string;
  is_visible: boolean;
  open_in_new_tab: boolean;
}

const BLANK: LinkForm = {
  platform: "github",
  url: "",
  label: "",
  is_visible: true,
  open_in_new_tab: true,
};

// ── Sub-component ──────────────────────────────────────────────────────────────
function SocialLinkForm({
  form,
  setForm,
  editId,
  isPending,
  onSubmit,
  onCancel,
  lang,
}: {
  form: LinkForm;
  setForm: React.Dispatch<React.SetStateAction<LinkForm>>;
  editId: string | null;
  isPending: boolean;
  onSubmit: (e: { preventDefault(): void }) => void;
  onCancel: () => void;
  lang: string;
}) {
  return (
    <div style={{ ...cardStyleNoOverflow, padding: "clamp(20px, 3vw, 28px)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--color-text-primary)",
          }}
        >
          {editId
            ? lang === "en"
              ? "Edit Link"
              : "Edit Link"
            : lang === "en"
              ? "New Social Link"
              : "Link Sosial Baru"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: 6,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            display: "flex",
            alignItems: "center",
            borderRadius: 6,
          }}
        >
          <X size={16} />
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <FieldLabel text="Platform" />
            <select
              className="input-cyber"
              value={form.platform}
              onChange={(e) =>
                setForm((p) => ({ ...p, platform: e.target.value }))
              }
              style={{ cursor: "pointer" }}
            >
              {PLATFORMS.map((pl) => (
                <option key={pl} value={pl}>
                  {pl.charAt(0).toUpperCase() + pl.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel text="Label" />
            <input
              className="input-cyber"
              value={form.label}
              onChange={(e) =>
                setForm((p) => ({ ...p, label: e.target.value }))
              }
              placeholder={lang === "en" ? "e.g. GitHub" : "mis. GitHub"}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <FieldLabel text="URL *" />
            <input
              className="input-cyber"
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://github.com/username"
              required
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <Toggle
            checked={form.is_visible}
            onChange={(v) => setForm((p) => ({ ...p, is_visible: v }))}
            label={lang === "en" ? "Visible on site" : "Tampil di situs"}
          />
          <Toggle
            checked={form.open_in_new_tab}
            onChange={(v) => setForm((p) => ({ ...p, open_in_new_tab: v }))}
            label={lang === "en" ? "Open in new tab" : "Buka di tab baru"}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            paddingTop: 16,
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending
              ? lang === "en"
                ? "Saving..."
                : "Menyimpan..."
              : editId
                ? lang === "en"
                  ? "Update Link"
                  : "Perbarui Link"
                : lang === "en"
                  ? "Add Link"
                  : "Tambah Link"}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            {lang === "en" ? "Cancel" : "Batal"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SocialLinksManagerPage() {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<LinkForm>(BLANK);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: links = [], isLoading } = useQuery<SocialLink[]>({
    queryKey: ["admin-social-links"],
    queryFn: () => adminAPI.getSocialLinks() as Promise<SocialLink[]>,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-social-links"] });
    qc.invalidateQueries({ queryKey: ["social-links"] });
  };

  const createLink = useMutation({
    mutationFn: (data: object) => adminAPI.createSocialLink(data),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Link added" : "Link ditambahkan");
      setForm(BLANK);
      setShowForm(false);
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to add" : "Gagal menambahkan"),
  });
  const updateLink = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) =>
      adminAPI.updateSocialLink(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Link updated" : "Link diperbarui");
      setEditId(null);
      setShowForm(false);
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to update" : "Gagal memperbarui"),
  });
  const deleteLink = useMutation({
    mutationFn: (id: string) => adminAPI.deleteSocialLink(id),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Link deleted" : "Link dihapus");
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to delete" : "Gagal menghapus"),
  });

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!form.url) return;
    const label =
      form.label ||
      form.platform.charAt(0).toUpperCase() + form.platform.slice(1);
    const payload = { ...form, label };
    if (editId) updateLink.mutate({ id: editId, data: payload });
    else createLink.mutate(payload);
  };

  const startEdit = (link: SocialLink) => {
    setForm({
      platform: link.platform,
      url: link.url,
      label: link.label,
      is_visible: link.is_visible ?? true,
      open_in_new_tab: link.open_in_new_tab,
    });
    setEditId(link.id);
    setShowForm(true);
  };
  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(BLANK);
  };

  if (isLoading)
    return (
      <div className="admin-page">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 64, borderRadius: 12 }}
          />
        ))}
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {lang === "en" ? "Social Links" : "Tautan Sosial"}
          </h1>
          <p className="admin-page-subtitle">
            {lang === "en"
              ? "Manage your social media and contact links"
              : "Kelola tautan media sosial dan kontak Anda"}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setForm(BLANK);
              setEditId(null);
              setShowForm(true);
            }}
            className="btn-primary"
            style={{ gap: 6 }}
          >
            <Plus size={15} />
            {lang === "en" ? "Add Link" : "Tambah Link"}
          </button>
        )}
      </div>

      {showForm && (
        <SocialLinkForm
          form={form}
          setForm={setForm}
          editId={editId}
          isPending={createLink.isPending || updateLink.isPending}
          onSubmit={handleSubmit}
          onCancel={cancelForm}
          lang={lang}
        />
      )}

      <div style={cardStyle}>
        {links.length === 0 ? (
          <EmptyState
            icon={<ExternalLink size={20} />}
            message={
              lang === "en"
                ? "No social links yet."
                : "Belum ada tautan sosial."
            }
            action={
              <button
                onClick={() => {
                  setForm(BLANK);
                  setEditId(null);
                  setShowForm(true);
                }}
                className="btn-secondary"
                style={{ fontSize: 13, gap: 6 }}
              >
                <Plus size={14} />
                {lang === "en" ? "Add your first link" : "Tambah link pertama"}
              </button>
            }
          />
        ) : (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto auto",
                gap: 12,
                padding: "10px 20px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-surface-2)",
              }}
            >
              {[
                "Platform / URL",
                lang === "en" ? "Visible" : "Tampil",
                "",
                "",
                "",
              ].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {links.map((link, idx) => {
              const color =
                PLATFORM_COLORS[link.platform.toLowerCase()] || "#8b5cf6";
              const isVis = link.is_visible ?? true;
              return (
                <div
                  key={link.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto auto",
                    gap: 12,
                    padding: "14px 20px",
                    alignItems: "center",
                    borderBottom:
                      idx < links.length - 1
                        ? "1px solid var(--color-border)"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(59,130,246,0.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 11,
                        fontWeight: 800,
                        color,
                        textTransform: "uppercase",
                      }}
                    >
                      {link.platform.slice(0, 2)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          marginBottom: 2,
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
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      background: isVis
                        ? "rgba(34,197,94,0.08)"
                        : "rgba(148,163,184,0.08)",
                      border: `1px solid ${isVis ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)"}`,
                      color: isVis ? "#4ade80" : "var(--color-text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isVis ? <Eye size={10} /> : <EyeOff size={10} />}
                    {isVis
                      ? lang === "en"
                        ? "Visible"
                        : "Tampil"
                      : lang === "en"
                        ? "Hidden"
                        : "Tersembunyi"}
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: 7,
                      borderRadius: 7,
                      border: "1px solid var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-accent-bright)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-text-muted)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-border)";
                    }}
                  >
                    <ExternalLink size={13} />
                  </a>
                  <IconBtn onClick={() => startEdit(link)}>
                    <Pencil size={13} />
                  </IconBtn>
                  <IconBtn
                    variant="danger"
                    onClick={() => {
                      if (
                        confirm(
                          lang === "en"
                            ? "Delete this link?"
                            : "Hapus link ini?",
                        )
                      )
                        deleteLink.mutate(link.id);
                    }}
                  >
                    <Trash2 size={13} />
                  </IconBtn>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p
        style={{
          fontSize: 12,
          color: "var(--color-text-muted)",
          marginTop: -8,
        }}
      >
        {lang === "en"
          ? "Only visible links appear on the public site."
          : "Hanya link yang terlihat yang muncul di situs publik."}
      </p>
    </div>
  );
}
