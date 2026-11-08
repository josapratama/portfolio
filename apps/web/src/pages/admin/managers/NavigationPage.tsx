import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Link2,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { FieldLabel, Toggle, IconBtn, EmptyState, ModalShell } from "./_shared";
import { cardStyle } from "./_styles";

interface NavItem {
  id: string;
  label: { en: string; id: string };
  href: string;
  is_external: boolean;
  is_visible: boolean;
  sort_order: number;
}

const BLANK: Partial<NavItem> = {
  label: { en: "", id: "" },
  href: "",
  is_external: false,
  is_visible: true,
  sort_order: 0,
};

// ── Sub-component ──────────────────────────────────────────────────────────────
function NavItemModal({
  editing,
  form,
  setForm,
  isPending,
  onSave,
  onClose,
  lang,
}: {
  editing: string;
  form: Partial<NavItem>;
  setForm: React.Dispatch<React.SetStateAction<Partial<NavItem>>>;
  isPending: boolean;
  onSave: () => void;
  onClose: () => void;
  lang: string;
}) {
  return (
    <ModalShell
      title={
        editing === "new"
          ? lang === "en"
            ? "Add Nav Item"
            : "Tambah Item Nav"
          : lang === "en"
            ? "Edit Nav Item"
            : "Edit Item Nav"
      }
      onClose={onClose}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <FieldLabel text={`${lang === "en" ? "Label" : "Label"} (EN)`} />
          <input
            className="input-cyber"
            value={form.label?.en || ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                label: { en: e.target.value, id: p.label?.id ?? "" },
              }))
            }
            placeholder={lang === "en" ? "e.g. About" : "mis. Tentang"}
          />
        </div>
        <div>
          <FieldLabel text={`${lang === "en" ? "Label" : "Label"} (ID)`} />
          <input
            className="input-cyber"
            value={form.label?.id || ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                label: { en: p.label?.en ?? "", id: e.target.value },
              }))
            }
            placeholder={lang === "en" ? "e.g. Tentang" : "mis. Tentang"}
          />
        </div>
        <div>
          <FieldLabel text="Href" />
          <input
            className="input-cyber"
            value={form.href || ""}
            onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))}
            placeholder="/about"
          />
        </div>
        <div>
          <FieldLabel text={lang === "en" ? "Sort Order" : "Urutan"} />
          <input
            type="number"
            className="input-cyber"
            value={form.sort_order || 0}
            onChange={(e) =>
              setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) }))
            }
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Toggle
            checked={!!form.is_external}
            onChange={(v) => setForm((p) => ({ ...p, is_external: v }))}
            label={lang === "en" ? "External link" : "Tautan eksternal"}
          />
          <Toggle
            checked={!!form.is_visible}
            onChange={(v) => setForm((p) => ({ ...p, is_visible: v }))}
            label={lang === "en" ? "Visible" : "Tampil"}
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
          <button
            onClick={onSave}
            disabled={isPending}
            className="btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
          >
            {isPending
              ? lang === "en"
                ? "Saving..."
                : "Menyimpan..."
              : lang === "en"
                ? "Save"
                : "Simpan"}
          </button>
          <button onClick={onClose} className="btn-secondary">
            {lang === "en" ? "Cancel" : "Batal"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NavigationPage() {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-navigation"],
    queryFn: adminAPI.getNavigation,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<NavItem>>(BLANK);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-navigation"] });
    qc.invalidateQueries({ queryKey: ["navigation"] });
  };

  const createM = useMutation({
    mutationFn: (data: Partial<NavItem>) => adminAPI.createNavItem(data),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Item created" : "Item dibuat");
      setEditing(null);
    },
  });
  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NavItem> }) =>
      adminAPI.updateNavItem(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Updated" : "Diperbarui");
      setEditing(null);
    },
  });
  const deleteM = useMutation({
    mutationFn: adminAPI.deleteNavItem,
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Deleted" : "Dihapus");
    },
  });

  const openCreate = () => {
    setForm(BLANK);
    setEditing("new");
  };
  const openEdit = (item: NavItem) => {
    setForm({ ...item });
    setEditing(item.id);
  };
  const handleSave = () =>
    editing === "new"
      ? createM.mutate(form)
      : updateM.mutate({ id: editing!, data: form });

  if (isLoading)
    return (
      <div className="admin-page">
        <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {lang === "en" ? "Navigation" : "Navigasi"}
          </h1>
          <p className="admin-page-subtitle">
            {lang === "en"
              ? "Manage public site navigation links"
              : "Kelola tautan navigasi situs publik"}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ gap: 6 }}>
          <Plus size={15} />
          {lang === "en" ? "Add Item" : "Tambah Item"}
        </button>
      </div>

      {editing && (
        <NavItemModal
          editing={editing}
          form={form}
          setForm={setForm}
          isPending={createM.isPending || updateM.isPending}
          onSave={handleSave}
          onClose={() => setEditing(null)}
          lang={lang}
        />
      )}

      <div style={cardStyle}>
        {(items as NavItem[]).length === 0 ? (
          <EmptyState
            icon={<Navigation size={20} />}
            message={
              lang === "en" ? "No nav items yet." : "Belum ada item navigasi."
            }
          />
        ) : (
          (items as NavItem[]).map((item, idx, arr) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom:
                  idx < arr.length - 1
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
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: item.is_external
                      ? "rgba(99,102,241,0.1)"
                      : "rgba(59,130,246,0.1)",
                    border: `1px solid ${item.is_external ? "rgba(99,102,241,0.2)" : "rgba(59,130,246,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.is_external ? "#a5b4fc" : "var(--color-accent)",
                    flexShrink: 0,
                  }}
                >
                  {item.is_external ? (
                    <ExternalLink size={14} />
                  ) : (
                    <Link2 size={14} />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: 2,
                    }}
                  >
                    {item.label?.en}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {item.href}
                  </p>
                </div>
                {!item.is_visible && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(148,163,184,0.08)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {lang === "en" ? "Hidden" : "Tersembunyi"}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <IconBtn onClick={() => openEdit(item)}>
                  <Pencil size={13} />
                </IconBtn>
                <IconBtn
                  variant="danger"
                  onClick={() => {
                    if (confirm(lang === "en" ? "Delete?" : "Hapus?"))
                      deleteM.mutate(item.id);
                  }}
                >
                  <Trash2 size={13} />
                </IconBtn>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
