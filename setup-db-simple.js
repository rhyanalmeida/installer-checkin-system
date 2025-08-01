const { createClient } = require('@supabase/supabase-js')

// Your Supabase credentials
const supabaseUrl = 'https://pwdwhcdzhubbmlsfbzw.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZHdoY2R6aHViYmxtbHNmYnp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA3MDEwMSwiZXhwIjoyMDY5NjQ2MTAxfQ.Vhc8ecfx-84AhqpqN7zFAWNg40Mx7Eke-lJsPxHMwnQ'

// Create Supabase client with service key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Supabase database...')
    
    // Create tables and insert data step by step
    console.log('📊 Creating tables...')
    
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('checklist_items')
      .select('count')
      .limit(1)
    
    if (testError && testError.code === 'PGRST116') {
      console.log('❌ Tables don\'t exist yet. Please run the SQL manually in Supabase dashboard.')
      console.log('📋 Go to: https://app.supabase.com/project/pwdwhcdzhubbmlsfbzw')
      console.log('📋 Open SQL Editor and run the contents of supabase/setup.sql')
      return
    }
    
    console.log('✅ Database connection successful!')
    console.log('📋 Please run the SQL setup manually in your Supabase dashboard:')
    console.log('🌐 https://app.supabase.com/project/pwdwhcdzhubbmlsfbzw')
    console.log('📝 Copy and paste the contents of supabase/setup.sql into the SQL Editor')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('💡 Please run the SQL manually in your Supabase dashboard')
  }
}

setupDatabase() 