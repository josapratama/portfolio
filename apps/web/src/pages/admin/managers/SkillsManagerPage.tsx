import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { toast } from "sonner";
import { Plus, Trash2, ChevronDown, ChevronUp, Star, X } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import type { SkillCategory, Skill } from "@/types";
import { FieldLabel, Toggle, IconBtn } from "./_shared";
import { cardStyle, cardStyleNoOverflow } from "./_styles";

const LEVELS = ["beginner", "intermediate", "advanced", "expert"];

interface SkillForm {
  name_en: string;
  name_id: string;
  proficiency_level: string;
  is_featured: boolean;
  category_id: string;
}

const BLANK: SkillForm = {
  name_en: "",
  name_id: "",
  proficiency_level: "advanced",
  is_featured: false,
  category_id: "",
};

const parseLocalized = (val: unknown): { en: string; id: string } => {
  if (!val) return { en: "", id: "" };
  if (typeof val === "object" && val !== null)
    return val as { en: string; id: string };
  try {
    return JSON.parse(val as string);
  } catch {
    return { en: String(val), id: String(val) };
  }
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function AddSkillForm({
  form,
  setForm,
  categories,
  isPending,
  onSubmit,
  onCancel,
  lang,
}: {
  form: SkillForm;
  setForm: React.Dispatch<React.SetStateAction<SkillForm>>;
  categories: SkillCategory[];
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
          {lang === "en" ? "New Skill" : "Skill Baru"}
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
            <FieldLabel text={`${lang === "en" ? "Name" : "Nama"} (EN) *`} />
            <input
              className="input-cyber"
              value={form.name_en}
              onChange={(e) =>
                setForm((p) => ({ ...p, name_en: e.target.value }))
              }
              placeholder="React"
              required
            />
          </div>
          <div>
            <FieldLabel text={`${lang === "en" ? "Name" : "Nama"} (ID)`} />
            <input
              className="input-cyber"
              value={form.name_id}
              onChange={(e) =>
                setForm((p) => ({ ...p, name_id: e.target.value }))
              }
              placeholder={
                lang === "en" ? "Same if identical" : "Sama jika identik"
              }
            />
          </div>
          <div>
            <FieldLabel text={`${lang === "en" ? "Category" : "Kategori"} *`} />
            <select
              className="input-cyber"
              value={form.category_id}
              onChange={(e) =>
                setForm((p) => ({ ...p, category_id: e.target.value }))
              }
              required
              style={{ cursor: "pointer" }}
            >
              <option value="">
                {lang === "en" ? "Select category..." : "Pilih kategori..."}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel text="Level" />
            <select
              className="input-cyber"
              value={form.proficiency_level}
              onChange={(e) =>
                setForm((p) => ({ ...p, proficiency_level: e.target.value }))
              }
              style={{ cursor: "pointer" }}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <Toggle
            checked={form.is_featured}
            onChange={(v) => setForm((p) => ({ ...p, is_featured: v }))}
            label={lang === "en" ? "Featured on homepage" : "Tampil di beranda"}
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
              : lang === "en"
                ? "Add Skill"
                : "Tambah Skill"}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            {lang === "en" ? "Cancel" : "Batal"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CategoryCard({
  cat,
  isOpen,
  onToggle,
  onDelete,
  onDeleteSkill,
  onToggleFeatured,
  lang,
}: {
  cat: SkillCategory;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onDeleteSkill: (id: string) => void;
  onToggleFeatured: (id: string, val: boolean) => void;
  lang: string;
}) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          cursor: "pointer",
          background: isOpen ? "rgba(59,130,246,0.04)" : "transparent",
          transition: "background 0.15s",
          borderRadius: isOpen ? "16px 16px 0 0" : 16,
        }}
        onClick={onToggle}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isOpen ? (
            <ChevronUp size={15} style={{ color: "var(--color-text-muted)" }} />
          ) : (
            <ChevronDown
              size={15}
              style={{ color: "var(--color-text-muted)" }}
            />
          )}
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            {cat.name.en}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 999,
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "var(--color-accent-bright)",
            }}
          >
            {(cat.skills ?? []).length}
          </span>
        </div>
        <IconBtn
          variant="danger"
          onClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={13} />
        </IconBtn>
      </div>
      {isOpen && (
        <div style={{ borderTop: "1px solid var(--color-border)" }}>
          {(cat.skills ?? []).length === 0 ? (
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                padding: "16px 18px",
                fontStyle: "italic",
              }}
            >
              {lang === "en"
                ? "No skills in this category"
                : "Belum ada skill di kategori ini"}
            </p>
          ) : (
            (cat.skills ?? []).map((skill: Skill, idx: number) => (
              <div
                key={skill.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 18px",
                  borderBottom:
                    idx < (cat.skills ?? []).length - 1
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
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() =>
                      onToggleFeatured(skill.id, !skill.is_featured)
                    }
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                      color: skill.is_featured
                        ? "#facc15"
                        : "var(--color-text-muted)",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.15s",
                    }}
                    title={
                      lang === "en" ? "Toggle featured" : "Toggle unggulan"
                    }
                  >
                    <Star
                      size={13}
                      fill={skill.is_featured ? "currentColor" : "none"}
                    />
                  </button>
                  <span
                    style={{ fontSize: 13, color: "var(--color-text-primary)" }}
                  >
                    {skill.name.en}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      color: "var(--color-accent-bright)",
                      textTransform: "capitalize",
                    }}
                  >
                    {skill.proficiency_level}
                  </span>
                  <IconBtn
                    variant="danger"
                    onClick={() => onDeleteSkill(skill.id)}
                  >
                    <Trash2 size={12} />
                  </IconBtn>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SkillsManagerPage() {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SkillForm>(BLANK);
  const [newCatName, setNewCatName] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const { data: catsRaw, isLoading } = useQuery({
    queryKey: ["admin-skill-categories"],
    queryFn: () => adminAPI.getSkillCategories() as Promise<SkillCategory[]>,
    staleTime: 30_000,
  });

  const categories: SkillCategory[] = useMemo(
    () =>
      (catsRaw ?? []).map((cat) => ({
        ...cat,
        name: parseLocalized(cat.name),
        skills: (cat.skills ?? []).map((s) => ({
          ...s,
          name: parseLocalized(s.name),
        })),
      })),
    [catsRaw],
  );

  const isOpen = (id: string) => !collapsed[id];
  const toggleOpen = (id: string) =>
    setCollapsed((p) => ({ ...p, [id]: !p[id] }));
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["admin-skill-categories"] });

  const createSkill = useMutation({
    mutationFn: (data: object) => adminAPI.createSkill(data),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Skill added" : "Skill ditambahkan");
      setForm(BLANK);
      setShowForm(false);
    },
    onError: () =>
      toast.error(
        lang === "en" ? "Failed to add skill" : "Gagal menambahkan skill",
      ),
  });
  const deleteSkill = useMutation({
    mutationFn: (id: string) => adminAPI.deleteSkill(id),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Skill deleted" : "Skill dihapus");
    },
  });
  const toggleFeatured = useMutation({
    mutationFn: ({ id, val }: { id: string; val: boolean }) =>
      adminAPI.updateSkill(id, { is_featured: val }),
    onMutate: async ({ id, val }) => {
      await qc.cancelQueries({ queryKey: ["admin-skill-categories"] });
      const prev = qc.getQueryData(["admin-skill-categories"]);
      qc.setQueryData(
        ["admin-skill-categories"],
        (old: SkillCategory[] | undefined) =>
          old?.map((cat) => ({
            ...cat,
            skills: (cat.skills ?? []).map((s) =>
              s.id === id ? { ...s, is_featured: val } : s,
            ),
          })),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin-skill-categories"], ctx.prev);
      toast.error(lang === "en" ? "Update failed" : "Gagal memperbarui");
    },
    onSettled: () => invalidate(),
  });
  const createCategory = useMutation({
    mutationFn: (name: string) =>
      adminAPI.createSkillCategory({ name: { en: name, id: name } }),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Category created" : "Kategori dibuat");
      setNewCatName("");
    },
    onError: () =>
      toast.error(
        lang === "en" ? "Failed to create category" : "Gagal membuat kategori",
      ),
  });
  const deleteCategory = useMutation({
    mutationFn: (id: string) => adminAPI.deleteSkillCategory(id),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Category deleted" : "Kategori dihapus");
    },
  });

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!form.name_en || !form.category_id) return;
    createSkill.mutate({
      name: { en: form.name_en, id: form.name_id || form.name_en },
      proficiency_level: form.proficiency_level,
      is_featured: form.is_featured,
      category_id: form.category_id,
    });
  };
  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (
      categories.some((c) => c.name.en.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error(
        lang === "en" ? "Category already exists" : "Kategori sudah ada",
      );
      return;
    }
    createCategory.mutate(trimmed);
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
            {lang === "en" ? "Skills Manager" : "Manajer Keahlian"}
          </h1>
          <p className="admin-page-subtitle">
            {lang === "en"
              ? "Manage skill categories and individual skills"
              : "Kelola kategori dan keahlian individual"}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            style={{ gap: 6 }}
          >
            <Plus size={15} />
            {lang === "en" ? "Add Skill" : "Tambah Skill"}
          </button>
        )}
      </div>

      {showForm && (
        <AddSkillForm
          form={form}
          setForm={setForm}
          categories={categories}
          isPending={createSkill.isPending}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setForm(BLANK);
          }}
          lang={lang}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {categories.length === 0 ? (
          <div
            style={{
              ...cardStyleNoOverflow,
              padding: "48px 24px",
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontSize: 14,
            }}
          >
            {lang === "en"
              ? "No categories yet. Add one below."
              : "Belum ada kategori. Tambahkan di bawah."}
          </div>
        ) : (
          categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              isOpen={isOpen(cat.id)}
              onToggle={() => toggleOpen(cat.id)}
              onDelete={() => {
                if (
                  confirm(
                    lang === "en"
                      ? "Delete this category and all its skills?"
                      : "Hapus kategori ini beserta semua skillnya?",
                  )
                )
                  deleteCategory.mutate(cat.id);
              }}
              onDeleteSkill={(id) => {
                if (
                  confirm(
                    lang === "en" ? "Delete this skill?" : "Hapus skill ini?",
                  )
                )
                  deleteSkill.mutate(id);
              }}
              onToggleFeatured={(id, val) => toggleFeatured.mutate({ id, val })}
              lang={lang}
            />
          ))
        )}
      </div>

      <div
        style={{ ...cardStyleNoOverflow, padding: "clamp(16px, 2vw, 20px)" }}
      >
        <FieldLabel text={lang === "en" ? "New Category" : "Kategori Baru"} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            className="input-cyber"
            style={{ flex: 1, minWidth: 200 }}
            placeholder={
              lang === "en"
                ? "e.g. Mobile, DevOps..."
                : "mis. Mobile, DevOps..."
            }
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            disabled={createCategory.isPending || !newCatName.trim()}
            className="btn-secondary"
            style={{ gap: 6, flexShrink: 0 }}
          >
            <Plus size={14} />
            {createCategory.isPending
              ? lang === "en"
                ? "Adding..."
                : "Menambahkan..."
              : lang === "en"
                ? "Add Category"
                : "Tambah Kategori"}
          </button>
        </div>
      </div>
    </div>
  );
}
