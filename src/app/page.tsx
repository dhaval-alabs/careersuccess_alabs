import Link from 'next/link';
import { Suspense } from 'react';
import LeadCaptureForm from '@/components/forms/LeadCaptureForm';
import { AnalyticsTracker } from '@/components/public/AnalyticsTracker';

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col font-sans overflow-hidden bg-[var(--background)]">
      {/* Holographic background elements from the global styles */}
      <div className="holo-bg">
        <div className="holo-blob holo-blob-1"></div>
        <div className="holo-blob holo-blob-2"></div>
        <div className="holo-blob holo-blob-3"></div>
        <div className="holo-blob holo-blob-4"></div>
      </div>
      <div className="holo-grid opacity-40"></div>
      <div className="holo-shimmer"></div>

      {/* Main Content Center */}
      <div className="relative flex-grow flex flex-col items-center justify-center z-10 w-full max-w-6xl mx-auto px-6 fade-up pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side: Copy */}
          <div className="text-left">
            {/* Logo / Brand */}
            <div className="mb-8 inline-block">
              <h1 className="text-2xl font-sora font-extrabold tracking-tighter text-[var(--navy)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--grad)] font-sora text-white flex items-center justify-center text-lg shadow-lg">
                  AL
                </div>
                AnalytixLabs
              </h1>
            </div>

            {/* Message */}
            <h2 className="font-sora text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-[var(--navy)] leading-tight tracking-tight mb-6">
              The best time to <span className="text-gradient">invest in your career</span> is right now.
            </h2>

            <p className="text-[var(--muted)] text-lg leading-relaxed mb-8 max-w-xl">
              Equip yourself with the data, analytics, and AI skills that companies are desperately looking for today. Future-proof your trajectory with Nasscom-certified programs.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/lp/business-analytics-ncr" className="btn-primary-custom text-base py-3 px-8 text-center">
                Explore Offers ↗
              </Link>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full max-w-md mx-auto lg:mr-0 animate-in slide-in-from-right duration-700">
            <LeadCaptureForm />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <AnalyticsTracker pageId="home" />
      </Suspense>

      {/* Footer info (Sticky at the bottom without overlapping) */}
      <div className="relative z-10 w-full text-center text-[var(--muted-light)] text-sm px-6 py-6 mt-auto">
        © {new Date().getFullYear()} AnalytixLabs. A Nasscom-FutureSkills Prime Certified Program.
      </div>
    </main>
  );
}
