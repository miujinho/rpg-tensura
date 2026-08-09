import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function makeCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out.match(/.{1,4}/g)?.join('-') || out
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const master_id = body?.master_id
  const player_name = body?.player_name || 'Jogador'
  if (!master_id) return NextResponse.json({ error: 'master_id obrigatório' }, { status: 400 })

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // create player
  const { data: playerData, error: playerErr } = await supabase
    .from('players')
    .insert({ name: player_name })
    .select('id')
    .limit(1)
    .maybeSingle()

  if (playerErr || !playerData) return NextResponse.json({ error: 'falha ao criar jogador' }, { status: 500 })

  const code = makeCode()

  const { error: codeErr } = await supabase.from('codes').insert({ code, role: 'player', target_id: playerData.id })
  if (codeErr) return NextResponse.json({ error: 'falha ao criar código' }, { status: 500 })

  return NextResponse.json({ code, player_id: playerData.id })
}
