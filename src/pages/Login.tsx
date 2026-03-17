import { useState, useEffect } from "react"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // temporary simulation of login success
    console.log("form submitted:", { email, password, isSignUp })
    navigate("/")
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
      `}</style>
      
      <div className="flex items-stretch justify-center gap-6 md:gap-8 w-full max-w-2xl">
        
        {/* vertical tagline */}
        <div className="hidden sm:flex items-center justify-center pt-16">
          <p 
            className="text-slate-300 dark:text-[#2B2D31] font-bold uppercase tracking-[0.4em] text-[11px] whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            a place to compose.
          </p>
        </div>

        <div className="w-full max-w-md">
          
          <div className="flex justify-center mb-8 h-10">
            <div className="relative flex items-center">
              {/* invisible placeholder to keep perfect centering while typing */}
              <h1 className="text-4xl font-extrabold tracking-tight flex items-center opacity-0 pointer-events-none select-none whitespace-nowrap">
                compo<span className="text-brand-500">.</span>
                <span className="w-1.5 h-8 ml-1"></span>
              </h1>
              
              {/* actual typing text positioned left-to-right */}
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

              <button className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#222327] dark:hover:bg-[#2B2D31] text-slate-700 dark:text-slate-200 py-3 rounded-xl font-medium transition-all mb-6 border border-slate-200 dark:border-[#121214]">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#222327] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 caret-brand-500 transition-all"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#222327] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 caret-brand-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] mt-2"
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <p>{isSignUp ? "Already have an account?" : "Don't have an account?"}</p>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold text-slate-800 hover:text-brand-500 dark:text-slate-200 dark:hover:text-brand-400 transition-colors"
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