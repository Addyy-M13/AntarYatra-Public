"use client"

/**
 * LoaderCounter
 * Faithful recreation of https://framer.com/m/LoaderCounter-yRE5.js@1KnRwfjCWO0zsTVvk5Tx
 * Original author: Amr Rashed (https://amrrashed.com)
 *
 * Two animation modes:
 *   - Loader: fast start → steady middle → slow crawl → agonising final stretch + random micro-pauses
 *   - Linear: simple linear count
 *
 * Features: viewport trigger, replay on re-entry, color interpolation, prefix/suffix,
 *           K/M/B abbreviation, thousands separators, reduced-motion respect, full ARIA.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  CSSProperties,
} from "react"

// ─── Utilities ────────────────────────────────────────────────────────────────

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value))
}

interface RGB {
  r: number
  g: number
  b: number
}

function parseColor(color: string): RGB {
  if (color.startsWith("#")) {
    const hex = color.slice(1)
    const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex
    const n = parseInt(full, 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }
  const m = color.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/)
  if (m) return { r: +m[1], g: +m[2], b: +m[3] }
  return { r: 0, g: 0, b: 0 }
}

function interpolateColor(start: string, end: string, progress: number): string {
  const a = parseColor(start)
  const b = parseColor(end)
  const r = Math.round(a.r + (b.r - a.r) * progress)
  const g = Math.round(a.g + (b.g - a.g) * progress)
  const bl = Math.round(a.b + (b.b - a.b) * progress)
  return `rgb(${r}, ${g}, ${bl})`
}

// ─── Easing ───────────────────────────────────────────────────────────────────

/**
 * Loader easing that mimics a realistic progress bar:
 *   0–25%  : fast burst
 *   25–65% : steady
 *   65–88% : slow crawl
 *   88–100%: agonising final stretch
 */
function loaderEase(t: number): number {
  if (t < 0.25) return 3.2 * t * t
  if (t < 0.65) return 0.2 + ((t - 0.25) / 0.4) * 0.5
  if (t < 0.88) return 0.7 + Math.pow((t - 0.65) / 0.23, 1.5) * 0.18
  return 0.88 + Math.pow((t - 0.88) / 0.12, 4) * 0.12
}

// ─── Pause generator ──────────────────────────────────────────────────────────

interface Pause {
  start: number
  end: number
}

function generateLoaderPauses(): Pause[] {
  const pauses: Pause[] = []
  const count = 3 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i++) {
    const center = 0.15 + Math.random() * 0.7
    const width = 0.04 + Math.random() * 0.08
    pauses.push({
      start: Math.max(0.15, center - width / 2),
      end: Math.min(0.85, center + width / 2),
    })
  }
  // Classic "almost there" pause near the end
  pauses.push({
    start: 0.75 + Math.random() * 0.05,
    end: 0.82 + Math.random() * 0.03,
  })
  return pauses
}

// ─── Number formatting ────────────────────────────────────────────────────────

interface FormatOptions {
  thousands: boolean
  abbreviate: boolean
  locale: string
  decimals: number
}

function formatNumber(value: number, opts: FormatOptions): string {
  const { thousands, abbreviate, locale, decimals } = opts

  if (abbreviate) {
    const abs = Math.abs(value)
    let divisor = 1
    let sfx = ""
    let precision = 0

    if (abs >= 1e9) {
      divisor = 1e9; sfx = "B"
      if (abs < 1e10) precision = 2
      else if (abs < 1e11) precision = 1
    } else if (abs >= 1e6) {
      divisor = 1e6; sfx = "M"
      if (abs < 1e7) precision = 2
      else if (abs < 1e8) precision = 1
    } else if (abs >= 1e3) {
      divisor = 1e3; sfx = "K"
      if (abs < 1e4) precision = 2
      else if (abs < 1e5) precision = 1
    }

    if (divisor === 1) {
      const fixed = Number(value.toFixed(decimals))
      if (thousands) {
        try { return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: true }).format(fixed) }
        catch { return fixed.toString() }
      }
      return fixed.toString()
    }

    const scaled = value / divisor
    const factor = Math.pow(10, precision)
    const rounded = Math.round(scaled * factor) / factor
    const text = precision === 0 || Number.isInteger(rounded)
      ? rounded.toFixed(0)
      : rounded.toFixed(precision).replace(/\.?0+$/, "")
    return (value < 0 ? "-" : "") + text + sfx
  }

  const fixed = Number(value.toFixed(decimals))
  if (thousands) {
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true,
      }).format(fixed)
    } catch {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true,
      }).format(fixed)
    }
  }
  return fixed.toString()
}

