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
    backgroundColor: "#0d1117",
    padding: 0,
    flexDirection: "row",
  },
  sidebar: {
    width: 175,
    backgroundColor: "#161b22",
    padding: "28 14 24 14",
    borderRight: "1 solid #30363d",
  },
  photoWrap: { alignItems: "center", marginBottom: 16 },
  photo: { width: 68, height: 68, borderRadius: 34, border: "2 solid #58a6ff" },
  sName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#e6edf3",
    textAlign: "center",
    marginBottom: 3,
  },
  sTitle: {
    fontSize: 8,
    color: "#58a6ff",
    textAlign: "center",
    marginBottom: 14,
  },
  sMeta: { fontSize: 7, color: "#8b949e", marginBottom: 4, lineHeight: 1.5 },
  sSecTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#3fb950",
    marginBottom: 6,
    marginTop: 14,
  },
  sLine: { height: 1, backgroundColor: "#30363d", marginBottom: 7 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#e6edf3",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7,
    color: "#8b949e",
    lineHeight: 1.5,
    marginBottom: 6,
  },
  eduDeg: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#e6edf3" },
  eduSch: { fontSize: 7.5, color: "#58a6ff", marginBottom: 1 },
  eduPer: { fontSize: 7, color: "#6e7681", marginBottom: 5 },
  main: { flex: 1, padding: "28 24 24 20" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#3fb950",
    marginBottom: 6,
  },
  secLine: { height: 1, backgroundColor: "#21262d", marginBottom: 10 },
  secWrap: { marginBottom: 18 },
  summary: { fontSize: 8.5, color: "#c9d1d9", lineHeight: 1.65 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#e6edf3" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#6e7681" },
  expCo: { fontSize: 8.5, color: "#58a6ff", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#8b949e", lineHeight: 1.55 },
  expItem: { marginBottom: 12 },
});

export function TechTemplate({ cv, size }: { cv: CVData; size: CVPageSize }) {
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
              <View style={s.sLine} />
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
              <View style={s.sLine} />
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
              <Text style={s.secTitle}>$ whoami</Text>
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
