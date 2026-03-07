import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Settings, User, Palette, Timer, HardDrive } from "lucide-react"
import { AppearanceTab } from "../settings/AppearanceTab"
import { AccountTab } from "../settings/AccountTab"

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
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <Settings size={22} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl p-0 overflow-hidden h-[80vh] flex border-0 rounded-2xl shadow-2xl dark:bg-slate-800 dark:text-slate-100 transition-colors">
        
        {/* left sidebar */}
        <div className="w-60 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700 p-5 flex flex-col gap-1 transition-colors">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 ml-3 mt-2">
            User Settings
          </h2>
          
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
                  : "text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* right side content */}
        <div className="flex-1 bg-white dark:bg-slate-800 p-10 overflow-y-auto transition-colors">
          {activeTab === "account" && <AccountTab />}
          {activeTab === "appearance" && <AppearanceTab />}
          {activeTab === "pomodoro" && <p>pomodoro settings coming soon</p>}
          {activeTab === "data" && <p>data settings coming soon</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}