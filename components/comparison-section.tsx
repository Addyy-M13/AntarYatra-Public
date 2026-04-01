import { Check, X } from "lucide-react"

export function ComparisonSection() {
  const comparisons = [
    {
      feature: "AI-Powered Insights",
      antaryatra: true,
      traditional: false,
      therapy: true,
    },
    {
      feature: "24/7 Availability",
      antaryatra: true,
      traditional: false,
      therapy: false,
    },
    {
      feature: "Mood Tracking",
      antaryatra: true,
      traditional: false,
      therapy: true,
    },
    {
      feature: "Affordable",
      antaryatra: true,
      traditional: true,
      therapy: false,
    },
    {
      feature: "Personalized Prompts",
      antaryatra: true,
      traditional: false,
      therapy: true,
    },
    {
      feature: "Privacy & Security",
      antaryatra: true,
      traditional: true,
      therapy: true,
    },
    {
      feature: "Progress Analytics",
      antaryatra: true,
      traditional: false,
      therapy: false,
    },
  ]

  return (
    <section className="relative py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Why Choose AntarYatra?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we compare to traditional journaling and therapy
          </p>
        </div>

        <div className="bg-card border border-primary/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left p-6 font-semibold text-foreground">Feature</th>
                  <th className="text-center p-6 font-semibold text-primary">AntarYatra</th>
                  <th className="text-center p-6 font-semibold text-muted-foreground">Traditional Journaling</th>
                  <th className="text-center p-6 font-semibold text-muted-foreground">Therapy</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, index) => (
                  <tr key={index} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="p-6 text-foreground">{item.feature}</td>
                    <td className="p-6 text-center">
                      {item.antaryatra ? (
                        <Check className="w-6 h-6 text-primary mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {item.traditional ? (
                        <Check className="w-6 h-6 text-muted-foreground mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {item.therapy ? (
                        <Check className="w-6 h-6 text-muted-foreground mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

