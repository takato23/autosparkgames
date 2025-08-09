import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"

export interface ModernButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  ripple?: boolean
  asChild?: boolean
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    glow = true,
    ripple = true,
    asChild = false,
    children,
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; size: number }>>([])
    
    const Comp: any = asChild ? 'button' : motion.button
    
    const variants = {
      primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/25",
      secondary: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20",
      ghost: "bg-transparent text-white hover:bg-white/10",
      danger: "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-red-500/25"
    }
    
    const sizes = {
      sm: "px-4 py-2 text-sm rounded-xl",
      md: "px-6 py-3 text-base rounded-2xl",
      lg: "px-8 py-4 text-lg rounded-3xl"
    }
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple) {
        const rect = e.currentTarget.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2
        
        const newRipple = { x, y, size }
        setRipples([...ripples, newRipple])
        
        setTimeout(() => {
          setRipples((prevRipples) => prevRipples.slice(1))
        }, 600)
      }
      
      onClick?.(e as any)
    }
    
    return (
      <Comp
        className={cn(
          "relative overflow-hidden font-semibold transition-all duration-300",
          "transform-gpu will-change-transform",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2",
          variants[variant],
          sizes[size],
          glow && "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:opacity-0 before:blur-xl before:transition-opacity hover:before:opacity-40",
          className
        )}
        ref={ref}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {/* Ripple effect */}
        {ripples.map((ripple, index) => (
          <motion.span
            key={index}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: ripple.size, height: ripple.size, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ left: ripple.x, top: ripple.y }}
          />
        ))}
        
        {/* Content with subtle animation */}
        <motion.span 
          className="relative z-10 flex items-center justify-center gap-2"
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        
        {/* Gradient shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: "-200%" }}
          whileHover={{ 
            opacity: 1,
            x: "200%",
            transition: { duration: 0.6, ease: "easeOut" }
          }}
        />
      </Comp>
    )
  }
)

ModernButton.displayName = "ModernButton"

export { ModernButton }