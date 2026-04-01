"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Waves, Users, Plus, Heart, Wind, Leaf } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

interface HealingCircle {
  id: string
  name: string
  activity_type: string
  participant_count: number
  created_at: string
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; breathIn: number; hold: number; breathOut: number }> = {
  breathing:   { icon: <Wind className="h-5 w-5" />,  label: "Breathing Exercise", color: "text-blue-500",   breathIn: 4, hold: 4, breathOut: 6 },
  meditation:  { icon: <Heart className="h-5 w-5" />, label: "Meditation",         color: "text-purple-500", breathIn: 5, hold: 5, breathOut: 5 },
  grounding:   { icon: <Leaf className="h-5 w-5" />,  label: "Grounding",          color: "text-emerald-500",breathIn: 4, hold: 0, breathOut: 4 },
}

export default function HealingCirclesPage() {
  const [circles, setCircles] = useState<HealingCircle[]>([])
  const [activeCircle, setActiveCircle] = useState<HealingCircle | null>(null)
  const [newCircle, setNewCircle] = useState({ name: "", activity_type: "breathing" })
  const [creating, setCreating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [phaseCount, setPhaseCount] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const breathTimer = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadCircles()
    const sub = supabase
      .channel("healing_circles_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "healing_circles" }, () => loadCircles())
      .subscribe()
    return () => { sub.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!activeCircle) {
      if (breathTimer.current) clearInterval(breathTimer.current)
      return
    }
    startBreathCycle()
    return () => { if (breathTimer.current) clearInterval(breathTimer.current) }
  }, [activeCircle])

  const startBreathCycle = () => {
    if (!activeCircle) return
    const config = ACTIVITY_CONFIG[activeCircle.activity_type]
    setBreathPhase("inhale")
    setPhaseCount(config.breathIn)

    let currentPhase: "inhale" | "hold" | "exhale" = "inhale"
    let count = config.breathIn

    breathTimer.current = setInterval(() => {
      count--
      setPhaseCount(count)
      if (count <= 0) {
        if (currentPhase === "inhale") {
          currentPhase = config.hold > 0 ? "hold" : "exhale"
          count = config.hold > 0 ? config.hold : config.breathOut
        } else if (currentPhase === "hold") {
          currentPhase = "exhale"
          count = config.breathOut
        } else {
          currentPhase = "inhale"
          count = config.breathIn
          setCycleCount(c => c + 1)
        }
        setBreathPhase(currentPhase)
        setPhaseCount(count)
      }
    }, 1000)
  }

  const loadCircles = async () => {
    const { data } = await supabase
      .from("healing_circles")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    if (data) setCircles(data)
  }

  const createCircle = async () => {
    if (!newCircle.name.trim()) { toast.error("Give your circle a name"); return }
    setCreating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from("healing_circles").insert({
      name: newCircle.name,
      activity_type: newCircle.activity_type,
      host_user_id: user.id,
      participant_count: 1,
    }).select().single()
    if (error) { toast.error("Failed to create circle") }
    else {
      toast.success("Circle created!")
      setShowCreate(false)
      setNewCircle({ name: "", activity_type: "breathing" })
      setActiveCircle(data)
      setCycleCount(0)
    }
    setCreating(false)
  }

  const joinCircle = async (circle: HealingCircle) => {
    await supabase.from("healing_circles").update({ participant_count: circle.participant_count + 1 }).eq("id", circle.id)
    setActiveCircle(circle)
    setCycleCount(0)
  }

  const leaveCircle = async () => {
    if (activeCircle) {
      await supabase.from("healing_circles").update({
        participant_count: Math.max(1, activeCircle.participant_count - 1)
      }).eq("id", activeCircle.id)
    }
    setActiveCircle(null)
    setBreathPhase("inhale")
    setPhaseCount(0)
    setCycleCount(0)
  }

  if (activeCircle) {
    const config = ACTIVITY_CONFIG[activeCircle.activity_type]
    const circleScale = breathPhase === "inhale" ? 1.4 : breathPhase === "hold" ? 1.4 : 1
    const phaseLabel = breathPhase === "inhale" ? "Breathe In" : breathPhase === "hold" ? "Hold" : "Breathe Out"

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{activeCircle.name}</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1">
            <Users className="h-4 w-4" />
            {activeCircle.participant_count} in circle · {config.label}
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: circleScale }}
            transition={{ duration: breathPhase === "inhale" ? config.breathIn : breathPhase === "hold" ? 0.1 : config.breathOut, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-4 border-primary/40 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: breathPhase === "inhale" ? 1.1 : breathPhase === "hold" ? 1.1 : 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 flex flex-col items-center justify-center"
            >
              <span className="text-3xl font-bold text-primary">{phaseCount}</span>
            </motion.div>
          </motion.div>
          <div className="absolute -bottom-8 text-center">
            <p className="text-lg font-semibold text-primary">{phaseLabel}</p>
          </div>
        </div>

        <div className="text-center space-y-1 pt-4">
          <p className="text-sm text-muted-foreground">Cycles completed</p>
          <p className="text-3xl font-bold">{cycleCount}</p>
        </div>

        <Button variant="outline" onClick={leaveCircle} className="mt-4">
          Leave Circle
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Waves className="h-8 w-8 text-blue-500" />
            Healing Circles
          </h1>
          <p className="text-muted-foreground mt-1">Join a real-time circle for guided breathing and meditation.</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Circle
        </Button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <Card className="border-primary/30">
              <CardHeader><CardTitle>Create a New Circle</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Circle name (e.g. 'Morning Calm')" value={newCircle.name} onChange={e => setNewCircle(prev => ({ ...prev, name: e.target.value }))} />
                <Select value={newCircle.activity_type} onValueChange={v => setNewCircle(prev => ({ ...prev, activity_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTIVITY_CONFIG).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button onClick={createCircle} disabled={creating} className="flex-1">{creating ? "Creating..." : "Start Circle"}</Button>
                  <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {circles.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-16 text-center text-muted-foreground">
              <Waves className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No active circles right now. Create one and invite others!</p>
            </CardContent>
          </Card>
        ) : circles.map(circle => {
          const config = ACTIVITY_CONFIG[circle.activity_type]
          return (
            <motion.div key={circle.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="cursor-pointer hover:border-primary/50 transition-all" onClick={() => joinCircle(circle)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={`${config.color} bg-current/10 mb-2`} variant="outline">{config.label}</Badge>
                      <CardTitle className="text-lg">{circle.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" />
                        {circle.participant_count} breathing together
                      </CardDescription>
                    </div>
                    <div className={config.color}>{config.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(circle.created_at))} ago</span>
                    <Button size="sm">Join</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
