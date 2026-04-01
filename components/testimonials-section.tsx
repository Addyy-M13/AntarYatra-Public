"use client"

import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya S.",
      role: "Early access user",
      quote:
        "The AI journaling prompts are genuinely helpful — they ask the right questions when I don't know where to start. I've been more consistent with journaling in the past two weeks than in the past two years.",
      rating: 5,
    },
    {
      name: "Rahul M.",
      role: "Early access user",
      quote:
        "Writing in Hinglish without switching keyboards or getting autocorrected makes this feel like it was actually built for me. Small thing, but it matters.",
      rating: 5,
    },
    {
      name: "Sara V.",
      role: "Early access user",
      quote:
        "I appreciate that it doesn't try to be a therapist. It's a journaling tool that takes mental wellness seriously. The mood tracking actually helped me spot a pattern I hadn't noticed.",
      rating: 5,
    },
  ]

  return (
    <section
      id="testimonials"
      className="relative z-10 py-20 md:py-28 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            What early users{" "}
            <span className="text-primary">are saying</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Feedback from people who've been using AntarYatra during early access
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 hover:shadow-sm transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
