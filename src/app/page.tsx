import Link from 'next/link';
import { Suspense } from 'react';
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

          {/* Right Side: Feature Cards (Restored from Original Design) */}
          <div className="relative w-full lg:w-auto h-[450px] md:h-[500px] perspective-1000 hidden lg:block">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--teal)]/20 rounded-full blur-[80px]"></div>

            {/* Card 1 */}
            <div className="absolute top-[10%] left-[5%] w-[320px] bg-white/60 backdrop-blur-xl border border-white/40 p-5 rounded-2xl shadow-[0_15px_35px_rgba(26,74,143,0.06)] animate-float-slow transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgba(0,217,126,0.15)] text-[var(--teal)] flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-[var(--navy)] text-sm">Nasscom Certified</h4>
                  <p className="text-xs text-[var(--muted)]">Industry-recognized curriculum</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="absolute top-[40%] right-[-5%] w-[340px] bg-[#1A4A8F]/95 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_20px_40px_rgba(26,74,143,0.15)] animate-float-medium transform rotate-3 hover:rotate-0 transition-transform duration-500 z-10 text-white">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Applied AI & GenAI</h4>
                  <p className="text-xs text-white/70">Build agents, not just models</p>
                </div>
              </div>
              <div className="mt-3 bg-white/10 rounded-lg p-2 flex justify-between items-center text-xs">
                <span>Placement Success</span>
                <span className="font-bold text-[var(--teal)]">94%</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="absolute bottom-[5%] left-[15%] w-[290px] bg-white/70 backdrop-blur-xl border border-white/40 p-5 rounded-2xl shadow-[0_15px_35px_rgba(26,74,143,0.06)] animate-float-fast transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400"></div>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--navy)] text-sm text-[11px] uppercase tracking-wider">Join 35k+ Learners</h4>
                </div>
              </div>
            </div>
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
