import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  parallax?: boolean
  rotate?: boolean
}

export function FloatingElement({
  children,
  className,
  delay = 0,
  duration = 6,
  distance = 20,
  parallax = false,
  rotate = false
}: FloatingElementProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, parallax ? -distance * 2 : 0])
  
  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={{ y: 0 }}
      animate={{ 
        y: [-distance, distance, -distance],
        rotate: rotate ? [0, 5, -5, 0] : 0
      }}
      transition={{
        y: {
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay
        },
        rotate: {
          duration: duration * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay
        }
      }}
      style={{ y: parallax ? y : undefined }}
    >
      {children}
    </motion.div>
  )
}