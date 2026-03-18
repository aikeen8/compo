import { useState, useEffect } from "react"
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const [logoText, setLogoText] = useState("")
  const fullLogoText = "compo"

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setLogoText(fullLogoText.slice(0, i));
      i++;
      if (i > fullLogoText.length) clearInterval(timer);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        
        setMessage("Account created! Please check your email for the verification link.")
        setPassword("")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        navigate("/")
      }
    } catch (err) {
      const authError = err as Error;
      setError(authError.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // --- NEW: Google Login Handler ---
  const handleGoogleLogin = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // this sends them back to your app after google authenticates them
          redirectTo: window.location.origin 
        }
      })
      if (error) throw error
    } catch (err) {
      const authError = err as Error;
      setError(authError.message || "An error occurred with Google login.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError(null)
    setMessage(null)
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#121214] flex items-center justify-center p-4 transition-colors duration-300">
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }

        @keyframes shine {
          0% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-shine {
          --shine-base: #cbd5e1;
          --shine-highlight: #ffffff;
          background: linear-gradient(
            to bottom,
            var(--shine-base) 40%,
            var(--shine-highlight) 50%,
            var(--shine-base) 60%
          );
          background-size: 100% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }
        .dark .animate-shine {
          --shine-base: #2B2D31;
          --shine-highlight: #64748b;
        }
      `}</style>
      
      <div className="flex items-stretch justify-center gap-6 md:gap-8 w-full max-w-2xl">
        
        <div className="hidden sm:flex items-center justify-center pt-16">
          <p 
            className="animate-shine font-bold uppercase tracking-[0.4em] text-[11px] whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            a place to compose.
          </p>
        </div>

        <div className="w-full max-w-md">
          
          <div className="flex justify-center mb-8 h-10">
            <div className="relative flex items-center">
              <h1 className="text-4xl font-extrabold tracking-tight flex items-center opacity-0 pointer-events-none select-none whitespace-nowrap">
                compo<span className="text-brand-500">.</span>
                <span className="w-1.5 h-8 ml-1"></span>
              </h1>
              <h1 className="absolute left-0 text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center whitespace-nowrap">
                {logoText}
                {logoText === fullLogoText && <span className="text-brand-500">.</span>}
                <span className={`w-1.5 h-8 bg-brand-500 ml-1 rounded-sm ${logoText === fullLogoText ? 'animate-blink' : ''}`}></span>
              </h1>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1A1E] rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-[#222327]/60 overflow-hidden transition-colors">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                {isSignUp ? "Sign up to start organizing your workspace." : "Enter your details to access your workspace."}
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3 text-red-600 dark:text-red-400">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              
              {message && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-start gap-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}

              {/* --- NEW: Attached onClick handler --- */}
              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#222327] dark:hover:bg-[#2B2D31] text-slate-700 dark:text-slate-200 py-3 rounded-xl font-medium transition-all mb-6 border border-slate-200 dark:border-[#121214] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-slate-200 dark:bg-[#222327]"></div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Or</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-[#222327]"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#222327] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 caret-brand-500 transition-all disabled:opacity-50"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#222327] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 caret-brand-500 transition-all disabled:opacity-50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Sign In"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <p>{isSignUp ? "Already have an account?" : "Don't have an account?"}</p>
                <button
                  onClick={toggleMode}
                  disabled={isLoading}
                  className="font-bold text-slate-800 hover:text-brand-500 dark:text-slate-200 dark:hover:text-brand-400 transition-colors disabled:opacity-50"
                  type="button"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}