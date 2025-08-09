'use client'

import { Button, Card } from '@/lib/design-system/components'
import { ContentItem } from '@/lib/store/presenter'
import { 
  Plus, GripVertical, Trash2, 
  FileText, Gamepad2, Brain, Grid3X3, 
  Palette, Target, Zap, Users 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ContentListProps {
  contents: ContentItem[]
  selectedContent: string | null
  onSelectContent: (id: string) => void
  onAddContent: (type: 'slide' | 'game', subtype: string) => void
  onRemoveContent: (id: string) => void
  onUpdateContent: (id: string, updates: Partial<ContentItem>) => void
}

const contentTypes = [
  { type: 'slide', subtype: 'title', name: 'Título', icon: FileText },
  { type: 'slide', subtype: 'content', name: 'Contenido', icon: FileText },
  { type: 'game', subtype: 'trivia', name: 'Trivia', icon: Brain },
  { type: 'game', subtype: 'bingo', name: 'Bingo', icon: Grid3X3 },
  { type: 'game', subtype: 'pictionary', name: 'Pictionary', icon: Palette },
  { type: 'game', subtype: 'memory', name: 'Memory', icon: Target },
  { type: 'game', subtype: 'race', name: 'Race', icon: Zap },
  { type: 'game', subtype: 'team', name: 'Team', icon: Users },
] as const

function SortableContentItem({ 
  content, 
  isSelected, 
  onSelect, 
  onRemove 
}: {
  content: ContentItem
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getIcon = () => {
    const contentType = contentTypes.find(t => t.subtype === content.subtype)
    return contentType?.icon || FileText
  }

  const Icon = getIcon()

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group',
        isDragging && 'opacity-50'
      )}
    >
      <Card 
        variant={isSelected ? 'elevated' : 'default'}
        interactive
        onClick={onSelect}
        className="mb-2"
      >
        <div className="flex items-center gap-3 p-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-white/10 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Icon className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">
              {content.title}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {content.subtype}
            </p>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-red-400 hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function ContentList({ 
  contents, 
  selectedContent, 
  onSelectContent, 
  onAddContent, 
  onRemoveContent 
}: ContentListProps) {
  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-white mb-3">Contenido</h3>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Slides
          </p>
          <div className="grid grid-cols-2 gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddContent('slide', 'title')}
              className="text-xs"
            >
              + Título
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddContent('slide', 'content')}
              className="text-xs"
            >
              + Contenido
            </Button>
          </div>
          
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-4">
            Juegos
          </p>
          <div className="grid grid-cols-2 gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddContent('game', 'trivia')}
              className="text-xs"
            >
              + Trivia
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddContent('game', 'bingo')}
              className="text-xs"
            >
              + Bingo
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddContent('game', 'pictionary')}
              className="text-xs"
            >
              + Pictionary
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddContent('game', 'memory')}
              className="text-xs"
            >
              + Memory
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {contents.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400">
              Añade contenido para comenzar
            </p>
          </div>
        ) : (
          <div>
            {contents.map((content) => (
              <SortableContentItem
                key={content.id}
                content={content}
                isSelected={selectedContent === content.id}
                onSelect={() => onSelectContent(content.id)}
                onRemove={() => onRemoveContent(content.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}