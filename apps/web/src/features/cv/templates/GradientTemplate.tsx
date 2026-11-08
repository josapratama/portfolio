import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { CVData, CVPageSize } from "../types";

// react-pdf doesn't support CSS gradients, so we simulate with layered colored blocks
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: "#ffffff",
    padding: 0,
  },
  headerBg: { backgroundColor: "#4f46e5", padding: "24 36 20 36" },
  headerAccent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 120,
    height: "100%",
    backgroundColor: "#7c3aed",
    opacity: 0.4,
  },
  headerInner: { flexDirection: "row", alignItems: "center", gap: 18 },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    border: "2 solid #c4b5fd",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 21,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 3,
  },
  title: { fontSize: 10, color: "#c4b5fd", marginBottom: 6 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaItem: { fontSize: 7.5, color: "#e0e7ff" },
  body: { flexDirection: "row", flex: 1 },
  sidebar: {
    width: 168,
    backgroundColor: "#f5f3ff",
    padding: "18 14",
    borderRight: "1 solid #ede9fe",
  },
  main: { flex: 1, padding: "18 26" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#4f46e5",
    borderBottom: "1.5 solid #4f46e5",
    paddingBottom: 3,
    marginBottom: 9,
  },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#1e1b4b", lineHeight: 1.6 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#1e1b4b" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expPeriod: { fontSize: 7.5, color: "#6d28d9" },
  expCo: { fontSize: 8.5, color: "#4f46e5", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#374151", lineHeight: 1.55 },
  expItem: { marginBottom: 11 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#3730a3",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e1b4b" },
  eduSch: { fontSize: 8, color: "#4f46e5", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#9ca3af", marginBottom: 2 },
  eduItem: { marginBottom: 9 },
});

export function GradientTemplate({
  cv,
  size,
}: {
  cv: CVData;
  size: CVPageSize;
}) {
  return (
    <Document title={cv.name ? `${cv.name} — CV` : "CV"}>
      <Page size={size} style={s.page}>
        <View style={s.headerBg}>
          <View style={s.headerInner}>
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
              </View>
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
