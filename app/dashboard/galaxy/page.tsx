"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import * as THREE from "three"
import { Loader2, Telescope, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StarData {
  id: string
  title: string | null
  content: string
  ai_sentiment: string | null
  created_at: string
  wordCount: number
}

const SENTIMENT_COLORS: Record<string, number> = {
  positive: 0xfbbf24,
  neutral:  0x60a5fa,
  negative: 0x8b5cf6,
  mixed:    0x34d399,
  default:  0x94a3b8,
}

export default function EmotionGalaxyPage() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const isDragging = useRef(false)
  const prevMouse = useRef({ x: 0, y: 0 })
  const [loading, setLoading] = useState(true)
  const [starCount, setStarCount] = useState(0)
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; data: StarData | null }>({ visible: false, x: 0, y: 0, data: null })

  useEffect(() => {
    initGalaxy()
    return () => cleanupScene()
  }, [])

  const initGalaxy = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !mountRef.current) return

    const { data: entries } = await supabase
      .from("journal_entries")
      .select("id, title, content, ai_sentiment, created_at")
      .eq("user_id", user.id)

    if (!entries) { setLoading(false); return }
    setStarCount(entries.length)

    const stars: StarData[] = entries.map(e => ({
      ...e,
      wordCount: e.content.split(" ").length,
    }))

    buildScene(stars)
    setLoading(false)
  }

  const buildScene = (stars: StarData[]) => {
    if (!mountRef.current) return
    const w = mountRef.current.clientWidth
    const h = mountRef.current.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x030712)

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 10000)
    camera.position.set(0, 0, 400)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(w, h)
    mountRef.current.appendChild(renderer.domElement)

    // Background star field
    const bgGeometry = new THREE.BufferGeometry()
    const bgPositions: number[] = []
    for (let i = 0; i < 2000; i++) {
      bgPositions.push((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000)
    }
    bgGeometry.setAttribute("position", new THREE.Float32BufferAttribute(bgPositions, 3))
    const bgMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.4 })
    scene.add(new THREE.Points(bgGeometry, bgMaterial))

    // Journal entry stars
    const starMeshes: THREE.Mesh[] = []
    const sentimentOffsets: Record<string, [number, number, number]> = {
      positive: [120, 60, 0],
      negative: [-120, -60, 0],
      neutral:  [0, 0, 60],
      mixed:    [0, 80, -60],
      default:  [0, 0, 0],
    }

    stars.forEach((star, i) => {
      const sentiment = star.ai_sentiment ?? "default"
      const [ox, oy, oz] = sentimentOffsets[sentiment] ?? sentimentOffsets.default
      const spread = 80
      const x = ox + (Math.random() - 0.5) * spread
      const y = oy + (Math.random() - 0.5) * spread
      const z = oz + (Math.random() - 0.5) * spread

      const size = Math.min(2 + star.wordCount / 100, 8)
      const geometry = new THREE.SphereGeometry(size, 8, 8)
      const color = SENTIMENT_COLORS[sentiment] ?? SENTIMENT_COLORS.default
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      mesh.userData = { star, index: i }

      // Glow
      const glowGeo = new THREE.SphereGeometry(size * 1.8, 8, 8)
      const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      mesh.add(glow)

      scene.add(mesh)
      starMeshes.push(mesh)
    })

    // Rotation state
    let rotX = 0, rotY = 0, zoom = 400
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseMove = (e: MouseEvent) => {
      if (!mountRef.current) return
      const rect = mountRef.current.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging.current) {
        const dx = e.clientX - prevMouse.current.x
        const dy = e.clientY - prevMouse.current.y
        rotY += dx * 0.005
        rotX += dy * 0.005
        prevMouse.current = { x: e.clientX, y: e.clientY }
        setTooltip(t => ({ ...t, visible: false }))
        return
      }

      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(starMeshes)
      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh
        setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top, data: hit.userData.star })
        document.body.style.cursor = "pointer"
      } else {
        setTooltip(t => ({ ...t, visible: false }))
        document.body.style.cursor = "default"
      }
    }

    const onMouseDown = (e: MouseEvent) => { isDragging.current = true; prevMouse.current = { x: e.clientX, y: e.clientY } }
    const onMouseUp = () => { isDragging.current = false }
    const onWheel = (e: WheelEvent) => { zoom = Math.max(100, Math.min(1000, zoom + e.deltaY)); camera.position.setZ(zoom) }
    const onResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    mountRef.current.addEventListener("mousemove", onMouseMove)
    mountRef.current.addEventListener("mousedown", onMouseDown)
    mountRef.current.addEventListener("mouseup", onMouseUp)
    mountRef.current.addEventListener("wheel", onWheel)
    window.addEventListener("resize", onResize)

    let animId: number = 0
    const pivot = new THREE.Group()
    starMeshes.forEach(m => { scene.remove(m); pivot.add(m) })
    scene.add(pivot)

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isDragging.current) {
        pivot.rotation.y += 0.001
      } else {
        pivot.rotation.x = rotX
        pivot.rotation.y = rotY
      }
      renderer.render(scene, camera)
    }
    animate()

    sceneRef.current = {
      renderer, animId, mountRef, onMouseMove, onMouseDown, onMouseUp, onWheel, onResize,
      zoomIn: () => { zoom = Math.max(100, zoom - 80); camera.position.setZ(zoom) },
      zoomOut: () => { zoom = Math.min(1000, zoom + 80); camera.position.setZ(zoom) },
      reset: () => { pivot.rotation.set(0, 0, 0); rotX = 0; rotY = 0; zoom = 400; camera.position.setZ(zoom) },
    }
  }

  const cleanupScene = () => {
    if (!sceneRef.current) return
    const { renderer, animId, onMouseMove, onMouseDown, onMouseUp, onWheel, onResize } = sceneRef.current
    cancelAnimationFrame(animId)
    mountRef.current?.removeEventListener("mousemove", onMouseMove)
    mountRef.current?.removeEventListener("mousedown", onMouseDown)
    mountRef.current?.removeEventListener("mouseup", onMouseUp)
    mountRef.current?.removeEventListener("wheel", onWheel)
    window.removeEventListener("resize", onResize)
    renderer.dispose()
    if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
      mountRef.current.removeChild(renderer.domElement)
    }
    document.body.style.cursor = "default"
  }

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 100px)" }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">Building your universe...</p>
          </div>
        </div>
      )}

      <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden" />

      {/* Overlay UI */}
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <Telescope className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Your Emotion Galaxy</span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">{starCount} stars · drag to explore · scroll to zoom</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(SENTIMENT_COLORS).filter(([k]) => k !== "default").map(([sentiment, color]) => (
            <div key={sentiment} className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `#${color.toString(16).padStart(6, "0")}` }} />
              <span className="text-xs text-white/80 capitalize">{sentiment}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="icon" variant="secondary" className="bg-black/60 backdrop-blur-sm text-white border-white/20 hover:bg-black/80" onClick={() => sceneRef.current?.zoomIn()}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="bg-black/60 backdrop-blur-sm text-white border-white/20 hover:bg-black/80" onClick={() => sceneRef.current?.zoomOut()}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="bg-black/60 backdrop-blur-sm text-white border-white/20 hover:bg-black/80" onClick={() => sceneRef.current?.reset()}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {tooltip.visible && tooltip.data && (
        <div
          className="absolute pointer-events-none bg-black/80 backdrop-blur-sm text-white rounded-lg p-3 text-xs max-w-48 z-20"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="font-semibold truncate">{tooltip.data.title || "Untitled Entry"}</p>
          <p className="text-white/60 mt-0.5">{new Date(tooltip.data.created_at).toLocaleDateString()}</p>
          <p className="mt-1 text-white/80 line-clamp-2">{tooltip.data.content.slice(0, 100)}</p>
          <Badge className="mt-1 text-xs capitalize" variant="outline" style={{ color: `#${(SENTIMENT_COLORS[tooltip.data.ai_sentiment ?? "default"] ?? SENTIMENT_COLORS.default).toString(16).padStart(6, "0")}` }}>
            {tooltip.data.ai_sentiment ?? "unsorted"}
          </Badge>
        </div>
      )}
    </div>
  )
}
