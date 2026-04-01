"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  Sparkles, BarChart3, Globe, Gift, Users, Shield,
  Check, Menu, X, ArrowRight, Star, Heart,
  Brain, TrendingUp, Flame, ChevronDown, Sun, Moon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { CategoryList } from "@/components/ui/category-list"

// Dynamically import DottedSurface — Three.js requires the browser's window object
const DottedSurface = dynamic(
  () => import("@/components/ui/dotted-surface").then(m => m.DottedSurface),
  { ssr: false }
)

// ─────────────────────────────────────────────────────
// CSS CUSTOM PROPERTIES  (injected into the page head)
// Switches automatically with next-themes' .dark class
// ─────────────────────────────────────────────────────
const THEME_VARS = `
  :root {
    --ay-bg:       #FAF7F2;
    --ay-sf:       #F2EBE0;
    --ay-card:     #FFFFFF;
    --ay-bd:       #E2D9CE;
    --ay-tx:       #18231A;
    --ay-tx-d:     rgba(24,35,26,0.72);
    --ay-mt:       #6B7464;
    --ay-ac:       #E8700A;
    --ay-fo:       #1B3828;
    --ay-fo-sf:    #142D20;
    --ay-fo-tx:    #FAF7F2;
    --ay-fo-mt:    rgba(250,247,242,0.55);
    --ay-tl:       #2A9D8F;
    --ay-tl-bg:    rgba(42,157,143,0.09);
    --ay-tl-bd:    rgba(42,157,143,0.18);
    --ay-bl:       #F0C4A0;
    --ay-bl-d:     rgba(240,196,160,0.60);
    --ay-shadow:   0 4px 24px rgba(0,0,0,0.07);
    --ay-shadow-lg:0 16px 56px rgba(0,0,0,0.10);
  }
  .dark {
    --ay-bg:       #09110C;
    --ay-sf:       #0F1A12;
    --ay-card:     #141F17;
    --ay-bd:       #1E2D22;
    --ay-tx:       #EDE9E3;
    --ay-tx-d:     rgba(237,233,227,0.72);
    --ay-mt:       #8A9A8D;
    --ay-ac:       #E8700A;
    --ay-fo:       #0B1510;
    --ay-fo-sf:    #081009;
    --ay-fo-tx:    #EDE9E3;
    --ay-fo-mt:    rgba(237,233,227,0.50);
    --ay-tl:       #3DBFB0;
    --ay-tl-bg:    rgba(61,191,176,0.09);
    --ay-tl-bd:    rgba(61,191,176,0.18);
    --ay-bl:       #C4907A;
    --ay-bl-d:     rgba(196,144,122,0.45);
    --ay-shadow:   0 4px 24px rgba(0,0,0,0.30);
    --ay-shadow-lg:0 16px 56px rgba(0,0,0,0.50);
  }
`

// Convenience shorthands — use these everywhere instead of raw hex
const V = {
  bg:      "var(--ay-bg)",
  sf:      "var(--ay-sf)",
  card:    "var(--ay-card)",
  bd:      "var(--ay-bd)",
  tx:      "var(--ay-tx)",
  txd:     "var(--ay-tx-d)",
  mt:      "var(--ay-mt)",
  ac:      "var(--ay-ac)",        // saffron — same both modes
  fo:      "var(--ay-fo)",        // forest section bg
  foSf:    "var(--ay-fo-sf)",     // darker forest
  foTx:    "var(--ay-fo-tx)",     // text on forest
  foMt:    "var(--ay-fo-mt)",     // muted text on forest
  tl:      "var(--ay-tl)",
  tlBg:    "var(--ay-tl-bg)",
  tlBd:    "var(--ay-tl-bd)",
  bl:      "var(--ay-bl)",
  bld:     "var(--ay-bl-d)",
  shadow:  "var(--ay-shadow)",
  shadowLg:"var(--ay-shadow-lg)",
} as const

const SERIF = `var(--font-fraunces, "Fraunces", Georgia, serif)`
const SANS  = `var(--font-jakarta, "Plus Jakarta Sans", system-ui, sans-serif)`

// Fixed accent rgba helpers (saffron is identical in both modes)
const ac = (a: number) => `rgba(232,112,10,${a})`

