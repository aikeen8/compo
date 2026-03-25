import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, Brain, Coffee, Settings2, X } from "lucide-react"
import { useTheme } from "../ThemeProvider"

const accentHexMap: Record<string, string> = {
  indigo: '#6366f1',
  purple: '#a855f7',
  pink: '#ec4899',
  rose: '#f43f5e',
  orange: '#f97316',
  amber: '#fbbf24',
  emerald: '#10b981',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  slate: '#64748b'
}

export function PomodoroView() {
  const { accent, customColor } = useTheme()
  const activeColor = accent === 'custom' ? customColor : (accentHexMap[accent] || '#6366f1')

  // load saved durations from local storage, or use defaults
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('compo-pomodoro-durations')
    return saved ? JSON.parse(saved) : { work: 25, break: 5, longBreak: 15 }
  })

  // dynamically generate the modes using our saved durations
  const MODES = {
    work: { label: 'Focus', minutes: durations.work, icon: Brain },
    break: { label: 'Short Break', minutes: durations.break, icon: Coffee },
    longBreak: { label: 'Long Break', minutes: durations.longBreak, icon: Coffee }
  }

  const [mode, setMode] = useState<keyof typeof MODES>('work')
  const [timeLeft, setTimeLeft] = useState(MODES[mode].minutes * 60)
  const [isActive, setIsActive] = useState(false)
  
  // modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [tempDurations, setTempDurations] = useState(durations)

  if (timeLeft === 0 && isActive) {
    setIsActive(false)
    const nextMode = mode === 'work' ? 'break' : 'work'
    setMode(nextMode)
    setTimeLeft(MODES[nextMode].minutes * 60)
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const handleModeChange = (newMode: keyof typeof MODES) => {
    setMode(newMode)
    setTimeLeft(MODES[newMode].minutes * 60)
    setIsActive(false)
  }

  const toggleTimer = () => setIsActive(!isActive)
  
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(MODES[mode].minutes * 60)
  }

  const handleSaveSettings = () => {
    // ensure values are sensible (at least 1 minute, max 120 minutes)
    const safeDurations = {
      work: Math.max(1, Math.min(120, tempDurations.work || 25)),
      break: Math.max(1, Math.min(60, tempDurations.break || 5)),
      longBreak: Math.max(1, Math.min(60, tempDurations.longBreak || 15)),
    }
    
    setDurations(safeDurations)
    localStorage.setItem('compo-pomodoro-durations', JSON.stringify(safeDurations))
    
    // reset current timer to new settings
    setTimeLeft(safeDurations[mode] * 60)
    setIsActive(false)
    setIsSettingsOpen(false)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = 100 - ((timeLeft / (MODES[mode].minutes * 60)) * 100)

  return (
    <div className="flex-1 h-screen bg-white dark:bg-[#222327] transition-colors duration-200 flex flex-col items-center justify-center p-8 relative">
      
      <div className="flex items-center gap-3 mb-12">
        <div className="flex bg-slate-100 dark:bg-[#1A1A1E] p-1.5 rounded-2xl border border-slate-200 dark:border-[#121214] transition-colors">
          {(Object.keys(MODES) as Array<keyof typeof MODES>).map((key) => {
            const Icon = MODES[key].icon;
            const isSelected = mode === key;
            
            return (
              <button
                key={key}
                onClick={() => handleModeChange(key)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected 
                    ? 'bg-white dark:bg-[#222327] text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={16} className={isSelected ? 'text-brand-500 dark:text-brand-400' : ''} />
                <span className="hidden sm:inline">{MODES[key].label}</span>
              </button>
            )
          })}
        </div>

        <button 
          onClick={() => {
            setTempDurations(durations)
            setIsSettingsOpen(true)
          }}
          className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#1A1A1E] border border-slate-200 dark:border-[#121214] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          title="Timer Settings"
        >
          <Settings2 size={18} />
        </button>
      </div>

      <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center mb-12">
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none overflow-visible" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="48" 
            fill="none" 
            strokeWidth="2" 
            className="stroke-slate-100 dark:stroke-[#1A1A1E] transition-colors" 
          />
          <circle 
            cx="50" cy="50" r="48" 
            fill="none" 
            strokeWidth="2.5" 
            strokeDasharray="301.59" 
            strokeDashoffset={301.59 - (301.59 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            style={{ 
              stroke: activeColor,
              filter: `drop-shadow(0 0 6px ${activeColor}80)`
            }}
          />
        </svg>

        <div className="text-[5rem] md:text-[7rem] font-bold text-slate-800 dark:text-slate-100 tabular-nums tracking-tight">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="w-16 h-16 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:bg-[#1A1A1E] dark:hover:bg-[#2B2D31] transition-colors border border-slate-200 dark:border-[#121214]"
        >
          <RotateCcw size={24} />
        </button>
        
        <button 
          onClick={toggleTimer}
          className="w-16 h-16 flex items-center justify-center rounded-2xl text-white hover:scale-105 active:scale-95 transition-all bg-brand-500 hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
          style={{ boxShadow: `0 10px 25px -5px ${activeColor}80` }}
        >
          {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1A1A1E] border border-slate-200 dark:border-[#222327] rounded-3xl p-6 w-full max-w-sm shadow-xl transition-colors">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Timer Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Focus (minutes)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="120" 
                  value={tempDurations.work} 
                  onChange={(e) => setTempDurations({...tempDurations, work: parseInt(e.target.value) || 0})}
                  className="w-20 px-3 py-2 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#222327] rounded-xl text-center font-semibold focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-colors"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Short Break (minutes)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="60" 
                  value={tempDurations.break} 
                  onChange={(e) => setTempDurations({...tempDurations, break: parseInt(e.target.value) || 0})}
                  className="w-20 px-3 py-2 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#222327] rounded-xl text-center font-semibold focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-colors"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Long Break (minutes)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="60" 
                  value={tempDurations.longBreak} 
                  onChange={(e) => setTempDurations({...tempDurations, longBreak: parseInt(e.target.value) || 0})}
                  className="w-20 px-3 py-2 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#222327] rounded-xl text-center font-semibold focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222327] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white transition-colors"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}