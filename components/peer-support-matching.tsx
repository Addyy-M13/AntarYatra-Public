"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Users, Sparkles, ThumbsUp, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SupportMessage {
  id: number
  username: string
  struggle: string
  message: string
  replies: number
  likes: number
  isLiked: boolean
  category: string
  timeAgo: string
}

const categories = [
  { id: "all", name: "All", icon: "🌟" },
  { id: "anxiety", name: "Anxiety", icon: "😰" },
  { id: "depression", name: "Depression", icon: "😔" },
  { id: "stress", name: "Stress", icon: "😣" },
  { id: "loneliness", name: "Loneliness", icon: "😞" },
  { id: "victory", name: "Small Wins", icon: "🎉" },
]

const initialMessages: SupportMessage[] = [
  {
    id: 1,
    username: "Anonymous_Butterfly",
    struggle: "Feeling anxious about starting new job",
    message: "Tomorrow is my first day at a new job and I can't sleep. My mind won't stop racing with 'what ifs'. Has anyone else felt this way?",
    replies: 3,
    likes: 12,
    isLiked: false,
    category: "anxiety",
    timeAgo: "2h ago",
  },
  {
    id: 2,
    username: "Hopeful_Sunflower",
    struggle: "Celebrated 30 days of journaling!",
    message: "I know it's small, but I've journaled every day for a month! It's really helping me understand my emotions better. 🌻",
    replies: 8,
    likes: 24,
    isLiked: false,
    category: "victory",
    timeAgo: "5h ago",
  },
  {
    id: 3,
    username: "Brave_Oak",
    struggle: "Struggling with motivation today",
    message: "Everything feels heavy today. Even getting out of bed was hard. Just want someone to know I'm trying my best.",
    replies: 5,
    likes: 18,
    isLiked: false,
    category: "depression",
    timeAgo: "1d ago",
  },
  {
    id: 4,
    username: "Quiet_Moon",
    struggle: "Feeling isolated working from home",
    message: "Been remote for 6 months now. Missing real human connection. Video calls just aren't the same. Anyone else?",
    replies: 7,
    likes: 15,
    isLiked: false,
    category: "loneliness",
    timeAgo: "1d ago",
  },
]

export function PeerSupportMatching() {
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages)
  const [activeCategory, setActiveCategory] = useState("all")
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostMessage, setNewPostMessage] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("anxiety")

  const filteredMessages = activeCategory === "all" 
    ? messages 
    : messages.filter(m => m.category === activeCategory)

  const handleLike = (id: number) => {
    setMessages(messages.map(m => 
      m.id === id 
        ? { ...m, likes: m.isLiked ? m.likes - 1 : m.likes + 1, isLiked: !m.isLiked }
        : m
    ))
  }

  const handlePost = () => {
    if (!newPostTitle.trim() || !newPostMessage.trim()) return

    const newMessage: SupportMessage = {
      id: messages.length + 1,
      username: "You",
      struggle: newPostTitle,
      message: newPostMessage,
      replies: 0,
      likes: 0,
      isLiked: false,
      category: newPostCategory,
      timeAgo: "Just now",
    }

    setMessages([newMessage, ...messages])
    setNewPostTitle("")
    setNewPostMessage("")
    setShowNewPost(false)
  }

  return (
    <section className="relative py-8 md:py-12 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 mb-3">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Peer Support Community</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              You're Not Alone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with others who understand. Share your struggles, celebrate victories, and support each other
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                variant={activeCategory === cat.id ? "default" : "outline"}
                className="rounded-full"
                size="sm"
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </div>

          {/* New Post Button */}
          <div className="mb-6">
            <Button
              onClick={() => setShowNewPost(!showNewPost)}
              className="w-full"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {showNewPost ? "Cancel Post" : "Share Your Story"}
            </Button>
          </div>

          {/* New Post Form */}
          <AnimatePresence>
            {showNewPost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Share with the community (anonymous)</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.filter(c => c.id !== "all").map((cat) => (
                          <Button
                            key={cat.id}
                            onClick={() => setNewPostCategory(cat.id)}
                            variant={newPostCategory === cat.id ? "default" : "outline"}
                            size="sm"
                          >
                            {cat.icon} {cat.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">What's on your mind?</label>
                      <Input
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="e.g., Feeling overwhelmed with work stress"
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Share more (optional)</label>
                      <textarea
                        value={newPostMessage}
                        onChange={(e) => setNewPostMessage(e.target.value)}
                        placeholder="Share your story, ask for advice, or offer support..."
                        className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background resize-none"
                        maxLength={500}
                      />
                      <div className="text-xs text-muted-foreground text-right mt-1">
                        {newPostMessage.length}/500
                      </div>
                    </div>

                    <Button
                      onClick={handlePost}
                      disabled={!newPostTitle.trim()}
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Anonymously
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Support Messages */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {message.username[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{message.username}</div>
                          <div className="text-xs text-muted-foreground">{message.timeAgo}</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {categories.find(c => c.id === message.category)?.icon}{" "}
                        {categories.find(c => c.id === message.category)?.name}
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{message.struggle}</h3>
                    <p className="text-muted-foreground mb-4">{message.message}</p>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => handleLike(message.id)}
                        variant="ghost"
                        size="sm"
                        className={message.isLiked ? "text-red-500" : ""}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${message.isLiked ? "fill-current" : ""}`} />
                        {message.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {message.replies} {message.replies === 1 ? "reply" : "replies"}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Info Card */}
          <Card className="p-6 bg-muted/30 mt-8">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Community Guidelines
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              This is a safe, supportive space for mental health support. All posts are anonymous to protect your privacy.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Be kind and supportive</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Share authentically</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Respect others' stories</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