// ─────────────────────────────────────────────────────
// GRAIN OVERLAY
// ─────────────────────────────────────────────────────
function Grain() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99] opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px",
      }}
    />
  )
}

// ─────────────────────────────────────────────────────
// THEME TOGGLE BUTTON
// ─────────────────────────────────────────────────────
function ThemeBtn() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <motion.button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: V.sf, border: `1px solid ${V.bd}`, color: V.mt }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links = [
    ["Features",    "#features"],
    ["How It Works","#how-it-works"],
    ["Pricing",     "#pricing"],
    ["FAQ",         "#faq"],
  ] as const

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? `color-mix(in srgb, var(--ay-bg) 88%, transparent)` : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? `1px solid ${V.bd}` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: V.ac, color: "#fff", fontFamily: SERIF }}
          >
            अ
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: V.tx, fontFamily: SERIF }}>
            AntarYatra
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-medium transition-colors" style={{ color: V.mt }}
              onMouseEnter={e => (e.currentTarget.style.color = V.tx)}
              onMouseLeave={e => (e.currentTarget.style.color = V.mt)}
            >
              {label}
            </a>
          ))}
          <a href="/crisis" className="text-sm font-medium" style={{ color: "#E05555" }}>🆘 Crisis</a>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeBtn />
          <motion.button
            onClick={() => router.push("/login")}
            className="hidden md:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: V.fo, color: V.foTx }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Free <ArrowRight size={13} />
          </motion.button>
          <button className="md:hidden" style={{ color: V.tx }} onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden md:hidden"
            style={{ background: V.sf, borderBottom: `1px solid ${V.bd}` }}
          >
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4">
              {links.map(([label, href]) => (
                <a key={label} href={href} className="text-sm font-medium" style={{ color: V.tx }}>{label}</a>
              ))}
              <button onClick={() => router.push("/login")}
                className="py-3 rounded-full text-sm font-semibold mt-1"
                style={{ background: V.fo, color: V.foTx }}>
                Start Free Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ─────────────────────────────────────────────────────
