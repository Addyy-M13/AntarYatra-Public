"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, DollarSign, Star, ExternalLink, Filter, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TherapistDirectoryCard } from "@/components/ui/therapist-directory-card"
import { useTranslation } from "@/lib/i18n/context"

interface Therapist {
  id: number
  name: string
  credentials: string
  specialties: string[]
  location: string
  acceptsInsurance: boolean
  rating: number
  reviews: number
  priceRange: string
  availability: string
  imageColor: string
  imageUrl: string
  bookingUrl: string
  profileUrl?: string
}

const sampleTherapists: Therapist[] = [
  {
    id: 1,
    name: "Dr. Anjali Chhabria",
    credentials: "MD (Psychiatry), Founder Mindtemple",
    specialties: ["Anxiety", "Depression", "OCD"],
    location: "Mumbai, Maharashtra",
    acceptsInsurance: true,
    rating: 4.8,
    reviews: 245,
    priceRange: "₹₹₹",
    availability: "Available this week",
    imageColor: "from-blue-400 to-blue-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Anjali",
    bookingUrl: "https://www.mindtemple.com/book-appointment",
    profileUrl: "https://www.mindtemple.com/our-team",
  },
  {
    id: 2,
    name: "Dr. Achal Bhagat",
    credentials: "MD (Psychiatry), Senior Consultant",
    specialties: ["Depression", "Bipolar Disorder", "Schizophrenia"],
    location: "New Delhi, Delhi",
    acceptsInsurance: true,
    rating: 4.9,
    reviews: 312,
    priceRange: "₹₹₹₹",
    availability: "Limited availability",
    imageColor: "from-purple-400 to-purple-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Achal",
    bookingUrl: "https://www.saarthakcounselling.com/book-appointment",
    profileUrl: "https://www.saarthakcounselling.com/about",
  },
  {
    id: 3,
    name: "Dr. Shefali Batra",
    credentials: "MD (Psychiatry), Founder Mindframes",
    specialties: ["Anxiety", "ADHD", "Child Psychology"],
    location: "Gurugram, Haryana",
    acceptsInsurance: true,
    rating: 4.7,
    reviews: 189,
    priceRange: "₹₹₹",
    availability: "Available today",
    imageColor: "from-pink-400 to-pink-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Shefali",
    bookingUrl: "https://www.mindframes.in/book-appointment",
    profileUrl: "https://www.mindframes.in/dr-shefali-batra",
  },
  {
    id: 4,
    name: "Dr. Samir Parikh",
    credentials: "MD (Psychiatry), Director Fortis",
    specialties: ["Depression", "Stress Management", "Workplace Mental Health"],
    location: "New Delhi, Delhi",
    acceptsInsurance: true,
    rating: 4.9,
    reviews: 428,
    priceRange: "₹₹₹₹",
    availability: "Waitlist",
    imageColor: "from-green-400 to-green-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Samir",
    bookingUrl: "https://www.fortishealthcare.com/doctor/dr-samir-parikh",
    profileUrl: "https://www.fortishealthcare.com/doctor/dr-samir-parikh",
  },
  {
    id: 5,
    name: "Dr. Kersi Chavda",
    credentials: "MD (Psychiatry), Consultant",
    specialties: ["OCD", "Anxiety", "CBT"],
    location: "Mumbai, Maharashtra",
    acceptsInsurance: true,
    rating: 4.8,
    reviews: 267,
    priceRange: "₹₹₹",
    availability: "Available this week",
    imageColor: "from-orange-400 to-orange-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Kersi",
    bookingUrl: "https://www.practo.com/mumbai/doctor/dr-kersi-chavda",
    profileUrl: "https://www.practo.com/mumbai/doctor/dr-kersi-chavda",
  },
  {
    id: 6,
    name: "Dr. Alpes Panchal",
    credentials: "MD (Psychiatry), Serenity MH Centre",
    specialties: ["Trauma", "PTSD", "De-addiction"],
    location: "Ahmedabad, Gujarat",
    acceptsInsurance: true,
    rating: 4.7,
    reviews: 156,
    priceRange: "₹₹",
    availability: "Available today",
    imageColor: "from-cyan-400 to-cyan-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Alpes",
    bookingUrl: "https://www.serenitymentalhealth.in/book-appointment",
    profileUrl: "https://www.serenitymentalhealth.in/dr-alpes-panchal",
  },
  {
    id: 7,
    name: "Dr. Rashi Agarwal",
    credentials: "Clinical Psychologist, PhD",
    specialties: ["Anxiety", "Relationships", "Women's Mental Health"],
    location: "Bangalore, Karnataka",
    acceptsInsurance: false,
    rating: 4.9,
    reviews: 203,
    priceRange: "₹₹",
    availability: "Limited availability",
    imageColor: "from-indigo-400 to-indigo-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Rashi",
    bookingUrl: "https://calendly.com/dr-rashi-agarwal",
    profileUrl: "https://www.linkedin.com/in/dr-rashi-agarwal",
  },
  {
    id: 8,
    name: "Dr. Praveen Tripathi",
    credentials: "MD (Psychiatry), Max Hospital",
    specialties: ["Depression", "Bipolar Disorder", "Sleep Disorders"],
    location: "Noida, Uttar Pradesh",
    acceptsInsurance: true,
    rating: 4.6,
    reviews: 134,
    priceRange: "₹₹₹",
    availability: "Available this week",
    imageColor: "from-rose-400 to-rose-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Praveen",
    bookingUrl: "https://www.maxhealthcare.in/doctors/dr-praveen-tripathi",
    profileUrl: "https://www.maxhealthcare.in/doctors/dr-praveen-tripathi",
  },
  {
    id: 9,
    name: "Dr. Yusuf Matcheswalla",
    credentials: "MD (Psychiatry), Consultant",
    specialties: ["Depression", "Anxiety", "Geriatric Psychiatry"],
    location: "Mumbai, Maharashtra",
    acceptsInsurance: true,
    rating: 4.8,
    reviews: 178,
    priceRange: "₹₹₹",
    availability: "Available next week",
    imageColor: "from-teal-400 to-teal-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Yusuf",
    bookingUrl: "https://www.practo.com/mumbai/doctor/dr-yusuf-matcheswalla",
    profileUrl: "https://www.practo.com/mumbai/doctor/dr-yusuf-matcheswalla",
  },
  {
    id: 10,
    name: "Dr. Rajesh Sagar",
    credentials: "MD (Psychiatry), Professor AIIMS",
    specialties: ["Child Psychology", "ADHD", "Autism Spectrum"],
    location: "New Delhi, Delhi",
    acceptsInsurance: true,
    rating: 5.0,
    reviews: 291,
    priceRange: "₹₹₹₹",
    availability: "Waitlist",
    imageColor: "from-violet-400 to-violet-600",
    imageUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Rajesh",
    bookingUrl: "https://www.aiims.edu/en/component/content/article.html",
    profileUrl: "https://www.aiims.edu/en/component/content/article.html",
  },
]

