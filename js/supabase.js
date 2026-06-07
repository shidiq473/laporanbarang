import { createClient }
from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl =
'https://zfccpcvcuiawdywdgnci.supabase.co'

const supabaseKey =
'sb_publishable_zN5zguRDORnobHXOHHfJNw_r4S5zzsH'

export const supabase =
createClient(
    supabaseUrl,
    supabaseKey
)