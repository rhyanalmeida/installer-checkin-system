const { createClient } = require('@supabase/supabase-js')

// Your Supabase credentials
const supabaseUrl = 'https://pwdwhcdzhubbmlsfbzw.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZHdoY2R6aHViYmxtbHNmYnp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA3MDEwMSwiZXhwIjoyMDY5NjQ2MTAxfQ.Vhc8ecfx-84AhqpqN7zFAWNg40Mx7Eke-lJsPxHMwnQ'

// Create Supabase client with service key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Supabase database...')
    
    // Read the SQL file
    const fs = require('fs')
    const sql = fs.readFileSync('./supabase/setup.sql', 'utf8')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('❌ Error setting up database:', error)
      return
    }
    
    console.log('✅ Database setup completed successfully!')
    console.log('📊 Tables created: installers, checkins, checklist_items, email_templates')
    console.log('📋 17 checklist items inserted')
    console.log('🔒 Row Level Security enabled')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('💡 Please run the SQL manually in your Supabase dashboard')
  }
}

setupDatabase() 