const specialtyOptions = [
  "Anxiety", "Depression", "Trauma", "PTSD", "OCD", "ADHD",
  "Bipolar Disorder", "Schizophrenia", "Couples Therapy", "Family Therapy", 
  "Stress Management", "Workplace Mental Health", "Child Psychology",
  "Sleep Disorders", "De-addiction", "CBT", "Women's Mental Health",
  "Geriatric Psychiatry", "Autism Spectrum", "Eating Disorders"
]

export function TherapistFinder() {
  const { t } = useTranslation()
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [insuranceOnly, setInsuranceOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [therapists, setTherapists] = useState(sampleTherapists)

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  const filteredTherapists = therapists.filter(t => {
    const matchesLocation = !searchLocation || 
      t.location.toLowerCase().includes(searchLocation.toLowerCase())
    
    const matchesSpecialty = selectedSpecialties.length === 0 ||
      selectedSpecialties.some(s => t.specialties.includes(s))
    
    const matchesInsurance = !insuranceOnly || t.acceptsInsurance

    return matchesLocation && matchesSpecialty && matchesInsurance
  })

  return (
    <section className="relative py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-3">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">{t('therapist.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t('therapist.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('therapist.description')}
            </p>
          </div>

          {/* Search & Filters */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder={t('therapist.searchPlaceholder')}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('therapist.filtersBtn')}
                </Button>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-border"
                  >
                    <div>
                      <h4 className="font-semibold mb-3">{t('therapist.specialtiesLabel')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {specialtyOptions.map((specialty) => (
                          <Button
                            key={specialty}
                            onClick={() => handleSpecialtyToggle(specialty)}
                            variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                          >
                            {selectedSpecialties.includes(specialty) && (
                              <Check className="w-3 h-3 mr-1" />
                            )}
                            {specialty}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="insurance"
                        checked={insuranceOnly}
                        onChange={(e) => setInsuranceOnly(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="insurance" className="text-sm font-medium cursor-pointer">
                        {t('therapist.insuranceLabel')}
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Found {filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''}
          </div>

          {/* Therapist Cards - Professional Directory Style */}
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredTherapists.map((therapist) => (
                <TherapistDirectoryCard
                  key={therapist.id}
                  avatarColor={therapist.imageColor}
                  avatarImage={therapist.imageUrl}
                  avatarInitials={therapist.name.split(' ').map(n => n[0]).join('')}
                  therapistName={therapist.name}
                  credentials={therapist.credentials}
                  specialties={therapist.specialties}
                  location={therapist.location}
                  acceptsInsurance={therapist.acceptsInsurance}
                  rating={therapist.rating}
                  reviews={therapist.reviews}
                  priceRange={therapist.priceRange}
                  availability={therapist.availability}
                  bookingUrl={therapist.bookingUrl}
                  onBook={() => window.open(therapist.bookingUrl, '_blank', 'noopener,noreferrer')}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Info Card */}
          <Card className="p-6 bg-muted/30 mt-8">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              {t('therapist.chooseTitle')}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {t('therapist.chooseDesc')}
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Check credentials & licenses</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Read reviews & ratings</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Verify insurance coverage</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
