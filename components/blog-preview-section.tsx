import { ArrowRight, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function BlogPreviewSection() {
  const articles = [
    {
      title: "5 Science-Backed Benefits of Daily Journaling",
      excerpt: "Discover how just 10 minutes of journaling can transform your mental health and emotional well-being.",
      date: "Mar 15, 2024",
      readTime: "5 min read",
      category: "Research",
      image: "/person-writing-in-journal-peacefully.jpg",
    },
    {
      title: "How AI is Revolutionizing Mental Wellness",
      excerpt: "Explore the intersection of artificial intelligence and mental health support in the modern age.",
      date: "Mar 12, 2024",
      readTime: "7 min read",
      category: "Technology",
      image: "/ai-technology-mental-health.jpg",
    },
    {
      title: "Understanding Your Emotions: A Beginner's Guide",
      excerpt: "Learn practical techniques to identify, process, and manage your emotions effectively.",
      date: "Mar 10, 2024",
      readTime: "6 min read",
      category: "Wellness",
      image: "/emotional-wellness-meditation.jpg",
    },
  ]

  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Latest Insights
            </h2>
            <p className="text-lg text-muted-foreground">Expert advice and research on mental wellness</p>
          </div>
          <Button variant="outline" className="hidden md:flex items-center gap-2 bg-transparent">
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link
              key={index}
              href="#"
              className="group bg-card border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-sm transition-shadow"
            >
              <div className="aspect-video overflow-hidden relative">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="text-primary font-medium">{article.category}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="flex items-center gap-2 mx-auto bg-transparent">
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

