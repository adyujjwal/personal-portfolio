import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { achievements } from '@/data/achievements'
import { SectionHeading } from '../common/SectionHeading'
import { AchievementModal } from './AchievementModal'
import { AchievementsCarousel } from './AchievementsCarousel'
import { EASE } from '@/lib/constants'

export function Achievements() {
  const [active, setActive] = useState<number | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const started = useInView(galleryRef, { once: true, margin: '-15%' })

  return (
    <section id="achievements" className="relative py-28 sm:py-36" aria-label="Achievements">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="03 - Recognition"
          title="A Few Things I'm Proud Of"
          description="Moments of recognition from hackathons, teams, and mentorship. Drag the gallery to browse."
        />
      </div>

      <motion.div
        ref={galleryRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: EASE }}
        className="mt-10"
      >
        <AchievementsCarousel items={achievements} onOpen={(i) => setActive(i)} started={started} />
      </motion.div>

      <AchievementModal
        item={active != null ? achievements[active] : null}
        onClose={() => setActive(null)}
      />
    </section>
  )
}
