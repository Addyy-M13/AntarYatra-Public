"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTranslation } from "@/lib/i18n/context";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface StaggeredFAQProps {
  title?: string;
  subtitle?: string;
  supportText?: string;
  supportLink?: string;
  supportLinkText?: string;
  faqItems?: FAQItem[];
  className?: string;
  hideSupport?: boolean;
}

export function FAQSection({
  title,
  subtitle,
  supportText,
  supportLink = "#",
  supportLinkText,
  faqItems,
  className,
  hideSupport = false,
}: StaggeredFAQProps = {}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Use provided faqItems or fallback to default data from translations
  const faqs = faqItems || [
    {
      id: "faq-1",
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      id: "faq-2",
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      id: "faq-3",
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      id: "faq-4",
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
    {
      id: "faq-5",
      question: "Is AntarYatra a replacement for therapy?",
      answer:
        "No, AntarYatra is a complementary tool for mental wellness, not a replacement for professional therapy. We encourage users to seek professional help when needed and use our platform as a supportive daily practice.",
    },
    {
      id: "faq-6",
      question: "Can I use AntarYatra offline?",
      answer:
        "Yes! You can write journal entries offline, and they'll automatically sync when you're back online. Your mood tracking and insights will be available once synced.",
    },
    {
      id: "faq-7",
      question: "Do I need prior experience with journaling?",
      answer:
        "Not at all! AntarYatra is designed for beginners and experienced journalers alike. Our guided prompts and AI suggestions help you get started, and you can write at your own pace in your own style.",
    },
    {
      id: "faq-8",
      question: "What makes AntarYatra different from other wellness apps?",
      answer:
        "AntarYatra combines AI-powered analysis with cultural mindfulness practices and community support. Our platform is specifically designed to understand mental wellness across diverse cultural contexts while maintaining your privacy and security.",
    },
    {
      id: "faq-9",
      question: "How do I connect with others in the community?",
      answer:
        "Our community section allows you to share insights, find support groups based on interests, and connect with others on their wellness journey. You have full control over your privacy settings and what you choose to share.",
    },
  ];

  // Use provided or fallback to translations
  const displayTitle = title || t("faq.title");
  const displaySubtitle = subtitle || t("faq.subtitle");
  const displaySupportText = supportText || t("faq.support");
  const displaySupportLinkText = supportLinkText || t("faq.supportLink");

  return (
    <section id="faq" ref={ref} className={cn("relative z-10 py-20 md:py-28", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-4xl mx-auto rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 md:p-12 shadow-lg"
          style={{
            boxShadow: "0 4px 32px rgba(0, 0, 0, 0.08)"
          }}
        >
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
              {displayTitle}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {displaySubtitle}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((item, i) => (
            <motion.div
              key={item.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "hsl(var(--card))",
                border: `1px solid hsl(var(--border))`,
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{
                borderColor: "hsl(var(--primary))",
                boxShadow: "0 4px 20px hsl(var(--primary) / 0.08)",
              }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="font-semibold text-base pr-4 text-foreground">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-primary"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    key="ans"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground"
                    >
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

          {!hideSupport && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-muted-foreground">
                {displaySupportText}{" "}
                <Link
                  href={supportLink}
                  className="text-primary font-medium hover:underline"
                >
                  {displaySupportLinkText}
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

