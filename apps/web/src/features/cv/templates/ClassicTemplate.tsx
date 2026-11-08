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
    fontSize: 9,
    backgroundColor: "#ffffff",
    padding: 0,
  },
  header: {
    backgroundColor: "#0f172a",
    padding: "24 36 20 36",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  photo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    border: "2 solid #3b82f6",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 21,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 3,
  },
  title: { fontSize: 10, color: "#93c5fd", marginBottom: 6 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaItem: { fontSize: 7.5, color: "#cbd5e1" },
  body: { flexDirection: "row", flex: 1 },
  sidebar: {
    width: 168,
    backgroundColor: "#f1f5f9",
    padding: "18 14",
    borderRight: "1 solid #e2e8f0",
  },
  main: { flex: 1, padding: "18 26" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#2563eb",
    borderBottom: "1.5 solid #2563eb",
    paddingBottom: 3,
    marginBottom: 9,
  },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#334155", lineHeight: 1.6 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expPeriod: { fontSize: 7.5, color: "#64748b" },
  expCo: { fontSize: 8.5, color: "#2563eb", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#334155", lineHeight: 1.55 },
  expItem: { marginBottom: 11 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#475569",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  eduSch: { fontSize: 8, color: "#2563eb", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#64748b", marginBottom: 2 },
  eduDesc: { fontSize: 7.5, color: "#475569", lineHeight: 1.5 },
  eduItem: { marginBottom: 9 },
});

export function ClassicTemplate({
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
                  style={{ ...s.metaItem, color: "#93c5fd" }}
                >
                  {cv.website}
                </Link>
              ) : null}
            </View>
          </View>
        </View>
        <View style={s.body}>
          <View style={s.sidebar}>
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
                    {e.description ? (
                      <Text style={s.eduDesc}>{e.description}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={s.main}>
            {cv.summary ? (
              <View style={s.secWrap}>
                <Text style={s.secTitle}>Summary</Text>
                <Text style={s.summary}>{cv.summary}</Text>
              </View>
            ) : null}
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
        </View>
      </Page>
    </Document>
  );
}
