import { useState, ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface FolderPrivacyModalProps {
  isPrivate: boolean;
  onSave: (isPrivate: boolean) => void;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FolderPrivacyModal({ isPrivate, onSave, children, open, onOpenChange }: FolderPrivacyModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [privateState, setPrivateState] = useState(isPrivate)
  const [prevIsOpen, setPrevIsOpen] = useState(false)

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  // safely update state without useEffect
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setPrivateState(isPrivate);
    }
  }

  const handleSave = () => {
    onSave(privateState)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-md dark:bg-[#222327] dark:text-slate-100 border-0 dark:border-[#121214] rounded-2xl shadow-xl transition-colors">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-slate-100">Privacy Settings</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-[#1A1A1E] p-4 rounded-xl border border-slate-200 dark:border-[#121214] transition-colors">
            <div>
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                <Lock size={16} /> Private Folder
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
                Require authentication to open and view the contents of this folder.
              </p>
            </div>
            
            <button 
              onClick={() => setPrivateState(!privateState)}
              className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 ${privateState ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${privateState ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="dark:hover:bg-[#1A1A1E] dark:text-slate-300">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}