import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, Brain, Coffee } from "lucide-react"
import { useTheme } from "../ThemeProvider"

const MODES = {
  work: { label: 'Focus', minutes: 25, icon: Brain },
  break: { label: 'Short Break', minutes: 5, icon: Coffee },
  longBreak: { label: 'Long Break', minutes: 15, icon: Coffee }
}

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

  const [mode, setMode] = useState<keyof typeof MODES>('work')
  const [timeLeft, setTimeLeft] = useState(MODES[mode].minutes * 60)
  const [isActive, setIsActive] = useState(false)

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = 100 - ((timeLeft / (MODES[mode].minutes * 60)) * 100)

  return (
    <div className="flex-1 h-screen bg-white dark:bg-[#222327] transition-colors duration-200 flex flex-col items-center justify-center p-8">
      
      <div className="flex bg-slate-100 dark:bg-[#1A1A1E] p-1.5 rounded-2xl mb-12 border border-slate-200 dark:border-[#121214] transition-colors">
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
              {MODES[key].label}
            </button>
          )
        })}
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

    </div>
  )
}