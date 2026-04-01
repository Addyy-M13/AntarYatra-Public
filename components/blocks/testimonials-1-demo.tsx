"use client"

import { TestimonialsSection } from "@/components/ui/testimonials-1"

const demoTestimonials = [
  {
    name: "Shreya",
    rating: 5,
    role: "Student",
    text: `The AI journaling prompts are genuinely helpful — they ask the right questions when I don't know where to start. I've been more consistent with journaling in the past two weeks than in the past two years.`,
    avatar:
      "https://ui-avatars.com/api/?name=Shreya&background=4F46E5&color=fff&bold=true&size=128",
  },
  {
    name: "Anushka",
    rating: 5,
    role: "Student",
    text: `Writing in Hinglish without switching keyboards or getting autocorrected makes this feel like it was actually built for me. Small thing, but it matters.`,
    avatar:
      "https://ui-avatars.com/api/?name=Anushka&background=06B6D4&color=fff&bold=true&size=128",
  },
  {
    name: "Saumya",
    rating: 5,
    role: "Student",
    text: `I appreciate that it doesn't try to be a therapist. It's a journaling tool that takes mental wellness seriously. The mood tracking actually helped me spot a pattern I hadn't noticed.`,
    avatar:
      "https://ui-avatars.com/api/?name=Saumya&background=EC4899&color=fff&bold=true&size=128",
  },
  {
    name: "Rushil",
    rating: 5,
    role: "Student",
    text: `Finally, an app that understands Indian contexts and languages. The exercises are culturally relevant and don't feel generic. This is exactly what we needed.`,
    avatar:
      "https://ui-avatars.com/api/?name=Rushil&background=F59E0B&color=fff&bold=true&size=128",
  },
  {
    name: "Angad",
    rating: 5,
    role: "Student",
    text: `The breathing exercises have become part of my daily routine. I use them every morning and it's genuinely improved my focus and anxiety levels.`,
    avatar:
      "https://ui-avatars.com/api/?name=Angad&background=10B981&color=fff&bold=true&size=128",
  },
  {
    name: "Rishabh",
    rating: 5,
    role: "Student",
    text: `I love how the app celebrates small wins. The rewards system is motivating without being patronizing. Really helps me stay committed to my wellness journey.`,
    avatar:
      "https://ui-avatars.com/api/?name=Rishabh&background=8B5CF6&color=fff&bold=true&size=128",
  },
]

export function TestimonialsDemo() {
  return (
    <TestimonialsSection
      testimonials={demoTestimonials}
      badgeText="Success Stories"
      title="What Our Users Say About Their Transformation"
      subtitle="Real stories from students who have taken control of their mental health"
    />
  )
}
