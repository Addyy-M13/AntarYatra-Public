"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslation } from "@/lib/i18n/context"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/ui/logo"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t("nav.features")}
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t("nav.howItWorks")}
            </a>
            <a
              href="/demo"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Demo
            </a>
            <a
              href="/crisis"
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Crisis Support
            </a>
            <ThemeToggle />
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => window.location.href = '/login'}
            >
              {t("nav.getStarted")}
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            className="md:hidden bg-background border-b border-border overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {[
                { href: "#features", label: t("nav.features"), delay: 0.05 },
                { href: "#how-it-works", label: t("nav.howItWorks"), delay: 0.1 },
                { href: "/demo", label: "Demo", delay: 0.15 },
                { href: "/crisis", label: "Crisis Support", delay: 0.2, className: "text-red-500 hover:text-red-600" },
              ].map(({ href, label, delay, className }) => (
                <motion.a
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors ${className ?? "text-foreground/80 hover:text-foreground"}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay, duration: 0.25 }}
                >
                  {label}
                </motion.a>
              ))}
              <motion.div
                className="flex items-center gap-2 pt-2 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ThemeToggle />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                  onClick={() => window.location.href = '/login'}
                >
                  {t("nav.getStarted")}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

