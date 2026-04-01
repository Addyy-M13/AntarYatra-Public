"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sparkles, BarChart3, Globe, Gift, Users, Shield,
  Brain, TrendingUp, MessageCircle, Cloud, Frown,
  Star, Menu, X, Heart, ArrowRight, ChevronDown,
} from "lucide-react"

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  bg:      "#070B14",
  surface: "#0C1220",
  card:    "#111928",
  border:  "#1C2540",
  amber:   "#E8A04A",
  teal:    "#48D6CC",
  text:    "#EDE9E3",
  muted:   "#7B8298",
  red:     "#E05555",
} as const

// ─────────────────────────────────────────────
// NOISE OVERLAY — adds grain/depth
// ─────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[60] opacity-[0.022]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px",
      }}
    />
  )
}

// ─────────────────────────────────────────────
// GLOW ORB — reusable atmospheric blob
// ─────────────────────────────────────────────
function GlowOrb({ color, size, className }: { color: string; size: number; className?: string }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}28 0%, transparent 70%)`,
        filter: "blur(80px)",
      }}
    />
  )
}

// ─────────────────────────────────────────────
// MANDALA HERO — animated SVG rings
// ─────────────────────────────────────────────
function MandalaHero() {
  return (
    <div className="relative w-full max-w-[460px] aspect-square mx-auto select-none">
      {/* ambient glow */}
      <div
        className="absolute inset-8 rounded-full"
        style={{
          background: `radial-gradient(circle, ${C.amber}22 0%, ${C.teal}10 50%, transparent 75%)`,
          filter: "blur(40px)",
        }}
      />

      <svg viewBox="0 0 480 480" className="w-full h-full relative z-10" aria-hidden="true">
        {/* outermost dashed ring */}
        <motion.circle
          cx="240" cy="240" r="222"
          fill="none" stroke={C.border} strokeWidth="1" strokeDasharray="3 9"
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "240px 240px" }}
        />

        {/* amber dashed ring */}
        <motion.circle
          cx="240" cy="240" r="188"
          fill="none" stroke={C.amber} strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="2 18"
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "240px 240px" }}
        />

        {/* teal solid ring */}
        <motion.circle
          cx="240" cy="240" r="152"
          fill="none" stroke={C.teal} strokeWidth="1" strokeOpacity="0.45" strokeDasharray="6 14"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "240px 240px" }}
        />

        {/* inner amber ring */}
        <motion.circle
          cx="240" cy="240" r="112"
          fill="none" stroke={C.amber} strokeWidth="1.2" strokeOpacity="0.6"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "240px 240px" }}
        />

        {/* cardinal dots on inner ring */}
        {[0, 90, 180, 270].map((deg) => {
          const r = (deg * Math.PI) / 180
          return (
            <circle
              key={deg}
              cx={240 + 112 * Math.cos(r)}
              cy={240 + 112 * Math.sin(r)}
              r="4.5"
              fill={C.amber}
              opacity="0.85"
            />
          )
        })}

        {/* 8-spoke geometric star */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          return (
            <motion.line
              key={i}
              x1="240" y1="240"
              x2={240 + 58 * Math.cos(angle)}
              y2={240 + 58 * Math.sin(angle)}
              stroke={i % 2 === 0 ? C.amber : C.teal}
              strokeWidth="1.5"
              strokeOpacity="0.7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.08 }}
            />
          )
        })}

        {/* inner octagon */}
        <motion.polygon
          points={Array.from({ length: 8 }).map((_, i) => {
            const a = (i * 45 - 22.5) * (Math.PI / 180)
            return `${240 + 48 * Math.cos(a)},${240 + 48 * Math.sin(a)}`
          }).join(" ")}
          fill="none"
          stroke={C.teal}
          strokeWidth="1"
          strokeOpacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />

        {/* breathing center circle */}
        <motion.circle
          cx="240" cy="240" r="36"
          fill={C.amber}
          fillOpacity="0.12"
          stroke={C.amber}
          strokeWidth="2"
          strokeOpacity="0.85"
          animate={{ r: [36, 46, 36], fillOpacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* center label */}
        <text x="240" y="236" textAnchor="middle" fill={C.amber} fontSize="11" fontFamily="serif" letterSpacing="3.5" opacity="0.9">ANTAR</text>
        <text x="240" y="252" textAnchor="middle" fill={C.amber} fontSize="11" fontFamily="serif" letterSpacing="3.5" opacity="0.9">YATRA</text>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const navLinks = [
    ["Features", "#features"],
    ["How It Works", "#how-it-works"],
    ["Testimonials", "#testimonials"],
    ["FAQ", "#faq"],
  ] as const

  return (
    <nav
      className="fixed top-0 inset-x-0 z-40 transition-all duration-500"
      style={{
        background: scrolled ? `${C.bg}DD` : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: `linear-gradient(135deg, ${C.amber}, ${C.teal})`,
              color: C.bg,
              fontFamily: `var(--font-fraunces, serif)`,
            }}
          >
            A
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
          >
            AntarYatra
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium transition-colors duration-200 hover:opacity-100"
              style={{ color: C.muted }}
            >
              {label}
            </a>
          ))}
          <a href="/crisis" className="text-sm font-medium" style={{ color: C.red }}>
            🆘 Crisis Support
          </a>
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => router.push("/login")}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold"
            style={{ background: C.amber, color: C.bg }}
            whileHover={{ scale: 1.04, boxShadow: `0 0 24px ${C.amber}44` }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started <ArrowRight size={13} />
          </motion.button>

          <button
            className="md:hidden"
            style={{ color: C.text }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden md:hidden"
            style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}
          >
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} className="text-sm font-medium py-1" style={{ color: C.text }}>
                  {label}
                </a>
              ))}
              <a href="/crisis" className="text-sm font-medium py-1" style={{ color: C.red }}>
                🆘 Crisis Support
              </a>
              <button
                onClick={() => router.push("/login")}
                className="py-2.5 rounded-full text-sm font-semibold mt-1"
                style={{ background: C.amber, color: C.bg }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function Hero() {
  const router = useRouter()
  const [greeting, setGreeting] = useState("Namaste")

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting("Good morning")
    else if (h < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
      style={{ background: C.bg }}
    >
      <GlowOrb color={C.amber} size={600} className="-top-40 -left-32" />
      <GlowOrb color={C.teal}  size={500} className="bottom-0 -right-32" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
        {/* Left — copy */}
        <div>
          <motion.p
            className="text-sm font-semibold mb-5"
            style={{ color: C.amber }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {greeting} 🙏
          </motion.p>

          <motion.div
            className="mb-5"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full font-medium"
              style={{
                background: `${C.amber}18`,
                color: C.amber,
                border: `1px solid ${C.amber}35`,
              }}
            >
              <Sparkles size={12} />
              AI-Powered Mental Wellness
            </span>
          </motion.div>

          <motion.h1
            className="text-[clamp(2.8rem,6vw,4.8rem)] font-bold leading-[1.04] mb-6"
            style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            Your Journey to{" "}
            <span
              style={{
                WebkitTextStroke: `2px ${C.amber}`,
                color: "transparent",
              }}
            >
              Inner Peace
            </span>
            <br />
            Starts Here
          </motion.h1>

          <motion.p
            className="text-lg leading-relaxed mb-8 max-w-[30rem]"
            style={{ color: C.muted }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6 }}
          >
            Transform anxiety into confidence with AI-guided journaling,
            personalized mood tracking, and a supportive community — in your language.
          </motion.p>

          {/* Social proof avatars */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.58, duration: 0.5 }}
          >
            <div className="flex -space-x-2.5">
              {([C.amber, C.teal, "#A78BFA", "#F87171", "#34D399"] as string[]).map((col, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold"
                  style={{ background: col + "30", borderColor: col, color: col }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: C.text }}>2,400+ active users</p>
              <div className="flex items-center gap-1 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} fill={C.amber} style={{ color: C.amber }} />
                ))}
                <span className="text-xs ml-0.5" style={{ color: C.muted }}>4.9 / 5.0</span>
              </div>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm"
              style={{ background: C.amber, color: C.bg }}
              whileHover={{ scale: 1.04, boxShadow: `0 0 34px ${C.amber}45` }}
              whileTap={{ scale: 0.97 }}
            >
              Start Your Journey <ArrowRight size={15} />
            </motion.button>
            <motion.a
              href="#features"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm"
              style={{ border: `1px solid ${C.border}`, color: C.text }}
              whileHover={{ borderColor: C.amber + "80", color: C.amber }}
              transition={{ duration: 0.18 }}
            >
              See Features
            </motion.a>
          </motion.div>

          <motion.p
            className="mt-4 text-xs"
            style={{ color: C.muted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Free to start · No credit card required
          </motion.p>
        </div>

        {/* Right — mandala */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.28, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <MandalaHero />
          <motion.p
            className="text-center text-xs mt-4 tracking-[0.25em] uppercase"
            style={{ color: C.muted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Breathe in · Breathe out
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// STATS BAND
// ─────────────────────────────────────────────
function StatsBand() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })

  const stats = [
    { number: "87%",   label: "Anxiety Reduction",  sub: "reported by users" },
    { number: "2,400+",label: "Active Users",        sub: "and growing daily" },
    { number: "11+",   label: "Indian Languages",    sub: "speak freely" },
    { number: "4.9★",  label: "User Rating",         sub: "trusted & loved" },
  ]

  return (
    <section ref={ref} className="py-16 relative overflow-hidden" style={{ background: C.surface }}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ background: `linear-gradient(135deg, ${C.amber} 0%, transparent 50%, ${C.teal} 100%)` }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div
                className="text-4xl lg:text-5xl font-bold mb-1"
                style={{ color: C.amber, fontFamily: `var(--font-fraunces, serif)` }}
              >
                {s.number}
              </div>
              <div className="font-semibold text-sm mb-1" style={{ color: C.text }}>{s.label}</div>
              <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// STRUGGLES
// ─────────────────────────────────────────────
function Struggles() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const items = [
    { Icon: Cloud,         title: "Overwhelming Anxiety",  desc: "Racing thoughts that keep you up at night, making it hard to focus on what truly matters." },
    { Icon: Brain,         title: "Mental Exhaustion",     desc: "Feeling drained from constantly managing stress without the right tools or support." },
    { Icon: MessageCircle, title: "Difficulty Expressing", desc: "Struggling to put your feelings into words, even when you desperately need to." },
    { Icon: Frown,         title: "Feeling Alone",         desc: "Battling your inner demons in silence, wishing someone truly understood." },
  ]

  return (
    <section ref={ref} className="py-24 relative" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold mb-3 tracking-[0.2em] uppercase" style={{ color: C.amber }}>
            You Are Not Alone
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-balance"
            style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
          >
            We Know What You're{" "}
            <span style={{ color: C.teal }}>Going Through</span>
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
            Millions face these challenges every day. Your feelings are valid — and help is here.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              className="rounded-2xl p-6"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.55 }}
              whileHover={{ borderColor: C.amber + "55", y: -4, transition: { duration: 0.18 } }}
            >
              <div
                className="mb-4 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${C.amber}18`, color: C.amber }}
              >
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: C.text }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// TRANSFORMATION — before / after metrics
// ─────────────────────────────────────────────
function Transformation() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const metrics = [
    { pct: 87, label: "Reduced Anxiety",     detail: "users report less daily anxiety after 4 weeks" },
    { pct: 92, label: "Mood Improvement",    detail: "experience more consistent emotional stability" },
    { pct: 95, label: "More Confident",      detail: "feel empowered to handle life's challenges" },
  ]

  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ background: C.surface }}>
      <GlowOrb color={C.teal} size={500} className="top-0 right-0 opacity-70" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold mb-3 tracking-[0.2em] uppercase" style={{ color: C.teal }}>
              Real Results
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-6 text-balance"
              style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
            >
              The{" "}
              <span style={{ color: C.amber }}>Transformation</span>{" "}
              You've Been Waiting For
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: C.muted }}>
              AntarYatra users report measurable improvements in their mental wellbeing
              within just a few weeks of consistent journaling and mood tracking.
            </p>
          </motion.div>

          {/* Right — metric bars */}
          <div className="space-y-7">
            {metrics.map(({ pct, label, detail }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.15 + 0.2, duration: 0.6 }}
              >
                <div className="flex items-end justify-between mb-2">
                  <span className="font-semibold text-sm" style={{ color: C.text }}>{label}</span>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: C.amber, fontFamily: `var(--font-fraunces, serif)` }}
                  >
                    {pct}%
                  </span>
                </div>
                {/* progress track */}
                <div className="h-2 rounded-full overflow-hidden" style={{ background: C.border }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${C.amber}, ${C.teal})`,
                    }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${pct}%` } : {}}
                    transition={{ delay: i * 0.15 + 0.4, duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: C.muted }}>{pct}% of {detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FEATURES BENTO GRID
// ─────────────────────────────────────────────
function Features() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const smallCards = [
    { Icon: BarChart3, title: "Mood Tracking",       desc: "Beautiful visualizations of your emotional patterns over time.", color: C.amber },
    { Icon: Gift,      title: "Rewards System",      desc: "Earn badges and unlock features as you build your journaling streak.", color: C.amber },
    { Icon: Users,     title: "Anonymous Community", desc: "Connect with peers in a safe, moderated, supportive space.", color: C.teal },
  ]

  return (
    <section id="features" ref={ref} className="py-24 relative" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold mb-3 tracking-[0.2em] uppercase" style={{ color: C.teal }}>
            Features
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-balance"
            style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
          >
            Everything You Need for{" "}
            <span style={{ color: C.amber }}>Mental Wellness</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Hero card — AI Journaling (spans 2 cols on lg) */}
          <motion.div
            className="lg:col-span-2 rounded-2xl p-8 relative overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            whileHover={{ borderColor: C.amber + "55", transition: { duration: 0.2 } }}
          >
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full"
              style={{ background: `radial-gradient(circle, ${C.amber}18 0%, transparent 70%)`, filter: "blur(40px)" }}
            />
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: `${C.amber}20`, color: C.amber }}
            >
              <Sparkles size={26} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: C.text }}>AI-Guided Journaling</h3>
            <p className="text-base leading-relaxed max-w-lg" style={{ color: C.muted }}>
              Smart prompts that adapt to your emotional state and help you explore deeper.
              Our AI understands context, nuance, and your personal journey — delivering
              insights that actually resonate.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Adaptive Prompts", "Emotional Analysis", "Pattern Recognition"].map(tag => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: `${C.amber}15`, color: C.amber }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Privacy card */}
          <motion.div
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            whileHover={{ borderColor: C.teal + "55", transition: { duration: 0.2 } }}
          >
            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full"
              style={{ background: `radial-gradient(circle, ${C.teal}18 0%, transparent 70%)`, filter: "blur(30px)" }}
            />
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: `${C.teal}20`, color: C.teal }}
            >
              <Shield size={26} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: C.text }}>Privacy First</h3>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              End-to-end encrypted. HIPAA compliant. Your thoughts are yours alone —
              we never sell or share your data.
            </p>
            <p className="mt-4 text-xs font-semibold" style={{ color: C.teal }}>
              256-bit encryption · WCAG 2.1 AA ↗
            </p>
          </motion.div>

          {/* Small cards row */}
          {smallCards.map(({ Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              className="rounded-2xl p-7"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.28 + i * 0.1 }}
              whileHover={{ borderColor: color + "55", y: -4, transition: { duration: 0.18 } }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}20`, color }}
              >
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: C.text }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{desc}</p>
            </motion.div>
          ))}

          {/* Multilingual — wide card */}
          <motion.div
            className="lg:col-span-3 rounded-2xl p-8 relative overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55 }}
            whileHover={{ borderColor: C.teal + "55", transition: { duration: 0.2 } }}
          >
            {/* Decorative Devanagari letterform */}
            <div
              className="absolute right-8 top-1/2 -translate-y-1/2 text-[10rem] font-serif leading-none select-none pointer-events-none"
              style={{ color: C.teal, opacity: 0.05 }}
              aria-hidden="true"
            >
              अ
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: `${C.teal}20`, color: C.teal }}
            >
              <Globe size={26} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: C.text }}>Multilingual Support</h3>
            <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: C.muted }}>
              Express yourself in English, Hinglish, Tamil, Telugu, Malayalam, Bangla, and more.
              Because healing happens best in the language closest to your heart.
            </p>
            <div className="flex flex-wrap gap-2">
              {["English", "Hinglish", "Tanglish", "Tenglish", "Manglish", "Banglish", "Marathi", "Gujarati", "Kannada", "Punjabi"].map(lang => (
                <span
                  key={lang}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: `${C.teal}15`, color: C.teal }}
                >
                  {lang}
                </span>
              ))}
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: `${C.teal}08`, color: C.muted }}
              >
                + more
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const steps = [
    { Icon: Sparkles,   num: "01", title: "Start Journaling", desc: "Express your thoughts freely with AI-guided prompts that help you dig deeper.", color: C.amber },
    { Icon: Brain,      num: "02", title: "AI Analysis",      desc: "Our AI understands your emotions and provides personalized insights and patterns.", color: C.teal },
    { Icon: TrendingUp, num: "03", title: "Track Progress",   desc: "Visualize your mental wellness journey with beautiful mood tracking and analytics.", color: C.amber },
    { Icon: Users,      num: "04", title: "Connect & Grow",   desc: "Share anonymously with a supportive community and celebrate your wins together.", color: C.teal },
  ]

  return (
    <section id="how-it-works" ref={ref} className="py-24" style={{ background: C.surface }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold mb-3 tracking-[0.2em] uppercase" style={{ color: C.amber }}>
            The Process
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
          >
            How{" "}
            <span style={{ color: C.amber }}>AntarYatra</span>{" "}
            Works
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: C.muted }}>
            Four simple steps to transform your mental wellness journey
          </p>
        </motion.div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* connector line (desktop only) */}
          <div
            className="absolute top-10 left-[10%] right-[10%] h-px hidden lg:block"
            style={{ background: `linear-gradient(90deg, ${C.amber}60, ${C.teal}60)` }}
          />

          {steps.map(({ Icon, num, title, desc, color }, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.14, duration: 0.6 }}
            >
              <div
                className="relative z-10 w-20 h-20 rounded-2xl flex flex-col items-center justify-center mb-5 mx-auto lg:mx-0"
                style={{ background: C.card, border: `2px solid ${color}40` }}
              >
                <span className="text-[10px] font-bold mb-0.5" style={{ color: color + "80" }}>{num}</span>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: C.text }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
function Testimonials() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const items = [
    {
      name: "Priya S.",  role: "Beta Tester",   color: C.amber,
      quote: "I tested AntarYatra during beta and the AI prompts made journaling so much easier. Can't wait for the full launch!",
    },
    {
      name: "Rahul M.", role: "Early Adopter",  color: C.teal,
      quote: "The mood tracking feature looks incredible. As someone who struggles with anxiety, I'm so excited to try this.",
    },
    {
      name: "Sara V.",  role: "Beta Tester",   color: C.amber,
      quote: "Being able to write in Hinglish is a game-changer. Finally, an app that understands how we actually communicate!",
    },
  ]

  return (
    <section id="testimonials" ref={ref} className="py-24" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold mb-3 tracking-[0.2em] uppercase" style={{ color: C.teal }}>
            Testimonials
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
          >
            Real Stories,{" "}
            <span style={{ color: C.teal }}>Real Transformations</span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: C.muted }}>Join thousands who've found their path to inner peace</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ name, role, quote, color }, i) => (
            <motion.div
              key={i}
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -4, borderColor: color + "44", transition: { duration: 0.18 } }}
            >
              {/* Large decorative quote */}
              <div
                className="absolute top-4 right-5 text-8xl font-serif leading-none pointer-events-none select-none"
                style={{ color, opacity: 0.08 }}
                aria-hidden="true"
              >
                "
              </div>

              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={13} fill={color} style={{ color }} />
                ))}
              </div>

              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: C.text + "CC" }}>
                "{quote}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: color + "28", color }}
                >
                  {name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: C.text }}>{name}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
function FAQ() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    { q: "Is my data private and secure?",          a: "Absolutely. All your journal entries are encrypted end-to-end. We never share your personal data with third parties, and you have complete control over what you share with the community." },
    { q: "How does the AI journaling work?",         a: "Our AI analyzes your writing patterns and emotional state to provide personalized prompts and insights. It learns from your entries to offer increasingly relevant guidance while maintaining complete privacy." },
    { q: "Can I write in my native language?",       a: "Yes! AntarYatra supports English, Hindi, and other popular Indian languages. You can switch between languages freely and express yourself however feels most natural." },
    { q: "Is AntarYatra a replacement for therapy?", a: "No, AntarYatra is a complementary tool for mental wellness, not a replacement for professional therapy. We encourage users to seek professional help when needed and use our platform as a supportive daily practice." },
    { q: "How much does it cost?",                   a: "We offer a free tier with core features including daily journaling and basic mood tracking. Premium features like advanced AI insights and unlimited community access are available through our subscription plans." },
    { q: "Can I use AntarYatra offline?",            a: "Yes! You can write journal entries offline, and they'll automatically sync when you're back online. Your mood tracking and insights will be available once synced." },
  ]

  return (
    <section id="faq" ref={ref} className="py-24" style={{ background: C.surface }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold mb-3 tracking-[0.2em] uppercase" style={{ color: C.amber }}>FAQ</p>
          <h2
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
          >
            Frequently Asked{" "}
            <span style={{ color: C.amber }}>Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${open === i ? C.amber + "40" : C.border}`,
                background: C.card,
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07 }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-base pr-4" style={{ color: C.text }}>{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                  style={{ color: C.amber }}
                >
                  <ChevronDown size={17} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────
function FinalCTA() {
  const router = useRouter()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-28 relative overflow-hidden" style={{ background: C.bg }}>
      <GlowOrb color={C.amber} size={600} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Top line accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16"
        style={{ background: `linear-gradient(to bottom, transparent, ${C.amber}50)` }}
      />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold mb-4 tracking-[0.2em] uppercase" style={{ color: C.amber }}>
            Begin Today
          </p>
          <h2
            className="text-[clamp(2.4rem,5vw,4rem)] font-bold mb-6 text-balance"
            style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}
          >
            Ready to Start Your{" "}
            <span style={{ color: C.amber }}>Inner Journey?</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: C.muted }}>
            Join thousands of users who've transformed their mental wellness with AntarYatra.
            Your path to inner peace starts today.
          </p>

          <motion.button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base"
            style={{ background: C.amber, color: C.bg }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${C.amber}55` }}
            whileTap={{ scale: 0.97 }}
          >
            Start Free Today <ArrowRight size={17} />
          </motion.button>

          <p className="mt-5 text-sm" style={{ color: C.muted }}>
            No credit card required · Free forever plan available
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: "Product",
      links: [["Features","#features"],["How It Works","#how-it-works"],["Testimonials","#testimonials"],["FAQ","#faq"]] as [string,string][],
    },
    {
      title: "Company",
      links: [["About Us","#"],["Blog","#"],["Contact","#"]] as [string,string][],
    },
    {
      title: "Legal",
      links: [["Privacy Policy","#"],["Terms of Service","#"],["Cookie Policy","#"],["Accessibility","#"]] as [string,string][],
    },
  ]

  return (
    <footer
      className="py-14"
      style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `linear-gradient(135deg, ${C.amber}, ${C.teal})`, color: C.bg, fontFamily: `var(--font-fraunces, serif)` }}
              >
                A
              </div>
              <span className="font-bold" style={{ color: C.text, fontFamily: `var(--font-fraunces, serif)` }}>
                AntarYatra
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              Your AI-powered companion for mental wellness and inner peace.
            </p>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4" style={{ color: C.text }}>{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm transition-colors duration-200 hover:opacity-100"
                      style={{ color: C.muted }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
            {["256-bit Encryption", "HIPAA Compliant", "WCAG 2.1 AA"].map(badge => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{ background: `${C.teal}12`, color: C.teal, border: `1px solid ${C.teal}22` }}
              >
                <Shield size={10} />
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-center" style={{ color: C.muted }}>
            <span>© 2025 AntarYatra. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              Made with <Heart size={12} fill={C.red} style={{ color: C.red }} /> for your mental wellness
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────
export function LandingPageV2() {
  return (
    <div style={{ fontFamily: `var(--font-jakarta, "Plus Jakarta Sans", system-ui, sans-serif)` }}>
      <NoiseOverlay />
      <Nav />
      <Hero />
      <StatsBand />
      <Struggles />
      <Features />
      <Transformation />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
