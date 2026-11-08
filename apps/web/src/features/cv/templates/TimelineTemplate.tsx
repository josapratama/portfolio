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
    padding: "32 40",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
    paddingBottom: 14,
    borderBottom: "2 solid #6366f1",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    border: "2 solid #6366f1",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1e1b4b",
    marginBottom: 2,
  },
  title: { fontSize: 9.5, color: "#6366f1", marginBottom: 5 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metaItem: { fontSize: 7.5, color: "#6b7280" },
  twoCol: { flexDirection: "row", gap: 22 },
  left: { flex: 1.7 },
  right: { flex: 1 },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#6366f1",
    marginBottom: 10,
  },
  secWrap: { marginBottom: 16 },
  summary: {
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.65,
    marginBottom: 16,
  },
  tlItem: { flexDirection: "row", marginBottom: 12 },
  tlDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366f1",
    marginTop: 2,
    marginRight: 10,
    flexShrink: 0,
  },
  tlLine: {
    width: 1,
    backgroundColor: "#c7d2fe",
    position: "absolute",
    left: 3.5,
    top: 10,
    bottom: -12,
  },
  tlContent: { flex: 1 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#1e1b4b" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#6366f1" },
  expCo: { fontSize: 8.5, color: "#4f46e5", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#374151", lineHeight: 1.55 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#1e1b4b",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e1b4b" },
  eduSch: { fontSize: 8, color: "#6366f1", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#9ca3af", marginBottom: 2 },
  eduItem: { marginBottom: 9 },
});

export function TimelineTemplate({
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
            </View>
          </View>
        </View>
        {cv.summary ? <Text style={s.summary}>{cv.summary}</Text> : null}
        <View style={s.twoCol}>
          <View style={s.left}>
            {cv.experiences.length > 0 && (
              <View style={s.secWrap}>
                <Text style={s.secTitle}>Experience</Text>
                {cv.experiences.map((e) => (
                  <View key={e.id} style={s.tlItem}>
                    <View style={s.tlDot} />
                    <View style={s.tlContent}>
                      <View style={s.expRow}>
                        <Text style={s.expRole}>{e.role}</Text>
                        <Text style={s.expPeriod}>{e.period}</Text>
                      </View>
                      <Text style={s.expCo}>{e.company}</Text>
                      {e.description ? (
                        <Text style={s.expDesc}>{e.description}</Text>
                      ) : null}
                    </View>
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
