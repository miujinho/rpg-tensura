"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MasterPage() {
  const [session, setSession] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    const s = localStorage.getItem('rpg_session')
    if (!s) {
      router.replace('/')
      return
    }
    try {
      const obj = JSON.parse(s)
      if (obj.role !== 'master') {
        router.replace('/')
        return
      }
      setSession(obj)
    } catch (e) {
      router.replace('/')
    }
  }, [router])

  if (!session) return <div>Redirecionando...</div>

  return null
}
