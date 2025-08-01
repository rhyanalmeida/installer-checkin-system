// Demo data for local testing without external database
export const demoData = {
  checkins: [] as any[],
  installers: [] as any[],
  projects: [] as any[]
}

export const demoStorage = {
  // Simulate localStorage for demo data
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Ignore errors in demo mode
    }
  }
}

// Demo functions that simulate Supabase operations
export const demoSupabase = {
  from: (table: string) => ({
    insert: async (data: any) => {
      const id = 'demo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      const newRecord = { ...data, id, created_at: new Date().toISOString() }
      
      // Store in localStorage for demo
      const existing = demoStorage.getItem(`demo_${table}`) || '[]'
      const records = JSON.parse(existing)
      records.push(newRecord)
      demoStorage.setItem(`demo_${table}`, JSON.stringify(records))
      
      return { data: newRecord, error: null }
    },
    update: async (_data: any) => {
      // Simulate update
      return { data: null, error: null }
    },
    select: async (_columns?: string) => {
      // Get from localStorage
      const existing = demoStorage.getItem(`demo_${table}`) || '[]'
      const records = JSON.parse(existing)
      return { data: records, error: null }
    },
    eq: function(_field: string, _value: any) {
      // Return the same object for chaining
      return this
    },
    order: function(_field: string, _options: any) {
      // Return the same object for chaining
      return this
    }
  }),
  functions: {
    invoke: async (name: string, options: any) => {
      // Simulate function call
      console.log(`Demo: ${name} called with`, options)
      return { data: { success: true }, error: null }
    }
  }
} 