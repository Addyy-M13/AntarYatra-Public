"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Music, Play, Pause, Heart, Zap, CloudRain, Sun, Moon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MoodPlaylist {
  mood: string
  icon: any
  color: string
  gradient: string
  description: string
  songs: Array<{
    title: string
    artist: string
    duration: string
    vibe: string
  }>
  spotifyLink: string
  appleMusicLink: string
}

const moodPlaylists: Record<string, MoodPlaylist> = {
  anxious: {
    mood: "Anxious",
    icon: Zap,
    color: "yellow",
    gradient: "from-yellow-500 to-orange-500",
    description: "Calming tracks to slow your racing thoughts",
    songs: [
      { title: "Weightless", artist: "Marconi Union", duration: "8:08", vibe: "Ultra Calming" },
      { title: "Electra", artist: "Airstream", duration: "5:12", vibe: "Peaceful" },
      { title: "Mellomaniac", artist: "DJ Shah", duration: "6:32", vibe: "Grounding" },
      { title: "Watermark", artist: "Enya", duration: "2:25", vibe: "Serene" },
    ],
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
    appleMusicLink: "https://music.apple.com/playlist/anxiety-relief"
  },
  sad: {
    mood: "Sad",
    icon: CloudRain,
    color: "blue",
    gradient: "from-blue-500 to-indigo-500",
    description: "It's okay to feel your feelings - these will hold space for you",
    songs: [
      { title: "Someone Like You", artist: "Adele", duration: "4:45", vibe: "Cathartic" },
      { title: "The Night We Met", artist: "Lord Huron", duration: "3:28", vibe: "Melancholic" },
      { title: "Skinny Love", artist: "Bon Iver", duration: "3:58", vibe: "Raw" },
      { title: "Mad World", artist: "Gary Jules", duration: "3:09", vibe: "Reflective" },
    ],
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634",
    appleMusicLink: "https://music.apple.com/playlist/sad-songs"
  },
  happy: {
    mood: "Happy",
    icon: Sun,
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    description: "Keep the good vibes flowing!",
    songs: [
      { title: "Good Vibrations", artist: "The Beach Boys", duration: "3:36", vibe: "Uplifting" },
      { title: "Don't Stop Me Now", artist: "Queen", duration: "3:29", vibe: "Euphoric" },
      { title: "Walking on Sunshine", artist: "Katrina & The Waves", duration: "3:59", vibe: "Joyful" },
      { title: "Happy", artist: "Pharrell Williams", duration: "3:53", vibe: "Feel-Good" },
    ],
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
    appleMusicLink: "https://music.apple.com/playlist/happy-hits"
  },
  tired: {
    mood: "Tired",
    icon: Moon,
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    description: "Gentle sounds for rest and restoration",
    songs: [
      { title: "Sleep", artist: "Max Richter", duration: "8:24", vibe: "Dreamy" },
      { title: "Gymnopédie No. 1", artist: "Erik Satie", duration: "3:20", vibe: "Soothing" },
      { title: "Clair de Lune", artist: "Debussy", duration: "5:02", vibe: "Peaceful" },
      { title: "Nocturne", artist: "Chopin", duration: "4:30", vibe: "Tranquil" },
    ],
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp",
    appleMusicLink: "https://music.apple.com/playlist/sleep-sounds"
  },
  motivated: {
    mood: "Motivated",
    icon: Sparkles,
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    description: "Fuel your fire and get things done",
    songs: [
      { title: "Eye of the Tiger", artist: "Survivor", duration: "4:04", vibe: "Powerful" },
      { title: "Lose Yourself", artist: "Eminem", duration: "5:26", vibe: "Intense" },
      { title: "Stronger", artist: "Kanye West", duration: "5:12", vibe: "Energizing" },
      { title: "Hall of Fame", artist: "The Script", duration: "3:22", vibe: "Inspiring" },
    ],
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
    appleMusicLink: "https://music.apple.com/playlist/workout-motivation"
  },
  peaceful: {
    mood: "Peaceful",
    icon: Heart,
    color: "teal",
    gradient: "from-teal-500 to-cyan-500",
    description: "Maintain your inner calm and balance",
    songs: [
      { title: "River Flows in You", artist: "Yiruma", duration: "3:37", vibe: "Flowing" },
      { title: "A Thousand Years", artist: "Christina Perri", duration: "4:45", vibe: "Gentle" },
      { title: "Holocene", artist: "Bon Iver", duration: "5:36", vibe: "Meditative" },
      { title: "To Build a Home", artist: "The Cinematic Orchestra", duration: "6:18", vibe: "Contemplative" },
    ],
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
    appleMusicLink: "https://music.apple.com/playlist/peaceful-piano"
  }
}

export function MoodMusicGenerator() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [playingSong, setPlayingSong] = useState<number | null>(null)

  const handlePlayPause = (index: number) => {
    setPlayingSong(playingSong === index ? null : index)
  }

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-primary mb-4"
          >
            <Music className="w-4 h-4" />
            <span className="text-sm font-medium">Personalized Playlists</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Your{" "}
            <span className="text-primary">
              Mood Music
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Science-backed playlists curated for your emotional state
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-center text-muted-foreground mb-6">What's your mood right now?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {Object.entries(moodPlaylists).map(([key, playlist]) => {
                const Icon = playlist.icon
                return (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedMood(key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedMood === key
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30 bg-card"
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${playlist.gradient} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-semibold">{playlist.mood}</div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-6 md:p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${moodPlaylists[selectedMood].gradient} flex items-center justify-center flex-shrink-0`}>
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{moodPlaylists[selectedMood].mood} Vibes</h3>
                    <p className="text-sm text-muted-foreground">{moodPlaylists[selectedMood].description}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {moodPlaylists[selectedMood].songs.map((song, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-all group"
                    >
                      <button
                        onClick={() => handlePlayPause(index)}
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors"
                      >
                        {playingSong === index ? (
                          <Pause className="w-5 h-5 text-primary" />
                        ) : (
                          <Play className="w-5 h-5 text-primary ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">{song.vibe}</Badge>
                      <span className="text-sm text-muted-foreground flex-shrink-0">{song.duration}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 group" size="lg" asChild>
                    <a href={moodPlaylists[selectedMood].spotifyLink} target="_blank" rel="noopener noreferrer">
                      <Music className="mr-2 w-4 h-4" />
                      Open in Spotify
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg" asChild>
                    <a href={moodPlaylists[selectedMood].appleMusicLink} target="_blank" rel="noopener noreferrer">
                      <Music className="mr-2 w-4 h-4" />
                      Apple Music
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  🎵 Preview only - Full playlists available on streaming platforms
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

