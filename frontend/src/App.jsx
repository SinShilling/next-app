import { useState } from "react"
import MoodSelector from "./components/MoodSelector"
import SpinCard from "./components/SpinCard"
import ItemManager from "./components/ItemManager"
import { getSuggestion, postFeedback } from "./api"

function App() {
  const [mood, setMood] = useState("bored")
  const [time, setTime] = useState(30)
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showManager, setShowManager] = useState(false)

  const spin = async () => {
    setLoading(true)
    setError(null)
    const result = await getSuggestion(mood, time)
    if (result.ok) {
      setSuggestion(result.data)
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  const handleFeedback = async (action) => {
    if (!suggestion) return
    setLoading(true)
    setError(null)
    await postFeedback(suggestion.id, action, mood, time)
    const result = await getSuggestion(mood, time)
    if (result.ok) {
      setSuggestion(result.data)
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-5xl font-bold tracking-tight">NEXT</h1>
        <button
          onClick={() => setShowManager(true)}
          className="text-zinc-600 hover:text-zinc-300 transition-colors mt-2"
          title="Manage items"
        >
          ⚙
        </button>
      </div>
      <p className="text-zinc-500 text-sm mb-10">tell me what to do</p>

      <div className="w-full max-w-sm flex flex-col gap-8">
        <MoodSelector
          mood={mood}
          onMoodChange={setMood}
          time={time}
          onTimeChange={setTime}
        />
        {error && (
          <div className="w-full border border-red-500/30 bg-red-500/10 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}
        <SpinCard
          suggestion={suggestion}
          loading={loading}
          onSpin={spin}
          onFeedback={handleFeedback}
        />
      </div>

      {/* Item manager modal */}
      {showManager && <ItemManager onClose={() => setShowManager(false)} />}

    </div>
  )
}

export default App