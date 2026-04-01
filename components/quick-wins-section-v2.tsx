"use client"

import { motion } from "framer-motion"
import { Zap, Award, Target, Timer } from "lucide-react"

const quickWins = [
  {
    icon: Zap,
    title: "Instant Mood Relief",
    timeframe: "Within 5 minutes",
    description: "Feel lighter after your first journal entry",
    stat: "87% feel better immediately",
    color: "from-yellow-500 to-orange-500",
    delay: 0
  },
  {
    icon: Timer,
    title: "Pattern Recognition",
    timeframe: "Within 7 days",
    description: "AI identifies your emotional triggers",
    stat: "3-4 patterns discovered",
    color: "from-blue-500 to-cyan-500",
    delay: 0.1
  },
  {
    icon: Target,
    title: "Noticeable Progress",
    timeframe: "Within 2 weeks",
    description: "See measurable improvement in mood",
    stat: "62% report positive change",
    color: "from-purple-500 to-pink-500",
    delay: 0.2
  },
  {
    icon: Award,
    title: "Lasting Transformation",
    timeframe: "Within 30 days",
    description: "Build sustainable mental wellness habits",
    stat: "4.2/5 average improvement",
    color: "from-green-500 to-emerald-500",
    delay: 0.3
  }
]

export function QuickWinsSectionV2() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-primary mb-4"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Quick Wins</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            See Results{" "}
            <span className="text-primary">
              Faster
            </span>
            {" "}Than You Think
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            You don't need months to feel the difference. Here's what to expect on your journey.
          </motion.p>
        </div>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {quickWins.map((win, index) => {
            const Icon = win.icon
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: win.delay }}
                className="relative group"
              >
                <div className="relative bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${win.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${win.color} mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Timeframe Badge */}
                    <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                      {win.timeframe}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {win.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {win.description}
                    </p>
                    
                    {/* Stat */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${win.color} text-white text-xs font-medium`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {win.stat}
                    </div>
                  </div>
                </div>

                {/* Connector Arrow (except last item) */}
                {index < quickWins.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="relative bg-card border border-primary/20 rounded-2xl p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl" />
            
            <div className="relative">
              <p className="text-lg font-medium text-foreground mb-2">
                Every journey is unique, but progress is universal
              </p>
              <p className="text-muted-foreground">
                Start today and see your own transformation unfold ✨
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

