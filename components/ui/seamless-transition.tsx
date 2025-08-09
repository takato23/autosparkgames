'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    filter: "blur(10px)",
    scale: 0.98,
  },
  in: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
  },
  out: {
    opacity: 0,
    filter: "blur(10px)",
    scale: 1.02,
  }
}

const pageTransition = { duration: 0.25 as number }

export function SeamlessTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  
  useEffect(() => {
    setDisplayChildren(children)
  }, [children])
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="will-change-transform"
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  )
}