function getDecimalPlaces(n: number): number {
  const s = String(n)
  const idx = s.indexOf(".")
  return idx >= 0 ? Math.min(3, s.length - idx - 1) : 0
}

// ─── Animation hook ───────────────────────────────────────────────────────────

interface AnimationConfig {
  from: number
  to: number
  duration: number   // seconds
  delay: number      // seconds
  isLoader: boolean
  startOnView: boolean
  replay: boolean
}

function useCounterAnimation(config: AnimationConfig) {
  const [value, setValue] = useState(config.from)
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(!config.startOnView)
  const [isAnimating, setIsAnimating] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const pausesRef = useRef<Pause[]>([])
  const lastPausedRef = useRef(false)

  // Intersection Observer
  useEffect(() => {
    if (!config.startOnView) { setIsVisible(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else if (config.replay) {
          setIsVisible(false)
          setValue(config.from)
          setProgress(0)
          setIsAnimating(false)
        }
      },
      { threshold: 0.1 }
    )
    const el = containerRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [config.startOnView, config.replay, config.from])

  // Reduced motion: jump straight to end
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    if (reduced) { setValue(config.to); setProgress(1) }
  }, [config.to])

  // RAF animation loop
  useEffect(() => {
    if (!isVisible) return

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    if (reduced) { setValue(config.to); setProgress(1); return }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    pausesRef.current = config.isLoader ? generateLoaderPauses() : []
    lastPausedRef.current = false
    setIsAnimating(true)

    const startTime = performance.now() + config.delay * 1000
    const durationMs = config.duration * 1000
    const range = config.to - config.from

    const animate = () => {
      const now = performance.now()
      const elapsed = now - startTime

      if (elapsed < 0) { rafRef.current = requestAnimationFrame(animate); return }

      const rawProgress = clamp(elapsed / durationMs)

      // Loader micro-pauses
      if (config.isLoader && rawProgress < 0.95) {
        const isPaused = pausesRef.current.some(
          (p) => rawProgress >= p.start && rawProgress <= p.end
        )
        if (isPaused) {
          lastPausedRef.current = true
          rafRef.current = requestAnimationFrame(animate)
          return
        } else {
          lastPausedRef.current = false
        }
      }

      const eased = config.isLoader ? loaderEase(rawProgress) : rawProgress

      setProgress(eased)
      setValue(config.from + range * eased)

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setProgress(1)
        setValue(config.to)
        setIsAnimating(false)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setIsAnimating(false)
    }
  }, [isVisible, config.from, config.to, config.duration, config.delay, config.isLoader])

  return { containerRef, value, progress, isAnimating }
}

// ─── Component props ──────────────────────────────────────────────────────────

