import { useState, ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleCreate = () => {
    if (!name.trim()) return;
    onAddCategory(name.trim().toUpperCase())
    setName("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => {
      setIsOpen(val);
      if (!val) setName(""); // clear input when closing
    }}>
      {/* removed the fallback plus button here */}
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-md dark:bg-[#222327] dark:text-slate-100 border-0 dark:border-[#121214] rounded-2xl shadow-xl transition-colors">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-slate-100">Create Category</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Category Name</label>
          <Input 
            placeholder="New Category" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="bg-slate-50 dark:bg-[#1A1A1E] border-slate-200 dark:border-[#121214] dark:text-white dark:placeholder-slate-500 focus-visible:ring-brand-500 h-11 transition-colors"
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="dark:hover:bg-[#1A1A1E] dark:text-slate-300">
            Cancel
          </Button>
          <Button onClick={handleCreate} className="bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors">
            Create Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}