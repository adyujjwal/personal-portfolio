import { useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { experience } from '@/data/experience'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SectionHeading } from '../common/SectionHeading'
import { HolographicBadge } from './HolographicBadge'
import { ExperienceModal } from './ExperienceModal'
import { ExperienceLanyard } from './ExperienceLanyard'
import { ExperienceScene } from './ExperienceScene'

export function Experience() {
  const [active, setActive] = useState<number | null>(null)
  const isMobile = useIsMobile()
  // Start the physics (badge drop) only once the lanyard scrolls into view.
  const lanyardRef = useRef<HTMLDivElement>(null)
  const started = useInView(lanyardRef, { once: true, margin: '-25%' })

  return (
    <section id="experience" className="relative overflow-hidden py-28 sm:py-36" aria-label="Experience">
      <ExperienceScene />
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="01 - Career"
          title="Where I've Built"
          description={
            isMobile
              ? 'Three chapters, one through-line: scalable systems and thoughtful interfaces. Tap a badge to open it.'
              : 'Three chapters, one through-line: scalable systems and thoughtful interfaces. Drag a badge to swing it, tap to open.'
          }
        />
      </div>

      {isMobile ? (
        <div className="relative z-10 mt-14 grid grid-cols-1 gap-8 px-6 sm:grid-cols-2 sm:px-10">
          {experience.map((item, i) => (
            <HolographicBadge key={item.id} item={item} index={i} onOpen={() => setActive(i)} />
          ))}
        </div>
      ) : (
        <div ref={lanyardRef} className="relative z-10 mt-6">
          <ExperienceLanyard items={experience} onOpen={(i) => setActive(i)} paused={!started} />
        </div>
      )}

      <ExperienceModal item={active != null ? experience[active] : null} onClose={() => setActive(null)} />
    </section>
  )
}
