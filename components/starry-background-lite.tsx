"use client"

/**
 * Lightweight decorative starfield for pages that need depth without heavy WebGL.
 */
export function StarryBackgroundLite() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-muted/30" />
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.38]"
        style={{
          backgroundImage: [
            "radial-gradient(1.5px 1.5px at 12% 18%, color-mix(in oklch, var(--primary) 45%, transparent), transparent)",
            "radial-gradient(1px 1px at 28% 62%, color-mix(in oklch, var(--foreground) 20%, transparent), transparent)",
            "radial-gradient(1px 1px at 44% 34%, color-mix(in oklch, var(--primary) 35%, transparent), transparent)",
            "radial-gradient(1.5px 1.5px at 58% 78%, color-mix(in oklch, var(--foreground) 18%, transparent), transparent)",
            "radial-gradient(1px 1px at 71% 22%, color-mix(in oklch, var(--primary) 40%, transparent), transparent)",
            "radial-gradient(1px 1px at 85% 55%, color-mix(in oklch, var(--foreground) 15%, transparent), transparent)",
            "radial-gradient(1.5px 1.5px at 92% 88%, color-mix(in oklch, var(--primary) 30%, transparent), transparent)",
            "radial-gradient(1px 1px at 8% 90%, color-mix(in oklch, var(--foreground) 12%, transparent), transparent)",
          ].join(", "),
        }}
      />
    </div>
  )
}
