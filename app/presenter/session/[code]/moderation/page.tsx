'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSocket } from '@/lib/hooks/useSocket'
import { Card } from '@/lib/design-system/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Check, X, Star } from 'lucide-react'

interface IncomingMessage {
  id: string
  text: string
  author: string
  timestamp: string
}

export default function ModerationPage() {
  const params = useParams()
  const sessionCode = params.code as string
  const { socket, on } = useSocket()

  const [queue, setQueue] = useState<IncomingMessage[]>([])
  const [approved, setApproved] = useState<IncomingMessage[]>([])
  const [highlighted, setHighlighted] = useState<IncomingMessage[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!socket) return

    const unsub = [
      on('qna-message', ({ id, text, author, timestamp }: IncomingMessage) => {
        setQueue(prev => [{ id, text, author, timestamp }, ...prev])
      }),
    ]

    return () => { unsub.forEach(u => u && u()) }
  }, [socket, on])

  const filteredQueue = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return queue
    return queue.filter(m => m.text.toLowerCase().includes(term) || m.author.toLowerCase().includes(term))
  }, [queue, search])

  const approve = (msg: IncomingMessage) => {
    setQueue(prev => prev.filter(m => m.id !== msg.id))
    setApproved(prev => [msg, ...prev])
    socket?.emit('qna-approve', { sessionCode, id: msg.id })
  }

  const discard = (msg: IncomingMessage) => {
    setQueue(prev => prev.filter(m => m.id !== msg.id))
    socket?.emit('qna-discard', { sessionCode, id: msg.id })
  }

  const highlight = (msg: IncomingMessage) => {
    setHighlighted(prev => [msg, ...prev])
    socket?.emit('qna-highlight', { sessionCode, id: msg.id, text: msg.text, author: msg.author })
  }

  const clearHighlights = () => {
    setHighlighted([])
    socket?.emit('qna-clear-highlight', { sessionCode })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Moderación</h1>
            <p className="text-gray-400">Sesión {sessionCode}</p>
          </div>
          <Badge className="bg-white/10 border-white/20" aria-label="Estado de moderación">Q&A</Badge>
        </div>

        {/* Buscador */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar mensajes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar en la cola de mensajes"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cola */}
          <Card className="bg-gray-800/60 border-gray-700 lg:col-span-2">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold">En revisión</h2>
                <span className="text-sm text-gray-400">({filteredQueue.length})</span>
              </div>

              <ul className="space-y-3" role="list" aria-label="Mensajes en revisión">
                {filteredQueue.map(msg => (
                  <li key={msg.id} className="p-4 rounded-lg bg-gray-900/60 border border-gray-700">
                    <p className="text-white mb-2">{msg.text}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{msg.author}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => approve(msg)} aria-label="Aprobar mensaje">
                        <Check className="h-4 w-4 mr-1" />Aprobar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => highlight(msg)} aria-label="Destacar mensaje">
                        <Star className="h-4 w-4 mr-1" />Destacar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => discard(msg)} aria-label="Descartar mensaje">
                        <X className="h-4 w-4 mr-1" />Descartar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Aprobados / Destacados */}
          <div className="space-y-6">
            <Card className="bg-gray-800/60 border-gray-700">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-3">Aprobados</h2>
                <ul className="space-y-2" role="list" aria-label="Mensajes aprobados">
                  {approved.slice(0, 8).map(msg => (
                    <li key={msg.id} className="p-3 bg-gray-900/60 rounded border border-gray-700">
                      <p className="text-white">{msg.text}</p>
                      <div className="text-xs text-gray-500 mt-1">{msg.author} • {msg.timestamp}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="bg-gray-800/60 border-gray-700">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-3">Destacados</h2>
                <div className="flex justify-end mb-2">
                  <Button size="sm" variant="ghost" onClick={clearHighlights} aria-label="Ocultar destacados">
                    Ocultar destacados
                  </Button>
                </div>
                <ul className="space-y-2" role="list" aria-label="Mensajes destacados">
                  {highlighted.slice(0, 6).map(msg => (
                    <li key={msg.id} className="p-3 bg-yellow-500/10 rounded border border-yellow-700/40">
                      <p className="text-yellow-100">{msg.text}</p>
                      <div className="text-xs text-yellow-300 mt-1">{msg.author} • {msg.timestamp}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


