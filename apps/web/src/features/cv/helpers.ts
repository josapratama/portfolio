import type { CVData } from "./types";

export const metaLine = (cv: CVData): string =>
  [
    cv.email,
    cv.phone ? `· ${cv.phone}` : "",
    cv.location ? `· ${cv.location}` : "",
  ]
    .filter(Boolean)
    .join("  ");
