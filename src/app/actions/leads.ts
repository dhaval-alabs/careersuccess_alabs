'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface LeadEntry {
  name: string
  email: string
  countryCode: string
  mobile: string
  city: string
  form_source?: string
  session_id?: string
}

export async function createLeadAction(data: LeadEntry) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('leads').insert([{
      name: data.name,
      email: data.email,
      phone: `${data.countryCode} ${data.mobile}`, // Combine for UI compatibility
      city: data.city,
      form_source: data.form_source || 'Default Landing Page',
      session_id: data.session_id,
      created_at: new Date().toISOString()
    }])

    if (error) {
      console.error("Lead insertion error:", error)
      return { success: false, error: 'Failed to save lead information' }
    }

    revalidatePath('/admin/leads', 'page')
    return { success: true }
  } catch (error) {
    console.error("Runtime exception during lead insert:", error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function getLeads() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

export async function deleteLead(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('leads')
      .delete()
      .match({ id })

    if (error) throw error
    revalidatePath('/admin/leads', 'page')
    return { success: true }
  } catch (error) {
    console.error('Error deleting lead:', error)
    throw error
  }
}

export async function getLeadTimeline(sessionId: string | null | undefined) {
  if (!sessionId) return []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('lead_events') // Assuming this table exists based on LeadsClient logic
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching lead timeline:', error)
    return []
  }
}
