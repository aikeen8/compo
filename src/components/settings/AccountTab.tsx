import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"
import { Loader2 } from "lucide-react"

export function AccountTab() {
  const [email, setEmail] = useState("Loading...")
  const [newPassword, setNewPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
    }
    fetchUser()
  }, [])

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      setMessage("password must be at least 6 characters.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    setIsUpdating(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    
    if (error) {
      setMessage("error updating password.")
    } else {
      setMessage("password updated successfully!")
      setNewPassword("")
    }
    
    setIsUpdating(false)
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <div className="max-w-xl pr-2 pb-6">
      <h3 className="text-xl font-semibold mb-6 dark:text-white">My Account</h3>

      <div className="bg-slate-50 dark:bg-[#1A1A1E] p-5 rounded-xl border border-slate-200 dark:border-[#121214] mb-8 flex items-center justify-between transition-colors">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email address</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">{email}</p>
        </div>
      </div>

      <div className="mb-8 border-t border-slate-200 dark:border-[#1A1A1E] pt-8 transition-colors">
        <h4 className="text-lg font-semibold mb-4 dark:text-white">Change Password</h4>
        
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            update your account password below. it must be at least 6 characters long.
          </p>
          
          <div className="flex flex-col gap-3 max-w-sm">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-[#222327] border border-slate-200 dark:border-[#121214] rounded-lg focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white text-sm transition-colors"
            />
            
            <div className="flex items-center gap-3 mt-1">
              <button 
                onClick={handleUpdatePassword}
                disabled={isUpdating || !newPassword}
                className="bg-brand-500 text-slate-900 dark:text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors flex items-center gap-2 w-fit"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : "Save New Password"}
              </button>
              
              {message && (
                <span className={`text-sm font-medium ${message.includes('error') || message.includes('least') ? 'text-rose-500' : 'text-brand-500'}`}>
                  {message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}