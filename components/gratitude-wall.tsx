"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface GratitudePost {
  id: string
  text: string
  hearts: number
  timestamp: Date
  gradient: string
}

const gradients = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-amber-500",
  "from-red-500 to-pink-500",
]

export function GratitudeWall() {
  const [posts, setPosts] = useState<GratitudePost[]>([])
  const [newPost, setNewPost] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  // Simulated real-time posts (in production, use Supabase real-time)
  useEffect(() => {
    const initialPosts: GratitudePost[] = [
      {
        id: "1",
        text: "Grateful for my family supporting me through tough times ",
        hearts: 12,
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        gradient: gradients[0],
      },
      {
        id: "2",
        text: "Today I'\''m thankful for sunshine and chai ",
        hearts: 8,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        gradient: gradients[1],
      },
      {
        id: "3",
        text: "Grateful for the strength to ask for help when I need it ",
        hearts: 15,
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        gradient: gradients[2],
      },
    ]
    setPosts(initialPosts)
  }, [])

  const handleSubmit = async () => {
    if (!newPost.trim() || isSubmitting) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const post: GratitudePost = {
      id: Date.now().toString(),
      text: newPost,
      hearts: 0,
      timestamp: new Date(),
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
    }

    setPosts([post, ...posts])
    setNewPost("")
    setIsSubmitting(false)
  }

  const handleLike = (postId: string) => {
    if (likedPosts.has(postId)) return

    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, hearts: post.hearts + 1 } : post
      )
    )
    setLikedPosts(new Set([...likedPosts, postId]))
  }

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 1000 / 60)
    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <section className="relative py-20 md:py-32 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Gratitude Wall
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What Are You{" "}
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
              Grateful For?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your gratitude anonymously and spread positivity
          </p>
        </motion.div>

        {/* Post Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12"
        >
          <Card className="relative p-6 bg-card border-pink-500/20 shadow-lg">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Today I'\''m grateful for..."
              className="min-h-[100px] mb-4 resize-none bg-card border-border focus:border-pink-500 transition-colors"
              maxLength={280}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {newPost.length}/280
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!newPost.trim() || isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Share Gratitude
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Posts Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="relative p-6 bg-card border-border shadow-xl hover:shadow-lg transition-all group h-full">
                    {/* Gradient accent */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${post.gradient} rounded-t-lg`}
                    />

                    <div className="flex flex-col h-full">
                      <p className="text-foreground mb-4 flex-grow leading-relaxed">
                        {post.text}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                          {getTimeAgo(post.timestamp)}
                        </span>
                        <button
                          onClick={() => handleLike(post.id)}
                          disabled={likedPosts.has(post.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                            likedPosts.has(post.id)
                              ? "bg-pink-500/20 text-pink-500"
                              : "bg-muted hover:bg-pink-500/10 text-muted-foreground hover:text-pink-500"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 transition-all ${
                              likedPosts.has(post.id) ? "fill-pink-500" : ""
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {post.hearts}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Sparkle effect on hover */}
                    <Sparkles className="absolute top-4 right-4 w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

