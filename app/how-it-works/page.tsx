"use client";

import { HowAntarYatraWorks } from "@/components/ui/how-antaryatra-works";

export default function HowItWorksDemo() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Transform Your Mental Wellness
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Join thousands in their journey to better mental health with AI-powered insights
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <HowAntarYatraWorks className="bg-muted/30" />

      {/* CTA Section */}
      <section className="flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to start your journey?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Begin your wellness transformation today
          </p>
          <button className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
