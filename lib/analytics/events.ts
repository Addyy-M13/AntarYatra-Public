// Analytics event tracking utilities

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Vercel Analytics
  if (typeof window !== "undefined" && (window as any).va) {
    ;(window as any).va("track", eventName, properties)
  }

  // Google Analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", eventName, properties)
  }

  // Log events in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.log("📊 Analytics Event:", eventName, properties)
  }
}

// Predefined events for AntarYatra
export const analytics = {
  // Waitlist events
  waitlistJoin: (source: string) => {
    trackEvent("waitlist_join", {
      source,
      timestamp: new Date().toISOString(),
    })
  },

  waitlistError: (error: string, source: string) => {
    trackEvent("waitlist_error", {
      error,
      source,
      timestamp: new Date().toISOString(),
    })
  },

  // Navigation events
  ctaClick: (location: string, label: string) => {
    trackEvent("cta_click", {
      location,
      label,
      timestamp: new Date().toISOString(),
    })
  },

  navigationClick: (destination: string) => {
    trackEvent("navigation_click", {
      destination,
      timestamp: new Date().toISOString(),
    })
  },

  // Engagement events
  videoPlay: (videoId: string) => {
    trackEvent("video_play", {
      video_id: videoId,
      timestamp: new Date().toISOString(),
    })
  },

  faqExpand: (question: string) => {
    trackEvent("faq_expand", {
      question,
      timestamp: new Date().toISOString(),
    })
  },

  // Social events
  socialClick: (platform: string) => {
    trackEvent("social_click", {
      platform,
      timestamp: new Date().toISOString(),
    })
  },

  // Theme events
  themeToggle: (theme: string) => {
    trackEvent("theme_toggle", {
      theme,
      timestamp: new Date().toISOString(),
    })
  },

  languageChange: (language: string) => {
    trackEvent("language_change", {
      language,
      timestamp: new Date().toISOString(),
    })
  },

  // Page events
  pageView: (path: string) => {
    trackEvent("page_view", {
      path,
      timestamp: new Date().toISOString(),
    })
  },

  scrollDepth: (depth: number) => {
    trackEvent("scroll_depth", {
      depth,
      timestamp: new Date().toISOString(),
    })
  },
}
