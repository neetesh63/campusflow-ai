const { supabase } = require('../config/supabase');

async function testSupabaseConnection(req, res) {
  try {
    if (!supabase) {
      return res.status(400).json({
        success: false,
        message: 'Supabase client is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env'
      });
    }

    // Ping Supabase by checking database connection / departments table
    const { data, error } = await supabase.from('departments').select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist yet, try basic auth ping
      const { data: authHealth, error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
      if (authError) {
        return res.status(500).json({
          success: false,
          message: 'Supabase connection failed',
          error: authError.message
        });
      }
    }

    return res.json({
      success: true,
      message: 'Supabase connection successful',
      status: 'connected'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Supabase connection failed',
      error: error.message
    });
  }
}

module.exports = {
  testSupabaseConnection
};