// FLOATING HERO PREVIEW CARDS
// ─────────────────────────────────────────────────────
function FloatingCard({ children, delay = 0, className = "", style = {} }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={`absolute rounded-2xl ${className}`}
      style={{ background: V.card, border: `1px solid ${V.bd}`, boxShadow: V.shadow, fontFamily: SANS, ...style }}
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function HeroVisual() {
  const [active, setActive] = useState(3)
  const moods = ["😔", "😐", "🙂", "😊", "😄"]

  return (
    <div className="relative w-full max-w-[420px] h-[480px] mx-auto">
      {/* Ambient blob */}
      <div className="absolute inset-8 rounded-full opacity-25 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${ac(0.5)} 0%, ${ac(0.1)} 50%, transparent 75%)`, filter: "blur(50px)" }} />

      {/* Mood picker */}
      <FloatingCard delay={0.4} className="left-4 top-8 w-[220px] p-4">
        <p className="text-[11px] font-semibold mb-3" style={{ color: V.mt }}>How are you feeling?</p>
        <div className="flex gap-2 justify-between">
          {moods.map((emoji, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="text-xl w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: active === i ? ac(0.12) : V.sf,
                border: active === i ? `2px solid ${V.ac}` : `2px solid transparent`,
                transform: active === i ? "scale(1.15)" : "scale(1)",
              }}
            >{emoji}</button>
          ))}
        </div>
        <p className="text-[10px] mt-3" style={{ color: V.mt }}>Tap to log your mood</p>
      </FloatingCard>

      {/* Streak */}
      <FloatingCard delay={0.6} className="right-0 top-20 w-[160px] p-4">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={18} style={{ color: V.ac }} />
          <span className="text-2xl font-bold" style={{ color: V.tx, fontFamily: SERIF }}>12</span>
        </div>
        <p className="text-xs font-semibold" style={{ color: V.tx }}>Day Streak</p>
        <p className="text-[10px] mt-0.5" style={{ color: V.mt }}>Keep going! 🎉</p>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full"
              style={{ background: i < 5 ? V.ac : V.bd }} />
          ))}
        </div>
      </FloatingCard>

      {/* AI prompt */}
      <FloatingCard delay={0.8} className="left-0 top-[200px] w-[240px] p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: V.fo }}>
            <Sparkles size={12} color="white" />
          </div>
          <span className="text-[11px] font-semibold" style={{ color: V.tx }}>AI Prompt</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: V.mt }}>
          "What's one small thing that brought you joy today? Even the tiniest moment counts."
        </p>
        <button className="mt-3 text-[10px] font-semibold px-3 py-1.5 rounded-full w-full"
          style={{ background: V.fo, color: V.foTx }}>
          Start Writing →
        </button>
      </FloatingCard>

      {/* Mood trend */}
      <FloatingCard delay={1.0} className="right-4 bottom-12 w-[170px] p-4">
        <p className="text-[11px] font-semibold mb-2" style={{ color: V.mt }}>Mood This Week</p>
        <div className="flex items-end gap-1 h-10">
          {[3, 5, 4, 6, 7, 5, 8].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm"
              style={{ height: `${h * 5}px`, background: i === 6 ? V.ac : ac(0.25) }} />
          ))}
        </div>
        <p className="text-[10px] mt-2 font-medium" style={{ color: V.tl }}>↑ 23% this week</p>
      </FloatingCard>

      {/* Language badge */}
      <FloatingCard delay={1.1} className="left-1/2 bottom-4 -translate-x-1/2 px-4 py-2 flex items-center gap-2"
        style={{ whiteSpace: "nowrap" }}>
        <Globe size={13} style={{ color: V.ac }} />
        <span className="text-[11px] font-semibold" style={{ color: V.tx }}>अब Hinglish में भी!</span>
      </FloatingCard>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────
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
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      style={{ background: V.bg }}>
      {/* Devanagari watermark */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
        aria-hidden="true"
        style={{ fontSize: "clamp(180px,38vw,500px)", fontFamily: SERIF, color: V.tx, opacity: 0.03, lineHeight: 1 }}>
        अंतर
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full relative z-10">
        {/* Copy */}
        <div>
          <motion.div className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full font-semibold"
              style={{ background: ac(0.10), color: V.ac, border: `1px solid ${ac(0.22)}` }}>
              <Sparkles size={11} /> AI-Powered Mental Wellness
            </span>
            <span className="text-sm" style={{ color: V.mt }}>{greeting} 🙏</span>
          </motion.div>

          <motion.h1 className="font-bold leading-[1.03] mb-6"
            style={{ fontSize: "clamp(3rem,6.5vw,5.2rem)", color: V.tx, fontFamily: SERIF }}
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}>
            Your Journey to{" "}
            <span className="relative inline-block" style={{ color: V.ac }}>
              Inner Peace
              <svg viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full" aria-hidden="true" style={{ overflow: "visible" }}>
                <motion.path d="M 0 6 Q 37.5 0 75 6 Q 112.5 12 150 6 Q 187.5 0 225 6 Q 262.5 12 300 6"
                  fill="none" stroke={V.ac} strokeWidth="3" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.8 }} />
              </svg>
            </span>
            <br />Starts Here
          </motion.h1>

          <motion.p className="text-lg leading-relaxed mb-8 max-w-[30rem]" style={{ color: V.mt, fontFamily: SANS }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
            Transform anxiety into confidence with AI-guided journaling, personalized mood tracking,
            and a supportive community — in your language.
          </motion.p>

          {/* Social proof */}
          <motion.div className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            <div className="flex -space-x-2.5">
              {([V.ac, V.tl, V.fo, "#A78BFA", "#F87171"] as string[]).map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold"
                  style={{ background: c + "28", borderColor: V.card, color: c }}>
                  {["P","R","A","S","M"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: V.tx }}>2,400+ active users</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} fill={V.ac} style={{ color: V.ac }} />
                ))}
                <span className="text-xs ml-1" style={{ color: V.mt }}>4.9 / 5.0</span>
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
            <motion.button onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm"
              style={{ background: V.ac, color: "#fff" }}
              whileHover={{ scale: 1.04, boxShadow: `0 8px 30px ${ac(0.42)}` }}
              whileTap={{ scale: 0.97 }}>
              Start Free Today <ArrowRight size={15} />
            </motion.button>
            <motion.a href="#pricing"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm"
              style={{ border: `2px solid ${V.bd}`, color: V.tx }}
              whileHover={{ borderColor: V.fo, transition: { duration: 0.18 } }}>
              View Pricing
            </motion.a>
          </motion.div>

          <motion.p className="mt-4 text-xs" style={{ color: V.mt }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
            Free forever plan available · No credit card required
          </motion.p>
        </div>

        {/* Floating cards */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────
// STATS STRIP  (forest green band)
// ─────────────────────────────────────────────────────
function Stats() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })

  const items = [
    { n: "87%",    label: "Reduced Anxiety" },
    { n: "2,400+", label: "Active Users" },
    { n: "11+",    label: "Indian Languages" },
    { n: "4.9★",   label: "User Rating" },
    { n: "15+",    label: "Wellness Tools" },
  ]

  return (
    <section ref={ref} className="py-14 relative overflow-hidden" style={{ background: V.fo }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {items.map((s, i) => (
            <motion.div key={i} className="text-center"
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09, duration: 0.5 }}>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: V.ac, fontFamily: SERIF }}>{s.n}</div>
              <div className="text-xs mt-1 font-medium tracking-wide" style={{ color: V.foMt }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────
// FEATURES  (alternating rows)
// ─────────────────────────────────────────────────────
const FEATURES = [
  { num:"01", Icon:Sparkles,  title:"AI-Guided Journaling",    color:"ac", desc:"Smart prompts that adapt to your emotional state and help you explore deeper. Our AI understands context, nuance, and your personal journey — delivering insights that truly resonate.", tags:["Adaptive Prompts","Emotional Analysis","Pattern Recognition"] },
  { num:"02", Icon:BarChart3, title:"Mood Tracking & Analytics",color:"tl", desc:"Beautiful visualizations of your emotional patterns over time. Spot triggers, celebrate progress, and build self-awareness through data that tells your story.",                   tags:["Daily Check-ins","Weekly Reports","Trend Insights"] },
  { num:"03", Icon:Globe,     title:"Multilingual Support",     color:"ac", desc:"Express yourself in English, Hinglish, Tamil, Telugu, Malayalam, and 6+ more Indian languages. Because healing happens deepest in the language closest to your heart.",                   tags:["11+ Languages","Auto-detection","Code-switching"] },
  { num:"04", Icon:Shield,    title:"Privacy First",            color:"tl", desc:"End-to-end encrypted. HIPAA compliant. Your thoughts are yours alone — we never sell, share, or train on your personal data. Complete control, always.",                                  tags:["256-bit Encryption","HIPAA Compliant","Zero Data Sharing"] },
  { num:"05", Icon:Users,     title:"Anonymous Community",      color:"ac", desc:"Connect with others on the same journey in a safe, moderated space. Share wins, seek support, and realize you were never alone.",                                                        tags:["Fully Anonymous","Peer Support","Moderated & Safe"] },
  { num:"06", Icon:Gift,      title:"Rewards & Streaks",        color:"tl", desc:"Turn consistency into celebration. Earn badges, maintain streaks, and unlock new features as you show up for yourself every day.",                                                        tags:["Daily Streaks","Achievement Badges","Feature Unlocks"] },
] as const

function FeatureRow({ f, i }: { f: (typeof FEATURES)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const even = i % 2 === 0
  const color = f.color === "ac" ? V.ac : V.tl
  const colorAlpha = f.color === "ac" ? ac(0.10) : "var(--ay-tl-bg)"

  return (
    <motion.div ref={ref}
      className="grid md:grid-cols-2 gap-12 items-center py-16 border-b last:border-b-0"
      style={{ borderColor: V.bd }}
      initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65 }}>
      {/* Text */}
      <div className={even ? "md:order-1" : "md:order-2"}>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-6xl font-bold leading-none select-none" style={{ color: V.bd, fontFamily: SERIF }}>{f.num}</span>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: colorAlpha, color }}>
            <f.Icon size={20} />
          </div>
        </div>
        <h3 className="text-3xl font-bold mb-4" style={{ color: V.tx, fontFamily: SERIF }}>{f.title}</h3>
        <p className="text-base leading-relaxed mb-5" style={{ color: V.mt }}>{f.desc}</p>
        <div className="flex flex-wrap gap-2">
          {f.tags.map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: f.color === "ac" ? ac(0.10) : "var(--ay-tl-bg)", color }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Visual */}
      <div className={`flex items-center justify-center ${even ? "md:order-2" : "md:order-1"}`}>
        <div className="w-full max-w-[300px] aspect-square rounded-3xl flex items-center justify-center relative overflow-hidden"
          style={{ background: colorAlpha, border: `1px solid ${f.color === "ac" ? ac(0.15) : "var(--ay-tl-bd)"}` }}>
          <f.Icon size={88} style={{ color, opacity: 0.12 }} className="absolute" />
          <div className="relative z-10 text-center px-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: f.color === "ac" ? ac(0.18) : "var(--ay-tl-bg)", color }}>
              <f.Icon size={30} />
            </div>
            <p className="text-lg font-bold" style={{ color: V.tx, fontFamily: SERIF }}>{f.title}</p>
            <p className="text-xs mt-2" style={{ color: V.mt }}>{f.tags[0]}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Features() {
  return (
    <section id="features" className="py-16" style={{ background: V.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: V.ac }}>Features</p>
          <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: V.tx, fontFamily: SERIF }}>
            Everything You Need for{" "}<span style={{ color: V.ac }}>Mental Wellness</span>
          </h2>
        </div>
        <div>{FEATURES.map((f, i) => <FeatureRow key={f.num} f={f} i={i} />)}</div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────
function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const categories = [
    {
      id: 1,
      title: "Start Journaling",
      subtitle: "Express your thoughts freely with AI-guided prompts that help you dig deeper.",
      icon: <Sparkles className="w-8 h-8" />,
    },
    {
      id: 2,
      title: "AI Analysis",
      subtitle: "Our AI understands your emotions and provides personalized insights and patterns.",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      id: 3,
      title: "Track Progress",
      subtitle: "Visualize your mental wellness journey with beautiful mood tracking and analytics.",
      icon: <TrendingUp className="w-8 h-8" />,
    },
    {
      id: 4,
      title: "Connect & Grow",
      subtitle: "Share anonymously with a supportive community and celebrate your wins together.",
      icon: <Users className="w-8 h-8" />,
    },
  ]

  return (
    <section id="how-it-works" ref={ref} className="py-24" style={{ background: V.sf }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: V.ac }}>The Process</p>
          <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: V.tx, fontFamily: SERIF }}>
            How <span style={{ color: V.ac }}>AntarYatra</span> Works
          </h2>
          <p className="mt-4 text-lg" style={{ color: V.mt }}>
            Four simple steps to transform your mental wellness journey
          </p>
        </div>
        <CategoryList
          title=""
          categories={categories}
          className="!p-0"
        />
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────────────
type Plan = { name:string; price:string; sub:string; desc:string; features:string[]; cta:string; featured?:boolean; lifetime?:boolean }
const PLANS: Plan[] = [
  { name:"Free",     price:"₹0",     sub:"forever",     desc:"Perfect for getting started on your wellness journey.", cta:"Start Free",
    features:["Daily journaling (5 entries/day)","Basic mood tracking","2 interactive wellness tools","Community read access","English language only","Basic insights"] },
  { name:"Premium",  price:"₹299",   sub:"per month",   desc:"For serious wellness seekers who want the full experience.", cta:"Start Premium", featured:true,
    features:["Unlimited journaling","Advanced AI insights & analysis","All 15+ interactive wellness tools","Full community access & posting","11+ Indian languages","Detailed mood analytics","Streak rewards & badges","Priority support"] },
  { name:"Lifetime", price:"₹4,999", sub:"one-time",    desc:"One payment. Lifetime access. Forever yours.", cta:"Get Lifetime Access", lifetime:true,
    features:["Everything in Premium","Lifetime updates included","Early access to new features","Exclusive Lifetime badge","Direct founder support","30-day money-back guarantee","Never pay again"] },
]

