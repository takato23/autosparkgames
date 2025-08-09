import * as React from "react"
import { cn } from "@/lib/utils"
import { ImageIcon, Upload, Building2, Trophy, Users, Sparkles } from "lucide-react"
import { theme } from "@/lib/theme"

interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'logo' | 'background' | 'avatar' | 'badge' | 'question' | 'general'
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait'
  uploadable?: boolean
  label?: string
  description?: string
  onUpload?: (file: File) => void
}

const typeIcons = {
  logo: Building2,
  background: ImageIcon,
  avatar: Users,
  badge: Trophy,
  question: ImageIcon,
  general: Sparkles
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]'
}

export function ImagePlaceholder({
  type = 'general',
  aspectRatio = 'square',
  uploadable = false,
  label,
  description,
  onUpload,
  className,
  ...props
}: ImagePlaceholderProps) {
  const Icon = typeIcons[type]
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  const handleClick = () => {
    if (uploadable && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUpload) {
      onUpload(file)
    }
  }
  
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-purple-100 to-pink-100",
        "border-2 border-dashed border-purple-300",
        "flex flex-col items-center justify-center",
        "transition-all duration-300",
        aspectRatioClasses[aspectRatio],
        uploadable && "cursor-pointer hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-200 hover:to-pink-200",
        className
      )}
      onClick={handleClick}
      role={uploadable ? "button" : undefined}
      tabIndex={uploadable ? 0 : undefined}
      aria-label={uploadable ? `Subir ${label || 'imagen'}` : undefined}
      {...props}
    >
      <div className="text-center p-4">
        <Icon className="h-12 w-12 mx-auto mb-3 text-purple-400" aria-hidden="true" />
        
        {uploadable && (
          <Upload className="h-6 w-6 mx-auto mb-2 text-purple-500" aria-hidden="true" />
        )}
        
        {label && (
          <p className="text-sm font-semibold text-purple-700 mb-1">
            {label}
          </p>
        )}
        
        {description && (
          <p className="text-xs text-purple-600">
            {description}
          </p>
        )}
        
        {uploadable && (
          <p className="text-xs text-purple-500 mt-2">
            Click para subir
          </p>
        )}
      </div>
      
      {uploadable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-label={`Seleccionar archivo para ${label || 'imagen'}`}
        />
      )}
      
      {/* Decorative corner */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl" />
    </div>
  )
}