"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Heart, Brain, Users } from "lucide-react";
import Image from "next/image";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function parseMetricValue(raw: string) {
  const value = (raw ?? "").toString().trim();
  const m = value.match(
    /^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/
  );
  if (!m) {
    return { prefix: "", end: 0, suffix: value, decimals: 0 };
  }
  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, "");
  const end = parseFloat(normalized);
  const decimals = (normalized.split(".")[1]?.length ?? 0);
  return {
    prefix: prefix ?? "",
    end: isNaN(end) ? 0 : end,
    suffix: suffix ?? "",
    decimals,
  };
}

function MetricStat({
  value,
  label,
  sub,
  duration = 1.6,
}: {
  value: string;
  label: string;
  sub?: string;
  duration?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-2 text-left p-6">
      <p
        className="text-2xl font-medium text-gray-900 dark:text-white sm:text-4xl"
        aria-label={`${label} ${value}`}
      >
        {prefix}
        {reduceMotion ? (
          <span>
            {end.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
        ) : (
          <CountUp
            end={end}
            decimals={decimals}
            duration={duration}
            separator=","
            enableScrollSpy
            scrollSpyOnce
          />
        )}
        {suffix}
      </p>
      <p className="font-medium text-gray-900 dark:text-white text-left">
        {label}
      </p>
      {sub ? (
        <p className="text-gray-600 dark:text-gray-400 text-left">{sub}</p>
      ) : null}
    </div>
  );
}

export default function TransformationJourney() {
  const transformationStories = [
    {
      id: 1,
      quote:
        "AntarYatra helped me understand my emotions in ways I never could before. The daily journaling combined with AI insights showed me patterns I was completely unaware of. My anxiety levels have dropped significantly, and I finally sleep through the night.",
      name: "Priya Sharma",
      role: "Software Engineer, Bangalore",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
      icon: Heart,
      metrics: [
        { value: "87%", label: "Anxiety Reduction", sub: "In 3 months" },
        { value: "92%", label: "Better Sleep Quality", sub: "Consistent improvement" },
      ],
    },
    {
      id: 2,
      quote:
        "The community feature changed everything for me. I did not realize how isolating my mental health struggles were until I connected with others on AntarYatra. Everyone understands, and the shared experiences give me courage to keep going.",
      name: "Rahul Desai",
      role: "Marketing Manager, Mumbai",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      icon: Users,
      metrics: [
        { value: "3.2x", label: "Support Network Growth", sub: "Meaningful connections" },
        { value: "84%", label: "Feeling Less Isolated", sub: "Community impact" },
      ],
    },
    {
      id: 3,
      quote:
        "The mindspace exercises and AI-powered insights gave me clarity about my mental state. I went from feeling overwhelmed every day to having actual strategies for managing stress. The tracking feature shows my real progress, which is incredibly motivating.",
      name: "Ananya Patel",
      role: "Graphic Designer, Delhi",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
      icon: Brain,
      metrics: [
        { value: "95%", label: "Would Recommend To Friends", sub: "User sentiment" },
        { value: "78%", label: "Stress Management Improvement", sub: "Measurable progress" },
      ],
    },
  ];

  return (
    <section
      className="py-16 bg-background"
      aria-labelledby="transformation-heading"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <h2
            id="transformation-heading"
            className="text-4xl font-semibold md:text-5xl text-foreground"
          >
            Your Transformation Journey
          </h2>
          <p className="text-muted-foreground">
            See how AntarYatra helps you move from struggle to strength
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-12">
          {transformationStories.map((story, idx) => {
            const reversed = idx % 2 === 1;
            const IconComponent = story.icon;
            return (
              <div
                key={story.id}
                className="grid gap-8 lg:grid-cols-3 xl:gap-16 items-center border-b border-gray-200 dark:border-gray-800 pb-8"
              >
                <div
                  className={[
                    "flex flex-col sm:flex-row gap-10 lg:col-span-2 lg:border-r lg:pr-12 xl:pr-16 text-left",
                    reversed
                      ? "lg:order-2 lg:border-r-0 lg:border-l border-gray-200 dark:border-gray-800 lg:pl-12 xl:pl-16 lg:pr-0"
                      : "border-gray-200 dark:border-gray-800",
                  ].join(" ")}
                >
                  <Image
                    src={story.image}
                    alt={`${story.name} portrait`}
                    width={300}
                    height={400}
                    className="aspect-[29/35] h-auto w-full max-w-60 rounded-2xl object-cover ring-1 ring-border hover:scale-105 transition-all duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  <figure className="flex flex-col justify-between gap-8 text-left">
                    <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                          Transformation Story
                        </h3>
                      </div>
                      <span className="block text-gray-700 dark:text-gray-300 text-base sm:text-lg lg:text-lg leading-relaxed">
                        {story.quote}
                      </span>
                    </blockquote>
                    <figcaption className="flex items-center gap-6 mt-4 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-md font-medium text-foreground">
                          {story.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {story.role}
                        </span>
                      </div>
                    </figcaption>
                  </figure>
                </div>

                <div
                  className={[
                    "grid grid-cols-1 gap-10 self-center text-left",
                    reversed ? "lg:order-1" : "",
                  ].join(" ")}
                >
                  {story.metrics.map((metric, i) => (
                    <MetricStat
                      key={`${story.id}-${i}`}
                      value={metric.value}
                      label={metric.label}
                      sub={metric.sub}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
