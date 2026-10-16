import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { profile } from '@/data/profile'
import { GlitchButton } from '../common/GlitchButton'
import { HeroScene } from './HeroScene'
import { HeroAvatar } from './HeroAvatar'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { EASE } from '@/lib/constants'

export function Hero({ started = true }: { started?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef(0) // 0..1 progress through the hero, fed to the 3D rig
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Keep a plain-number mirror of progress for the imperative camera rig.
  useEffect(() => scrollYProgress.on('change', (v) => (scrollRef.current = v)), [scrollYProgress])

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden"
      aria-label="Introduction"
    >
      {/* 3D layer */}
      <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
        <HeroScene scrollRef={scrollRef} />
      </motion.div>

      {/* Waving avatar - fills the right-side space (desktop only, non-blocking) */}
      <motion.div
        style={{ opacity: sceneOpacity }}
        data-cursor="interactive"
        className="absolute inset-y-0 right-0 z-[5] hidden w-[46%] lg:block"
      >
        <HeroAvatar />
      </motion.div>

      {/* Readability scrims */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/20 to-ink-950" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,7,0.6))]" />
      {/* Extra darkening on mobile where the copy overlaps the 3D scene */}
      <div className="pointer-events-none absolute inset-0 bg-ink-950/55 md:hidden" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-center px-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.75)] sm:px-10 md:[text-shadow:none] lg:px-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mb-5 flex flex-wrap items-center gap-2 font-display text-sm uppercase tracking-[0.3em] text-bone-300 sm:text-base"
        >
          <span>Currently building at</span>
          <img
            src="/images/downloaded/Walmart.webp"
            alt="Walmart"
            className="h-5 w-auto"
            loading="eager"
            decoding="async"
          />
          <span className="font-semibold normal-case tracking-normal text-bone-100">
            Walmart
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="font-display font-bold leading-[0.95] tracking-tight text-bone-100"
          style={{ fontSize: 'clamp(3.5rem, 10.5vw, 11rem)' }}
        >
          Hi, I'm{' '}
          <span style={{ color: '#5de4c7' }}>{profile.firstName}.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-6 flex flex-col gap-3"
        >
          <p className="font-display text-3xl font-semibold tracking-tight text-bone-100 sm:text-4xl">
            {profile.heroSub}
          </p>
          <p className="mt-1 max-w-md text-sm text-bone-200 sm:text-base">{profile.tagline}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="pointer-events-auto mt-10 w-fit"
        >
          <GlitchButton
            label="Book a 1:1"
            href={profile.links.topmate}
            ariaLabel="Book a 1:1 with Adway on Topmate"
          />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 1 : [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-bone-400"
      >
        <span className="font-display text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  )
}
