import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Settings, User, Palette, Timer, HardDrive } from "lucide-react"
import { AppearanceTab } from "../settings/AppearanceTab"

const tabs = [
  { id: "account", label: "My Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "pomodoro", label: "Pomodoro", icon: Timer },
  { id: "data", label: "Data & Privacy", icon: HardDrive },
]

export function SettingsModal() {
  const [activeTab, setActiveTab] = useState("appearance")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Settings size={22} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl p-0 overflow-hidden h-[80vh] flex border-0 rounded-2xl shadow-2xl">
        {/* left sidebar */}
        <div className="w-60 bg-slate-50 border-r border-slate-100 p-5 flex flex-col gap-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-3 mt-2">
            User Settings
          </h2>
          
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* right side content */}
        <div className="flex-1 bg-white p-10 overflow-y-auto">
          {activeTab === "account" && <p>account settings coming soon</p>}
          {activeTab === "appearance" && <AppearanceTab />}
          {activeTab === "pomodoro" && <p>pomodoro settings coming soon</p>}
          {activeTab === "data" && <p>data settings coming soon</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}