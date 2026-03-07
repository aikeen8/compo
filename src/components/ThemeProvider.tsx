import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

// removed commas, tailwind requires spaces here
const colorPalettes: Record<string, Record<string, string>> = {
  indigo: { "50": "238 242 255", "100": "224 231 255", "400": "129 140 248", "500": "99 102 241", "600": "79 70 229", "700": "67 56 202" },
  purple: { "50": "250 245 255", "100": "243 232 255", "400": "192 132 252", "500": "168 85 247", "600": "147 51 234", "700": "126 34 206" },
  pink: { "50": "253 242 248", "100": "252 231 243", "400": "244 114 182", "500": "236 72 153", "600": "219 39 119", "700": "190 24 93" },
  rose: { "50": "255 241 242", "100": "255 228 230", "400": "251 113 133", "500": "244 63 94", "600": "225 29 72", "700": "190 18 60" },
  emerald: { "50": "236 253 245", "100": "209 250 229", "400": "52 211 153", "500": "16 185 129", "600": "5 150 105", "700": "4 120 87" },
  blue: { "50": "239 246 255", "100": "219 234 254", "400": "96 165 250", "500": "59 130 246", "600": "37 99 235", "700": "29 78 216" }
}

function generateCustomShades(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  const mix = (c1: number, c2: number, w: number) => Math.round(c1 * w + c2 * (1 - w))
  const toRgb = (r: number, g: number, b: number) => `${r} ${g} ${b}` // removed commas here too
  
  return {
    "50": toRgb(mix(r, 255, 0.1), mix(g, 255, 0.1), mix(b, 255, 0.1)),
    "100": toRgb(mix(r, 255, 0.2), mix(g, 255, 0.2), mix(b, 255, 0.2)),
    "400": toRgb(mix(r, 255, 0.8), mix(g, 255, 0.8), mix(b, 255, 0.8)),
    "500": toRgb(r, g, b),
    "600": toRgb(mix(r, 0, 0.8), mix(g, 0, 0.8), mix(b, 0, 0.8)),
    "700": toRgb(mix(r, 0, 0.6), mix(g, 0, 0.6), mix(b, 0, 0.6)),
  }
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  accent: string
  setAccent: (accent: string) => void
  customColor: string
  setCustomColor: (color: string) => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
  accent: "indigo",
  setAccent: () => null,
  customColor: "#6366f1",
  setCustomColor: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("compo-theme") as Theme) || "light"
  )
  const [accent, setAccent] = useState<string>(
    () => localStorage.getItem("compo-accent") || "indigo"
  )
  const [customColor, setCustomColor] = useState<string>(
    () => localStorage.getItem("compo-custom-color") || "#6366f1"
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    const palette = accent === "custom" ? generateCustomShades(customColor) : (colorPalettes[accent] || colorPalettes.indigo)
    
    root.style.setProperty("--brand-50", palette["50"])
    root.style.setProperty("--brand-100", palette["100"])
    root.style.setProperty("--brand-400", palette["400"])
    root.style.setProperty("--brand-500", palette["500"])
    root.style.setProperty("--brand-600", palette["600"])
    root.style.setProperty("--brand-700", palette["700"])
  }, [accent, customColor])

  const value = {
    theme,
    setTheme: (t: Theme) => { localStorage.setItem("compo-theme", t); setTheme(t); },
    accent,
    setAccent: (a: string) => { localStorage.setItem("compo-accent", a); setAccent(a); },
    customColor,
    setCustomColor: (c: string) => { localStorage.setItem("compo-custom-color", c); setCustomColor(c); }
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeProviderContext)