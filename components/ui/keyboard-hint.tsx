import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"

interface KeyboardHintProps {
  keys: string[]
  description: string
  className?: string
}

export function KeyboardHint({ keys, description, className }: KeyboardHintProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-sm",
        theme.colors.text.secondary,
        className
      )}
      role="note"
    >
      <div className="flex gap-1">
        {keys.map((key, index) => (
          <kbd
            key={index}
            className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          >
            {key}
          </kbd>
        ))}
      </div>
      <span>{description}</span>
    </div>
  )
}