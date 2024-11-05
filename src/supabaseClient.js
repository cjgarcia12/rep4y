import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for environment variables in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key is missing!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
