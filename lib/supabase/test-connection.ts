import { createClient } from './client'

export async function testSupabaseConnection() {
  const supabase = createClient()
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('restaurants')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}
