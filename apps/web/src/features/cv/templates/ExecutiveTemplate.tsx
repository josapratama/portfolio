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
  topBar: { height: 5, backgroundColor: "#1e3a5f" },
  header: {
    backgroundColor: "#1e3a5f",
    padding: "22 40 20 40",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    border: "2 solid #93c5fd",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 10,
    color: "#93c5fd",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metaItem: { fontSize: 7.5, color: "#bfdbfe" },
  body: { flexDirection: "row", flex: 1 },
  sidebar: {
    width: 165,
    backgroundColor: "#f0f4f8",
    padding: "20 14",
    borderRight: "1 solid #dde3ea",
  },
  main: { flex: 1, padding: "20 30" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#1e3a5f",
    borderBottom: "1.5 solid #1e3a5f",
    paddingBottom: 3,
    marginBottom: 9,
  },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#1e293b", lineHeight: 1.65 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#64748b" },
  expCo: { fontSize: 8.5, color: "#1e3a5f", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#334155", lineHeight: 1.55 },
  expItem: { marginBottom: 12 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#475569",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  eduSch: { fontSize: 8, color: "#1e3a5f", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#64748b", marginBottom: 2 },
  eduItem: { marginBottom: 9 },
});

export function ExecutiveTemplate({
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
                <Text style={s.secTitle}>Core Skills</Text>
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
                <Text style={s.secTitle}>Executive Summary</Text>
                <Text style={s.summary}>{cv.summary}</Text>
              </View>
            ) : null}
            {cv.experiences.length > 0 && (
              <View style={s.secWrap}>
                <Text style={s.secTitle}>Professional Experience</Text>
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
