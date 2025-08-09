'use client'

import { motion } from 'framer-motion'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Trophy, 
  Zap, 
  Target, 
  Crown, 
  Star, 
  Award,
  Sparkles,
  Medal
} from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon?: 'trophy' | 'zap' | 'target' | 'crown' | 'star' | 'award' | 'sparkles' | 'medal'
  imageUrl?: string
  unlocked: boolean
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

const iconMap = {
  trophy: Trophy,
  zap: Zap,
  target: Target,
  crown: Crown,
  star: Star,
  award: Award,
  sparkles: Sparkles,
  medal: Medal
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600'
}

const rarityBorders = {
  common: 'border-gray-300',
  rare: 'border-blue-300',
  epic: 'border-purple-300',
  legendary: 'border-yellow-300'
}

export function AchievementBadge({ 
  achievement,
  size = 'md',
  showProgress = true,
  onClick
}: { 
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  onClick?: () => void
}) {
  const Icon = achievement.icon ? iconMap[achievement.icon] : Trophy
  const rarity = achievement.rarity || 'common'
  
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  }
  
  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer",
        onClick && "hover:scale-105 transition-transform"
      )}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Badge Container */}
        <div className={cn(
          sizeClasses[size],
          "relative rounded-full overflow-hidden",
          "border-4",
          achievement.unlocked ? rarityBorders[rarity] : 'border-gray-200',
          !achievement.unlocked && "grayscale opacity-60"
        )}>
          {achievement.imageUrl ? (
            <img 
              src={achievement.imageUrl} 
              alt={achievement.name}
              className="w-full h-full object-cover"
            />
          ) : achievement.unlocked ? (
            <div className={cn(
              "w-full h-full flex items-center justify-center",
              "bg-gradient-to-br",
              rarityColors[rarity]
            )}>
              <Icon className={cn(iconSizes[size], "text-white drop-shadow-lg")} />
            </div>
          ) : (
            <ImagePlaceholder
              type="badge"
              label=""
              className="w-full h-full border-0"
            />
          )}
        </div>

        {/* Unlock Effect */}
        {achievement.unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ 
              scale: [1, 1.5, 1.8],
              opacity: [0.5, 0.3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <div className={cn(
              "w-full h-full rounded-full",
              "bg-gradient-to-r",
              rarityColors[rarity],
              "opacity-50"
            )} />
          </motion.div>
        )}

        {/* Progress Ring */}
        {showProgress && achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="url(#progress-gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(achievement.progress / achievement.maxProgress) * 100 * 3.14} 314`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progress-gradient">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Rarity Stars */}
        {achievement.unlocked && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {rarity === 'rare' && (
              <>
                <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
              </>
            )}
            {rarity === 'epic' && (
              <>
                <Star className="h-4 w-4 text-purple-500 fill-purple-500" />
                <Star className="h-4 w-4 text-purple-500 fill-purple-500" />
                <Star className="h-4 w-4 text-purple-500 fill-purple-500" />
              </>
            )}
            {rarity === 'legendary' && (
              <>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </>
            )}
          </div>
        )}
      </div>

      {/* Badge Info */}
      <div className="mt-3 text-center">
        <h3 className={cn(
          "font-bold",
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg',
          achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
        )}>
          {achievement.name}
        </h3>
        {size !== 'sm' && (
          <p className={cn(
            "text-xs mt-1",
            achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
          )}>
            {achievement.description}
          </p>
        )}
        {showProgress && achievement.progress !== undefined && achievement.maxProgress && (
          <p className="text-xs mt-1 font-semibold text-purple-600">
            {achievement.progress}/{achievement.maxProgress}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// Achievement Display Grid
export function AchievementGrid({ 
  achievements,
  onBadgeClick
}: {
  achievements: Achievement[]
  onBadgeClick?: (achievement: Achievement) => void
}) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size="sm"
          onClick={() => onBadgeClick?.(achievement)}
        />
      ))}
    </div>
  )
}

// Achievement Unlock Notification
export function AchievementUnlock({ achievement }: { achievement: Achievement }) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 flex items-center gap-4 border-2 border-yellow-400">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1 }}
        >
          <AchievementBadge
            achievement={achievement}
            size="sm"
            showProgress={false}
          />
        </motion.div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold">
              ¡Logro Desbloqueado!
            </Badge>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">{achievement.name}</h3>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
      </div>
    </motion.div>
  )
}