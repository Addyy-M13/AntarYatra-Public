"use client"

import { UniqueTestimonial } from "@/components/ui/unique-testimonial"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n/context"

export function Testimonials() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent pointer-events-none" />
      <div className="container z-10 mx-auto px-4 md:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-135 mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg bg-muted text-foreground text-sm font-medium tracking-tight">
              {t("testimonials.badge")}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-center text-slate-100">
            {t("testimonials.title")}
          </h2>
          <p className="text-center mt-5 text-slate-300">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <UniqueTestimonial />
        </motion.div>
      </div>
    </section>
  )
}
