const CATEGORY_STYLES = {
  study:     { color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/30",   label: "📚 Study" },
  game:      { color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30",  label: "🎮 Game" },
  browse:    { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", label: "🌐 Browse" },
  stimulate: { color: "text-pink-400",   bg: "bg-pink-500/10 border-pink-500/30",    label: "⚡ Stimulate" },
}

function SpinCard({ suggestion, loading, onSpin, onFeedback }) {
  const style = suggestion ? CATEGORY_STYLES[suggestion.category] : null

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* Suggestion card */}
      {suggestion && (
        <div className={`w-full border rounded-2xl p-6 flex flex-col gap-3 transition-all ${style.bg}`}>
          <span className={`text-xs font-semibold uppercase tracking-widest ${style.color}`}>
            {style.label}
          </span>
          <p className="text-white text-xl font-semibold leading-snug">
            {suggestion.title}
          </p>
          <span className="text-zinc-500 text-sm">
            ~{suggestion.duration_minutes} min
          </span>
        </div>
      )}

      {/* Feedback buttons — only show when there's a suggestion */}
      {suggestion && (
        <div className="flex gap-3 w-full">
          <button
            onClick={() => onFeedback("did_it")}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-green-500/40 text-green-400 text-sm font-medium hover:bg-green-500/10 transition-all disabled:opacity-30"
          >
            ✓ Did it
          </button>
          <button
            onClick={() => onFeedback("skip")}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-30"
          >
            ✗ Skip
          </button>
        </div>
      )}

      {/* NEXT / SPIN AGAIN button */}
      <button
        onClick={onSpin}
        disabled={loading}
        className={`
          w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all duration-200
          ${loading
            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            : "bg-white text-zinc-900 hover:bg-zinc-200 active:scale-95"
          }
        `}
      >
        {loading ? "..." : suggestion ? "↺ SPIN AGAIN" : "→ NEXT"}
      </button>

    </div>
  )
}

export default SpinCard