import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  X,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import type { Experience } from "@/types";
import { FieldLabel, Toggle, LangPill, IconBtn, EmptyState } from "./_shared";
import { cardStyle, cardStyleNoOverflow, btnStyle } from "./_styles";

const EMP_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

interface ExpForm {
  org_en: string;
  org_id: string;
  role_en: string;
  role_id: string;
  loc_en: string;
  loc_id: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_visible: boolean;
  desc_en: string;
  desc_id: string;
  achievements: string;
}

const BLANK: ExpForm = {
  org_en: "",
  org_id: "",
  role_en: "",
  role_id: "",
  loc_en: "",
  loc_id: "",
  employment_type: "Full-time",
  start_date: "",
  end_date: "",
  is_current: false,
  is_visible: true,
  desc_en: "",
  desc_id: "",
  achievements: "",
};

function toPayload(f: ExpForm) {
  return {
    organization: { en: f.org_en, id: f.org_id || f.org_en },
    role: { en: f.role_en, id: f.role_id || f.role_en },
    location: { en: f.loc_en, id: f.loc_id || f.loc_en },
    employment_type: f.employment_type,
    start_date: f.start_date,
    end_date: f.is_current ? null : f.end_date || null,
    is_current: f.is_current,
    is_visible: f.is_visible,
    sort_order: 0,
    description: { en: f.desc_en, id: f.desc_id || f.desc_en },
    achievements: f.achievements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

function fromExperience(exp: Experience): ExpForm {
  const ach = Array.isArray(exp.achievements) ? exp.achievements : [];
  return {
    org_en: exp.organization?.en || "",
    org_id: exp.organization?.id || "",
    role_en: exp.role?.en || "",
    role_id: exp.role?.id || "",
    loc_en: exp.location?.en || "",
    loc_id: exp.location?.id || "",
    employment_type: exp.employment_type || "Full-time",
    start_date: exp.start_date ? exp.start_date.slice(0, 10) : "",
    end_date: exp.end_date ? exp.end_date.slice(0, 10) : "",
    is_current: exp.is_current ?? false,
    is_visible: exp.is_visible ?? true,
    desc_en: exp.description?.en || "",
    desc_id: exp.description?.id || "",
    achievements: ach.join("\n"),
  };
}

// ── Sub-component ──────────────────────────────────────────────────────────────
function ExperienceForm({
  form,
  setForm,
  editId,
  isPending,
  onSubmit,
  onCancel,
  uiLang,
}: {
  form: ExpForm;
  setForm: React.Dispatch<React.SetStateAction<ExpForm>>;
  editId: string | null;
  isPending: boolean;
  onSubmit: (e: { preventDefault(): void }) => void;
  onCancel: () => void;
  uiLang: string;
}) {
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const set = (key: keyof ExpForm, val: string | boolean) =>
    setForm((p) => ({ ...p, [key]: val }));

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
            ? uiLang === "en"
              ? "Edit Experience"
              : "Edit Pengalaman"
            : uiLang === "en"
              ? "New Experience"
              : "Pengalaman Baru"}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LangPill lang={contentLang} setLang={setContentLang} />
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
            <FieldLabel
              text={`${uiLang === "en" ? "Organization" : "Organisasi"} (${contentLang.toUpperCase()}) *`}
            />
            <input
              className="input-cyber"
              value={contentLang === "en" ? form.org_en : form.org_id}
              onChange={(e) =>
                set(contentLang === "en" ? "org_en" : "org_id", e.target.value)
              }
              placeholder={
                uiLang === "en" ? "Company / Organization" : "Perusahaan"
              }
              required={contentLang === "en"}
            />
          </div>
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Role" : "Jabatan"} (${contentLang.toUpperCase()}) *`}
            />
            <input
              className="input-cyber"
              value={contentLang === "en" ? form.role_en : form.role_id}
              onChange={(e) =>
                set(
                  contentLang === "en" ? "role_en" : "role_id",
                  e.target.value,
                )
              }
              placeholder="Senior Engineer"
              required={contentLang === "en"}
            />
          </div>
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Location" : "Lokasi"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={contentLang === "en" ? form.loc_en : form.loc_id}
              onChange={(e) =>
                set(contentLang === "en" ? "loc_en" : "loc_id", e.target.value)
              }
              placeholder="Jakarta, Indonesia"
            />
          </div>
          <div>
            <FieldLabel
              text={uiLang === "en" ? "Employment Type" : "Tipe Pekerjaan"}
            />
            <select
              className="input-cyber"
              value={form.employment_type}
              onChange={(e) => set("employment_type", e.target.value)}
              style={{ cursor: "pointer" }}
            >
              {EMP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Start Date" : "Tanggal Mulai"} *`}
            />
            <input
              className="input-cyber"
              type="date"
              value={form.start_date}
              onChange={(e) => set("start_date", e.target.value)}
              required
            />
          </div>
          <div>
            <FieldLabel
              text={uiLang === "en" ? "End Date" : "Tanggal Selesai"}
            />
            <input
              className="input-cyber"
              type="date"
              value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
              disabled={form.is_current}
              style={{ opacity: form.is_current ? 0.5 : 1 }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 16,
          }}
        >
          <Toggle
            checked={form.is_current}
            onChange={(v) => set("is_current", v)}
            label={
              uiLang === "en"
                ? "Currently working here"
                : "Masih bekerja di sini"
            }
          />
          <Toggle
            checked={form.is_visible}
            onChange={(v) => set("is_visible", v)}
            label={
              uiLang === "en"
                ? "Visible on public site"
                : "Tampil di situs publik"
            }
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FieldLabel
            text={`${uiLang === "en" ? "Description" : "Deskripsi"} (${contentLang.toUpperCase()})`}
          />
          <textarea
            className="input-cyber"
            rows={3}
            style={{ resize: "vertical" }}
            value={contentLang === "en" ? form.desc_en : form.desc_id}
            onChange={(e) =>
              set(contentLang === "en" ? "desc_en" : "desc_id", e.target.value)
            }
            placeholder={
              uiLang === "en"
                ? "Describe your role..."
                : "Deskripsikan peran Anda..."
            }
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <FieldLabel
            text={
              uiLang === "en"
                ? "Achievements (one per line)"
                : "Pencapaian (satu per baris)"
            }
          />
          <textarea
            className="input-cyber"
            rows={4}
            style={{
              resize: "vertical",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
            value={form.achievements}
            onChange={(e) => set("achievements", e.target.value)}
            placeholder={
              uiLang === "en"
                ? "Reduced API latency by 60%\nMentored 3 junior engineers"
                : "Mengurangi latensi API 60%\nMembimbing 3 junior engineer"
            }
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
              ? uiLang === "en"
                ? "Saving..."
                : "Menyimpan..."
              : editId
                ? uiLang === "en"
                  ? "Update"
                  : "Perbarui"
                : uiLang === "en"
                  ? "Add Experience"
                  : "Tambah Pengalaman"}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            {uiLang === "en" ? "Cancel" : "Batal"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ExperienceManagerPage() {
  const qc = useQueryClient();
  const { lang: uiLang } = useLanguageStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ExpForm>(BLANK);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["admin-experiences"],
    queryFn: () => adminAPI.getExperiences() as Promise<Experience[]>,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-experiences"] });
    qc.invalidateQueries({ queryKey: ["experiences"] });
  };

  const createExp = useMutation({
    mutationFn: (data: object) => adminAPI.createExperience(data),
    onSuccess: () => {
      invalidate();
      toast.success(
        uiLang === "en" ? "Experience added" : "Pengalaman ditambahkan",
      );
      setForm(BLANK);
      setShowForm(false);
    },
    onError: () =>
      toast.error(uiLang === "en" ? "Failed to add" : "Gagal menambahkan"),
  });
  const updateExp = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) =>
      adminAPI.updateExperience(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(uiLang === "en" ? "Updated" : "Diperbarui");
      setEditId(null);
      setShowForm(false);
    },
    onError: () =>
      toast.error(uiLang === "en" ? "Failed to update" : "Gagal memperbarui"),
  });
  const deleteExp = useMutation({
    mutationFn: (id: string) => adminAPI.deleteExperience(id),
    onSuccess: () => {
      invalidate();
      toast.success(uiLang === "en" ? "Deleted" : "Dihapus");
    },
  });

  const toggleVisible = (exp: Experience) => {
    adminAPI
      .updateExperience(exp.id, {
        ...toPayload(fromExperience(exp)),
        is_visible: !exp.is_visible,
      })
      .then(() => invalidate())
      .catch(() => toast.error("Failed"));
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!form.org_en || !form.role_en || !form.start_date) return;
    const payload = toPayload(form);
    if (editId) updateExp.mutate({ id: editId, data: payload });
    else createExp.mutate(payload);
  };

  const startEdit = (exp: Experience) => {
    setForm(fromExperience(exp));
    setEditId(exp.id);
    setShowForm(true);
    setExpandedId(null);
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
            style={{ height: 80, borderRadius: 12 }}
          />
        ))}
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {uiLang === "en" ? "Experience Manager" : "Manajer Pengalaman"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Manage your work history and career timeline"
              : "Kelola riwayat kerja dan timeline karier Anda"}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              cancelForm();
              setShowForm(true);
            }}
            className="btn-primary"
            style={{ gap: 6 }}
          >
            <Plus size={15} />
            {uiLang === "en" ? "Add Experience" : "Tambah Pengalaman"}
          </button>
        )}
      </div>

      {showForm && (
        <ExperienceForm
          form={form}
          setForm={setForm}
          editId={editId}
          isPending={createExp.isPending || updateExp.isPending}
          onSubmit={handleSubmit}
          onCancel={cancelForm}
          uiLang={uiLang}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(experiences || []).length === 0 ? (
          <EmptyState
            icon={<Briefcase size={20} />}
            message={
              uiLang === "en" ? "No experiences yet." : "Belum ada pengalaman."
            }
          />
        ) : (
          (experiences || []).map((exp) => (
            <div
              key={exp.id}
              style={{ ...cardStyle, opacity: exp.is_visible ? 1 : 0.6 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-accent)",
                  }}
                >
                  <Briefcase size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {exp.role?.en}
                    </span>
                    {exp.is_current && (
                      <span
                        className="status-badge"
                        style={{ fontSize: 10, padding: "2px 8px" }}
                      >
                        {uiLang === "en" ? "Current" : "Sekarang"}
                      </span>
                    )}
                    {!exp.is_visible && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "rgba(148,163,184,0.1)",
                          color: "var(--color-text-muted)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {uiLang === "en" ? "Hidden" : "Tersembunyi"}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-accent-bright)",
                      fontWeight: 500,
                    }}
                  >
                    {exp.organization?.en}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {exp.start_date?.slice(0, 7)} —{" "}
                    {exp.is_current
                      ? uiLang === "en"
                        ? "Present"
                        : "Sekarang"
                      : exp.end_date?.slice(0, 7)}
                    {exp.location?.en ? ` · ${exp.location.en}` : ""}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleVisible(exp)}
                    title={
                      exp.is_visible
                        ? uiLang === "en"
                          ? "Hide"
                          : "Sembunyikan"
                        : uiLang === "en"
                          ? "Show"
                          : "Tampilkan"
                    }
                    style={{
                      ...btnStyle,
                      color: exp.is_visible
                        ? "var(--color-accent-bright)"
                        : "var(--color-text-muted)",
                      borderColor: exp.is_visible
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color =
                        "var(--color-accent-bright)";
                      e.currentTarget.style.borderColor = "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = exp.is_visible
                        ? "var(--color-accent-bright)"
                        : "var(--color-text-muted)";
                      e.currentTarget.style.borderColor = exp.is_visible
                        ? "var(--color-accent)"
                        : "var(--color-border)";
                    }}
                  >
                    {exp.is_visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <IconBtn
                    onClick={() =>
                      setExpandedId((id) => (id === exp.id ? null : exp.id))
                    }
                  >
                    {expandedId === exp.id ? (
                      <ChevronUp size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    )}
                  </IconBtn>
                  <IconBtn onClick={() => startEdit(exp)}>
                    <Pencil size={13} />
                  </IconBtn>
                  <IconBtn
                    variant="danger"
                    onClick={() => {
                      if (
                        confirm(
                          uiLang === "en"
                            ? "Delete this experience?"
                            : "Hapus pengalaman ini?",
                        )
                      )
                        deleteExp.mutate(exp.id);
                    }}
                  >
                    <Trash2 size={13} />
                  </IconBtn>
                </div>
              </div>
              {expandedId === exp.id && (
                <div
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    padding: "14px 18px",
                    background: "rgba(59,130,246,0.02)",
                  }}
                >
                  {exp.description?.en && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.7,
                        marginBottom: 10,
                      }}
                    >
                      {exp.description.en}
                    </p>
                  )}
                  {Array.isArray(exp.achievements) &&
                    exp.achievements.length > 0 && (
                      <ul
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {exp.achievements.map((a, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                              fontSize: 12,
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            <span
                              style={{
                                color: "var(--color-accent)",
                                marginTop: 1,
                                flexShrink: 0,
                              }}
                            >
                              ▹
                            </span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                  {!exp.description?.en &&
                    (!Array.isArray(exp.achievements) ||
                      exp.achievements.length === 0) && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--color-text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        {uiLang === "en"
                          ? "No details added yet."
                          : "Belum ada detail."}
                      </p>
                    )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
