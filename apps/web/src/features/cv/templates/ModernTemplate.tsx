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
    padding: 0,
    flexDirection: "row",
  },
  sidebar: { width: 180, backgroundColor: "#1e293b", padding: "32 16 24 16" },
  photoWrap: { alignItems: "center", marginBottom: 18 },
  photo: { width: 72, height: 72, borderRadius: 36, border: "3 solid #38bdf8" },
  sName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 3,
  },
  sTitle: {
    fontSize: 8.5,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 14,
  },
  sMeta: { fontSize: 7.5, color: "#94a3b8", marginBottom: 4, lineHeight: 1.5 },
  sSecTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#38bdf8",
    marginBottom: 7,
    marginTop: 14,
  },
  sSecLine: { height: 1, backgroundColor: "#334155", marginBottom: 8 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#e2e8f0",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#94a3b8",
    lineHeight: 1.5,
    marginBottom: 6,
  },
  eduDeg: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#e2e8f0" },
  eduSch: { fontSize: 7.5, color: "#38bdf8", marginBottom: 1 },
  eduPer: { fontSize: 7, color: "#64748b", marginBottom: 5 },
  main: { flex: 1, padding: "32 28 24 24" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#0ea5e9",
    marginBottom: 8,
  },
  secLine: { height: 1.5, backgroundColor: "#e0f2fe", marginBottom: 10 },
  secWrap: { marginBottom: 18 },
  summary: { fontSize: 8.5, color: "#334155", lineHeight: 1.65 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#64748b" },
  expCo: { fontSize: 8.5, color: "#0ea5e9", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#334155", lineHeight: 1.55 },
  expItem: { marginBottom: 12 },
});

export function ModernTemplate({ cv, size }: { cv: CVData; size: CVPageSize }) {
  return (
    <Document title={cv.name ? `${cv.name} — CV` : "CV"}>
      <Page size={size} style={s.page}>
        <View style={s.sidebar}>
          <View style={s.photoWrap}>
            {cv.photo_url ? <Image src={cv.photo_url} style={s.photo} /> : null}
          </View>
          <Text style={s.sName}>{cv.name || "Your Name"}</Text>
          {cv.title ? <Text style={s.sTitle}>{cv.title}</Text> : null}
          {cv.email ? <Text style={s.sMeta}>{cv.email}</Text> : null}
          {cv.phone ? <Text style={s.sMeta}>{cv.phone}</Text> : null}
          {cv.location ? <Text style={s.sMeta}>{cv.location}</Text> : null}
          {cv.website ? <Text style={s.sMeta}>{cv.website}</Text> : null}
          {cv.skills.length > 0 && (
            <>
              <Text style={s.sSecTitle}>Skills</Text>
              <View style={s.sSecLine} />
              {cv.skills.map((sg) => (
                <View key={sg.id}>
                  <Text style={s.skillCat}>{sg.category}</Text>
                  <Text style={s.skillItems}>{sg.items}</Text>
                </View>
              ))}
            </>
          )}
          {cv.education.length > 0 && (
            <>
              <Text style={s.sSecTitle}>Education</Text>
              <View style={s.sSecLine} />
              {cv.education.map((e) => (
                <View key={e.id}>
                  <Text style={s.eduDeg}>{e.degree}</Text>
                  <Text style={s.eduSch}>{e.school}</Text>
                  <Text style={s.eduPer}>{e.period}</Text>
                </View>
              ))}
            </>
          )}
        </View>
        <View style={s.main}>
          {cv.summary ? (
            <View style={s.secWrap}>
              <Text style={s.secTitle}>About Me</Text>
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
        </View>
      </Page>
    </Document>
  );
}
