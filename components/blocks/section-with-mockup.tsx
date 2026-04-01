"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionWithMockupProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  primaryImageSrc: string;
  secondaryImageSrc: string;
  reverseLayout?: boolean;
  className?: string;
}

const S = { type: "spring" as const, stiffness: 300, damping: 28 };
const S_SOFT = { type: "spring" as const, stiffness: 260, damping: 24 };

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
  title,
  description,
  primaryImageSrc,
  secondaryImageSrc,
  reverseLayout = false,
  className,
}) => {
  return (
    <section className={cn("relative overflow-hidden py-12", className)}>
      <div className="mx-auto w-full max-w-5xl p-6">
        <div className={cn("grid items-center gap-12 pb-14", reverseLayout ? "md:grid-cols-2 md:grid-flow-col-dense" : "md:grid-cols-2")}>
          {/* ── Text Content ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...S, delay: 0 }}
            className={cn("max-w-md", reverseLayout && "md:col-start-2")}
          >
            <div className="space-y-6">
              <div className="space-y-2 md:space-y-2">
                <h2 className="text-balance text-4xl font-semibold text-foreground">
                  {title}
                </h2>
              </div>

              <p className="text-balance text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </motion.div>

          {/* ── Mockup Section ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...S_SOFT, delay: 0.12 }}
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/30 px-4 py-8 dark:bg-muted/20",
              reverseLayout && "md:col-start-1"
            )}
          >
            {/* Decorative Background Element */}
            <motion.div
              className="absolute inset-0 z-0 opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ ...S_SOFT, delay: 0.24 }}
              style={{
                backgroundImage: `url(${secondaryImageSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(20px) brightness(0.3)",
              }}
            />

            {/* Main Mockup Card */}
            <motion.div
              className="relative z-10 w-full max-w-xs rounded-2xl overflow-hidden border border-border/50 bg-card shadow-2xl"
              initial={{ scale: 0.95, y: reverseLayout ? -20 : 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ ...S, delay: 0.24 }}
              whileHover={{ scale: 1.02, y: reverseLayout ? -25 : 15 }}
            >
              {/* Image Container */}
              <div className="relative w-full h-96 overflow-hidden bg-muted">
                <motion.img
                  src={primaryImageSrc}
                  alt="Mockup showcase"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative gradient border */}
      <div
        className="absolute w-full h-px bottom-0 left-0 z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%)",
        }}
      />
    </section>
  );
};

export default SectionWithMockup;
