import { useState, useRef, useEffect } from "react"
import { ChevronDown, Trash2, FileText, CheckSquare, Timer, Lock, X, FolderPlus, Pencil, Shield } from "lucide-react"
import { FolderType } from "../../pages/Dashboard"
import { CreateCategoryModal } from "./CreateCategoryModal"
import { CreateItemModal } from "./CreateItemModal"
import { RenameFolderModal } from "./RenameFolderModal"
import { FolderPrivacyModal } from "./FolderPrivacyModal"

interface SidebarInnerProps {
  isOpen: boolean;
  folder?: FolderType;
  activeItemId: string | null;
  onSelectItem: (id: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onUpdateFolderPrivacy: (folderId: string, isPrivate: boolean) => void;
  onAddCategory: (folderId: string, name: string) => void;
  onDeleteCategory: (folderId: string, categoryId: string) => void;
  onAddItem: (folderId: string, categoryId: string, name: string, type: 'note' | 'todo' | 'pomodoro', isPrivate: boolean) => void;
  onDeleteItem: (folderId: string, categoryId: string, itemId: string) => void;
}

export function SidebarInner({ 
  isOpen, 
  folder, 
  activeItemId, 
  onSelectItem,
  onRenameFolder,
  onUpdateFolderPrivacy,
  onAddCategory, 
  onDeleteCategory, 
  onAddItem, 
  onDeleteItem 
}: SidebarInnerProps) {
  
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }
  
  if (!folder) return (
    <aside className={`h-screen flex flex-col bg-slate-50 dark:bg-[#1A1A1E] transition-[width,border] duration-300 overflow-hidden ${isOpen ? "w-60 border-r border-slate-200 dark:border-[#121214]" : "w-0 border-none"}`}></aside>
  );

  return (
    <>
      <aside 
        className={`h-screen flex flex-col bg-slate-50 dark:bg-[#1A1A1E] transition-[width,border] duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
          isOpen ? "w-60 border-r border-slate-200 dark:border-[#121214]" : "w-0 border-none"
        }`}
      >
        <div className={`w-60 flex flex-col h-full transition-opacity duration-300 relative ${isOpen ? "opacity-100" : "opacity-0"}`}>
          
          <div ref={menuRef} className="relative z-50">
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`h-12 flex items-center justify-between px-4 border-b border-slate-200 dark:border-[#121214] cursor-pointer transition-colors group ${
                isMenuOpen ? "bg-slate-200/50 dark:bg-[#222327]" : "hover:bg-slate-200/50 dark:hover:bg-[#222327]"
              }`}
            >
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-[15px] truncate flex items-center gap-2">
                {folder.name}
                {folder.isPrivate && <Lock size={14} className="text-slate-400" />}
              </h2>
              {isMenuOpen ? (
                <X size={18} className="text-slate-700 dark:text-slate-200" />
              ) : (
                <ChevronDown size={18} className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
              )}
            </div>

            {isMenuOpen && (
              <div className="absolute top-14 left-2 right-2 bg-white dark:bg-[#111214] border border-slate-200 dark:border-[#1A1A1E] rounded-md shadow-xl p-1.5 flex flex-col gap-0.5">
                
                <button 
                  onClick={() => { setIsMenuOpen(false); setRenameModalOpen(true); }}
                  className="flex items-center justify-between px-2 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-500 hover:text-slate-900 dark:hover:text-white rounded transition-colors group"
                >
                  Rename Folder
                  <Pencil size={14} className="opacity-70 group-hover:opacity-100" />
                </button>

                <div className="h-px bg-slate-200 dark:bg-[#1A1A1E] my-1 mx-1"></div>

                <button 
                  onClick={() => { setIsMenuOpen(false); setCategoryModalOpen(true); }}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-500 hover:text-slate-900 dark:hover:text-white rounded transition-colors group"
                >
                  Create Category
                  <FolderPlus size={14} className="opacity-70 group-hover:opacity-100" />
                </button>

                <div className="h-px bg-slate-200 dark:bg-[#1A1A1E] my-1 mx-1"></div>

                <button 
                  onClick={() => { setIsMenuOpen(false); setPrivacyModalOpen(true); }}
                  className="flex items-center justify-between px-2 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-500 hover:text-slate-900 dark:hover:text-white rounded transition-colors group"
                >
                  Privacy Settings
                  <Shield size={14} className="opacity-70 group-hover:opacity-100" />
                </button>
                
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pt-3 pb-4">
            
            {folder.categories.map(category => {
              const isCollapsed = collapsedCategories.has(category.id);
              
              return (
                <div key={category.id} className="mb-4">
                  
                  <div className="flex items-center justify-between px-2 group/cat">
                    <div 
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer text-xs font-semibold tracking-wide uppercase transition-colors flex-1 py-1"
                    >
                      <ChevronDown size={12} className={`mr-1 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                      {category.name}
                    </div>
                    
                    <div className="flex items-center opacity-0 group-hover/cat:opacity-100 transition-opacity">
                      <CreateItemModal 
                        categoryName={category.name} 
                        onAddItem={(name, type, isPrivate) => onAddItem(folder.id, category.id, name, type, isPrivate)} 
                      />
                      <button 
                        onClick={() => onDeleteCategory(folder.id, category.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className={`mt-0.5 space-y-0.5 px-2 overflow-hidden transition-all duration-200 ${isCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                    {category.items.map(item => {
                      const isActive = item.id === activeItemId;
                      
                      return (
                        <div 
                          key={item.id}
                          onClick={() => onSelectItem(item.id)}
                          className={`flex items-center justify-between group/ch px-2 py-1.5 rounded cursor-pointer transition-colors ${
                            isActive 
                              ? 'bg-slate-200 dark:bg-[#222327] text-slate-900 dark:text-white' 
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-[#222327] hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="opacity-70 flex-shrink-0">
                              {item.type === 'note' && <FileText size={16} />}
                              {item.type === 'todo' && <CheckSquare size={16} />}
                              {item.type === 'pomodoro' && <Timer size={16} />}
                            </span>
                            
                            <span className={`text-[15px] truncate font-medium ${isActive ? '' : 'font-medium'}`}>
                              {item.name}
                            </span>
                            
                            {item.isPrivate && <Lock size={12} className="opacity-50 ml-1 flex-shrink-0" />}
                          </div>

                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteItem(folder.id, category.id, item.id); }}
                            className="opacity-0 group-hover/ch:opacity-100 text-slate-400 hover:text-rose-500 transition-colors ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </aside>

      <RenameFolderModal 
        open={renameModalOpen} 
        onOpenChange={setRenameModalOpen} 
        currentName={folder.name} 
        onRename={(name) => onRenameFolder(folder.id, name)} 
      />
      <CreateCategoryModal 
        open={categoryModalOpen} 
        onOpenChange={setCategoryModalOpen} 
        onAddCategory={(name) => onAddCategory(folder.id, name)} 
      />
      <FolderPrivacyModal 
        open={privacyModalOpen} 
        onOpenChange={setPrivacyModalOpen} 
        isPrivate={folder.isPrivate || false} 
        onSave={(priv) => onUpdateFolderPrivacy(folder.id, priv)} 
      />
    </>
  )
}