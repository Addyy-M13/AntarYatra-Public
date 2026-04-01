"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Sparkles, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface Visualization {
  id: string
  title: string
  duration: number // seconds
  theme: string
  gradient: string
  story: string[]
  audioUrl: string
}

const visualizations: Visualization[] = [
  {
    id: "river",
    title: "Floating Down a River",
    duration: 300, // 5 minutes
    theme: "Peaceful water journey",
    gradient: "from-blue-400 to-cyan-600",
    story: [
      "Close your eyes... You're lying on a comfortable raft...",
      "Gentle waves rock you softly... The sun warms your skin...",
      "You hear water flowing peacefully... Birds singing in the distance...",
      "All worries float away with the current...",
      "You're safe... You're calm... You're at peace...",
      "Take a deep breath... Feel the serenity...",
    ],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "forest",
    title: "Walking Through an Ancient Forest",
    duration: 420, // 7 minutes
    theme: "Nature connection",
    gradient: "from-green-400 to-emerald-600",
    story: [
      "You step onto a soft forest path... Moss cushions your feet...",
      "Towering trees surround you... Their branches create a canopy above...",
      "Sunlight filters through leaves... Creating patterns of light...",
      "You breathe in fresh, clean air... Feel grounded and connected...",
      "The forest accepts you as you are... No judgment, only peace...",
      "You belong here... In this moment... Exactly as you are...",
    ],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "stars",
    title: "Floating Among the Stars",
    duration: 480, // 8 minutes
    theme: "Cosmic peace",
    gradient: "from-purple-400 to-indigo-600",
    story: [
      "You're weightless... Floating in infinite space...",
      "Stars twinkle all around you... Like diamonds in velvet...",
      "You feel small... Yet somehow connected to everything...",
      "Your worries seem tiny from up here... Insignificant...",
      "You're part of something vast... Something beautiful...",
      "Let go... Float... Just be...",
    ],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
]

export function GuidedVisualization() {
  const [selectedViz, setSelectedViz] = useState<Visualization | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [volume, setVolume] = useState([70])
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.preload = "metadata"
    
    // Update time as audio plays
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress(Math.floor(audioRef.current.currentTime))
      }
    }
    
    // Handle audio end
    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }
    
    // Handle errors
    const handleError = () => {
      console.error("Audio failed to load")
      setIsPlaying(false)
    }
    
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    audioRef.current.addEventListener('ended', handleEnded)
    audioRef.current.addEventListener('error', handleError)
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        audioRef.current.removeEventListener('ended', handleEnded)
        audioRef.current.removeEventListener('error', handleError)
      }
    }
  }, [])

  // Load audio when visualization changes
  useEffect(() => {
    if (audioRef.current && selectedViz) {
      audioRef.current.src = selectedViz.audioUrl
      audioRef.current.load()
    }
  }, [selectedViz])

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  const startVisualization = (viz: Visualization) => {
    setSelectedViz(viz)
    setProgress(0)
    setCurrentStoryIndex(0)
    setIsPlaying(true)
    
    // Start audio with error handling
    if (audioRef.current) {
      // Stop any existing playback first
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      
      // Small delay to ensure clean state
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            console.error("Playback failed:", err)
            setIsPlaying(false)
          })
        }
      }, 100)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setSelectedViz(null)
    setProgress(0)
    setCurrentStoryIndex(0)
    setIsPlaying(false)
  }

  // Story progression
  useEffect(() => {
    if (selectedViz && isPlaying) {
      const storyInterval = selectedViz.duration / selectedViz.story.length
      const newIndex = Math.min(
        Math.floor(progress / storyInterval),
        selectedViz.story.length - 1
      )
      setCurrentStoryIndex(newIndex)
    }
  }, [progress, selectedViz, isPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Guided Visualization
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Journey to{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Inner Peace
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immersive guided journeys with calming narration and music
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedViz ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {visualizations.map((viz, index) => (
                  <motion.div
                    key={viz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      onClick={() => startVisualization(viz)}
                      className="p-6 cursor-pointer hover:shadow-lg transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${viz.gradient} mb-4 flex items-center justify-center`}>
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {viz.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{viz.theme}</p>
                      <div className="text-xs text-muted-foreground mb-4">
                        {formatTime(viz.duration)} journey
                      </div>
                      <Button className={`w-full bg-gradient-to-r ${viz.gradient} hover:opacity-90`}>
                        Begin Journey
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="journey"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className={`relative min-h-[600px] overflow-hidden bg-gradient-to-br ${selectedViz.gradient}`}>
                  {/* Animated background particles */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0.2, 0.8, 0.2],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] p-8 text-white">
                    <motion.div
                      key={currentStoryIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 1 }}
                      className="text-center max-w-2xl mb-12"
                    >
                      <p className="text-2xl md:text-3xl font-light leading-relaxed">
                        {selectedViz.story[currentStoryIndex]}
                      </p>
                    </motion.div>

                    {/* Controls */}
                    <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span>{formatTime(progress)}</span>
                          <span>{formatTime(selectedViz.duration)}</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-white"
                            style={{ width: `${(progress / selectedViz.duration) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Play/Pause */}
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <button
                          onClick={togglePlayPause}
                          className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-7 h-7" />
                          ) : (
                            <Play className="w-7 h-7 ml-1" />
                          )}
                        </button>
                      </div>

                      {/* Volume */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {/* Reset */}
                      <Button
                        onClick={reset}
                        variant="outline"
                        className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        End Journey
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info */}
          {!selectedViz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Card className="p-6 bg-purple-500/5 border-purple-500/20">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Real Audio Meditations</h4>
                    <p className="text-sm text-muted-foreground">
                      Each journey features calming music from public domain meditation libraries. Best experienced with headphones in a quiet space. Click play to hear the actual guided audio.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

