'use client'

import { Heart, Shield } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.product")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  {t("footer.productFeatures")}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  {t("footer.productHowItWorks")}
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-foreground transition-colors">
                  {t("footer.productTestimonials")}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  {t("footer.productFAQ")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("footer.companyAbout")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("footer.companyBlog")}
                </a>
              </li>
              <li>

              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("footer.companyContact")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("footer.legalPrivacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("footer.legalTerms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-primary/20 rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-primary/20 rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-primary/20 rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>WCAG 2.1 AA Accessible</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Made with <Heart size={16} className="text-accent fill-accent" /> for your mental wellness
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

