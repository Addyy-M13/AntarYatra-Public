/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @next/next/no-img-element */
"use client"

import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n/context"

export interface Testimonial {
  name: string
  role: string
  text: string
  avatar: string
  rating?: number
}

interface TestimonialsSectionProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Shreya",
    role: "Student",
    text: "The AI journaling prompts are genuinely helpful — they ask the right questions when I don't know where to start. I've been more consistent with journaling in the past two weeks than in the past two years.",
    avatar: "https://ui-avatars.com/api/?name=Shreya&background=4F46E5&color=fff&bold=true&size=128",
    rating: 5,
  },
  {
    name: "Anushka",
    role: "Student",
    text: "Writing in Hinglish without switching keyboards or getting autocorrected makes this feel like it was actually built for me. Small thing, but it matters.",
    avatar: "https://ui-avatars.com/api/?name=Anushka&background=06B6D4&color=fff&bold=true&size=128",
    rating: 5,
  },
  {
    name: "Saumya",
    role: "Student",
    text: "I appreciate that it doesn't try to be a therapist. It's a journaling tool that takes mental wellness seriously. The mood tracking actually helped me spot a pattern I hadn't noticed.",
    avatar: "https://ui-avatars.com/api/?name=Saumya&background=EC4899&color=fff&bold=true&size=128",
    rating: 5,
  },
  {
    name: "Rushil",
    role: "Student",
    text: "Finally, an app that understands Indian contexts and languages. The exercises are culturally relevant and don't feel generic. This is exactly what we needed.",
    avatar: "https://ui-avatars.com/api/?name=Rushil&background=F59E0B&color=fff&bold=true&size=128",
    rating: 5,
  },
  {
    name: "Angad",
    role: "Student",
    text: "The breathing exercises have become part of my daily routine. I use them every morning and it's genuinely improved my focus and anxiety levels.",
    avatar: "https://ui-avatars.com/api/?name=Angad&background=10B981&color=fff&bold=true&size=128",
    rating: 5,
  },
  {
    name: "Rishabh",
    role: "Student",
    text: "I love how the app celebrates small wins. The rewards system is motivating without being patronizing. Really helps me stay committed to my wellness journey.",
    avatar: "https://ui-avatars.com/api/?name=Rishabh&background=8B5CF6&color=fff&bold=true&size=128",
    rating: 5,
  },
]

export function TestimonialsSection({
  title,
  subtitle,
  badgeText,
  testimonials = defaultTestimonials,
}: TestimonialsSectionProps) {
  const { t } = useTranslation()

  const displayTitle = title || t('testimonials.title')
  const displaySubtitle = subtitle || t('testimonials.subtitle')
  const displayBadgeText = badgeText || t('testimonials.badge')

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background via-background to-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-foreground font-medium tracking-tight">
              {displayBadgeText}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-slate-100">
              {displayTitle}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {displaySubtitle}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2"
        >
          {testimonials.map((testimonial, i) => {
            const stars = typeof testimonial.rating === "number" ? testimonial.rating : 5
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                viewport={{ once: true }}
              >
                <Card className="flex flex-col h-full border-slate-800 bg-slate-950/50 hover:bg-slate-900/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${
                              idx < stars
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-700 fill-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">"{testimonial.text}"</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    // eslint-disable-next-line react/jsx-no-comment-textnodes
                    <div className="flex items-center gap-4">
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="rounded-full w-10 h-10 object-cover border border-slate-700"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-100">{testimonial.name}</p>
                        <p className="text-xs text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
