'use client'

import * as React from 'react'

interface BrandRibbonProps {
  logoUrl?: string
  primaryColor?: string
  sponsorName?: string
}

export default function BrandRibbon({ logoUrl, primaryColor = '#2563eb', sponsorName }: BrandRibbonProps) {
  return (
    <div
      className="w-full py-1.5 px-3 text-xs flex items-center gap-2 border-b"
      style={{ background: `${primaryColor}0D`, borderColor: `${primaryColor}33` }}
      aria-label="Cinta de marca del sponsor"
    >
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={sponsorName || 'Sponsor'} className="h-5 w-auto" />
      )}
      <span className="font-medium" style={{ color: primaryColor }}>
        {sponsorName || 'Evento patrocinado'}
      </span>
    </div>
  )
}



