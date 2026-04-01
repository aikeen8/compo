import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"
import { Loader2, ShieldCheck, Download, Eye, EyeOff } from "lucide-react"

export function DataPrivacyTab() {
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('user_settings').select('pin').eq('user_id', user.id).single()
        if (data?.pin) setPin(data.pin)
      }
      setIsLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSavePin = async () => {
    if (pin.length !== 4) return
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_settings').upsert({ user_id: user.id, pin: pin })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setIsSaving(false)
  }

  const handleRemovePin = async () => {
    setIsSaving(true)
    setPin("")
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_settings').upsert({ user_id: user.id, pin: null })
    }
    setIsSaving(false)
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [foldersRes, categoriesRes, itemsRes] = await Promise.all([
        supabase.from('folders').select('*').eq('user_id', user.id).neq('is_deleted', true).order('created_at', { ascending: true }),
        supabase.from('categories').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('items').select('*').eq('user_id', user.id).neq('is_deleted', true).order('created_at', { ascending: true })
      ])

      const safeFolders = foldersRes.data || []
      const safeCategories = categoriesRes.data || []
      const safeItems = itemsRes.data || []

      const exportData = {
        exportedAt: new Date().toISOString(),
        folders: safeFolders.map(f => ({
          ...f,
          categories: safeCategories.filter(c => c.folder_id === f.id).map(c => ({
            ...c,
            items: safeItems.filter(i => i.category_id === c.id)
          }))
        }))
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `compo-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("error exporting data:", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" /></div>
  }

  return (
    <div className="max-w-xl pr-2">
      <h3 className="text-xl font-semibold mb-6 dark:text-white">Data & Privacy</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
        Manage your security PIN and export your workspace data.
      </p>

      <div className="bg-slate-50 dark:bg-[#1A1A1E] rounded-xl border border-slate-100 dark:border-[#222327] p-5 mb-6 transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="text-brand-500" size={20} />
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Privacy PIN</h4>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Set a 4-digit PIN to lock your private folders and notes. If you forget this PIN, you will not be able to access private items.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <input
              type={showPin ? "text" : "password"}
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              className="w-full sm:w-32 pl-4 pr-10 h-11 text-center text-lg font-bold tracking-[0.3em] bg-white dark:bg-[#222327] border border-slate-200 dark:border-[#121214] rounded-lg focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-colors [&::-ms-reveal]:hidden [&::-webkit-reveal]:hidden"
            />
            <button
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSavePin}
              disabled={pin.length !== 4 || isSaving}
              className="flex-1 sm:flex-none h-11 px-6 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save PIN'}
            </button>
            {pin && pin.length === 4 && (
              <button
                onClick={handleRemovePin}
                className="flex-1 sm:flex-none h-11 px-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-medium rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        {saved && <p className="text-brand-500 text-xs mt-3 font-medium">PIN saved successfully.</p>}
      </div>

      <div className="bg-slate-50 dark:bg-[#1A1A1E] rounded-xl border border-slate-100 dark:border-[#222327] p-5 flex items-center justify-between transition-colors">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Export Data</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Download all your notes and tasks as a JSON file.</p>
        </div>
        <button 
          onClick={handleExportData}
          disabled={isExporting}
          className="p-2 ml-2 flex-shrink-0 text-slate-500 hover:bg-white dark:hover:bg-[#222327] hover:text-brand-500 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-[#121214] transition-all"
        >
          {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        </button>
      </div>
    </div>
  )
}