"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PlayerPage() {
  const [session, setSession] = useState<any | null>(null)
  const [notes, setNotes] = useState('')
  const router = useRouter()

  useEffect(() => {
    const s = localStorage.getItem('rpg_session')
    if (!s) {
      router.replace('/')
      return
    }
    try {
      const obj = JSON.parse(s)
      if (obj.role !== 'player') {
        router.replace('/')
        return
      }
      setSession(obj)
    } catch (e) {
      router.replace('/')
    }
  }, [router])

  useEffect(() => {
    const playerId = session?.id
    if (!playerId) return

    ;(async () => {
      try {
        const res = await fetch(`/api/player/notes?player_id=${encodeURIComponent(playerId)}`)
        if (res.ok) {
          const j = await res.json()
          setNotes(j.notes || '')
        }
      } catch (e) {
        // ignore network errors for now
      }
    })()
  }, [session])

  async function save() {
    const playerId = session?.id
    if (!playerId) return
    const res = await fetch('/api/player/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, notes }),
    })
    if (!res.ok) return alert('falha ao salvar')
    alert('Notas salvas')
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Ficha do Jogador</h1>
      <p className="mb-2">ID do Jogador: {session?.id}</p>

      <div className="mt-4">
        <h2 className="font-medium">Suas notas</h2>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={8} className="w-full border rounded p-2 mt-2" />
        <div className="mt-2">
          <button onClick={save} className="bg-black text-white px-3 py-2 rounded">Salvar notas</button>
        </div>
      </div>
    </section>
  )
}
