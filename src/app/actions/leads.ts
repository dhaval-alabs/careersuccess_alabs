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
  gclid?: string
  source_keyword?: string
  page_url?: string
}

export async function createLeadAction(data: LeadEntry) {
  try {
    const supabase = await createClient()

    // Phone format cleanup: Prevent +91 91xxxxxxxx
    let cleanMobile = data.mobile.trim();
    if (data.countryCode === '+91' && cleanMobile.startsWith('91') && cleanMobile.length > 10) {
      cleanMobile = cleanMobile.substring(2); // Strip the extra 91 if someone typed it into the input
    }
    const cleanPhone = `${data.countryCode}${cleanMobile}`;

    const { error } = await supabase.from('leads').insert([{
      name: data.name,
      email: data.email,
      phone: cleanPhone, // Combined cleanly
      city: data.city,
      form_source: data.form_source || 'Default Landing Page',
      session_id: data.session_id,
      gclid: data.gclid,
      source_keyword: data.source_keyword,
      created_at: new Date().toISOString()
    }])

    if (error) {
      console.error("Lead insertion error:", error)
      return { success: false, error: 'Failed to save lead information' }
    }

    // CRM Webhook Push (Leadsquared API Sync)
    const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;
    if (CRM_WEBHOOK_URL) {
      try {
        // Leadsquared highly prefers split Name fields
        let firstName = data.name;
        let lastName = '';
        const nameParts = data.name.trim().split(' ');
        if (nameParts.length > 1) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        }

        // Leadsquared Lead Capture API format requires an array of attributes
        const lsqPayload = [
          { "Attribute": "FirstName", "Value": firstName },
          { "Attribute": "LastName", "Value": lastName },
          { "Attribute": "EmailAddress", "Value": data.email },
          { "Attribute": "Phone", "Value": cleanPhone },
          { "Attribute": "mx_City_name", "Value": data.city }, // Mapped to requested custom field
          { "Attribute": "Source", "Value": data.form_source || "Website Form" },
          { "Attribute": "mx_gclid", "Value": data.gclid || "" }, // Requested to send blank if not present
          { "Attribute": "mx_Keyword", "Value": data.source_keyword || "" },
          { "Attribute": "mx_Page_Url", "Value": data.page_url || "" },
          { "Attribute": "mx_terms_and_condition", "Value": "true" } // Assuming all submissions accepted consent
        ];

        await fetch(CRM_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lsqPayload)
        });
      } catch (webhookError) {
        console.error("CRM Webhook failed:", webhookError);
        // We don't fail the user submission if the CRM sync fails
      }
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
