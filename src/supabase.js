import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ohofmjzobckqfllowabo.supabase.co'

const supabaseKey = 'sb_publishable_m9C4e4ttjIKrUeYgnbl_vA_mdeGQvl5'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)