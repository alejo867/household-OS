import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { supabase } from './supabase'
import { useAuth } from './useAuth'
import type { Household, HouseholdMember, Profile } from './types'

type HouseholdContextValue = {
  household: Household | null
  members: HouseholdMember[]
  loading: boolean
  createHousehold: (name: string) => Promise<void>
  joinHousehold: (code: string) => Promise<{ error?: string }>
  createInvite: () => Promise<string>
  refresh: () => Promise<void>
}

const HouseholdContext = createContext<HouseholdContextValue | undefined>(undefined)

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [household, setHousehold] = useState<Household | null>(null)
  const [members, setMembers] = useState<HouseholdMember[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) {
      setHousehold(null)
      setMembers([])
      setLoading(false)
      return
    }
    setLoading(true)

    const { data: membershipRows } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', user.id)
      .limit(1)

    const householdId = membershipRows?.[0]?.household_id

    if (!householdId) {
      setHousehold(null)
      setMembers([])
      setLoading(false)
      return
    }

    const [{ data: h }, { data: memberRows }] = await Promise.all([
      supabase.from('households').select('*').eq('id', householdId).maybeSingle(),
      supabase.from('household_members').select('*').eq('household_id', householdId)
    ])

    let withProfiles: HouseholdMember[] = memberRows ?? []
    if (memberRows && memberRows.length > 0) {
      const ids = memberRows.map((m) => m.user_id)
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids)
      const byId = new Map((profiles ?? []).map((p: Profile) => [p.id, p]))
      withProfiles = memberRows.map((m) => ({ ...m, profile: byId.get(m.user_id) }))
    }

    setHousehold((h as Household) ?? null)
    setMembers(withProfiles)
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const createHousehold = async (name: string) => {
    const { error } = await supabase.rpc('create_household', { hname: name })
    if (error) throw error
    await load()
  }

  const joinHousehold = async (code: string) => {
    const { error } = await supabase.rpc('redeem_invite', { p_code: code.trim().toUpperCase() })
    if (error) return { error: error.message }
    await load()
    return {}
  }

  const createInvite = async () => {
    if (!household) throw new Error('No household yet')
    const { data, error } = await supabase.rpc('create_invite', { p_household_id: household.id })
    if (error) throw error
    return data as string
  }

  return (
    <HouseholdContext.Provider
      value={{ household, members, loading, createHousehold, joinHousehold, createInvite, refresh: load }}
    >
      {children}
    </HouseholdContext.Provider>
  )
}

export function useHousehold() {
  const ctx = useContext(HouseholdContext)
  if (!ctx) throw new Error('useHousehold must be used within HouseholdProvider')
  return ctx
}
