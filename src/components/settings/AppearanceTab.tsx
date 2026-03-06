import { useState } from "react"

const accentColors = [
  { name: "indigo", color: "bg-indigo-500" },
  { name: "purple", color: "bg-purple-500" },
  { name: "pink", color: "bg-pink-500" },
  { name: "rose", color: "bg-rose-500" },
  { name: "emerald", color: "bg-emerald-500" },
  { name: "blue", color: "bg-blue-500" }
]

export function AppearanceTab() {
  const [theme, setTheme] = useState("light")
  const [accent, setAccent] = useState("indigo")

  return (
    <div className="max-w-xl">
      <h3 className="text-xl font-semibold mb-6">Appearance</h3>
      
      <div className="mb-10">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Theme</h4>
        <div className="flex gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
              theme === "light" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="w-full h-24 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-slate-400 text-xs font-medium">Light UI</span>
            </div>
            <span className={`text-sm font-semibold ${theme === "light" ? "text-indigo-700" : "text-slate-600"}`}>Light</span>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
              theme === "dark" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-slate-500 text-xs font-medium">Dark UI</span>
            </div>
            <span className={`text-sm font-semibold ${theme === "dark" ? "text-indigo-700" : "text-slate-600"}`}>Dark</span>
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Accent Color</h4>
        <div className="flex flex-wrap gap-4">
          {accentColors.map((c) => (
            <button
              key={c.name}
              onClick={() => setAccent(c.name)}
              className={`w-10 h-10 rounded-full transition-all ${c.color} ${
                accent === c.name ? "ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-md" : "hover:scale-110"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Choose the main color used for buttons, active folders, and highlights.
        </p>
      </div>
    </div>
  )
}