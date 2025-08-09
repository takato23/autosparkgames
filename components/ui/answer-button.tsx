import * as React from "react"
import { cn } from "@/lib/utils"
import { theme, a11y } from "@/lib/theme"
import { motion } from "framer-motion"

interface AnswerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  index: number
  selected?: boolean
  correct?: boolean
  incorrect?: boolean
  showResult?: boolean
}

export function AnswerButton({
  className,
  index,
  selected = false,
  correct = false,
  incorrect = false,
  showResult = false,
  children,
  ...props
}: AnswerButtonProps) {
  const answerColor = theme.colors.answers[index % theme.colors.answers.length]
  const letter = String.fromCharCode(65 + index)
  
  const buttonClass = cn(
    "w-full text-left p-6 rounded-2xl transition-all duration-300 transform",
    "hover:scale-[1.02] active:scale-[0.98]",
    "flex items-center gap-4",
    a11y.focusRing,
    showResult && correct && "ring-4 ring-green-500",
    showResult && selected && incorrect && "ring-4 ring-red-500",
    !showResult && `bg-gradient-to-r ${answerColor.bg} hover:bg-gradient-to-r ${answerColor.hover} ${answerColor.text}`,
    showResult && correct && "bg-gradient-to-r from-green-500 to-green-600 text-white",
    showResult && selected && incorrect && "bg-gradient-to-r from-red-500 to-red-600 text-white",
    showResult && !selected && !correct && "bg-gray-200 text-gray-500",
    "shadow-lg hover:shadow-xl",
    className
  )
  
  return (
    <button
      className={buttonClass}
      {...props}
    >
      <motion.div className="flex w-full items-center gap-4" whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center font-black text-xl",
        "bg-white/20 backdrop-blur-sm"
      )}>
        {letter}
      </div>
      <div className="flex-1 font-medium text-lg">
        {children}
      </div>
      {showResult && (
        <div className="text-2xl">
          {correct && "✅"}
          {selected && incorrect && "❌"}
        </div>
      )}
      </motion.div>
    </button>
  )
}