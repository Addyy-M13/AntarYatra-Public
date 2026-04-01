'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Brain, Users, Award, ArrowRight, Sparkles, BookOpen, Wind, Zap, Lightbulb, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BeamsBackground } from '@/components/ui/beams-background'
import { Logo } from '@/components/ui/logo'
import { LanguageSelector } from '@/components/language-selector'
import { useTranslation } from '@/lib/i18n/context'
import Link from 'next/link'

const demoFeatures = [
  {
    icon: Heart,
    title: 'Mood Tracking',
    description: 'Monitor your emotional wellbeing with AI-powered insights and personalized recommendations.',
    path: '/dashboard/mood',
    color: 'from-rose-500 to-pink-500'
  },
  {
    icon: Brain,
    title: 'Mindfulness Tools',
    description: 'Guided breathing exercises, meditation, and mindfulness techniques designed for daily peace.',
    path: '/dashboard/breathe',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BookOpen,
    title: 'Journal & Insights',
    description: 'Express yourself through journaling with AI analysis to understand your patterns and growth.',
    path: '/dashboard/journal',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Connect with others, share experiences, and build meaningful relationships in our supportive community.',
    path: '/dashboard/community',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Wind,
    title: 'Guided Exercises',
    description: 'Breathing exercises, visualizations, and grounding techniques for immediate emotional relief.',
    path: '/dashboard/mindspace',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    icon: Award,
    title: 'Rewards & Progress',
    description: 'Track your wellness journey with achievements, milestones, and personalized rewards.',
    path: '/dashboard/rewards',
    color: 'from-violet-500 to-fuchsia-500'
  }
]

const stats = [
  { label: 'Site Visitors', value: '200+' },
  { label: 'Active Sessions', value: '50+' },
  { label: 'Languages', value: '12' },
  { label: 'Features', value: '15+' }
]

const FeatureCard = ({ feature, index }: { feature: typeof demoFeatures[0]; index: number }) => {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={feature.path}>
        <div className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15 dark:from-black/5 dark:to-black/10 dark:hover:from-black/10 dark:hover:to-black/15">
          {/* Background gradient accent */}
          <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${feature.color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20`} />

          <div className="relative z-10">
            {/* Icon */}
            <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-3 text-white`}>
              <Icon className="h-6 w-6" />
            </div>

            {/* Title */}
            <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>

            {/* Description */}
            <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
              {feature.description}
            </p>

            {/* Arrow */}
            <div className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-300 group-hover:gap-2">
              Explore <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Hover border animation */}
          <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>
    </motion.div>
  )
}

const StatCard = ({ stat, index }: { stat: typeof stats[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
      {stat.value}
    </div>
    <p className="text-sm text-muted-foreground">{stat.label}</p>
  </motion.div>
)

// Interactive Mood Tracker Demo
const MoodTrackerDemo = () => {
  const moods = [
    { emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-500', insight: 'You\'re feeling great! Channel this positive energy.' },
    { emoji: '😌', label: 'Calm', color: 'from-blue-400 to-cyan-500', insight: 'Perfect time for mindfulness or journaling.' },
    { emoji: '😐', label: 'Neutral', color: 'from-gray-400 to-slate-500', insight: 'A good moment to explore your feelings.' },
    { emoji: '😔', label: 'Sad', color: 'from-indigo-400 to-purple-500', insight: 'Try a guided meditation or breathing exercise.' },
    { emoji: '😤', label: 'Frustrated', color: 'from-red-400 to-pink-500', insight: 'Use the Anger Room or grounding technique.' },
  ]

  const [selectedMood, setSelectedMood] = useState(moods[0])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl"
    >
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-pink-500" />
        Try Your Mood
      </h3>

      <div className="flex gap-4 mb-8 flex-wrap">
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood)}
            className={`text-4xl p-4 rounded-xl transition-all ${
              selectedMood.label === mood.label
                ? `bg-gradient-to-br ${mood.color} shadow-lg`
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {mood.emoji}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={selectedMood.label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl bg-gradient-to-br ${selectedMood.color} bg-opacity-20`}
      >
        <p className="text-lg font-semibold mb-2">{selectedMood.label} Mood</p>
        <p className="text-muted-foreground">{selectedMood.insight}</p>
      </motion.div>
    </motion.div>
  )
}

