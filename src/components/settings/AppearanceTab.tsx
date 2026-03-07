import { useState } from "react"
import { useTheme } from "../ThemeProvider"

const accentColors = [
  { name: "indigo", bg: "bg-indigo-500", ring: "ring-indigo-500" },
  { name: "purple", bg: "bg-purple-500", ring: "ring-purple-500" },
  { name: "pink", bg: "bg-pink-500", ring: "ring-pink-500" },
  { name: "rose", bg: "bg-rose-500", ring: "ring-rose-500" },
  { name: "emerald", bg: "bg-emerald-500", ring: "ring-emerald-500" },
  { name: "blue", bg: "bg-blue-500", ring: "ring-blue-500" }
]

export function AppearanceTab() {
  const { theme, setTheme, accent, setAccent, customColor, setCustomColor } = useTheme()
  
  const [draftTheme, setDraftTheme] = useState(theme)
  const [draftAccent, setDraftAccent] = useState(accent)
  const [draftCustomColor, setDraftCustomColor] = useState(customColor)

  const handleApply = () => {
    setTheme(draftTheme)
    setAccent(draftAccent)
    setCustomColor(draftCustomColor)
  }

  return (
    <div className="max-w-xl pr-2 pb-6">
      <h3 className="text-xl font-semibold mb-6 dark:text-white">Appearance</h3>
      
      <div className="mb-10">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Theme</h4>
        <div className="flex gap-4">
          <button
            onClick={() => setDraftTheme("light")}
            className={`flex-1 border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
              draftTheme === "light" 
                ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 dark:border-brand-500" 
                : "border-slate-200 hover:border-slate-300 dark:border-[#1A1A1E] dark:hover:border-[#222327]"
            }`}
          >
            <div className="w-full h-24 bg-white border border-slate-200 dark:bg-[#1A1A1E] dark:border-[#121214] rounded-lg shadow-sm flex items-center justify-center transition-colors">
              <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Light UI</span>
            </div>
            <span className={`text-sm font-semibold ${draftTheme === "light" ? "text-brand-700 dark:text-brand-400" : "text-slate-600 dark:text-slate-400"}`}>Light</span>
          </button>

          <button
            onClick={() => setDraftTheme("dark")}
            className={`flex-1 border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
              draftTheme === "dark" 
                ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 dark:border-brand-500" 
                : "border-slate-200 hover:border-slate-300 dark:border-[#1A1A1E] dark:hover:border-[#222327]"
            }`}
          >
            <div className="w-full h-24 bg-slate-900 border border-slate-700 dark:bg-[#121214] dark:border-[#1A1A1E] rounded-lg shadow-sm flex items-center justify-center transition-colors">
              <span className="text-slate-500 text-xs font-medium">Dark UI</span>
            </div>
            <span className={`text-sm font-semibold ${draftTheme === "dark" ? "text-brand-700 dark:text-brand-400" : "text-slate-600 dark:text-slate-400"}`}>Dark</span>
          </button>
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Accent Color</h4>
        <div className="flex flex-wrap gap-4 items-center">
          {accentColors.map((c) => (
            <button
              key={c.name}
              onClick={() => setDraftAccent(c.name)}
              className={`w-10 h-10 rounded-full transition-all ${c.bg} ${
                draftAccent === c.name ? `ring-2 ring-offset-2 ${c.ring} dark:ring-offset-[#222327] scale-110 shadow-md` : "hover:scale-110"
              }`}
            />
          ))}

          <div className="relative w-10 h-10">
            <input
              type="color"
              value={draftCustomColor}
              onChange={(e) => {
                setDraftCustomColor(e.target.value)
                setDraftAccent("custom")
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Choose custom color"
            />
            <div
              className={`w-full h-full rounded-full transition-all pointer-events-none outline outline-2 outline-offset-2 ${
                draftAccent === "custom" ? "scale-110 shadow-md outline-brand-500" : "outline-transparent hover:scale-110"
              }`}
              style={{
                background: draftAccent === "custom" ? draftCustomColor : "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                outlineColor: draftAccent === "custom" ? draftCustomColor : "transparent"
              }}
            />
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
          Choose the main color used for buttons, active folders, and highlights.
        </p>
      </div>

      <div className="border-t border-slate-200 dark:border-[#1A1A1E] pt-6 flex justify-end transition-colors">
        <button 
          onClick={handleApply}
          className="bg-brand-500 text-slate-900 dark:text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          Apply Changes
        </button>
      </div>
    </div>
  )
}