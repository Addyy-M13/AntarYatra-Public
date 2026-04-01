"use client"

import { motion, useInView } from "framer-motion"
import { TrendingUp, Users, AlertTriangle, Heart } from "lucide-react"
import { useEffect, useState, useRef } from "react"

const stats = [
  {
    icon: AlertTriangle,
    value: 56,
    suffix: "M",
    label: "Indians face mental health challenges",
    color: "text-red-500",
    bgColor: "from-red-500/20 to-red-600/20"
  },
  {
    icon: TrendingUp,
    value: 80,
    suffix: "%",
    label: "increase in anxiety among young Indians (2020-2024)",
    color: "text-orange-500",
    bgColor: "from-orange-500/20 to-amber-600/20"
  },
  {
    icon: Users,
    value: 0.75,
    suffix: "",
    label: "psychiatrists per 100,000 people in India",
    color: "text-blue-500",
    bgColor: "from-blue-500/20 to-cyan-600/20",
    decimals: 2
  },
  {
    icon: Heart,
    value: 70,
    suffix: "%",
    label: "of Gen Z seeking mental wellness support",
    color: "text-purple-500",
    bgColor: "from-purple-500/20 to-pink-600/20"
  }
]

function AnimatedNumber({ value, suffix, decimals = 0, inView }: { value: number; suffix: string; decimals?: number; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let startTime: number | null = null
    const duration = 2000
    const startValue = 0
    const endValue = value

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, value])

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export function MentalHealthByNumbers() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-purple-500/10 text-primary mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">The Reality in India</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Mental Health{" "}
            <span className="text-primary">
              By the Numbers
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            The mental health crisis in India is real. But so is the growing awareness and support.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${stat.bgColor} mb-6`}>
                      <Icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    
                    <div className={`text-5xl md:text-6xl font-bold mb-4 ${stat.color}`}>
                      <AnimatedNumber 
                        value={stat.value} 
                        suffix={stat.suffix} 
                        decimals={stat.decimals}
                        inView={inView}
                      />
                    </div>
                    
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-card border border-primary/20 rounded-2xl p-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl" />
            
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Be Part of the{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Change
                </span>
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Every person who prioritizes their mental wellness makes it easier for others to do the same. 
                Break the stigma. Start your journey today.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
                  🌱 Normalize mental wellness
                </div>
                <div className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium">
                  💪 Lead by example
                </div>
                <div className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium">
                  ✨ Inspire others
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

