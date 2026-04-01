import { useState, ReactNode } from "react"
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
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setPrivateState(isPrivate);
  }

  const handleSave = () => {
    onSave(privateState)
    setIsOpen(false)
  }

  return (
    <>
      {children && <span onClick={() => setIsOpen(true)}>{children}</span>}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="w-[92vw] sm:max-w-md bg-white dark:bg-[#222327] border border-slate-200 dark:border-[#121214] rounded-[24px] p-6 shadow-xl transition-colors" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Privacy Settings</h3>
            <div className="py-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-[#1A1A1E] p-4 rounded-xl border border-slate-200 dark:border-[#121214] transition-colors">
                <div>
                  <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                    <Lock size={16} /> Private Folder
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
                    Require your 4-digit PIN to open and view the contents of this folder.
                  </p>
                </div>
                <button onClick={() => setPrivateState(!privateState)} className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 ${privateState ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${privateState ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white transition-colors">Save Settings</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}