"use client"

import Image from "next/image"

export function PressMentions() {
  const mentions = [
    { name: "TechCrunch", logo: "/techcrunch-logo.png" },
    { name: "YourStory", logo: "/yourstory-logo.jpg" },
    { name: "Inc42", logo: "/inc42-logo.jpg" },
    { name: "The Hindu", logo: "/the-hindu-logo.jpg" },
    { name: "Economic Times", logo: "/economic-times-logo.jpg" },
  ]

  return (
    <section className="relative z-10 py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium">AS FEATURED IN</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 hover:opacity-100 transition-opacity">
          {mentions.map((mention, index) => (
            <div key={index} className="grayscale hover:grayscale-0 transition-all">
              <Image
                src={mention.logo || "/placeholder.svg"}
                alt={mention.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

