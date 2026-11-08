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
    padding: "36 48",
  },
  header: { alignItems: "center", marginBottom: 16 },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    border: "1 solid #d1d5db",
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 3,
  },
  title: {
    fontSize: 9.5,
    color: "#374151",
    textAlign: "center",
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  metaItem: { fontSize: 7.5, color: "#6b7280" },
  divider: {
    height: 1.5,
    backgroundColor: "#111827",
    marginBottom: 14,
    marginTop: 10,
  },
  secTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#111827",
    marginBottom: 6,
  },
  secLine: { height: 0.5, backgroundColor: "#d1d5db", marginBottom: 8 },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#374151", lineHeight: 1.7 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#6b7280" },
  expCo: {
    fontSize: 8.5,
    color: "#374151",
    marginBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
  expDesc: { fontSize: 8, color: "#374151", lineHeight: 1.6 },
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
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  eduSch: {
    fontSize: 8,
    color: "#374151",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 1,
  },
  eduPer: { fontSize: 7.5, color: "#9ca3af", marginBottom: 2 },
  eduDesc: { fontSize: 7.5, color: "#6b7280", lineHeight: 1.5 },
  eduItem: { marginBottom: 9 },
});

export function AcademicTemplate({
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
                style={{ ...s.metaItem, color: "#374151" }}
              >
                {cv.website}
              </Link>
            ) : null}
          </View>
        </View>
        <View style={s.divider} />
        {cv.summary ? (
          <View style={s.secWrap}>
            <Text style={s.secTitle}>Research Interests / Summary</Text>
            <View style={s.secLine} />
            <Text style={s.summary}>{cv.summary}</Text>
          </View>
        ) : null}
        {cv.experiences.length > 0 && (
          <View style={s.secWrap}>
            <Text style={s.secTitle}>Academic & Professional Experience</Text>
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
          {cv.education.length > 0 && (
            <View style={s.col}>
              <Text style={s.secTitle}>Education</Text>
              <View style={s.secLine} />
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
          {cv.skills.length > 0 && (
            <View style={s.col}>
              <Text style={s.secTitle}>Skills & Competencies</Text>
              <View style={s.secLine} />
              {cv.skills.map((sg) => (
                <View key={sg.id}>
                  <Text style={s.skillCat}>{sg.category}</Text>
                  <Text style={s.skillItems}>{sg.items}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
