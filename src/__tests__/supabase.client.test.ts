import { describe, it, expect } from 'vitest'
import { createSupabaseClient } from '@/lib/db/supabase'

describe('createSupabaseClient', () => {
  it('returns a supabase client with from method', () => {
    const client = createSupabaseClient({
      url: 'http://localhost:54321',
      anonKey: 'test-key',
    })
    expect(client.from).toBeTypeOf('function')
  })

  it('returns a supabase client with auth property', () => {
    const client = createSupabaseClient({
      url: 'http://localhost:54321',
      anonKey: 'test-key',
    })
    expect(client.auth).toBeDefined()
  })
})
