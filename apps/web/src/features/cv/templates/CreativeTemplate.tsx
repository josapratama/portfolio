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
  sidebar: { width: 185, backgroundColor: "#ec4899", padding: "32 16 24 16" },
  photoWrap: { alignItems: "center", marginBottom: 16 },
  photo: { width: 72, height: 72, borderRadius: 36, border: "3 solid #fce7f3" },
  sName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 3,
  },
  sTitle: {
    fontSize: 8.5,
    color: "#fce7f3",
    textAlign: "center",
    marginBottom: 14,
  },
  sMeta: { fontSize: 7.5, color: "#fce7f3", marginBottom: 4, lineHeight: 1.5 },
  sSecTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#ffffff",
    marginBottom: 6,
    marginTop: 14,
  },
  sLine: { height: 1, backgroundColor: "#f9a8d4", marginBottom: 7 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7,
    color: "#fce7f3",
    lineHeight: 1.5,
    marginBottom: 6,
  },
  eduDeg: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  eduSch: { fontSize: 7.5, color: "#fce7f3", marginBottom: 1 },
  eduPer: { fontSize: 7, color: "#fbcfe8", marginBottom: 5 },
  main: { flex: 1, padding: "32 28 24 24" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#ec4899",
    marginBottom: 6,
  },
  secLine: { height: 1.5, backgroundColor: "#fce7f3", marginBottom: 10 },
  secWrap: { marginBottom: 18 },
  summary: { fontSize: 8.5, color: "#374151", lineHeight: 1.65 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#1f2937" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#9ca3af" },
  expCo: { fontSize: 8.5, color: "#ec4899", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#374151", lineHeight: 1.55 },
  expItem: { marginBottom: 12 },
});

export function CreativeTemplate({
  cv,
  size,
}: {
  cv: CVData;
  size: CVPageSize;
}) {
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
