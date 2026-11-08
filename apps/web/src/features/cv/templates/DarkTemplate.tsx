import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { CVData, CVPageSize } from "../types";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: "#09090b",
    padding: 0,
  },
  header: {
    backgroundColor: "#18181b",
    padding: "24 36 20 36",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    borderBottom: "1 solid #27272a",
  },
  photo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    border: "2 solid #a78bfa",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 21,
    fontFamily: "Helvetica-Bold",
    color: "#fafafa",
    marginBottom: 3,
  },
  title: { fontSize: 10, color: "#a78bfa", marginBottom: 6 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaItem: { fontSize: 7.5, color: "#71717a" },
  body: { flexDirection: "row", flex: 1 },
  sidebar: {
    width: 168,
    backgroundColor: "#18181b",
    padding: "18 14",
    borderRight: "1 solid #27272a",
  },
  main: { flex: 1, padding: "18 26" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#a78bfa",
    borderBottom: "1.5 solid #a78bfa",
    paddingBottom: 3,
    marginBottom: 9,
  },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#a1a1aa", lineHeight: 1.6 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#fafafa" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expPeriod: { fontSize: 7.5, color: "#52525b" },
  expCo: { fontSize: 8.5, color: "#a78bfa", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#71717a", lineHeight: 1.55 },
  expItem: { marginBottom: 11 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#e4e4e7",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#71717a",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#fafafa" },
  eduSch: { fontSize: 8, color: "#a78bfa", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#52525b", marginBottom: 2 },
  eduItem: { marginBottom: 9 },
});

export function DarkTemplate({ cv, size }: { cv: CVData; size: CVPageSize }) {
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
