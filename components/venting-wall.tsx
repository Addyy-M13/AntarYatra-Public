"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Clock, Flame, Heart, ThumbsUp, Sparkles, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface VentPost {
  id: string
  text: string
  reactions: {
    heart: number
    thumbsUp: number
    fire: number
    sparkle: number
  }
  timeLeft: number // seconds until deletion
  isFeatured: boolean
}

const reactionEmojis = [
  { type: "heart", icon: Heart, label: "Support", color: "text-red-500" },
  { type: "thumbsUp", icon: ThumbsUp, label: "Relate", color: "text-blue-500" },
  { type: "fire", icon: Flame, label: "Valid", color: "text-orange-500" },
  { type: "sparkle", icon: Sparkles, label: "Strong", color: "text-yellow-500" },
]

export function VentingWall() {
  const [posts, setPosts] = useState<VentPost[]>([])
  const [newVent, setNewVent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reactedPosts, setReactedPosts] = useState<Set<string>>(new Set())

  // Initialize with sample posts
  useEffect(() => {
    const initialPosts: VentPost[] = [
      {
        id: "1",
        text: "Tired of pretending I'm okay when I'm really not. Just need someone to know.",
        reactions: { heart: 45, thumbsUp: 32, fire: 18, sparkle: 12 },
        timeLeft: 18000, // 5 hours
        isFeatured: true,
      },
      {
        id: "2",
        text: "Why does asking for help feel like admitting defeat? I hate this pressure to be strong all the time.",
        reactions: { heart: 28, thumbsUp: 41, fire: 15, sparkle: 9 },
        timeLeft: 32400, // 9 hours
        isFeatured: false,
      },
      {
        id: "3",
        text: "Anxiety won today. Tomorrow I'll try again.",
        reactions: { heart: 67, thumbsUp: 23, fire: 34, sparkle: 28 },
        timeLeft: 7200, // 2 hours
        isFeatured: true,
      },
    ]
    setPosts(initialPosts)
  }, [])

  // Countdown timer for posts
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts((prevPosts) =>
        prevPosts
          .map((post) => ({ ...post, timeLeft: post.timeLeft - 1 }))
          .filter((post) => post.timeLeft > 0)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async () => {
    if (!newVent.trim() || isSubmitting) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const post: VentPost = {
      id: Date.now().toString(),
      text: newVent,
      reactions: { heart: 0, thumbsUp: 0, fire: 0, sparkle: 0 },
      timeLeft: 86400, // 24 hours
      isFeatured: false,
    }

    setPosts([post, ...posts])
    setNewVent("")
    setIsSubmitting(false)
  }

  const handleReaction = (postId: string, reactionType: string) => {
    const postReactionKey = `${postId}-${reactionType}`
    if (reactedPosts.has(postReactionKey)) return

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                [reactionType]: post.reactions[reactionType as keyof typeof post.reactions] + 1,
              },
            }
          : post
      )
    )
    setReactedPosts(new Set([...reactedPosts, postReactionKey]))
  }

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-4">
            <MessageSquare className="w-4 h-4" />
            Venting Wall
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Let It{" "}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              All Out
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Anonymous venting space. Your post disappears in 24 hours. No judgment, just support.
          </p>
        </motion.div>

        {/* Post Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12"
        >
          <Card className="relative p-6 bg-card border-orange-500/20 shadow-lg">
            <Textarea
              value={newVent}
              onChange={(e) => setNewVent(e.target.value)}
              placeholder="What's weighing on you today? Get it off your chest..."
              className="min-h-[120px] mb-4 resize-none bg-card border-border focus:border-orange-500 transition-colors"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Disappears in 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{newVent.length}/500</span>
                <Button
                  onClick={handleSubmit}
                  disabled={!newVent.trim() || isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Vent Anonymously
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Featured Posts */}
        {posts.some((p) => p.isFeatured) && (
          <div className="max-w-6xl mx-auto mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Most Relatable Right Now
            </h3>
          </div>
        )}

        {/* Posts Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card
                    className={`relative p-6 bg-card border-border shadow-xl hover:shadow-lg transition-all h-full flex flex-col ${
                      post.isFeatured ? "border-orange-500/50 ring-2 ring-orange-500/20" : ""
                    }`}
                  >
                    {/* Featured Badge */}
                    {post.isFeatured && (
                      <div className="absolute -top-3 -right-3">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          Featured
                        </div>
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="flex-grow mb-4">
                      <p className="text-foreground leading-relaxed">{post.text}</p>
                    </div>

                    {/* Time Left */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeLeft(post.timeLeft)}</span>
                    </div>

                    {/* Reactions */}
                    <div className="grid grid-cols-4 gap-2">
                      {reactionEmojis.map(({ type, icon: Icon, label, color }) => {
                        const reactionKey = `${post.id}-${type}`
                        const hasReacted = reactedPosts.has(reactionKey)
                        const count = post.reactions[type as keyof typeof post.reactions]

                        return (
                          <button
                            key={type}
                            onClick={() => handleReaction(post.id, type)}
                            disabled={hasReacted}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                              hasReacted
                                ? `bg-${color.replace("text-", "")}/20 ${color}`
                                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs font-medium">{count}</span>
                          </button>
                        )
                      })}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-12"
        >
          <Card className="p-6 bg-orange-500/5 border-orange-500/20">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Safe Space Rules</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All posts are completely anonymous</li>
                  <li>• Posts automatically delete after 24 hours</li>
                  <li>• React with empathy, not judgment</li>
                  <li>• If you're in crisis, please call a helpline</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

