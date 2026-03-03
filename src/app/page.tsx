import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-[var(--background)]">
      {/* Holographic background elements from the global styles */}
      <div className="holo-bg">
        <div className="holo-blob holo-blob-1"></div>
        <div className="holo-blob holo-blob-2"></div>
        <div className="holo-blob holo-blob-3"></div>
        <div className="holo-blob holo-blob-4"></div>
      </div>
      <div className="holo-grid opacity-40"></div>
      <div className="holo-shimmer"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-[5%] text-center fade-up">

        {/* Logo / Brand */}
        <div className="mb-12 inline-block">
          <h1 className="text-[2.5rem] font-sora font-extrabold tracking-tighter text-[var(--navy)] flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-xl bg-[var(--grad)] font-sora text-white flex items-center justify-center text-xl shadow-[0_8px_16px_rgba(0,217,126,0.3)]">
              AL
            </div>
            AnalytixLabs
          </h1>
        </div>

        {/* Message */}
        <h2 className="font-sora text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold text-[var(--navy)] leading-[1.1] tracking-tight mb-8">
          The best time to <span className="text-gradient">invest in your career</span> is right now.
        </h2>

        <p className="text-[var(--muted)] text-[clamp(1.1rem,2vw,1.3rem)] leading-[1.7] max-w-2xl mx-auto mb-12">
          The job market is evolving faster than ever. Equip yourself with the data, analytics, and AI skills that companies are desperately looking for today. Future-proof your trajectory.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/lp/business-analytics-ncr" className="btn-primary-custom text-[1.05rem] py-4 px-8 w-full sm:w-auto text-center">
            Explore Programs ↗
          </Link>
          <Link href="/login" className="btn-secondary-custom text-[1.05rem] py-4 px-8 w-full sm:w-auto text-center">
            Admin Login
          </Link>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 left-0 right-0 text-center text-[var(--muted-light)] text-sm px-6">
          © {new Date().getFullYear()} AnalytixLabs. A Nasscom-FutureSkills Prime Certified Program.
        </div>
      </div>
    </main>
  );
}
