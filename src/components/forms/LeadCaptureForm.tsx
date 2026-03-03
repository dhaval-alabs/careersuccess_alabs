'use client'

import { useState, useTransition } from 'react'
import { createLeadAction } from '@/app/actions/leads'

const INDIA_CITIES = [
  "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad",
  "Mumbai", "Pune", "Kolkata", "Kochi", "Trivandrum",
  "Jaipur", "Faridabad", "Navi Mumbai", "Noida", "Ahmedabad"
];

const COUNTRY_CODES = [
  { code: "+1", label: "+1 (US/CAN)" },
  { code: "+91", label: "+91 (IN)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+61", label: "+61 (AUS)" },
];

interface LeadCaptureFormProps {
  sourceName?: string;
  buttonText?: string;
}

export default function LeadCaptureForm({ sourceName = 'Hero Section', buttonText = 'Secure My Spot ↗' }: LeadCaptureFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({
    success: false,
    error: ''
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState({ success: false, error: '' })

    const formData = new FormData(e.currentTarget)

    // Explicit shape based on our constraints
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      countryCode: formData.get('countryCode') as string,
      mobile: formData.get('mobile') as string,
      city: formData.get('city') as string,
      form_source: sourceName, // Attribution
      session_id: typeof window !== 'undefined' ? sessionStorage.getItem('alabs_session_id') || undefined : undefined
    }

    startTransition(async () => {
      const result = await createLeadAction(data)
      if (result.success) {
        setFormState({ success: true, error: '' })
      } else {
        setFormState({ success: false, error: result.error || 'Failed to submit' })
      }
    })
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 shadow-2xl rounded-2xl max-w-lg w-full mx-auto border border-white/20" id="lead-capture-module">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-sora font-bold text-slate-900">Get Started Today</h3>
        <p className="text-slate-500 mt-2">Fill the form below to connect with our experts.</p>
      </div>

      {formState.success ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-xl mb-4 text-center border border-green-100 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <p className="font-bold text-lg">Inquiry Received!</p>
          <p className="text-sm opacity-90">Our career advisor will contact you within 24 hours.</p>
        </div>
      ) : (

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formState.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {formState.error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              maxLength={50}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all ring-offset-2"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                maxLength={75}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all ring-offset-2"
                placeholder="you@email.com"
              />
            </div>

            {/* City Dropdown (India Only) */}
            <div>
              <label htmlFor="city" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Current City</label>
              <select
                name="city"
                id="city"
                required
                defaultValue=""
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select City...</option>
                {INDIA_CITIES.sort().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Fields */}
          <div>
            <label htmlFor="mobile" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Mobile Number</label>
            <div className="flex gap-2">
              <div className="w-24 shrink-0">
                <select
                  name="countryCode"
                  id="countryCode"
                  defaultValue="+91"
                  className="w-full px-3 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all appearance-none cursor-pointer text-center"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
              </div>

              <div className="flex-grow">
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all ring-offset-2"
                  placeholder="10-digit mobile"
                />
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="mt-2 flex items-start gap-3 px-2">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                required
                className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-2 focus:ring-[#1A4A8F] cursor-pointer"
              />
            </div>
            <div className="text-xs text-slate-500 leading-tight">
              <label htmlFor="consent" className="cursor-pointer">
                I agree to the <a href="/privacy-policy" className="text-[#1A4A8F] underline hover:text-[#00D97E]">Privacy Policy</a> and consent to being contacted by AnalytixLabs regarding my career inquiry.
              </label>
              <span className="block mt-1 font-medium text-slate-400">No Spam ❤️ We promise.</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full btn-primary-custom !py-4 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Processing...' : buttonText}
          </button>
        </form>
      )}
    </div>
  )
}
