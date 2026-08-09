import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const player_id = url.searchParams.get('player_id')
  if (!player_id) return NextResponse.json({ error: 'player_id obrigatório' }, { status: 400 })

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase.from('players').select('notes').eq('id', player_id).limit(1).maybeSingle()
  if (error) return NextResponse.json({ error: 'falha ao buscar notas' }, { status: 500 })
  return NextResponse.json({ notes: data?.notes || '' })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const player_id = body?.player_id
  const notes = body?.notes || ''
  if (!player_id) return NextResponse.json({ error: 'player_id obrigatório' }, { status: 400 })

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase.from('players').update({ notes }).eq('id', player_id)
  if (error) return NextResponse.json({ error: 'falha ao atualizar notas' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
