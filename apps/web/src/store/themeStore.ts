import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const body = document.body;

  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
    body.style.backgroundColor = "";
    body.style.color = "";
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    // Force light background directly in case CSS class doesn't apply fast enough
    body.style.backgroundColor = "#f0f4ff";
    body.style.color = "#0f172a";
  }
  body.classList.toggle("light", theme === "light");
  body.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggle: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        applyTheme(next);
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);

// Apply immediately on module load (before rehydration)
const raw = localStorage.getItem("theme-storage");
if (raw) {
  try {
    const parsed = JSON.parse(raw);
    applyTheme(parsed?.state?.theme === "light" ? "light" : "dark");
  } catch {
    applyTheme("dark");
  }
} else {
  applyTheme("dark");
}
