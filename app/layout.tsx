import type React from "react"
import type { Metadata } from "next"
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google"
import { LoadingScreen } from "@/components/loading-screen"
import { Providers } from "./providers"
import "./globals.css"

const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700"],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://antaryatra.com"),
  title: {
    default: "AntarYatra - AI-Powered Mental Wellness & Journaling Platform",
    template: "%s | AntarYatra",
  },
  description:
    "Transform anxiety into confidence with AntarYatra's AI-guided journaling, personalized mood tracking, and supportive community. Start your mental wellness journey today.",
  keywords: [
    "mental wellness",
    "AI journaling",
    "mood tracking",
    "mental health",
    "anxiety relief",
    "mindfulness",
    "self-care",
    "emotional wellness",
    "therapy journal",
    "mental health app",
    "self-help app",
    "mental health app",
  ],
  authors: [{ name: "AntarYatra Team" }],
  creator: "AntarYatra",
  publisher: "AntarYatra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://antaryatra.com",
    title: "AntarYatra - AI-Powered Mental Wellness & Journaling",
    description:
      "Transform your mental wellness journey with AI-guided journaling, mood tracking, and a supportive community that understands you.",
    siteName: "AntarYatra",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AntarYatra - Your Journey to Inner Peace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AntarYatra - AI-Powered Mental Wellness & Journaling",
    description:
      "Transform anxiety into confidence with AI-guided journaling and personalized mood tracking. Join thousands on their wellness journey.",
    images: ["/twitter-image.jpg"],
    creator: "@antaryatra",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://antaryatra.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`font-sans ${plusJakarta.variable} ${heading.variable}`}>
        <LoadingScreen />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}