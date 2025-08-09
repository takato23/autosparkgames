'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createEventCode, listEventCodes } from '@/lib/firebase/helpers/codes'

export default function AdminCodesPage() {
  const [code, setCode] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [maxParticipants, setMaxParticipants] = useState<number>(200)
  const [codes, setCodes] = useState<any[]>([])

  useEffect(() => {
    listEventCodes().then(setCodes).catch(() => {})
  }, [])

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Códigos de evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="code">Código</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
            </div>
            <div>
              <Label htmlFor="expires">Expira (ISO)</Label>
              <Input id="expires" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} placeholder="2025-12-31T23:59:59Z" />
            </div>
            <div>
              <Label htmlFor="max">Máx. participantes</Label>
              <Input id="max" type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} />
            </div>
          </div>
          <Button
            aria-label="Crear código"
            onClick={async () => {
              await createEventCode({ code, expiresAt, maxParticipants })
              const list = await listEventCodes()
              setCodes(list)
            }}
          >Crear</Button>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Códigos existentes</h3>
            <ul className="space-y-2">
              {codes.map((c) => (
                <li key={c.code} className="text-sm">
                  {c.code} · expira: {c.expiresAt || '—'} · max: {c.maxParticipants || '—'}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


