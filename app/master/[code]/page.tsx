"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function MasterCodePage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<any | null>(null)
  const [notes, setNotes] = useState('')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const rawCode = Array.isArray(params?.code) ? params?.code[0] : params?.code || ''
  const code = decodeURIComponent(rawCode).trim()

  async function generatePlayer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!session) return

    const res = await fetch('/api/master/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ master_id: session.id, player_name: newPlayerName || 'Jogador' }),
    })

    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      return alert(j?.error || 'falha ao gerar código')
    }

    const j = await res.json()
    setGeneratedCode(j.code)
    setNewPlayerName('')
  }

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
        if (j.role !== 'master') {
          setError('Este código não é de um mestre')
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
    if (!session) return
    ;(async () => {
      const res = await fetch(`/api/master/notes?master_id=${session.id}`)
      if (res.ok) {
        const j = await res.json()
        setNotes(j.notes || '')
      }
    })()
  }, [session])

  async function save() {
    if (!session) return
    const res = await fetch('/api/master/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ master_id: session.id, notes }),
    })
    if (!res.ok) return alert('falha ao salvar')
    alert('Notas salvas')
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Área do Mestre</h1>
      <p className="mb-2">Código: {code}</p>
      <p className="mb-2">ID do Mestre: {session?.id}</p>

      <div className="mt-4 mb-6">
        <h2 className="font-medium">Gerar código para Jogador</h2>
        <form onSubmit={generatePlayer} className="flex gap-2 mt-2">
          <input value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="Nome do jogador (opcional)" className="border px-3 py-2 rounded" />
          <button type="submit" className="bg-black text-white px-3 py-2 rounded">Gerar</button>
        </form>
        {generatedCode ? <div className="mt-2">Código gerado: <strong>{generatedCode}</strong></div> : null}
        <p className="mt-2 text-sm text-gray-600">Use esta página para gerir o mestre.</p>
      </div>

      <div className="mt-4">
        <h2 className="font-medium">Notas do Mestre</h2>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className="w-full border rounded p-2 mt-2" />
        <div className="mt-2">
          <button onClick={save} className="bg-black text-white px-3 py-2 rounded">Salvar notas</button>
        </div>
      </div>
    </section>
  )
}
