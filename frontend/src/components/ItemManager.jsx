import { useState, useEffect } from "react"
import { getItems, addItem, deleteItem, resetItem } from "../api"

const CATEGORIES = ["study", "game", "browse", "stimulate"]

const CATEGORY_COLORS = {
  study:     "text-blue-400 border-blue-500/30",
  game:      "text-green-400 border-green-500/30",
  browse:    "text-yellow-400 border-yellow-500/30",
  stimulate: "text-pink-400 border-pink-500/30",
}

function ItemManager({ onClose }) {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("study")
  const [duration, setDuration] = useState(15)
  const [loading, setLoading] = useState(false)

  // Fetch all items when panel opens
  useEffect(() => {
    getItems().then(setItems)
  }, [])

  const handleAdd = async () => {
    if (!title.trim()) return
    setLoading(true)
    await addItem(title.trim(), category, duration)
    const updated = await getItems()
    setItems(updated)
    setTitle("")
    setLoading(false)
  }

  const handleDelete = async (id) => {
    await deleteItem(id)
    setItems(items.filter(i => i.id !== id))
  }

  const handleReset = async (id) => {
    await resetItem(id)
    const updated = await getItems()
    setItems(updated)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-white font-bold text-lg">Manage Items</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        {/* Add form */}
        <div className="p-5 border-b border-zinc-800 flex flex-col gap-3">
          <input
            type="text"
            placeholder="What's the activity?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <div className="flex gap-3">
            {/* Category picker */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Duration */}
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                min={1}
                max={240}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
              />
              <span className="text-zinc-500 text-sm whitespace-nowrap">min</span>
            </div>

            <button
              onClick={handleAdd}
              disabled={loading || !title.trim()}
              className="px-4 py-2 bg-white text-zinc-900 rounded-xl text-sm font-bold hover:bg-zinc-200 disabled:opacity-40 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* Item list */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-2">
          {items.length === 0 && (
            <p className="text-zinc-600 text-sm text-center py-8">No items yet. Add one above.</p>
          )}
          {items.map(item => (
            <div
              key={item.id}
              className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${CATEGORY_COLORS[item.category]}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {item.duration_minutes} min · {item.category}
                  {item.skip_count > 0 && (
                    <span className="text-red-400 ml-2">skipped {item.skip_count}×</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {item.skip_count > 0 && (
                  <button
                    onClick={() => handleReset(item.id)}
                    className="text-zinc-500 hover:text-white text-xs transition-colors"
                    title="Reset skip count"
                  >
                    ↺
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default ItemManager