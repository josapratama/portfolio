export type CVPageSize = "A4" | "LETTER";

export type CVTemplate =
  | "classic"
  | "minimal"
  | "modern"
  | "bold"
  | "elegant"
  | "tech"
  | "executive"
  | "creative"
  | "compact"
  | "timeline"
  | "academic"
  | "nordic"
  | "dark"
  | "split"
  | "corporate"
  | "infographic"
  | "pastel"
  | "mono"
  | "midnight"
  | "gradient";

export interface CVExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface CVSkillGroup {
  id: string;
  category: string;
  items: string;
}

export interface CVEducation {
  id: string;
  degree: string;
  school: string;
  period: string;
  description?: string;
}

export interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photo_url: string;
  summary: string;
  experiences: CVExperience[];
  skills: CVSkillGroup[];
  education: CVEducation[];
}