// Interactive Breathing Exercise Demo
const BreathingExerciseDemo = () => {
  const [isBreathing, setIsBreathing] = useState(false)

  const breathingPhases = [
    { label: 'Inhale', duration: 4 },
    { label: 'Hold', duration: 7 },
    { label: 'Exhale', duration: 8 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl"
    >
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Wind className="h-6 w-6 text-cyan-500" />
        4-7-8 Breathing Exercise
      </h3>

      <div className="flex flex-col items-center gap-8">
        {/* Animated breathing circle */}
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600"
          animate={
            isBreathing
              ? {
                  scale: [1, 1.3, 1.3, 1],
                }
              : { scale: 1 }
          }
          transition={
            isBreathing
              ? {
                  duration: 19,
                  repeat: Infinity,
                  times: [0, 4 / 19, 11 / 19, 1],
                }
              : {}
          }
        >
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              className="text-center"
              animate={
                isBreathing
                  ? {
                      opacity: [1, 0.5, 0.5, 1],
                    }
                  : { opacity: 1 }
              }
              transition={
                isBreathing
                  ? {
                      duration: 19,
                      repeat: Infinity,
                      times: [0, 4 / 19, 11 / 19, 1],
                    }
                  : {}
              }
            >
              {isBreathing ? (
                <div className="text-white text-xl font-bold">
                  <div className="text-sm opacity-75 mb-1">
                    {breathingPhases[Math.floor((Date.now() / 1000) % 19) > 11 ? 2 : Math.floor((Date.now() / 1000) % 19) > 4 ? 1 : 0]?.label || 'Ready'}
                  </div>
                </div>
              ) : (
                <Wind className="h-8 w-8 text-white" />
              )}
            </motion.div>
          </div>
        </motion.div>

        <Button
          onClick={() => setIsBreathing(!isBreathing)}
          size="lg"
          className="w-full sm:w-auto"
        >
          {isBreathing ? 'Stop Exercise' : 'Start Breathing'}
        </Button>

        <div className="grid grid-cols-3 gap-4 w-full text-center">
          {breathingPhases.map((phase) => (
            <div
              key={phase.label}
              className="p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <p className="text-sm font-semibold">{phase.label}</p>
              <p className="text-lg font-bold text-primary">{phase.duration}s</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Interactive Emotion Wheel Demo
const EmotionWheelDemo = () => {
  const emotions = [
    { name: 'Happy', color: 'text-yellow-400', emoji: '😄' },
    { name: 'Inspired', color: 'text-purple-400', emoji: '✨' },
    { name: 'Loved', color: 'text-pink-400', emoji: '💕' },
    { name: 'Grateful', color: 'text-green-400', emoji: '🙏' },
    { name: 'Calm', color: 'text-blue-400', emoji: '🧘' },
    { name: 'Curious', color: 'text-indigo-400', emoji: '🤔' },
    { name: 'Anxious', color: 'text-orange-400', emoji: '😰' },
    { name: 'Frustrated', color: 'text-red-400', emoji: '😤' },
  ]

  const [selectedEmotion, setSelectedEmotion] = useState(emotions[0])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl"
    >
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Smile className="h-6 w-6 text-amber-500" />
        Emotion Wheel
      </h3>

      {/* Emotion Wheel Grid */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {emotions.map((emotion, idx) => (
          <motion.button
            key={emotion.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedEmotion(emotion)}
            className={`p-4 rounded-xl transition-all ${
              selectedEmotion.name === emotion.name
                ? 'bg-white/20 border-2 border-white/50'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <div className="text-2xl mb-1">{emotion.emoji}</div>
            <div className="text-xs font-semibold whitespace-nowrap">{emotion.name}</div>
          </motion.button>
        ))}
      </div>

      <motion.div
        key={selectedEmotion.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-xl bg-white/5 border border-white/10"
      >
        <p className={`text-lg font-semibold ${selectedEmotion.color} mb-2`}>
          {selectedEmotion.emoji} {selectedEmotion.name}
        </p>
        <p className="text-sm text-muted-foreground">
          You're exploring how this emotion shows up in your day. Journal about it or try a guided exercise to process it.
        </p>
      </motion.div>
    </motion.div>
  )
}

// Mood Avatar with Particle Explosion
const MoodAvatarDemo = () => {
  const emotions = [
    { emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-500', particles: 15 },
    { emoji: '😌', label: 'Calm', color: 'from-blue-400 to-cyan-500', particles: 10 },
    { emoji: '😤', label: 'Angry', color: 'from-red-500 to-pink-600', particles: 20 },
    { emoji: '😔', label: 'Sad', color: 'from-purple-500 to-indigo-600', particles: 8 },
  ]

  const [selectedMood, setSelectedMood] = useState(emotions[0])
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleMoodChange = (mood: typeof emotions[0]) => {
    setSelectedMood(mood)
    const newParticles = Array.from({ length: mood.particles }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl"
    >
      <h3 className="text-2xl font-bold mb-12 text-center">How Are You Feeling?</h3>

      <div className="flex justify-center mb-12 relative">
        {/* Particle container */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${selectedMood.color}`}
            />
          ))}
        </div>

        {/* Main avatar with glow */}
        <motion.div
          key={selectedMood.emoji}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`text-8xl drop-shadow-2xl filter blur-0`}
          >
            {selectedMood.emoji}
          </motion.div>

          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${selectedMood.color} blur-3xl opacity-30`}
            animate={{ scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Emotion buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {emotions.map((mood) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.15, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMoodChange(mood)}
            className={`p-4 rounded-xl transition-all font-semibold text-lg ${
              selectedMood.label === mood.label
                ? `bg-gradient-to-r ${mood.color} text-white shadow-2xl`
                : 'bg-white/5 border border-white/20 hover:border-white/40'
            }`}
          >
            {mood.emoji}
            <div className="text-xs mt-1">{mood.label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// Chakra Energy System
const ChakraEnergyDemo = () => {
  const chakras = [
    { name: 'Root', color: '#EF4444', y: 0 },
    { name: 'Sacral', color: '#F97316', y: 30 },
    { name: 'Solar', color: '#FBBF24', y: 60 },
    { name: 'Heart', color: '#10B981', y: 90 },
    { name: 'Throat', color: '#06B6D4', y: 120 },
    { name: 'Third Eye', color: '#8B5CF6', y: 150 },
    { name: 'Crown', color: '#EC4899', y: 180 },
  ]

  const [activeChakras, setActiveChakras] = useState(new Set(['Heart']))

  const toggleChakra = (name: string) => {
    const newSet = new Set(activeChakras)
    if (newSet.has(name)) newSet.delete(name)
    else newSet.add(name)
    setActiveChakras(newSet)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl"
    >
      <h3 className="text-2xl font-bold mb-12 text-center">✨ Chakra Energy</h3>

      <div className="flex justify-center items-center mb-12 h-96 relative">
        {/* Central glow */}
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Chakra circles */}
        <div className="relative w-full h-full max-w-xs">
          {chakras.map((chakra, idx) => (
            <motion.div
              key={chakra.name}
              className="absolute left-1/2 cursor-pointer"
              style={{ top: `${chakra.y}px` }}
              animate={{
                x: activeChakras.has(chakra.name) ? 0 : -50,
              }}
            >
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleChakra(chakra.name)}
                className="relative -translate-x-1/2"
              >
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: chakra.color, width: '60px', height: '60px' }}
                  animate={
                    activeChakras.has(chakra.name)
                      ? {
                          scale: [1, 1.4, 1],
                          opacity: [0.8, 0.2, 0.8],
                        }
                      : { scale: 1, opacity: 0.3 }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Main circle */}
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold relative z-10 shadow-lg"
                  style={{
                    background: `radial-gradient(circle, ${chakra.color}, ${chakra.color}dd)`,
                  }}
                  animate={
                    activeChakras.has(chakra.name)
                      ? { scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  {activeChakras.has(chakra.name) ? '⚡' : '•'}
                </motion.div>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {chakras.map((chakra) => (
          <motion.button
            key={chakra.name}
            whileHover={{ scale: 1.05 }}
            onClick={() => toggleChakra(chakra.name)}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              activeChakras.has(chakra.name)
                ? 'text-white shadow-lg'
                : 'text-muted-foreground bg-white/5'
            }`}
            style={{
              backgroundColor: activeChakras.has(chakra.name) ? `${chakra.color}40` : undefined,
              borderColor: chakra.color,
            }}
          >
            {chakra.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// Affirmation Roulette Wheel - EPIC SPINNING WHEEL
const AffirmationRoulette = () => {
  const affirmations = [
    { text: 'You are worthy', color: '#EC4899' },
    { text: 'I choose growth', color: '#8B5CF6' },
    { text: 'My power is within', color: '#06B6D4' },
    { text: 'I am resilient', color: '#10B981' },
    { text: 'Today is mine', color: '#F59E0B' },
    { text: 'I deserve peace', color: '#EF4444' },
    { text: 'Love conquers fear', color: '#EC4899' },
    { text: 'I am enough', color: '#8B5CF6' },
  ]

  const [isSpinning, setIsSpinning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    const spins = Math.floor(Math.random() * 10) + 10
    const newIndex = (currentIndex + spins) % affirmations.length

    setTimeout(() => {
      setCurrentIndex(newIndex)
      setIsSpinning(false)

      // Create confetti particles
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        color: affirmations[newIndex].color,
      }))
      setParticles(newParticles)
      setTimeout(() => setParticles([]), 1500)
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl"
    >
      <h3 className="text-2xl font-bold mb-8 text-center">🎡 Affirmation Roulette</h3>

      {/* Wheel Container */}
      <div className="flex justify-center mb-8 relative">
        <div className="relative w-64 h-64">
          {/* Confetti */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x * 2, y: p.y * 2, opacity: 0, scale: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full pointer-events-none"
              style={{ background: p.color }}
            />
          ))}

          {/* Wheel */}
          <motion.div
            animate={isSpinning ? { rotate: 3600 } : { rotate: 0 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <svg width="256" height="256" viewBox="0 0 256 256" className="w-full h-full">
              {affirmations.map((aff, idx) => {
                const angle = (360 / affirmations.length) * idx
                return (
                  <g key={idx}>
                    {/* Slice */}
                    <motion.path
                      d={`M 128 128 L ${128 + 100 * Math.cos((angle - 90) * (Math.PI / 180))} ${128 + 100 * Math.sin((angle - 90) * (Math.PI / 180))} A 100 100 0 0 1 ${128 + 100 * Math.cos((angle + 360 / affirmations.length - 90) * (Math.PI / 180))} ${128 + 100 * Math.sin((angle + 360 / affirmations.length - 90) * (Math.PI / 180))} Z`}
                      fill={aff.color}
                      opacity="0.6"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>
                )
              })}
            </svg>
          </motion.div>

          {/* Center Circle */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-white">
              <span className="text-2xl">✨</span>
            </div>
          </motion.div>

          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-yellow-400 z-10" />
        </div>
      </div>

      {/* Current Affirmation Display */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-6 rounded-lg text-center"
        style={{
          background: `${affirmations[currentIndex].color}30`,
          borderColor: affirmations[currentIndex].color,
          borderWidth: '2px',
        }}
      >
        <motion.p
          className="text-2xl font-bold"
          style={{ color: affirmations[currentIndex].color }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5 }}
        >
          ✨ {affirmations[currentIndex].text} ✨
        </motion.p>
      </motion.div>

      {/* Spin Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={!isSpinning ? { scale: 1.1 } : {}}
          whileTap={!isSpinning ? { scale: 0.95 } : {}}
          onClick={spinWheel}
          disabled={isSpinning}
          className="px-8 py-3 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg hover:shadow-2xl transition-all"
        >
          {isSpinning ? '🎡 Spinning...' : '🎡 Spin for Affirmation'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function DemoPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('avatar')

  const interactiveTabs = [
    { id: 'avatar', label: '😊 Mood Avatar', icon: Heart },
    { id: 'chakra', label: '✨ Chakra Energy', icon: Zap },
    { id: 'calm', label: '🎡 Affirmations', icon: Sparkles },
  ]

  return (
    <BeamsBackground className="min-h-screen text-white relative" intensity="strong">
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Logo size="sm" />
              <div className="flex items-center gap-4">
                <LanguageSelector />
                <Link href="/dashboard">
                  <Button variant="default" size="sm">
                    Enter Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 right-0 h-80 w-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-40 left-1/3 h-80 w-80 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-5xl font-bold sm:text-6xl lg:text-7xl"
            >
              {t('demo.exploreTitle')}{' '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AntarYatra
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8 text-xl text-muted-foreground"
            >
              {t('demo.exploreSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  <span className="flex items-center gap-2">
                    {t('demo.exploreDashboard')} <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t('demo.backToHome')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                <Lightbulb className="inline-block h-8 w-8 mr-2 text-yellow-400" />
                {t('demo.tryFeatures')}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {t('demo.tryFeaturesDesc')}
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="mb-8 flex gap-2 flex-wrap justify-center">
              {interactiveTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                      : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Interactive Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'avatar' && <MoodAvatarDemo />}
              {activeTab === 'chakra' && <ChakraEnergyDemo />}
              {activeTab === 'calm' && <AffirmationRoulette />}
            </motion.div>
          </div>
        </section>

        <section className="relative px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                {t('demo.comprehensiveTitle')}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {t('demo.comprehensiveDesc')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {demoFeatures.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  feature={feature}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-4xl font-bold">{t('demo.readyTitle')}</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                {t('demo.readyDesc')}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/dashboard">
                  <Button size="lg">
                    <span className="flex items-center gap-2">
                      {t('demo.accessDashboard')} <ArrowRight className="h-5 w-5" />
                    </span>
                  </Button>
                </Link>
                <Link href="/crisis">
                  <Button size="lg" variant="outline">
                    {t('demo.crisisSupport')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
          </div>
        </footer>
      </div>
    </BeamsBackground>
  )
}
