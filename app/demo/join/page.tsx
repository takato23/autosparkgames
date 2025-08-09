'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, QrCode, Sparkles } from 'lucide-react'

export default function DemoJoinPage() {
  const router = useRouter()
  const [code, setCode] = useState('123456')
  const [name, setName] = useState('')
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleJoin = () => {
    if (code === '123456' && name) {
      // For demo, just redirect to participant view
      router.push(`/demo/session/123456?name=${encodeURIComponent(name)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full mb-4"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Únete a la Sesión Demo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Usa el código <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">123456</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ingresa tus datos</CardTitle>
            <CardDescription>
              Participa en juegos interactivos y actividades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tu nombre</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Código de sesión</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="text-center text-2xl font-mono tracking-wider"
                maxLength={6}
              />
            </div>

            <div className="pt-4 space-y-4">
              <Button
                onClick={handleJoin}
                disabled={!name || code !== '123456'}
                className="w-full"
                size="lg"
              >
                Unirse
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                disabled
              >
                <QrCode className="mr-2 h-5 w-5" />
                Escanear QR (Demo)
              </Button>
            </div>

            <div className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
              Al unirte, aceptas que tu participación es anónima y que tus respuestas 
              se usarán de forma agregada durante la sesión demo.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}