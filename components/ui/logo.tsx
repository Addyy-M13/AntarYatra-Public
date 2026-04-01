'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  animate?: boolean
}

export function Logo({ size = 'md', href = '/', animate = false }: LogoProps) {
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl md:text-5xl'
  }

  const logo = (
    <motion.span
      className={`${sizeMap[size]} font-bold bg-gradient-to-r from-purple-400 via-cyan-300 to-yellow-300 bg-clip-text text-transparent whitespace-nowrap`}
      animate={animate ? { scale: [1, 1.02, 1] } : {}}
      transition={animate ? { duration: 2, repeat: Infinity } : {}}
    >
      AntarYatra
    </motion.span>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {logo}
      </Link>
    )
  }

  return logo
}
