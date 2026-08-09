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
  const name = ((body && body.name) || 'Mestre').trim()
  const providedCode = (body?.code || '').trim()

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data, error } = await supabase
    .from('masters')
    .insert({ name })
    .select('id')
    .limit(1)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'falha ao criar mestre' }, { status: 500 })

  const code = providedCode || makeCode()
  const { error: codeErr } = await supabase.from('codes').insert({ code, role: 'master', target_id: data.id })
  if (codeErr) return NextResponse.json({ error: 'falha ao criar código do mestre' }, { status: 500 })

  return NextResponse.json({ role: 'master', target_id: data.id, code })
}
