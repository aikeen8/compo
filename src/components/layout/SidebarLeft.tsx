import { Folder, LogOut } from "lucide-react"
import { NewFolderDialog } from "./NewFolderDialog"
import { SettingsModal } from "./SettingsModal"

interface SidebarLeftProps {
  onFolderClick?: () => void;
}

export function SidebarLeft({ onFolderClick }: SidebarLeftProps) {
  return (
    <aside className="w-[80px] h-screen flex flex-col items-center py-6 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-shrink-0 z-10 relative transition-colors">
      
      {/* put everything in one flex container so the gap-4 applies to the plus button too */}
      <div className="flex flex-col gap-4 flex-1 w-full items-center">
        
        <NewFolderDialog />

        {/* optional divider line to separate the add button from actual folders, discord-style */}
        <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-800 rounded-full my-1"></div>

        <button 
          onClick={onFolderClick}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 transition-colors"
        >
          <Folder size={24} fill="currentColor" strokeWidth={0} />
        </button>
        
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors">
          <Folder size={24} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-5 items-center w-full mt-auto">
        <div className="w-8 h-px bg-slate-200 dark:bg-slate-800"></div>
        
        <SettingsModal />
        
        <button className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
          <LogOut size={22} />
        </button>
      </div>
    </aside>
  )
}