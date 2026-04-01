"use client"

import { Instagram, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function SocialFeedSection() {
  const posts = [
    {
      platform: "instagram",
      account: "@antaryatra_in",
      image: "/mental-wellness-quote-peaceful.jpg",
      caption: "Your mental health matters. Take a moment today to check in with yourself. 💜",
      likes: "2.4K",
      url: "https://instagram.com/antaryatra_in"
    },
    {
      platform: "instagram",
      account: "@antaryatra_in",
      image: "/journaling-setup-aesthetic.jpg",
      caption: "Morning journaling ritual ✨ How do you start your day?",
      likes: "1.8K",
      url: "https://instagram.com/antaryatra_in"
    },
    {
      platform: "instagram",
      account: "@antaryatra_in",
      image: "/peaceful-nature-meditation.png",
      caption: "Find your inner peace, one breath at a time 🌿",
      likes: "3.1K",
      url: "https://instagram.com/antaryatra_in"
    },
  ]

  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Latest Insights
          </h2>
          <p className="text-lg text-muted-foreground mb-6">Real stories and insights from mental wellness experts & community</p>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 hover:opacity-90"
            onClick={() => window.open('https://instagram.com/antaryatra_in', '_blank')}
            aria-label="Follow us on Instagram"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Follow @antaryatra_in
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div
              key={index}
              className="group bg-card border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => window.open(post.url, '_blank')}
            >
              <div className="aspect-square overflow-hidden relative">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={`Instagram post: ${post.caption}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <Button size="sm" variant="secondary" className="gap-2">
                    View on Instagram
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-primary font-medium mb-2">{post.account}</p>
                <p className="text-sm text-foreground/80 line-clamp-2 mb-2">{post.caption}</p>
                <p className="text-xs text-muted-foreground">❤️ {post.likes} likes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

