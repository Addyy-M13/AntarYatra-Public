"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users } from "lucide-react"

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi",
]

const names = [
  "Priya",
  "Rahul",
  "Ananya",
  "Arjun",
  "Diya",
  "Rohan",
  "Isha",
  "Aditya",
  "Kavya",
  "Vikram",
  "Neha",
  "Karan",
  "Riya",
  "Siddharth",
  "Meera",
  "Aarav",
]

export function RealTimeActivityFeed() {
  // Disabled for performance optimization
  // This component was causing lag with constant animations
  return null
  
  /* Original code disabled - uncomment to re-enable
  const [notifications, setNotifications] = useState<Array<{ id: number; name: string; city: string }>>([])

  useEffect(() => {
    const showNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]
      const id = Date.now()

      setNotifications((prev) => [...prev, { id, name, city }])

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, 4000)
    }

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showNotification, 3000)

    // Then show random notifications every 12-20 seconds (increased interval)
    const interval = setInterval(
      () => {
        showNotification()
      },
      Math.random() * 8000 + 12000, // Changed from 7000 + 8000
    )

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed bottom-24 left-4 z-40 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            className="flex items-center gap-3 bg-card border border-primary/20 rounded-lg px-4 py-3 shadow-lg max-w-xs"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="text-primary" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {notification.name} from {notification.city}
              </p>
              <p className="text-xs text-muted-foreground">just joined the waitlist</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
  */
}

