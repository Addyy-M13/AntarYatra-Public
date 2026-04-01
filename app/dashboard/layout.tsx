"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BookOpen,
  Heart,
  Users,
  Trophy,
  Home,
  LogOut,
  Shield,
  Sparkles,
  Brain,
  Sun,
  Moon,
  UserCircle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { OnboardingModal } from "@/components/onboarding-modal"
import { GlassFilter } from "@/components/ui/liquid-glass"
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation"
import { Logo } from "@/components/ui/logo"

interface SidebarNavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const sidebarNavItems: SidebarNavItem[] = [
  { title: "Overview",   href: "/dashboard",            icon: Home },
  { title: "Journal",    href: "/dashboard/journal",    icon: BookOpen },
  { title: "Wellness",   href: "/dashboard/mood",       icon: Heart },
  { title: "Mindspace",  href: "/dashboard/mindspace",  icon: Brain },
  { title: "Community",  href: "/dashboard/community",  icon: Users },
  { title: "Rewards",    href: "/dashboard/rewards",    icon: Trophy },
  { title: "Profile",    href: "/dashboard/profile",    icon: UserCircle },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [moodTheme, setMoodTheme] = useState(3)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        setUser(user)
        setLoading(false)

        supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data)
          })

        supabase
          .from('mood_entries')
          .select('mood_value')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(1)
          .single()
          .then(({ data }) => {
            if (data?.mood_value) setMoodTheme(data.mood_value)
          })
      } catch (error) {
        router.push('/login')
      }
    }

    getUser()
  }, [router, pathname])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
    }
    router.push("/login")
    router.refresh()
  }

  if (pathname?.includes('/auth')) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0a0d1a 0%, #0f1535 25%, #0d1a2e 50%, #150a30 75%, #0a1220 100%)",
        }}
      >
        <div className="text-center">
          <Sparkles className="mx-auto h-12 w-12 animate-pulse text-white/70" />
          <p className="mt-4 text-white/50">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/dashboard/auth")
    return null
  }

  return (
    <SidebarProvider
      className={`mood-theme-${moodTheme} dashboard-dark h-svh overflow-hidden relative`}
      style={
        {
          background:
            "linear-gradient(135deg, #0a0d1a 0%, #0f1535 20%, #0d1a2e 40%, #150a30 60%, #0a1535 80%, #0d0f1e 100%)",
          "--sidebar": "rgba(10, 13, 26, 0.65)",
          "--sidebar-foreground": "rgba(255, 255, 255, 0.85)",
          "--sidebar-primary": "rgba(255, 255, 255, 0.15)",
          "--sidebar-primary-foreground": "rgba(255, 255, 255, 0.9)",
          "--sidebar-accent": "rgba(255, 255, 255, 0.12)",
          "--sidebar-accent-foreground": "rgba(255, 255, 255, 0.9)",
          "--sidebar-border": "rgba(255, 255, 255, 0.10)",
          "--sidebar-ring": "rgba(255, 255, 255, 0.3)",
          position: "relative",
        } as React.CSSProperties
      }
    >
      <SmokeBackground smokeColor="#505050" />
      <GlassFilter />
      <OnboardingModal />

      <Sidebar collapsible="icon" className="relative z-10">
        {/* Logo */}
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Logo size="sm" />
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-auto rounded-lg p-1.5 transition-all duration-200 group-data-[collapsible=icon]:hidden"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
              }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </SidebarHeader>

        {/* Nav items */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Privacy badge — hidden in icon-collapsed mode */}
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <div
              className="rounded-xl p-3"
              style={{
                background: "rgba(99, 255, 160, 0.06)",
                border: "1px solid rgba(99, 255, 160, 0.18)",
              }}
            >
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">Privacy Protected</span>
              </div>
              <p className="mt-1 text-xs text-white/40">
                Your data is encrypted and private
              </p>
            </div>
          </SidebarGroup>
        </SidebarContent>

        {/* User profile + sign out */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                tooltip={profile?.username || user?.email || "User"}
                className="group-data-[collapsible=icon]:p-2!"
              >
                <Avatar className="h-7 w-7 shrink-0 ring-1 ring-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {profile?.username?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-white/80">
                    {profile?.username || "User"}
                  </span>
                  <span className="truncate text-xs text-white/40">
                    {user?.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign Out"
                onClick={handleSignOut}
                className="text-white/50 hover:text-white/90"
              >
                <LogOut />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-y-auto relative z-10">
        <div className="flex items-center px-4 py-3">
          <SidebarTrigger className="text-white/60 hover:bg-white/10 hover:text-white/90" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="container mx-auto flex-1 px-6 pb-6 lg:px-8 lg:pb-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </SidebarProvider>
  )
}
