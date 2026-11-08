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
import { metaLine } from "../helpers";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: "#ffffff",
    padding: "40 48",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 solid #e2e8f0",
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  photo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    border: "1 solid #e2e8f0",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  title: { fontSize: 10, color: "#6b7280", marginBottom: 5 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metaItem: { fontSize: 7.5, color: "#9ca3af" },
  secTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 8,
  },
  secWrap: { marginBottom: 18 },
  summary: { fontSize: 8.5, color: "#374151", lineHeight: 1.65 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#9ca3af" },
  expCo: { fontSize: 8, color: "#6b7280", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#374151", lineHeight: 1.6 },
  expItem: { marginBottom: 12 },
  twoCol: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  eduSch: { fontSize: 8, color: "#6b7280", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#9ca3af", marginBottom: 2 },
  eduItem: { marginBottom: 8 },
});

export function MinimalTemplate({
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
              <Text style={s.metaItem}>{metaLine(cv)}</Text>
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
        <View style={s.twoCol}>
          {cv.skills.length > 0 && (
            <View style={s.col}>
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
            <View style={s.col}>
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
      </Page>
    </Document>
  );
}
