// supabaseClient.js
import { createClient } from '@supabase/supabase-js';
// import dotenv from 'dotenv';

// dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || "https://zpurlnracdgqjjkbjjqu.supabase.co/"
const supabaseKey = process.env.SUPABASE_ANON_KEY|| "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdXJsbnJhY2RncWpqa2JqanF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjc3NDAsImV4cCI6MjA3Nzc0Mzc0MH0.YtG-6VsE_J4qU5kqXFatiz-6RuUdPkkOwwKKUY51IA8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;