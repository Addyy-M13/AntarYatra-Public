"use client"

import { useState } from "react"

const avatarKeyframes = `
  @keyframes avatarGradientFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes silhouettePulse {
    0%, 100% { opacity: 0.82; }
    50% { opacity: 1; }
  }
`

function AnimatedAvatar({
  from,
  via,
  to,
  delay = "0s",
}: {
  from: string
  via: string
  to: string
  delay?: string
}) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${from}, ${via}, ${to}, ${from})`,
          backgroundSize: "400% 400%",
          animation: `avatarGradientFlow 4s ease infinite`,
          animationDelay: delay,
        }}
      />
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{
          animation: `silhouettePulse 2.5s ease-in-out infinite`,
          animationDelay: delay,
        }}
      >
        {/* Head */}
        <circle cx="20" cy="13" r="7" fill="rgba(255,255,255,0.92)" />
        {/* Shoulders */}
        <path
          d="M4 44 C4 29.5 11 23 20 23 C29 23 36 29.5 36 44"
          fill="rgba(255,255,255,0.92)"
        />
      </svg>
    </div>
  )
}

const testimonials = [
  {
    quote:
      "AntarYatra changed how I deal with pressure during exams. The journaling and CBT tools are exactly what every engineering student needs — I wish I'd found it sooner.",
    name: "Ashish",
    role: "Student at IIT Kanpur",
    from: "#6366f1",
    via: "#8b5cf6",
    to: "#a855f7",
    delay: "0s",
  },
  {
    quote:
      "I was genuinely struggling to keep up mentally at BITS, but the mood tracking and guided breathing on AntarYatra helped me reclaim my peace. It's beautifully made.",
    name: "Shreya",
    role: "Student at BITS Pilani",
    from: "#f43f5e",
    via: "#ec4899",
    to: "#f97316",
    delay: "1.3s",
  },
  {
    quote:
      "Mental health support felt out of reach until I found AntarYatra. It's like a therapist in your pocket — always there, zero judgment. Every NIT student should try this.",
    name: "Rishab",
    role: "Student at NIT Calicut",
    from: "#10b981",
    via: "#06b6d4",
    to: "#3b82f6",
    delay: "0.7s",
  },
]

export function TestimonialsMinimal() {
  const [active, setActive] = useState(0)

  return (
    <>
      <style>{avatarKeyframes}</style>
      <div className="w-full max-w-2xl mx-auto px-6 py-16">
        {/* Quote */}
        <div className="relative min-h-40 mb-16 bg-gradient-to-b from-slate-800/50 to-slate-900/30 rounded-2xl p-10 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
          {testimonials.map((t, i) => (
            <p
              key={i}
              className={`
                absolute inset-4 text-lg md:text-xl font-light leading-relaxed text-slate-100
                transition-all duration-500 ease-out
                ${
                  active === i
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-4 blur-sm pointer-events-none"
                }
              `}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
          ))}
        </div>

        {/* Author Row */}
        <div className="flex items-center gap-6 bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
          {/* Avatars */}
          <div className="flex -space-x-2">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View testimonial from ${t.name}`}
                className={`
                  relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-900/50
                  transition-all duration-300 ease-out cursor-pointer
                  ${active === i ? "z-10 scale-110 ring-slate-700/80" : "opacity-60 hover:opacity-90 hover:scale-105"}
                `}
              >
                <AnimatedAvatar
                  from={t.from}
                  via={t.via}
                  to={t.to}
                  delay={t.delay}
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-600/40" />

          {/* Active Author Info */}
          <div className="relative flex-1 min-h-12">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`
                  absolute inset-0 flex flex-col justify-center
                  transition-all duration-300 ease-out
                  ${active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
                `}
              >
                <span className="text-sm font-semibold text-slate-100">{t.name}</span>
                <span className="text-xs text-slate-400">{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
