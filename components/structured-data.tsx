export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AntarYatra",
    description:
      "AI-powered mental wellness and journaling platform that helps transform anxiety into confidence through guided journaling and mood tracking.",
    url: "https://antaryatra.com",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free forever plan available",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "AI-guided journaling",
      "Personalized mood tracking",
      "Multilingual support",
      "Community support",
      "Privacy-focused",
      "Cross-platform sync",
    ],
    screenshot: "https://antaryatra.com/screenshot.jpg",
    author: {
      "@type": "Organization",
      name: "AntarYatra",
      url: "https://antaryatra.com",
    },
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AntarYatra",
    url: "https://antaryatra.com",
    logo: "https://antaryatra.com/logo.png",
    description: "AI-powered mental wellness platform",
    sameAs: [
      "https://twitter.com/antaryatra",
      "https://facebook.com/antaryatra",
      "https://instagram.com/antaryatra",
      "https://linkedin.com/company/antaryatra",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "hello@antaryatra.com",
    },
  }

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is AntarYatra?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AntarYatra is an AI-powered mental wellness platform that combines journaling, mood tracking, and community support to help you transform anxiety into confidence and achieve inner peace.",
        },
      },
      {
        "@type": "Question",
        name: "Is AntarYatra free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! AntarYatra offers a free forever plan with core features. Premium plans with advanced AI capabilities and additional features are also available.",
        },
      },
      {
        "@type": "Question",
        name: "How does AI journaling work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our AI analyzes your journal entries to understand your emotional patterns, provides personalized insights, suggests coping strategies, and helps you track your mental wellness journey over time.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data private and secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Your journal entries are encrypted end-to-end, and we never share your personal data with third parties. Your privacy is our top priority.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
    </>
  )
}

