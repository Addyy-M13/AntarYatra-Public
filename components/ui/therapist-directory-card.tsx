"use client"

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign, Star, ExternalLink, MessageCircle } from 'lucide-react'

const cardVariants = cva(
  'w-full rounded-xl border bg-card/80 backdrop-blur-sm text-card-foreground shadow-lg hover:shadow-xl flex flex-col transition-all duration-300 hover:border-primary/50 group',
  {
    variants: {
      isExpanded: {
        true: 'h-auto',
        false: 'h-auto',
      },
    },
    defaultVariants: {
      isExpanded: true,
    },
  },
)

export interface TherapistDirectoryCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  avatarColor: string
  avatarInitials: string
  avatarImage?: string
  therapistName: string
  credentials: string
  specialties: string[]
  location: string
  acceptsInsurance: boolean
  rating: number
  reviews: number
  priceRange: string
  availability: string
  bookingUrl: string
  onBook?: () => void
  onContact?: () => void
  isExpanded?: boolean
}

const TherapistDirectoryCard = React.forwardRef<
  HTMLDivElement,
  TherapistDirectoryCardProps
>(
  (
    {
      className,
      avatarColor,
      avatarInitials,
      avatarImage,
      therapistName,
      credentials,
      specialties,
      location,
      acceptsInsurance,
      rating,
      reviews,
      priceRange,
      availability,
      bookingUrl,
      onBook,
      onContact,
      isExpanded,
      ...props
    },
    ref,
  ) => {
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    }

    const handleBook = () => {
      if (onBook) {
        onBook()
      } else {
        window.open(bookingUrl, '_blank', 'noopener,noreferrer')
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ isExpanded }), className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -4 }}
        {...(props as any)}
      >
        {/* Card Header with Avatar and Details */}
        <motion.div
          className="px-4 sm:px-6 pt-4 sm:pt-6 flex items-start gap-4 pb-4 border-b border-border/50"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0 shadow-md overflow-hidden`}
          >
            {avatarImage ? (
              <img
                src={avatarImage}
                alt={therapistName}
                className="w-full h-full object-cover"
              />
            ) : (
              avatarInitials
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-card-foreground truncate">
              {therapistName}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
              {credentials}
            </p>

            {/* Rating */}
            <motion.div className="flex items-center gap-2" variants={itemVariants}>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">{rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({reviews})
              </span>
            </motion.div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-semibold text-primary">{priceRange}</div>
          </div>
        </motion.div>

        {/* Specialties */}
        <motion.div
          className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50"
          variants={itemVariants}
        >
          <div className="flex flex-wrap gap-2">
            {specialties.slice(0, 3).map((specialty, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-xs font-medium inline-block"
              >
                {specialty}
              </motion.span>
            ))}
            {specialties.length > 3 && (
              <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium inline-block">
                +{specialties.length - 3} more
              </span>
            )}
          </div>
        </motion.div>

        {/* Location & Insurance Info */}
        <motion.div
          className="px-4 sm:px-6 py-3 sm:py-4 space-y-2 border-b border-border/50"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            {acceptsInsurance ? (
              <>
                <DollarSign className="w-4 h-4 flex-shrink-0 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Insurance Accepted
                </span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 flex-shrink-0 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Self-pay only
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Availability Status */}
        <motion.div
          className="px-4 sm:px-6 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-4 mx-4 sm:mx-6"
          variants={itemVariants}
        >
          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {availability}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="px-4 sm:px-6 pb-4 sm:pb-6 flex gap-3"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button
              className="w-full group/btn"
              size="sm"
              onClick={handleBook}
            >
              View & Book
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={onContact}
              className="w-10 h-10"
              aria-label="Contact therapist"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  },
)

TherapistDirectoryCard.displayName = 'TherapistDirectoryCard'

export { TherapistDirectoryCard, cardVariants }
