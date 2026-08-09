import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data, error, count } = await supabase.from('masters').select('id', { count: 'exact' })
  if (error) return NextResponse.json({ error: 'erro ao verificar mestres' }, { status: 500 })

  const hasMasters = (typeof count === 'number' && count > 0) || (Array.isArray(data) && data.length > 0)
  return NextResponse.json({ hasMasters })
}
