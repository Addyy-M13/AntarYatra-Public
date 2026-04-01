"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    quote: "The AI journaling prompts are genuinely helpful — they ask the right questions when I don't know where to start. I've been more consistent with journaling in the past two weeks than in the past two years.",
    author: "Shreya",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Shreya&background=4F46E5&color=fff&bold=true&size=128",
  },
  {
    id: 2,
    quote: "Writing in Hinglish without switching keyboards or getting autocorrected makes this feel like it was actually built for me. Small thing, but it matters.",
    author: "Anushka",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Anushka&background=06B6D4&color=fff&bold=true&size=128",
  },
  {
    id: 3,
    quote: "I appreciate that it doesn't try to be a therapist. It's a journaling tool that takes mental wellness seriously. The mood tracking actually helped me spot a pattern I hadn't noticed.",
    author: "Saumya",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Saumya&background=EC4899&color=fff&bold=true&size=128",
  },
  {
    id: 4,
    quote: "Finally, an app that understands Indian contexts and languages. The exercises are culturally relevant and don't feel generic. This is exactly what we needed.",
    author: "Rushil",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Rushil&background=F59E0B&color=fff&bold=true&size=128",
  },
  {
    id: 5,
    quote: "The breathing exercises have become part of my daily routine. I use them every morning and it's genuinely improved my focus and anxiety levels.",
    author: "Angad",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Angad&background=10B981&color=fff&bold=true&size=128",
  },
  {
    id: 6,
    quote: "I love how the app celebrates small wins. The rewards system is motivating without being patronizing. Really helps me stay committed to my wellness journey.",
    author: "Rishabh",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Rishabh&background=8B5CF6&color=fff&bold=true&size=128",
  },
  {
    id: 7,
    quote: "The crisis support feature gave me hope during my darkest moments. Knowing help is just a tap away is incredibly reassuring. Thank you for building this.",
    author: "Rahul",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Rahul&background=EF4444&color=fff&bold=true&size=128",
  },
  {
    id: 8,
    quote: "The AI analysis of my mood patterns is spot-on. It helped me realize my triggers and now I can manage them better. This tool is genuinely therapeutic.",
    author: "Shreya",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Shreya&background=06B6D4&color=fff&bold=true&size=128",
  },
  {
    id: 9,
    quote: "After using this for a month, I noticed I'm sleeping better and feeling less overwhelmed. The visualization exercises are incredibly calming.",
    author: "Anushka",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Anushka&background=EC4899&color=fff&bold=true&size=128",
  },
  {
    id: 10,
    quote: "The community feature is beautiful. Knowing I'm not alone in my struggles and seeing others' journeys is incredibly empowering.",
    author: "Saumya",
    role: "Student",
    avatar: "https://ui-avatars.com/api/?name=Saumya&background=4F46E5&color=fff&bold=true&size=128",
  },
]

export function UniqueTestimonial() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote)
  const [displayedRole, setDisplayedRole] = useState(testimonials[0].role)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote)
      setDisplayedRole(testimonials[index].role)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 400)
    }, 200)
  }

  return (
    <div className="flex flex-col items-center gap-10 py-16">
      {/* Quote Container */}
      <div className="relative px-8">
        <span className="absolute -left-2 -top-6 text-7xl font-serif text-foreground/[0.06] select-none pointer-events-none">
          "
        </span>

        <p
          className={cn(
            "text-2xl md:text-3xl font-light text-foreground text-center max-w-lg leading-relaxed transition-all duration-400 ease-out",
            isAnimating ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100",
          )}
        >
          {displayedQuote}
        </p>

        <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-foreground/[0.06] select-none pointer-events-none">
          "
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 mt-2">
        {/* Role text */}
        <p
          className={cn(
            "text-xs text-muted-foreground tracking-[0.2em] uppercase transition-all duration-500 ease-out",
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
          )}
        >
          {displayedRole}
        </p>

        <div className="flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index
            const isHovered = hoveredIndex === index && !isActive
            const showName = isActive || isHovered

            return (
              <button
                key={testimonial.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex items-center gap-0 rounded-full cursor-pointer",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive ? "bg-foreground shadow-lg" : "bg-transparent hover:bg-muted/80",
                  showName ? "pr-4 pl-2 py-2" : "p-0.5",
                )}
              >
                {/* Avatar with smooth ring animation */}
                <div className="relative flex-shrink-0">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className={cn(
                      "w-8 h-8 rounded-full object-cover",
                      "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isActive ? "ring-2 ring-background/30" : "ring-0",
                      !isActive && "hover:scale-105",
                    )}
                  />
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "grid-cols-[1fr] opacity-100 ml-2" : "grid-cols-[0fr] opacity-0 ml-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-nowrap block",
                        "transition-colors duration-300",
                        isActive ? "text-background" : "text-foreground",
                      )}
                    >
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
