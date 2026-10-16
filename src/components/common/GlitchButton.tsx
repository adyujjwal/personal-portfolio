import { cn } from '@/lib/utils'

interface GlitchButtonProps {
  label: string
  href: string
  external?: boolean
  className?: string
  ariaLabel?: string
  dataCursor?: string
}

/**
 * Glitch-effect CTA link. The visible label is mirrored into `data-text`,
 * which the ::after layer reads to drive the hover glitch animation.
 * Honors reduced-motion via the global stylesheet.
 */
export function GlitchButton({
  label,
  href,
  external = true,
  className,
  ariaLabel,
  dataCursor = 'open',
}: GlitchButtonProps) {
  return (
    <a
      href={href}
      data-text={label}
      data-cursor={dataCursor}
      aria-label={ariaLabel ?? label}
      className={cn('glitch-btn', className)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {label}
    </a>
  )
}
