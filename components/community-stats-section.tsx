import { Globe, Languages, Heart, TrendingUp } from "lucide-react"

export function CommunityStatsSection() {
  const stats = [
    {
      icon: Globe,
      value: "1",
      label: "Country",
      description: "Starting in India",
    },
    {
      icon: Languages,
      value: "12",
      label: "Languages",
      description: "English, Hindi and many more",
    },
    {
      icon: Heart,
      value: "7",
      label: "Journal Entries",
      description: "Build your daily habit",
    },
    {
      icon: TrendingUp,
      value: "27%",
      label: "Early Adopters",
      description: "Join us from day one",
    },
  ]

  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Join Our Growing Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of people worldwide on their wellness journey
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-primary/20 rounded-2xl p-6 text-center hover:border-primary/30 transition-all hover:shadow-sm transition-shadow"
            >
              <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

