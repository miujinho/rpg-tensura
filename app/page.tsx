"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasMasters, setHasMasters] = useState<boolean | null>(null)
  const [regName, setRegName] = useState('')
  const [regCode, setRegCode] = useState('')
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/master/exists')
        if (res.ok) {
          const j = await res.json()
          setHasMasters(Boolean(j.hasMasters))
        } else {
          setHasMasters(true)
        }
      } catch (e) {
        setHasMasters(true)
      }
    })()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j?.error || 'Código inválido')
        setLoading(false)
        return
      }

      const json = await res.json()
      const session = { role: json.role, id: json.target_id }
      localStorage.setItem('rpg_session', JSON.stringify(session))
      router.push(json.role === 'master' ? `/master/${code}` : `/player/${code}`)
    } catch (err) {
      setError('Erro de conexão')
      setLoading(false)
    }
  }

  async function registerMaster(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/master/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName || 'Mestre', code: regCode || undefined }),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j?.error || 'Erro ao registrar mestre')
        setLoading(false)
        return
      }

      const json = await res.json()
      const session = { role: json.role, id: json.target_id }
      localStorage.setItem('rpg_session', JSON.stringify(session))
      router.push(`/master/${json.code}`)
    } catch (err) {
      setError('Erro de conexão')
      setLoading(false)
    }
  }

  if (hasMasters === null) return <div>Carregando...</div>

  if (!hasMasters) {
    return (
      <section>
        <h1 className="mb-6 text-2xl font-semibold">Cadastrar Mestre</h1>
        <p className="mb-4">Ainda não há mestre cadastrado. Crie o Mestre inicial.</p>
        <form onSubmit={registerMaster} className="flex flex-col gap-3 max-w-md">
          <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Seu nome" className="border px-3 py-2 rounded" />
          <input value={regCode} onChange={(e) => setRegCode(e.target.value)} placeholder="Código desejado (opcional)" className="border px-3 py-2 rounded" />
          <button type="submit" disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Salvando...' : 'Criar Mestre'}</button>
          {error ? <div className="text-red-600">{error}</div> : null}
        </form>
      </section>
    )
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">Entrar com código</h1>
      <p className="mb-4">Cole o código do Mestre ou do Jogador para entrar.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input
          aria-label="Código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border px-3 py-2 rounded"
          placeholder="ex: AB12-CD34"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error ? <div className="text-red-600">{error}</div> : null}
      </form>

      <div className="mt-8 text-sm text-gray-600">
        <p>Se você for o Mestre, gere códigos na interface do Mestre.</p>
      </div>
    </section>
  )
}
