const MOODS = [
  { id: "bored",    label: "😐 Bored",    color: "hover:bg-yellow-500/20 hover:border-yellow-500" },
  { id: "focused",  label: "🎯 Focused",  color: "hover:bg-blue-500/20 hover:border-blue-500" },
  { id: "lazy",     label: "🛋️ Lazy",     color: "hover:bg-purple-500/20 hover:border-purple-500" },
  { id: "creative", label: "✨ Creative", color: "hover:bg-pink-500/20 hover:border-pink-500" },
]

function MoodSelector({ mood, onMoodChange, time, onTimeChange }) {
  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Mood buttons */}
      <div>
        <p className="text-zinc-400 text-sm mb-3 uppercase tracking-widest">How are you feeling?</p>
        <div className="grid grid-cols-2 gap-3">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => onMoodChange(m.id)}
              className={`
                border rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                ${mood === m.id
                  ? "bg-white text-zinc-900 border-white"
                  : `border-zinc-700 text-zinc-300 ${m.color}`
                }
              `}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time slider */}
      <div>
        <p className="text-zinc-400 text-sm mb-3 uppercase tracking-widest">
          Available time: <span className="text-white font-semibold">{time} min</span>
        </p>
        <input
          type="range"
          min={5}
          max={120}
          step={5}
          value={time}
          onChange={(e) => onTimeChange(Number(e.target.value))}
          className="w-full accent-white"
        />
        <div className="flex justify-between text-zinc-600 text-xs mt-1">
          <span>5 min</span>
          <span>2 hrs</span>
        </div>
      </div>

    </div>
  )
}

export default MoodSelector