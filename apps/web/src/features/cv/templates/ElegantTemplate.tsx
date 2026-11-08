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
    backgroundColor: "#fffdf9",
    padding: "36 44",
  },
  header: { alignItems: "center", marginBottom: 6, paddingBottom: 14 },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    border: "1.5 solid #d4a96a",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1c1917",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 3,
  },
  title: {
    fontSize: 9.5,
    color: "#a16207",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  divider: { height: 1, backgroundColor: "#d4a96a", marginBottom: 5 },
  dividerThin: { height: 0.5, backgroundColor: "#e7d5b3", marginBottom: 12 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 4,
  },
  metaItem: { fontSize: 7.5, color: "#78716c" },
  body: { flexDirection: "row", gap: 24 },
  sidebar: { width: 155 },
  main: { flex: 1 },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: "#a16207",
    marginBottom: 5,
  },
  secUnder: { height: 0.75, backgroundColor: "#d4a96a", marginBottom: 8 },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#44403c", lineHeight: 1.7 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#1c1917" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#a16207" },
  expCo: {
    fontSize: 8,
    color: "#78716c",
    marginBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
  expDesc: { fontSize: 8, color: "#44403c", lineHeight: 1.6 },
  expItem: { marginBottom: 11 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#1c1917",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#78716c",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1c1917" },
  eduSch: {
    fontSize: 8,
    color: "#a16207",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 1,
  },
  eduPer: { fontSize: 7.5, color: "#a8a29e", marginBottom: 2 },
  eduItem: { marginBottom: 9 },
});

export function ElegantTemplate({
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
                style={{ ...s.metaItem, color: "#a16207" }}
              >
                {cv.website}
              </Link>
            ) : null}
          </View>
        </View>
        <View style={s.divider} />
        <View style={s.dividerThin} />
        <View style={s.body}>
          <View style={s.sidebar}>
            {cv.skills.length > 0 && (
              <View style={s.secWrap}>
                <Text style={s.secTitle}>Skills</Text>
                <View style={s.secUnder} />
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
                <View style={s.secUnder} />
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
                <Text style={s.secTitle}>Profile</Text>
                <View style={s.secUnder} />
                <Text style={s.summary}>{cv.summary}</Text>
              </View>
            ) : null}
            {cv.experiences.length > 0 && (
              <View style={s.secWrap}>
                <Text style={s.secTitle}>Experience</Text>
                <View style={s.secUnder} />
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
