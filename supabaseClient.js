import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 URL과 방금 복사하신 공개 키(sb_publishable_...)를 여기에 입력합니다.
const SUPABASE_URL = 'https://gclasfufajvjlskgipy.supabase.co'
const SUPABASE_ANON_KEY = 'Sb_publishable_nEWP6UpwlxPk4GevXFoYSg_YysjjBm7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
