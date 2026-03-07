import { Folder, FolderOpen, LogOut } from "lucide-react"
import { NewFolderDialog } from "./NewFolderDialog"
import { SettingsModal } from "./SettingsModal"
import { FolderType } from "../../pages/Dashboard"

interface SidebarLeftProps {
  folders: FolderType[];
  activeFolderId: string | null;
  isSidebarOpen: boolean;
  onFolderClick: (id: string) => void;
  onAddFolder: (name: string, color: string) => void;
}

const folderStyles: Record<string, { active: string, inactive: string }> = {
  indigo: { active: "bg-indigo-500 text-slate-900 dark:text-white", inactive: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white" },
  purple: { active: "bg-purple-500 text-slate-900 dark:text-white", inactive: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white" },
  pink: { active: "bg-pink-500 text-slate-900 dark:text-white", inactive: "bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 dark:hover:text-white" },
  rose: { active: "bg-rose-500 text-slate-900 dark:text-white", inactive: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white" },
  orange: { active: "bg-orange-500 text-slate-900 dark:text-white", inactive: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white" },
  amber: { active: "bg-amber-400 text-slate-900 dark:text-white", inactive: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 hover:bg-amber-400 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white" },
  emerald: { active: "bg-emerald-500 text-slate-900 dark:text-white", inactive: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white" },
  cyan: { active: "bg-cyan-500 text-slate-900 dark:text-white", inactive: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white" },
  blue: { active: "bg-blue-500 text-slate-900 dark:text-white", inactive: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white" },
  slate: { active: "bg-slate-500 text-slate-900 dark:text-white", inactive: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 hover:bg-slate-500 hover:text-white dark:hover:bg-slate-500 dark:hover:text-white" }
}

export function SidebarLeft({ folders, activeFolderId, isSidebarOpen, onFolderClick, onAddFolder }: SidebarLeftProps) {
  return (
    <aside className="w-[80px] h-screen flex flex-col items-center py-6 bg-slate-50 dark:bg-[#121214] border-r border-slate-100 dark:border-[#1A1A1E] flex-shrink-0 z-10 relative transition-colors duration-200">
      
      <div className="flex flex-col gap-4 flex-1 w-full items-center overflow-y-auto overflow-x-hidden scrollbar-none">
        
        <NewFolderDialog onAddFolder={onAddFolder} />

        <div className="w-8 h-[2px] bg-slate-200 dark:bg-[#1A1A1E] rounded-full my-1 transition-colors flex-shrink-0"></div>

        {folders.map((folder) => {
          const isActive = folder.id === activeFolderId;
          const styles = folderStyles[folder.color] || folderStyles.indigo;

          return (
            <div key={folder.id} className="relative w-full flex justify-center group flex-shrink-0">
              <div 
                className={`absolute left-0 bg-slate-800 dark:bg-slate-200 rounded-r-full transition-all duration-300 w-1 ${
                  isActive && isSidebarOpen
                    ? "h-10 top-1" 
                    : isActive 
                      ? "h-5 top-3.5"
                      : "h-0 top-6 group-hover:h-5 group-hover:top-3.5 opacity-0 group-hover:opacity-100"
                }`}
              ></div>
              
              <button 
                onClick={() => onFolderClick(folder.id)}
                className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? `rounded-xl shadow-md ${styles.active}`
                    : `rounded-[24px] hover:rounded-xl ${styles.inactive}`
                }`}
                title={folder.name}
              >
                {isActive && isSidebarOpen ? (
                  <FolderOpen size={24} fill="none" strokeWidth={2} />
                ) : (
                  <Folder size={24} fill="none" strokeWidth={2} />
                )}
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-5 items-center w-full mt-auto pt-4 flex-shrink-0">
        <div className="w-8 h-px bg-slate-200 dark:bg-[#1A1A1E] transition-colors"></div>
        
        <SettingsModal />
        
        <button className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
          <LogOut size={22} />
        </button>
      </div>
    </aside>
  )
}