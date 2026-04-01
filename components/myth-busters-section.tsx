"use client"

import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, X } from "lucide-react"
import { useState } from "react"

const myths = [
  {
    id: 1,
    myth: "Mental health apps don't actually work",
    reality: "Studies show journaling and mood tracking reduce anxiety by 28% and improve emotional awareness",
    icon: "📱"
  },
  {
    id: 2,
    myth: "I need to be 'sick enough' to seek help",
    reality: "Mental wellness is for everyone. Prevention and early support are more effective than crisis intervention",
    icon: "🏥"
  },
  {
    id: 3,
    myth: "Therapy is the only real solution",
    reality: "Apps like AntarYatra complement therapy. 78% of therapists recommend journaling between sessions",
    icon: "💬"
  },
  {
    id: 4,
    myth: "I should be able to handle this on my own",
    reality: "Seeking support is a sign of strength. Everyone needs tools and community to thrive",
    icon: "💪"
  },
  {
    id: 5,
    myth: "My problems aren't 'real' mental health issues",
    reality: "Stress, overwhelm, and everyday struggles matter. You don't need a diagnosis to deserve support",
    icon: "🧠"
  },
  {
    id: 6,
    myth: "Talking about feelings makes them worse",
    reality: "Expression and acknowledgment are key to processing emotions. Suppression leads to buildup",
    icon: "💭"
  }
]

export function MythBustersSection() {
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  const toggleCard = (id: number) => {
    setFlippedCards(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    )
  }

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-green-500/10 text-primary mb-4"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Myth Busters</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Let's Bust Some{" "}
            <span className="text-primary">
              Mental Health
            </span>
            {" "}Myths
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            Click any card to reveal the truth
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {myths.map((item, index) => {
            const isFlipped = flippedCards.includes(item.id)
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="perspective-1000"
              >
                <motion.button
                  onClick={() => toggleCard(item.id)}
                  className="relative w-full h-64 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="relative w-full h-full preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    {/* Front - Myth */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="relative bg-card border border-red-500/30 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center hover:border-red-500/50 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl" />
                        
                        <div className="relative">
                          <div className="text-5xl mb-4">{item.icon}</div>
                          
                          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-red-500/10 text-red-500">
                            <X className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase">Myth</span>
                          </div>
                          
                          <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
                            "{item.myth}"
                          </p>
                          
                          <p className="text-xs text-muted-foreground mt-4">Click to reveal truth</p>
                        </div>
                      </div>
                    </div>

                    {/* Back - Reality */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                      <div className="relative bg-card border border-green-500/30 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center hover:border-green-500/50 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl" />
                        
                        <div className="relative">
                          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-green-500/10 text-green-500">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase">Reality</span>
                          </div>
                          
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {item.reality}
                          </p>
                          
                          <p className="text-xs text-primary mt-4">Click to flip back</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Knowledge is the first step to breaking stigma 💚
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  )
}

