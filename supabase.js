// supabase.js
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and Anon key
const supabaseUrl = 'https://vybfylvvgmfybuodznan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5YmZ5bHZ2Z21meWJ1b2R6bmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0ODU2NTUsImV4cCI6MjA1NjA2MTY1NX0.O-Zl03IOpHKhgdEqkTjH2aRCyYb0e-9dz7uSBctC14k';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
