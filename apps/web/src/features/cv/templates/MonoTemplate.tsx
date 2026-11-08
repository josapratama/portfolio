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
    backgroundColor: "#ffffff",
    padding: "36 48",
  },
  header: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottom: "2 solid #111827",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 6,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    border: "1 solid #111827",
    flexShrink: 0,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    letterSpacing: 0.5,
  },
  title: { fontSize: 9.5, color: "#374151", marginBottom: 5 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metaItem: { fontSize: 7.5, color: "#374151" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#111827",
    marginBottom: 6,
  },
  secLine: { height: 1, backgroundColor: "#111827", marginBottom: 8 },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#374151", lineHeight: 1.65 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#374151" },
  expCo: {
    fontSize: 8.5,
    color: "#374151",
    marginBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
  expDesc: { fontSize: 8, color: "#4b5563", lineHeight: 1.6 },
  expItem: { marginBottom: 12 },
  twoCol: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#374151",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  eduSch: { fontSize: 8, color: "#374151", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#6b7280", marginBottom: 2 },
  eduItem: { marginBottom: 9 },
});

export function MonoTemplate({ cv, size }: { cv: CVData; size: CVPageSize }) {
  return (
    <Document title={cv.name ? `${cv.name} — CV` : "CV"}>
      <Page size={size} style={s.page}>
        <View style={s.header}>
          <View style={s.nameRow}>
            {cv.photo_url ? <Image src={cv.photo_url} style={s.photo} /> : null}
            <Text style={s.name}>{cv.name || "Your Name"}</Text>
          </View>
          {cv.title ? <Text style={s.title}>{cv.title}</Text> : null}
          <View style={s.metaRow}>
            {cv.email ? <Text style={s.metaItem}>{cv.email}</Text> : null}
            {cv.phone ? <Text style={s.metaItem}>· {cv.phone}</Text> : null}
            {cv.location ? (
              <Text style={s.metaItem}>· {cv.location}</Text>
            ) : null}
            {cv.website ? <Text style={s.metaItem}>· {cv.website}</Text> : null}
          </View>
        </View>
        {cv.summary ? (
          <View style={s.secWrap}>
            <Text style={s.secTitle}>Summary</Text>
            <View style={s.secLine} />
            <Text style={s.summary}>{cv.summary}</Text>
          </View>
        ) : null}
        {cv.experiences.length > 0 && (
          <View style={s.secWrap}>
            <Text style={s.secTitle}>Experience</Text>
            <View style={s.secLine} />
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
        <View style={s.twoCol}>
          {cv.skills.length > 0 && (
            <View style={s.col}>
              <Text style={s.secTitle}>Skills</Text>
              <View style={s.secLine} />
              {cv.skills.map((sg) => (
                <View key={sg.id}>
                  <Text style={s.skillCat}>{sg.category}</Text>
                  <Text style={s.skillItems}>{sg.items}</Text>
                </View>
              ))}
            </View>
          )}
          {cv.education.length > 0 && (
            <View style={s.col}>
              <Text style={s.secTitle}>Education</Text>
              <View style={s.secLine} />
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
      </Page>
    </Document>
  );
}
