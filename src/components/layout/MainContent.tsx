import { FileText } from "lucide-react"

export function MainContent() {
  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center transition-all duration-300">
      <div className="flex flex-col items-center text-slate-400">
        <FileText size={48} strokeWidth={1.5} className="mb-4 text-slate-300" />
        <p className="text-sm">Select or create a note to get started</p>
      </div>
    </main>
  )
}