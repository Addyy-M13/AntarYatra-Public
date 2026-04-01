"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Users } from "lucide-react"
import { useState } from "react"

const struggles = [
  {
    id: 1,
    thought: "I smile at work but cry at home",
    reactions: 847,
    replies: 234
  },
  {
    id: 2,
    thought: "My family wouldn't understand what I'm going through",
    reactions: 1203,
    replies: 456
  },
  {
    id: 3,
    thought: "I feel guilty for not being 'productive' enough",
    reactions: 692,
    replies: 189
  },
  {
    id: 4,
    thought: "Sometimes I fake being okay just to avoid questions",
    reactions: 1456,
    replies: 523
  },
  {
    id: 5,
    thought: "I'm exhausted from pretending everything is fine",
    reactions: 1089,
    replies: 378
  },
  {
    id: 6,
    thought: "I don't know if what I'm feeling is 'bad enough' to seek help",
    reactions: 934,
    replies: 412
  }
]

export function SilentStrugglesWall() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-primary mb-4"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">You're Not Alone</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Silent Struggles,{" "}
            <span className="text-primary">
              Spoken Here
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            Thoughts people have but rarely say out loud. If you've felt this way, you're not alone.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {struggles.map((struggle, index) => (
            <motion.div
              key={struggle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredId(struggle.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative group"
            >
              <div className="relative bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <blockquote className="text-base md:text-lg text-foreground mb-6 leading-relaxed">
                    "{struggle.thought}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Heart className={`w-4 h-4 transition-colors ${hoveredId === struggle.id ? 'text-pink-500 fill-pink-500' : ''}`} />
                      <span className="font-medium">{struggle.reactions}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{struggle.replies} felt this</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-primary/20">
            <p className="text-lg font-medium text-foreground">
              These are real thoughts from our anonymous community
            </p>
            <p className="text-muted-foreground max-w-xl">
              A safe space where you can share freely, connect with others who understand, 
              and realize you're never alone in your journey.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>100% Anonymous • 100% Safe • 100% Judgment-Free</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

