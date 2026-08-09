"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function PlayerCodePage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<any | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const rawCode = params?.code || ''
  const code = decodeURIComponent(rawCode).trim()

  useEffect(() => {
    if (!code) {
      router.replace('/')
      return
    }

    ;(async () => {
      try {
        const res = await fetch(`/api/auth?code=${encodeURIComponent(code)}`)
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          setError(j?.error || 'Código inválido')
          setLoading(false)
          return
        }

        const j = await res.json()
        if (j.role !== 'player') {
          setError('Este código não é de um jogador')
          setLoading(false)
          return
        }

        const sessionObj = { role: j.role, id: j.target_id }
        localStorage.setItem('rpg_session', JSON.stringify(sessionObj))
        setSession(sessionObj)
        setLoading(false)
      } catch (err) {
        setError('Erro ao validar código')
        setLoading(false)
      }
    })()
  }, [code, router])

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
        // ignore
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

  if (loading) return <div>Carregando...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Ficha do Jogador</h1>
      <p className="mb-2">Código do Jogador: {code}</p>
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
