"use client";

import React, { useEffect, useRef } from "react";
import { BookOpen, Brain, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkStep {
  stepNum: string;
  icon: React.ReactNode;
  title: string;
  titleHindi: string;
  desc: string;
  descHindi: string;
  span?: string;
}

const steps: WorkStep[] = [
  {
    stepNum: "01",
    icon: <BookOpen className="h-6 w-6" />,
    title: "Start Journaling",
    titleHindi: "Journaling Shuru Karo",
    desc: "Express your thoughts freely with AI-guided prompts that help you dig deeper.",
    descHindi: "AI prompts ke sath mann ki baat likho aur gehraye insights pao.",
    span: "col-span-2 row-span-2",
  },
  {
    stepNum: "02",
    icon: <Brain className="h-6 w-6" />,
    title: "AI Analysis",
    titleHindi: "AI Analysis",
    desc: "Our AI understands your emotions and provides personalized insights and patterns.",
    descHindi: "AI tumhare emotions samjhta hai aur personalized insights deta hai.",
  },
  {
    stepNum: "03",
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Track Progress",
    titleHindi: "Progress Track Karo",
    desc: "Visualize your mental wellness journey with beautiful mood tracking and analytics.",
    descHindi: "Apni wellness journey ko mood tracking aur analytics se visualize karo.",
  },
  {
    stepNum: "04",
    icon: <Users className="h-6 w-6" />,
    title: "Connect & Grow",
    titleHindi: "Connect Aur Grow Karo",
    desc: "Share anonymously with a supportive community and celebrate your wins together.",
    descHindi: "Community ke sath anonymously share karo aur wins celebrate karo.",
  },
];

// Reusable BentoItem component
const BentoItem = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);
    };

    item.addEventListener("mousemove", handleMouseMove);

    return () => {
      item.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={cn(
        "bento-item group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 p-6 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/50",
        className
      )}
      style={
        {
          "--mouse-x": "0px",
          "--mouse-y": "0px",
        } as React.CSSProperties
      }
    >
      {/* Hover glow effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 80%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

interface HowAntarYatraWorksGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showHindi?: boolean;
}

export const HowAntarYatraWorksGrid = React.forwardRef<
  HTMLDivElement,
  HowAntarYatraWorksGridProps
>(({ className, showHindi = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-full bg-neutral-950 px-4 py-16 sm:py-24", className)}
      {...props}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How AntarYatra Works
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            {showHindi
              ? "Sirf 4 simple steps mein apna mental wellness journey transform karo"
              : "Four simple steps to transform your mental wellness journey"}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <BentoItem
              key={idx}
              className={cn(step.span && "sm:" + step.span)}
            >
              <div className="flex h-full flex-col justify-between">
                {/* Header */}
                <div>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    {step.icon}
                  </div>
                  <div className="mb-2 font-mono text-sm font-semibold text-neutral-500">
                    {step.stepNum}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {showHindi ? step.titleHindi : step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                  {showHindi ? step.descHindi : step.desc}
                </p>
              </div>
            </BentoItem>
          ))}
        </div>
      </div>
    </div>
  );
});

HowAntarYatraWorksGrid.displayName = "HowAntarYatraWorksGrid";
