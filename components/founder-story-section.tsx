"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Heart } from "lucide-react"

const storyPanels = [
  {
    icon: "😔",
    title: "The Struggle",
    text: "Three years ago, struggling with anxiety & burnout. Life was lonely since school...",
    subtext: "Therapy was expensive. Journaling felt overwhelming.",
    color: "from-slate-500 to-slate-600"
  },
  {
    icon: "💔",
    title: "The Loss",
    text: "Lost my girlfriend to cardiac arrest. She believed in helping others heal...",
    subtext: "Her support kept me going through the darkness.",
    color: "from-red-500 to-pink-500"
  },
  {
    icon: "💡",
    title: "The Vision",
    text: "What if there was a platform that meets you wherever you are, at any hour?",
    subtext: "Combining journaling + therapy guidance.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: "✨",
    title: "The Birth",
    text: "AntarYatra was born from pain, determination, and a dream to create good from darkness.",
    subtext: "Making mental wellness accessible for everyone.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: "🌟",
    title: "The Mission",
    text: "Today, helping thousands transform their mental wellness journey.",
    subtext: "Honoring her memory, one inner journey at a time.",
    color: "from-green-500 to-emerald-500"
  }
]

export function FounderStorySection() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-primary mb-4"
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Origin Story</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Why{" "}
            <span className="text-primary">
              AntarYatra
            </span>
            {" "}Exists
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            From personal pain to a platform that heals
          </motion.p>
        </div>

        {/* Comic Panels */}
        <div className="max-w-6xl mx-auto space-y-8">
          {storyPanels.map((panel, index) => {
            const isEven = index % 2 === 0
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`flex flex-col md:flex-row gap-6 ${!isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Panel Number */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${panel.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {index + 1}
                  </div>
                </div>

                {/* Comic Panel */}
                <div className="flex-1">
                  <div className="relative bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group">
                    {/* Comic border effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 rounded-2xl blur transition-opacity" />
                    
                    <div className={`absolute inset-0 bg-gradient-to-br ${panel.color} opacity-5 rounded-2xl`} />
                    
                    <div className="relative">
                      {/* Emoji Icon */}
                      <div className="text-6xl mb-4">{panel.icon}</div>
                      
                      {/* Title with comic font style */}
                      <h3 className="text-2xl font-bold text-foreground mb-3 uppercase tracking-wide">
                        {panel.title}
                      </h3>
                      
                      {/* Speech bubble effect */}
                      <div className="relative bg-background/80 rounded-2xl p-4 mb-3">
                        <p className="text-base text-foreground leading-relaxed">
                          {panel.text}
                        </p>
                        {/* Small triangle for speech bubble */}
                        <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-background/80" />
                      </div>
                      
                      {/* Subtext */}
                      <p className="text-sm text-muted-foreground italic">
                        {panel.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Founder Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mx-auto mt-16"
        >
          <div className="relative bg-card border border-primary/20 rounded-3xl p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-lg opacity-50" />
                <Image
                  src="/images/design-mode/IMG-20250706-WA0026.jpg"
                  alt="Adwait, Founder of AntarYatra"
                  width={120}
                  height={120}
                  className="relative w-28 h-28 rounded-full border-4 border-primary/50 shadow-xl"
                  loading="lazy"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-2">Adwait</h3>
                <p className="text-primary font-medium mb-3">Founder & CEO, AntarYatra</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "Every feature we build is inspired by real struggles and real needs, because I've lived them too. 
                  This is my way of honoring her memory and helping others find their way." 💜
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

