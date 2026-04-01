"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { BookOpen, Brain, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassHowItWorksCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

const steps = [
  {
    stepNum: "01",
    icon: BookOpen,
    title: "Start Journaling",
    description:
      "Express your thoughts freely with AI-guided prompts that help you dig deeper.",
  },
  {
    stepNum: "02",
    icon: Brain,
    title: "AI Analysis",
    description:
      "Our AI understands your emotions and provides personalized insights and patterns.",
  },
  {
    stepNum: "03",
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Visualize your mental wellness journey with beautiful mood tracking and analytics.",
  },
  {
    stepNum: "04",
    icon: Users,
    title: "Connect & Grow",
    description:
      "Share anonymously with a supportive community and celebrate your wins together.",
  },
];

export function GlassHowItWorksCard({
  title = "Your Wellness Journey",
  subtitle = "Transform your mental health in 4 simple steps",
  className,
  ...props
}: GlassHowItWorksCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: shouldReduceMotion ? "linear" : ([0.16, 1, 0.3, 1] as any),
      },
    },
  };

  return (
    <motion.section
      as="section"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: shouldReduceMotion ? "linear" : [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group w-full max-w-5xl rounded-3xl overflow-hidden border border-border/60 bg-card/85 p-8 backdrop-blur-xl sm:p-12 relative mx-auto",
        className
      )}
      suppressHydrationWarning
      {...(props as any)}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
      />

      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
      </div>

      {/* Steps Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((step, index) => {
          const IconComponent = step.icon;

          return (
            <motion.div
              key={step.stepNum}
              variants={itemVariants}
              className="group/card relative rounded-2xl border border-border/60 bg-background/45 p-6 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-background/60"
            >
              {/* Accent gradient on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-10 -z-10" />

              {/* Step number */}
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-primary">
                {step.stepNum}
              </div>

              {/* Icon and title */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 bg-gradient-to-r from-primary/30 to-transparent lg:block" />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
