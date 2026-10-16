import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassPanelProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section' | 'aside'
}

/** Reusable glassmorphic surface with a subtle top highlight. */
export function GlassPanel({ children, className, as: Tag = 'div' }: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        'relative overflow-hidden rounded-2xl glass shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      {children}
    </Tag>
  )
}
