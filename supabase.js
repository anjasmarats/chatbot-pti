// supabaseClient.js
import { createClient } from '@supabase/supabase-js';
// import dotenv from 'dotenv';

// dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || "https://zihqizuhnplpwemzsaut.supabase.co"
const supabaseKey = process.env.SUPABASE_ANON_KEY|| "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppaHFpenVobnBscHdlbXpzYXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTE3NDUsImV4cCI6MjA4MTAyNzc0NX0.L6nGu8IgxtlF_8nlEn974BD3yNxP1BlL6dCqEcp6tYQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;