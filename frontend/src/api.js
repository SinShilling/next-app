const BASE = "http://localhost:8000"

export async function getSuggestion(mood, time) {
  try {
    const res = await fetch(`${BASE}/suggest?mood=${mood}&time=${time}`)
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return { ok: true, data }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

export async function postFeedback(item_id, action, mood, available_time) {
  try {
    const res = await fetch(`${BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id, action, mood, available_time })
    })
    return await res.json()
  } catch (err) {
    console.error("Feedback failed:", err)
  }
}

export async function getItems() {
  try {
    const res = await fetch(`${BASE}/items`)
    return await res.json()
  } catch (err) {
    console.error("Failed to fetch items:", err)
    return []
  }
}

export async function addItem(title, category, duration_minutes) {
  const res = await fetch(`${BASE}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, category, duration_minutes })
  })
  return res.json()
}

export async function deleteItem(id) {
  await fetch(`${BASE}/items/${id}`, { method: "DELETE" })
}

export async function resetItem(id) {
  await fetch(`${BASE}/items/${id}/reset`, { method: "PATCH" })
}