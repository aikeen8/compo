import { useState, ReactNode } from "react"

interface CreateCategoryModalProps {
  onAddCategory: (name: string) => void;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateCategoryModal({ onAddCategory, children, open, onOpenChange }: CreateCategoryModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [name, setName] = useState("")

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const handleCreate = () => {
    if (!name.trim()) return;
    onAddCategory(name.trim().toUpperCase())
    setName("")
    setIsOpen(false)
  }

  return (
    <>
      {children && <span onClick={() => setIsOpen(true)}>{children}</span>}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => { setIsOpen(false); setName(""); }}>
          <div className="w-[92vw] sm:max-w-md bg-white dark:bg-[#222327] border border-slate-200 dark:border-[#121214] rounded-[24px] p-6 shadow-xl transition-colors" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Create Category</h3>
            <div className="py-4">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Category Name</label>
              <input
                placeholder="New Category"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-[#1A1A1E] border border-slate-200 dark:border-[#121214] rounded-xl dark:text-white dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setIsOpen(false); setName(""); }} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] transition-colors">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white transition-colors">Create Category</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}