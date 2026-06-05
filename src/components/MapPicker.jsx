"use client"
import dynamic from 'next/dynamic'
import { AlertCircle } from 'lucide-react'

// Dynamically import the map component with SSR disabled
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[var(--muted)] flex items-center justify-center border border-[var(--border)] rounded-md">
      <p className="text-[var(--muted-foreground)]">Loading Map...</p>
    </div>
  )
})

export function MapPicker({ error, onLocationSelect, initialPosition }) {
  return (
    <div className="flex flex-col space-y-2 h-full">
      <div className={`relative h-full w-full rounded-md overflow-hidden border ${error ? 'border-[var(--danger)]' : 'border-[var(--border)]'}`}>
        <DynamicMap initialPosition={initialPosition || null} onLocationSelect={onLocationSelect} />
      </div>
      {error && (
        <div className="flex items-center text-[var(--danger)] text-sm font-medium">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}
