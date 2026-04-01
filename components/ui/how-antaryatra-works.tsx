"use client";

import * as React from "react";
import { BookOpen, Brain, TrendingUp, Users, Sparkles } from "lucide-react";
import { FeatureHighlight } from "@/components/ui/feature-highlight";
import { cn } from "@/lib/utils";

export interface HowAntarYatraWorksProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showHindi?: boolean;
}

const steps = [
  {
    stepNum: "01",
    icon: <BookOpen className="inline h-5 w-5 align-middle" />,
    title: "Start Journaling",
    titleHindi: "Journaling Shuru Karo",
    desc: "Write your thoughts with AI prompts and gain deeper insights.",
    descHindi: "AI prompts ke sath mann ki baat likho, aur zyada insight pao.",
  },
  {
    stepNum: "02",
    icon: <Brain className="inline h-5 w-5 align-middle" />,
    title: "AI Analysis",
    titleHindi: "AI Analysis",
    desc: "Our AI understands your emotions and provides personalized insights.",
    descHindi:
      "AI tumhare emotions samjhta hai aur tumhe personal insights deta hai.",
  },
  {
    stepNum: "03",
    icon: <TrendingUp className="inline h-5 w-5 align-middle" />,
    title: "Track Progress",
    titleHindi: "Progress Track Karo",
    desc: "Monitor your wellness journey with mood tracking and analytics.",
    descHindi:
      "Apni wellness journey ka safar, mood tracking aur analytics se dekho.",
  },
  {
    stepNum: "04",
    icon: <Users className="inline h-5 w-5 align-middle" />,
    title: "Connect & Grow",
    titleHindi: "Connect Karo, Grow Karo",
    desc: "Share anonymously and celebrate with supportive communities.",
    descHindi:
      "Anonymous share karo, supportive logon ke saath celebrate karo.",
  },
];

const HowAntarYatraWorks = React.forwardRef<
  HTMLDivElement,
  HowAntarYatraWorksProps
>(({ className, showHindi = true, ...props }, ref) => {
  const features = steps.map((step) => (
    <div className="flex items-start gap-3">
      {/* Step number badge */}
      <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {step.stepNum}
      </span>

      <div>
        {/* Icon + title inline */}
        <span className="inline-flex items-center gap-1.5">
          <span className="text-primary">{step.icon}</span>
          <span className="font-semibold text-foreground">
            {showHindi ? step.titleHindi : step.title}
          </span>
        </span>
        <span className="mx-2 text-muted-foreground/40">—</span>
        <span>{showHindi ? step.descHindi : step.desc}</span>
      </div>
    </div>
  ));

  const footer = (
    <p className="pt-2 text-base text-muted-foreground">
      {showHindi
        ? "Sirf 4 simple steps mein apna wellness journey badlo."
        : "Transform your mental wellness in just 4 simple steps."}
    </p>
  );

  return (
    <div
      ref={ref}
      className={cn("flex w-full justify-center px-4 py-12", className)}
      {...props}
    >
      <FeatureHighlight
        icon={
          <Sparkles className="h-10 w-10 rounded-full bg-primary p-2 text-primary-foreground" />
        }
        title="How AntarYatra Works"
        features={features}
        footer={footer}
      />
    </div>
  );
});

HowAntarYatraWorks.displayName = "HowAntarYatraWorks";

export { HowAntarYatraWorks };
