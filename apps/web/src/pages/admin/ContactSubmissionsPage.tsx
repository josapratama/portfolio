import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import { Inbox, Archive, Trash2, Mail, X } from "lucide-react";
import { format } from "date-fns";
import { useLanguageStore } from "@/store/languageStore";

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

interface SubmissionsData {
  submissions: Submission[];
}

const cardStyle = {
  background: "var(--color-surface-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  backdropFilter: "blur(16px)",
  overflow: "hidden" as const,
};

export default function ContactSubmissionsPage() {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: () => adminAPI.getSubmissions(),
  });
  const data = rawData as SubmissionsData | undefined;
  const [selected, setSelected] = useState<Submission | null>(null);
  const submissions = data?.submissions ?? [];
  const unread = submissions.filter((s) => !s.is_read && !s.is_archived).length;

  const readM = useMutation({
    mutationFn: adminAPI.markSubmissionRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-submissions"] }),
  });
  const archiveM = useMutation({
    mutationFn: adminAPI.archiveSubmission,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success(lang === "en" ? "Archived" : "Diarsipkan");
      setSelected(null);
    },
  });
  const deleteM = useMutation({
    mutationFn: adminAPI.deleteSubmission,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success(lang === "en" ? "Deleted" : "Dihapus");
      setSelected(null);
    },
  });

  const openSub = (sub: Submission) => {
    setSelected(sub);
    if (!sub.is_read) readM.mutate(sub.id);
  };

  if (isLoading)
    return (
      <div className="admin-page">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 64, borderRadius: 12 }}
          />
        ))}
      </div>
    );

  const active = submissions.filter((s) => !s.is_archived);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {lang === "en" ? "Contact Submissions" : "Pesan Masuk"}
          </h1>
          <p className="admin-page-subtitle">
            {unread > 0
              ? lang === "en"
                ? `${unread} unread message${unread > 1 ? "s" : ""}`
                : `${unread} pesan belum dibaca`
              : lang === "en"
                ? "All messages read"
                : "Semua pesan sudah dibaca"}
          </p>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              ...cardStyle,
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "clamp(20px, 3vw, 32px)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selected.subject ||
                    (lang === "en" ? "(no subject)" : "(tanpa subjek)")}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-accent-bright)",
                    marginTop: 4,
                  }}
                >
                  {selected.name} &lt;{selected.email}&gt;
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    marginTop: 2,
                  }}
                >
                  {format(new Date(selected.created_at), "MMM d, yyyy HH:mm")}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  padding: 6,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 6,
                  flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Message body */}
            <div
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                padding: "16px 18px",
                fontSize: 14,
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                marginBottom: 20,
              }}
            >
              {selected.message}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: 8,
                paddingTop: 16,
                borderTop: "1px solid var(--color-border)",
              }}
            >
              <a
                href={`mailto:${selected.email}`}
                className="btn-primary"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                }}
              >
                <Mail size={14} />
                {lang === "en" ? "Reply" : "Balas"}
              </a>
              <button
                onClick={() => archiveM.mutate(selected.id)}
                disabled={archiveM.isPending}
                className="btn-secondary"
                style={{ gap: 6, fontSize: 13 }}
              >
                <Archive size={14} />
                {lang === "en" ? "Archive" : "Arsip"}
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      lang === "en"
                        ? "Delete this message?"
                        : "Hapus pesan ini?",
                    )
                  )
                    deleteM.mutate(selected.id);
                }}
                disabled={deleteM.isPending}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(248,113,113,0.3)",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#f87171",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(248,113,113,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions list */}
      <div style={cardStyle}>
        {active.length === 0 ? (
          <div
            style={{
              padding: "56px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <Inbox size={20} />
            </div>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
              {lang === "en" ? "No messages yet" : "Belum ada pesan"}
            </p>
          </div>
        ) : (
          active.map((sub, idx) => (
            <div
              key={sub.id}
              onClick={() => openSub(sub)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 20px",
                cursor: "pointer",
                borderBottom:
                  idx < active.length - 1
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
                  alignItems: "flex-start",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                {/* Unread dot */}
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: !sub.is_read
                      ? "var(--color-accent)"
                      : "transparent",
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: !sub.is_read ? 600 : 400,
                      color: !sub.is_read
                        ? "var(--color-text-primary)"
                        : "var(--color-text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sub.name}
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
                    {sub.email}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: 2,
                    }}
                  >
                    {sub.subject ||
                      (lang === "en" ? "(no subject)" : "(tanpa subjek)")}
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {format(new Date(sub.created_at), "MMM d")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
