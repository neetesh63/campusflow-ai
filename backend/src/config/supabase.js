const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase = null;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in backend/.env.');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('Supabase backend service-role client initialized.');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error.message);
  }
}

module.exports = { supabase, supabaseUrl, supabaseServiceKey };