function PricingCard({ plan, i }: { plan: Plan; i: number }) {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  if (plan.lifetime) return (
    <motion.div ref={ref} className="rounded-3xl p-8 relative overflow-hidden"
      style={{ background: V.fo, border: `1px solid ${V.fo}` }}
      initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.6 }} whileHover={{ y: -6, transition: { duration: 0.22 } }}>
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-15 pointer-events-none"
        style={{ background: V.ac, filter: "blur(30px)" }} />
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: ac(0.22), color: V.ac }}>♾ Lifetime</span>
        <span className="text-xs font-medium" style={{ color: V.foMt }}>Best Value</span>
      </div>
      <h3 className="text-2xl font-bold mb-1" style={{ color: V.foTx, fontFamily: SERIF }}>{plan.name}</h3>
      <p className="text-sm mb-4" style={{ color: V.foMt }}>{plan.desc}</p>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-5xl font-bold" style={{ color: V.ac, fontFamily: SERIF }}>{plan.price}</span>
        <span className="text-sm" style={{ color: V.foMt }}>{plan.sub}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: `rgba(237,233,227,0.80)` }}>
            <Check size={14} className="mt-0.5 shrink-0" style={{ color: V.ac }} />{f}
          </li>
        ))}
      </ul>
      <motion.button onClick={() => router.push("/login")}
        className="w-full py-3.5 rounded-full font-bold text-sm"
        style={{ background: V.ac, color: "#fff" }}
        whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${ac(0.45)}` }} whileTap={{ scale: 0.97 }}>
        {plan.cta}
      </motion.button>
      <p className="text-center text-xs mt-3" style={{ color: V.foMt }}>30-day money-back guarantee</p>
    </motion.div>
  )

  if (plan.featured) return (
    <motion.div ref={ref} className="rounded-3xl p-8 relative overflow-hidden lg:-mt-4 lg:-mb-4"
      style={{ background: V.card, border: `2px solid ${V.ac}`, boxShadow: `0 20px 60px ${ac(0.20)}` }}
      initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.6 }} whileHover={{ y: -4, transition: { duration: 0.22 } }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="text-xs font-bold px-4 py-1.5 rounded-full" style={{ background: V.ac, color: "#fff" }}>★ Most Popular</span>
      </div>
      <div className="mt-2 mb-6">
        <h3 className="text-2xl font-bold mb-1" style={{ color: V.tx, fontFamily: SERIF }}>{plan.name}</h3>
        <p className="text-sm" style={{ color: V.mt }}>{plan.desc}</p>
      </div>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-5xl font-bold" style={{ color: V.tx, fontFamily: SERIF }}>{plan.price}</span>
        <span className="text-sm" style={{ color: V.mt }}>{plan.sub}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: V.tx }}>
            <Check size={14} className="mt-0.5 shrink-0" style={{ color: V.ac }} />{f}
          </li>
        ))}
      </ul>
      <motion.button onClick={() => router.push("/login")}
        className="w-full py-3.5 rounded-full font-bold text-sm"
        style={{ background: V.ac, color: "#fff" }}
        whileHover={{ scale: 1.03, boxShadow: `0 8px 30px ${ac(0.45)}` }} whileTap={{ scale: 0.97 }}>
        {plan.cta}
      </motion.button>
      <p className="text-center text-xs mt-3" style={{ color: V.mt }}>Cancel anytime · No hidden fees</p>
    </motion.div>
  )

  return (
    <motion.div ref={ref} className="rounded-3xl p-8"
      style={{ background: V.card, border: `1px solid ${V.bd}` }}
      initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.6 }}
      whileHover={{ y: -4, borderColor: ac(0.35), transition: { duration: 0.2 } }}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1" style={{ color: V.tx, fontFamily: SERIF }}>{plan.name}</h3>
        <p className="text-sm" style={{ color: V.mt }}>{plan.desc}</p>
      </div>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-5xl font-bold" style={{ color: V.tx, fontFamily: SERIF }}>{plan.price}</span>
        <span className="text-sm" style={{ color: V.mt }}>{plan.sub}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: V.mt }}>
            <Check size={14} className="mt-0.5 shrink-0" style={{ color: V.tl }} />{f}
          </li>
        ))}
      </ul>
      <motion.button onClick={() => router.push("/login")}
        className="w-full py-3.5 rounded-full font-bold text-sm transition-all duration-200"
        style={{ border: `2px solid ${V.bd}`, color: V.tx, background: "transparent" }}
        whileHover={{ scale: 1.02 }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = V.fo; (e.currentTarget as HTMLButtonElement).style.color = V.foTx; (e.currentTarget as HTMLButtonElement).style.borderColor = V.fo }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = V.tx; (e.currentTarget as HTMLButtonElement).style.borderColor = V.bd }}
        whileTap={{ scale: 0.97 }}>
        {plan.cta}
      </motion.button>
    </motion.div>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-24" style={{ background: V.sf }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: V.ac }}>Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: V.tx, fontFamily: SERIF }}>
            Simple, Transparent <span style={{ color: V.ac }}>Pricing</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: V.mt }}>
            Start free, upgrade when you're ready. All plans include our core features.
          </p>
          <p className="mt-2 text-sm font-medium" style={{ color: V.tl }}>
            ✓ 30-day money-back guarantee on all paid plans
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {PLANS.map((plan, i) => <PricingCard key={plan.name} plan={plan} i={i} />)}
        </div>
        <p className="text-center text-sm mt-8" style={{ color: V.mt }}>
          All prices in INR. Students & NGOs get 50% off —{" "}
          <a href="#" style={{ color: V.ac, fontWeight: 600 }}>contact us</a>.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────
function Testimonials() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const items = [
    { name:"Priya S.",  role:"Beta Tester",  quote:"The AI prompts made journaling so much easier. Can't wait for the full launch — this app gets it!" },
    { name:"Rahul M.", role:"Early Adopter", quote:"As someone who struggles with anxiety, the mood tracking alone has been a revelation. Finally data about my own mind." },
    { name:"Sara V.",  role:"Beta Tester",   quote:"Writing in Hinglish is a game-changer. AntarYatra actually understands how we communicate. Incredible." },
  ]
  return (
    <section ref={ref} className="py-24" style={{ background: V.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: V.ac }}>Testimonials</p>
          <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: V.tx, fontFamily: SERIF }}>
            Real Stories, <span style={{ color: V.ac }}>Real Change</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div key={i} className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: V.card, border: `1px solid ${V.bd}` }}
              initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4, borderColor: ac(0.35), transition: { duration: 0.18 } }}>
              <div className="absolute top-4 right-5 text-7xl font-serif leading-none select-none pointer-events-none"
                style={{ color: V.ac, opacity: 0.07 }} aria-hidden="true">"</div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={13} fill={V.ac} style={{ color: V.ac }} />)}
              </div>
              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: V.txd }}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: ac(0.15), color: V.ac }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: V.tx }}>{t.name}</div>
                  <div className="text-xs" style={{ color: V.mt }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────
function FAQ() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const faqs = [
    { q:"Is my data private and secure?",           a:"Absolutely. All your journal entries are encrypted end-to-end. We never share your personal data with third parties, and you have complete control over what you share with the community." },
    { q:"How does the AI journaling work?",          a:"Our AI analyzes your writing patterns and emotional state to provide personalized prompts and insights. It learns from your entries to offer increasingly relevant guidance while maintaining complete privacy." },
    { q:"Can I write in my native language?",        a:"Yes! AntarYatra supports English, Hindi, and other popular Indian languages. You can switch between languages freely and express yourself however feels most natural." },
    { q:"Is AntarYatra a replacement for therapy?",  a:"No, AntarYatra is a complementary wellness tool, not a replacement for professional therapy. We encourage users to seek professional help when needed." },
    { q:"Can I cancel or change my plan anytime?",   a:"Yes, always. Premium subscribers can cancel anytime with no penalties. Lifetime plan comes with a 30-day money-back guarantee — no questions asked." },
    { q:"Does it work offline?",                     a:"Yes! You can write journal entries offline, and they'll automatically sync when you're back online." },
  ]
  return (
    <section id="faq" ref={ref} className="py-24" style={{ background: V.sf }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: V.ac }}>FAQ</p>
          <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: V.tx, fontFamily: SERIF }}>
            Frequently Asked <span style={{ color: V.ac }}>Questions</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} className="rounded-2xl overflow-hidden"
              style={{ background: V.card, border: `1px solid ${openIdx === i ? ac(0.45) : V.bd}`, boxShadow: openIdx === i ? `0 4px 20px ${ac(0.08)}` : "none" }}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.07 }}>
              <button className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <span className="font-semibold text-base pr-4" style={{ color: V.tx }}>{faq.q}</span>
                <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.2 }}
                  className="shrink-0" style={{ color: V.ac }}>
                  <ChevronDown size={17} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div key="ans" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24 }} className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: V.mt }}>{faq.a}</p>
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

// ─────────────────────────────────────────────────────
// FINAL CTA  (full-bleed forest)
// ─────────────────────────────────────────────────────
function CTA() {
  const router = useRouter()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <section ref={ref} className="py-28 relative overflow-hidden" style={{ background: V.fo }}>
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: V.ac, filter: "blur(100px)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16"
        style={{ background: `linear-gradient(to bottom, transparent, ${ac(0.45)})` }} />
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden" aria-hidden="true">
        <span style={{ fontFamily: SERIF, fontSize: "clamp(120px,25vw,280px)", color: V.ac, opacity: 0.04, lineHeight: 1 }}>
          यात्रा
        </span>
      </div>
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-5" style={{ color: V.ac }}>Begin Today</p>
          <h2 className="font-bold mb-6 text-balance"
            style={{ fontSize: "clamp(2.4rem,5vw,4rem)", color: V.foTx, fontFamily: SERIF, lineHeight: 1.1 }}>
            Ready to Start Your <span style={{ color: V.ac }}>Inner Journey?</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: V.foMt }}>
            Join thousands of users who've transformed their mental wellness with AntarYatra.
            Your path to inner peace starts today — for free.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button onClick={() => router.push("/login")}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base"
              style={{ background: V.ac, color: "#fff" }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${ac(0.50)}` }} whileTap={{ scale: 0.97 }}>
              Start Free Today <ArrowRight size={17} />
            </motion.button>
            <motion.a href="#pricing"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-base"
              style={{ border: `2px solid ${V.bld}`, color: V.foTx }}
              whileHover={{ borderColor: V.foTx, transition: { duration: 0.18 } }}>
              View Pricing
            </motion.a>
          </div>
          <p className="mt-5 text-sm" style={{ color: V.foMt }}>
            No credit card required · Free forever plan available
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title:"Product", links:[["Features","#features"],["How It Works","#how-it-works"],["Pricing","#pricing"],["FAQ","#faq"]] as [string,string][] },
    { title:"Company", links:[["About Us","#"],["Blog","#"],["Contact","#"]] as [string,string][] },
    { title:"Legal",   links:[["Privacy Policy","#"],["Terms of Service","#"],["Cookie Policy","#"]] as [string,string][] },
  ]
  return (
    <footer className="py-14" style={{ background: V.bg, borderTop: `1px solid ${V.bd}` }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: V.ac, color: "#fff", fontFamily: SERIF }}>अ</div>
              <span className="font-bold text-base" style={{ color: V.tx, fontFamily: SERIF }}>AntarYatra</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: V.mt }}>
              Your AI-powered companion for mental wellness and inner peace.
            </p>
            <a href="/crisis"
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(192,57,43,0.12)", color: "#C0392B" }}>
              🆘 Crisis Support
            </a>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4" style={{ color: V.tx }}>{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm" style={{ color: V.mt }}
                      onMouseEnter={e => (e.currentTarget.style.color = V.tx)}
                      onMouseLeave={e => (e.currentTarget.style.color = V.mt)}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ borderTop: `1px solid ${V.bd}` }}>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {["256-bit Encryption","HIPAA Compliant","WCAG 2.1 AA"].map(b => (
              <span key={b} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{ background: V.tlBg, color: V.tl, border: `1px solid ${V.tlBd}` }}>
                <Shield size={10} /> {b}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-center" style={{ color: V.mt }}>
            <span>© 2025 AntarYatra. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              Made with <Heart size={12} fill="#E05555" style={{ color: "#E05555" }} /> for your mental wellness
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────
export function LandingPageV3() {
  return (
    <>
      {/* Inject CSS custom properties — SSR-safe, instant theme switching */}
      <style dangerouslySetInnerHTML={{ __html: THEME_VARS }} />
      <div style={{ fontFamily: SANS }}>
        {/* Animated 3D dot wave — theme-aware, renders behind all content */}
        <DottedSurface className="opacity-[0.18]" />
        <Grain />
        <Nav />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </>
  )
}
