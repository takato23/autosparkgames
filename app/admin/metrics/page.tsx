"use client"

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { listSessions, getSessionAnalyticsFromDoc } from '@/lib/firebase/helpers/sessions'

type Row = {
  sessionId: string
  code: string | null
  participants: number
  avgResponseRate: number | null
  durationMs: number | null
}

export default function AdminMetricsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true); setError(null)
        const sessions = await listSessions(100)
        const data = sessions.map(getSessionAnalyticsFromDoc) as Row[]
        setRows(data)
      } catch (e: unknown) {
        console.error('[metrics] load error', e)
        setError((e as { message?: string })?.message || 'No se pudieron cargar métricas')
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [])

  const asCSV = useMemo(() => {
    const header = ['sessionId','code','participants','avgResponseRate','durationMs']
    const body = rows.map(r => [
      r.sessionId,
      r.code ?? '',
      String(r.participants ?? 0),
      r.avgResponseRate == null ? '' : r.avgResponseRate.toFixed(3),
      r.durationMs == null ? '' : String(r.durationMs)
    ])
    return [header, ...body].map(line => line.map(field => {
      const f = String(field)
      return f.includes(',') ? `"${f.replace(/"/g,'""')}"` : f
    }).join(',')).join('\n')
  }, [rows])

  const handleExportCSV = () => {
    const blob = new Blob([asCSV], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'metrics.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'metrics.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Métricas por evento</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportCSV} className="rounded-xl" aria-label="Exportar CSV">Exportar CSV</Button>
            <Button onClick={handleExportJSON} variant="outline" className="rounded-xl" aria-label="Exportar JSON">Exportar JSON</Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div role="alert" className="text-sm text-red-400">{error}</div>
          ) : loading ? (
            <div aria-busy="true" aria-live="polite" className="text-sm opacity-80">Cargando…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="[&>th]:py-2 [&>th]:px-2 border-b">
                    <th>Session</th>
                    <th>Código</th>
                    <th>Participantes</th>
                    <th>% resp. promedio</th>
                    <th>Duración (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.sessionId} className="[&>td]:py-2 [&>td]:px-2 border-b">
                      <td className="font-mono">{r.sessionId}</td>
                      <td className="font-mono">{r.code ?? '—'}</td>
                      <td className="tabular-nums">{r.participants}</td>
                      <td className="tabular-nums">
                        {r.avgResponseRate == null ? '—' : `${Math.round((r.avgResponseRate)*100)}%`}
                      </td>
                      <td className="tabular-nums">
                        {r.durationMs == null ? '—' : (r.durationMs/60000).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


