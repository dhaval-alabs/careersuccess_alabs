'use client';

import React, { FormEvent, useRef, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useLeadTracker } from '@/hooks/useLeadTracker';

export interface LeadCaptureFormProps {
    sourceName: string; // e.g., 'hero_banner', 'cta_banner'
    buttonText?: string;
    // Allow passing default intrestedIn or redirect urls if needed
    redirectUrl?: string;
    interestedInId?: string;
}

// Extracted from legacy PHP array
const COUNTRY_CODES = [
    '+91', '+1', '+44', '+61', '+81', '+86', '+49', '+33', '+971', '+65'
];

export function LeadCaptureForm({ sourceName, buttonText = "Submit", redirectUrl, interestedInId }: LeadCaptureFormProps) {
    const sessionId = useLeadTracker();
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Remove legacy reCAPTCHA handling and initialize clean state
    const [formData, setFormData] = useState({
        name: '',
        code: '+91',
        mobile: '',
        email: '',
        city: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const supabase = createClient();

            // Convert to a plain object for raw JSON storage
            const rawHtmlData: Record<string, string> = {
                ...formData,
                source: sourceName,
                redirectUrl: redirectUrl || '',
                interestedInId: interestedInId || ''
            };

            const { error: dbError } = await supabase.from('leads').insert({
                session_id: sessionId || 'unknown_session',
                name: formData.name,
                email: formData.email,
                phone: `${formData.code}${formData.mobile}`,
                form_source: sourceName,
                raw_html_data: rawHtmlData
            });

            if (dbError) throw dbError;

            setStatus('success');

            // Handle legacy redirect if provided
            if (redirectUrl) {
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1500);
            }

        } catch (error) {
            console.error('Error submitting lead:', error);
            setStatus('error');
        }
    };

    return (
        <div className="lead-capture-wrapper relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-bold font-sora text-white mb-2">Request Information</h3>
                <p className="text-sm text-white/60">Fill out the form below and our team will get back to you.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 w-full flex flex-col gap-4 text-left">

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/80" htmlFor="cs-alabs-contact-form-name">Name</label>
                    <input
                        type="text"
                        maxLength={50}
                        name="name"
                        id="cs-alabs-contact-form-name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--teal)] transition-colors"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Mobile / Code Row */}
                <div className="grid grid-cols-[100px_1fr] gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="cs-alabs-contact-form-code" className="text-sm font-medium text-white/80">Code</label>
                        <select
                            name="code"
                            id="cs-alabs-contact-form-code"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-[var(--teal)] transition-colors appearance-none cursor-pointer"
                            required
                            value={formData.code}
                            onChange={handleInputChange}
                        >
                            {COUNTRY_CODES.map(code => (
                                <option key={code} value={code} className="bg-[var(--navy)] text-white">{code}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="cs-alabs-contact-form-mobile" className="text-sm font-medium text-white/80">Mobile</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--teal)] transition-colors"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            name="mobile"
                            onKeyPress={isNumber}
                            id="cs-alabs-contact-form-mobile"
                            placeholder="Mobile Number"
                            required
                            value={formData.mobile}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/80" htmlFor="cs-alabs-contact-form-email">Email</label>
                    <input
                        type="email"
                        maxLength={50}
                        name="email"
                        id="cs-alabs-contact-form-email"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--teal)] transition-colors"
                        placeholder="Your Email Address"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5 mb-2">
                    <label htmlFor="cs-alabs-contact-form-city" className="text-sm font-medium text-white/80">Select City</label>
                    <select
                        name="city"
                        id="cs-alabs-contact-form-city"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--teal)] transition-colors appearance-none cursor-pointer"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled className="bg-[var(--navy)] text-white/50">Select your city...</option>
                        <option value="Bangalore" className="bg-[var(--navy)] text-white">Bangalore</option>
                        <option value="Chennai" className="bg-[var(--navy)] text-white">Chennai</option>
                        <option value="Delhi" className="bg-[var(--navy)] text-white">Delhi</option>
                        <option value="Gurgaon" className="bg-[var(--navy)] text-white">Gurgaon</option>
                        <option value="Hyderabad" className="bg-[var(--navy)] text-white">Hyderabad</option>
                        <option value="Kolkata" className="bg-[var(--navy)] text-white">Kolkata</option>
                        <option value="Mumbai" className="bg-[var(--navy)] text-white">Mumbai</option>
                        <option value="Noida" className="bg-[var(--navy)] text-white">Noida</option>
                        <option value="Pune" className="bg-[var(--navy)] text-white">Pune</option>
                        <option value="Other" className="bg-[var(--navy)] text-white">Other</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[var(--teal)] hover:bg-[var(--teal-hover)] text-[var(--navy)] font-bold py-3.5 px-6 rounded-lg font-sora transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    disabled={status === 'submitting' || status === 'success'}
                >
                    {status === 'submitting' ? 'Submitting...' : buttonText}
                </button>

                {/* Status Overlays */}
                {status === 'success' && (
                    <div className="absolute inset-0 bg-[var(--navy)]/95 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl z-20 text-white p-6 text-center shadow-inner">
                        <div className="w-16 h-16 bg-[var(--teal)]/20 text-[var(--teal)] rounded-full flex items-center justify-center mb-4 text-3xl border-2 border-[var(--teal)]/30">✓</div>
                        <h4 className="font-sora font-bold text-xl mb-2 text-white">Application Received</h4>
                        <p className="text-sm text-white/70">Our admissions team will contact you shortly.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500/90 backdrop-blur-sm text-white text-sm font-medium text-center py-3 px-4 rounded-t-2xl z-20">
                        There was an error submitting your details. Please try again.
                    </div>
                )}
            </form>
        </div>
    );
}
