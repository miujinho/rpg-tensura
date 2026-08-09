import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const code = (body && body.code) || ''
  if (!code) return NextResponse.json({ error: 'código obrigatório' }, { status: 400 })

  return validateCode(code)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code') || ''
  if (!code) return NextResponse.json({ error: 'código obrigatório' }, { status: 400 })

  return validateCode(code)
}

async function validateCode(code: string) {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data, error } = await supabase
    .from('codes')
    .select('role,target_id,expires_at')
    .eq('code', code)
    .limit(1)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'código inválido' }, { status: 401 })

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: 'código expirado' }, { status: 401 })
  }

  return NextResponse.json({ role: data.role, target_id: data.target_id })
}
