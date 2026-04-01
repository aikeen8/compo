import { useState } from "react"
import { Settings, User, Palette, HardDrive, Trash2 } from "lucide-react"
import { AppearanceTab } from "../settings/AppearanceTab"
import { AccountTab } from "../settings/AccountTab"
import { TrashTab } from "../settings/TrashTab"
import { DataPrivacyTab } from "../settings/DataPrivacyTab"

const tabs = [
  { id: "account", label: "My Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "trash", label: "Trash", icon: Trash2 },
  { id: "data", label: "Data & Privacy", icon: HardDrive }
]

export function SettingsModal() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("appearance")

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
        <Settings size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="w-[95vw] md:max-w-4xl max-h-[85vh] h-auto md:h-[80vh] flex flex-col md:flex-row overflow-hidden rounded-[24px] shadow-2xl bg-white dark:bg-[#222327] dark:text-slate-100 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full md:w-60 bg-slate-50 dark:bg-[#1A1A1E] border-b md:border-b-0 md:border-r border-slate-100 dark:border-[#121214] p-3 md:p-5 flex flex-row md:flex-col gap-1 transition-colors overflow-x-auto md:overflow-y-auto scrollbar-none shrink-0 pr-12 md:pr-5">
              <h2 className="hidden md:block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 ml-3 mt-2">
                User Settings
              </h2>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 md:gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-[#222327] dark:hover:text-slate-200"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 bg-white dark:bg-[#222327] p-6 md:p-10 overflow-y-auto transition-colors min-h-[50vh]">
              {activeTab === "account" && <AccountTab />}
              {activeTab === "appearance" && <AppearanceTab />}
              {activeTab === "trash" && <TrashTab />}
              {activeTab === "data" && <DataPrivacyTab />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}