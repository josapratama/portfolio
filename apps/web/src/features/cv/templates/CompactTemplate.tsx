import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
} from "@react-pdf/renderer";
import type { CVData, CVPageSize } from "../types";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8.5,
    backgroundColor: "#ffffff",
    padding: "28 36",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: "1 solid #e5e7eb",
  },
  photo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    border: "1 solid #d1d5db",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  title: { fontSize: 9, color: "#6b7280", marginBottom: 4 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaItem: { fontSize: 7, color: "#9ca3af" },
  twoCol: { flexDirection: "row", gap: 18 },
  left: { flex: 1.6 },
  right: { flex: 1 },
  secTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#374151",
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 2,
    marginBottom: 7,
  },
  secWrap: { marginBottom: 12 },
  summary: { fontSize: 8, color: "#374151", lineHeight: 1.6 },
  expRole: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7, color: "#9ca3af" },
  expCo: { fontSize: 7.5, color: "#6b7280", marginBottom: 2 },
  expDesc: { fontSize: 7.5, color: "#374151", lineHeight: 1.5 },
  expItem: { marginBottom: 9 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    marginBottom: 1,
  },
  skillItems: {
    fontSize: 7,
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 5,
  },
  eduDeg: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#111827" },
  eduSch: { fontSize: 7.5, color: "#6b7280", marginBottom: 1 },
  eduPer: { fontSize: 7, color: "#9ca3af", marginBottom: 2 },
  eduItem: { marginBottom: 7 },
});

export function CompactTemplate({
  cv,
  size,
}: {
  cv: CVData;
  size: CVPageSize;
}) {
  return (
    <Document title={cv.name ? `${cv.name} — CV` : "CV"}>
      <Page size={size} style={s.page}>
        <View style={s.header}>
          {cv.photo_url ? <Image src={cv.photo_url} style={s.photo} /> : null}
          <View style={s.hText}>
            <Text style={s.name}>{cv.name || "Your Name"}</Text>
            {cv.title ? <Text style={s.title}>{cv.title}</Text> : null}
            <View style={s.metaRow}>
              {cv.email ? <Text style={s.metaItem}>{cv.email}</Text> : null}
              {cv.phone ? <Text style={s.metaItem}>· {cv.phone}</Text> : null}
              {cv.location ? (
                <Text style={s.metaItem}>· {cv.location}</Text>
              ) : null}
              {cv.website ? (
                <Link
                  src={cv.website}
                  style={{ ...s.metaItem, color: "#6b7280" }}
                >
                  {cv.website}
                </Link>
              ) : null}
            </View>
          </View>
        </View>
        {cv.summary ? (
          <View style={s.secWrap}>
            <Text style={s.secTitle}>Summary</Text>
            <Text style={s.summary}>{cv.summary}</Text>
          </View>
        ) : null}
        <View style={s.twoCol}>
          <View style={s.left}>
            {cv.experiences.length > 0 && (
              <View style={s.secWrap}>
                <Text style={s.secTitle}>Experience</Text>
                {cv.experiences.map((e) => (
                  <View key={e.id} style={s.expItem}>
                    <View style={s.expRow}>
                      <Text style={s.expRole}>{e.role}</Text>
                      <Text style={s.expPeriod}>{e.period}</Text>
                    </View>
                    <Text style={s.expCo}>{e.company}</Text>
                    {e.description ? (
                      <Text style={s.expDesc}>{e.description}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={s.right}>
            {cv.skills.length > 0 && (
              <View style={s.secWrap}>
                <Text style={s.secTitle}>Skills</Text>
                {cv.skills.map((sg) => (
                  <View key={sg.id}>
                    <Text style={s.skillCat}>{sg.category}</Text>
                    <Text style={s.skillItems}>{sg.items}</Text>
                  </View>
                ))}
              </View>
            )}
            {cv.education.length > 0 && (
              <View style={s.secWrap}>
                <Text style={s.secTitle}>Education</Text>
                {cv.education.map((e) => (
                  <View key={e.id} style={s.eduItem}>
                    <Text style={s.eduDeg}>{e.degree}</Text>
                    <Text style={s.eduSch}>{e.school}</Text>
                    <Text style={s.eduPer}>{e.period}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
