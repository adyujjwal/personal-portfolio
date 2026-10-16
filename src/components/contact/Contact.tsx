import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Linkedin, Mail, Code2 } from 'lucide-react'
import { profile } from '@/data/profile'
import { MagneticButton } from '../common/MagneticButton'
import { ContactScene } from './ContactScene'
import { EASE } from '@/lib/constants'

export function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[100svh] items-center overflow-hidden py-28"
      aria-label="Contact"
    >
      <ContactScene />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/70" />

      <div className="relative z-10 w-full px-6 text-center sm:px-10 lg:px-16">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-display text-xs uppercase tracking-[0.35em] text-accent/80"
        >
          05 - Contact
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto mt-5 max-w-3xl font-display font-bold leading-[1.0] tracking-tight text-bone-100"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          Let's Build Something.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mx-auto mt-6 max-w-lg text-base text-bone-300 sm:text-lg"
        >
          Have an interesting problem, opportunity, or idea? Let's talk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            href={profile.links.topmate}
            variant="primary"
            icon={<ArrowUpRight size={15} />}
            ariaLabel="Book a 1:1 on Topmate"
          >
            <span data-cursor="open">Book a 1:1</span>
          </MagneticButton>
          <MagneticButton href={profile.links.linkedin} variant="outline" icon={<Linkedin size={15} />} ariaLabel="LinkedIn profile">
            LinkedIn
          </MagneticButton>
          <MagneticButton href={profile.links.github} variant="outline" icon={<Github size={15} />} ariaLabel="GitHub profile">
            GitHub
          </MagneticButton>
          <MagneticButton href={profile.links.leetcode} variant="outline" icon={<Code2 size={15} />} ariaLabel="LeetCode profile">
            LeetCode
          </MagneticButton>
          <MagneticButton href={profile.links.email} external={false} variant="outline" icon={<Mail size={15} />} ariaLabel="Send an email">
            Email
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