export interface LoaderCounterProps {
  /** Count from this number */
  from?: number
  /** Count to this number */
  to?: number
  /**
   * true  = Loader mode (fast → slow with micro-pauses)
   * false = Linear mode (smooth, consistent)
   */
  isLoader?: boolean
  /**
   * Override duration in seconds.
   * When undefined the duration is calculated automatically from the number range.
   */
  duration?: number
  /** Start delay in seconds */
  delay?: number
  /** Only start when the element enters the viewport */
  startOnView?: boolean
  /** Re-run the animation every time the element re-enters the viewport */
  replay?: boolean
  /** Show thousands separators (1,000) */
  formatThousands?: boolean
  /** Abbreviate large numbers to K / M / B */
  abbreviate?: boolean
  /** BCP-47 locale string used for thousands formatting, e.g. "en-US", "nl-NL" */
  locale?: string
  // Typography
  fontFamily?: string
  fontWeight?: number | string
  fontSize?: number
  letterSpacing?: number
  lineHeight?: number
  textAlign?: "left" | "center" | "right"
  /** Static number colour (used when colorTransition is false) */
  color?: string
  // Color transition
  colorTransition?: boolean
  startColor?: string
  endColor?: string
  // Prefix / Suffix
  prefix?: string
  prefixColor?: string
  suffix?: string
  suffixColor?: string
  /** Gap in px between prefix/number/suffix */
  gap?: number
  className?: string
  style?: CSSProperties
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoaderCounter({
  from = 0,
  to = 100,
  isLoader = true,
  duration: durationProp,
  delay = 0,
  startOnView = true,
  replay = true,
  formatThousands = false,
  abbreviate = false,
  locale = "en-US",
  fontFamily = "Inter, sans-serif",
  fontWeight = 600,
  fontSize = 64,
  letterSpacing = 0,
  lineHeight = 1.1,
  textAlign = "left",
  color = "#000000",
  colorTransition = false,
  startColor = "#3b82f6",
  endColor = "#ef4444",
  prefix = "",
  prefixColor = "#000000",
  suffix = "",
  suffixColor = "#000000",
  gap = 8,
  className,
  style,
}: LoaderCounterProps) {
  // Auto-calculate duration when not supplied
  const calculatedDuration = useMemo(() => {
    if (durationProp != null) return durationProp
    const range = Math.abs(to - from)
    if (isLoader) return clamp(3 + Math.log10(Math.max(1, range)) * 0.5, 3, 4.5)
    return clamp(1 + Math.log10(Math.max(1, range)) * 0.4, 1, 2.5)
  }, [durationProp, from, to, isLoader])

  const decimals = useMemo(
    () => Math.max(getDecimalPlaces(from), getDecimalPlaces(to)),
    [from, to]
  )

  const { containerRef, value, progress, isAnimating } = useCounterAnimation({
    from,
    to,
    duration: calculatedDuration,
    delay,
    isLoader,
    startOnView,
    replay,
  })

  const displayValue = useMemo(
    () => formatNumber(value, { thousands: formatThousands, abbreviate, locale, decimals }),
    [value, formatThousands, abbreviate, locale, decimals]
  )

  const currentColor = useMemo(() => {
    if (colorTransition && startColor && endColor)
      return interpolateColor(startColor, endColor, progress)
    return color
  }, [colorTransition, startColor, endColor, progress, color])

  const justifyContent =
    textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start"

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label={`Counter: ${displayValue}`}
      className={className}
      style={{
        width: "100%",
        display: "flex",
        justifyContent,
        fontFamily,
        fontWeight,
        fontSize,
        letterSpacing,
        lineHeight,
        textAlign,
        ...style,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: prefix || suffix ? `${gap}px` : "0px",
          fontVariantNumeric: "tabular-nums",
          userSelect: isAnimating ? "none" : "auto",
          transition: colorTransition ? "color 0.3s ease" : undefined,
        }}
      >
        {prefix && (
          <span style={{ color: prefixColor }} aria-hidden="true">
            {prefix}
          </span>
        )}
        <span
          style={{ color: currentColor }}
          data-value={value}
          data-progress={progress}
        >
          {displayValue}
        </span>
        {suffix && (
          <span style={{ color: suffixColor }} aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>

      {/* Accessible completion announcement */}
      {progress === 1 && (
        <span
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
          }}
          aria-live="assertive"
        >
          Counter complete: {prefix}{displayValue}{suffix}
        </span>
      )}
    </div>
  )
}
