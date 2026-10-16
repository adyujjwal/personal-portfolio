import { motion } from 'framer-motion'
import { Code2, Server, Cloud, Container, Database, Sparkles, type LucideIcon } from 'lucide-react'
import { skills, categoryColors, type SkillCategory } from '@/data/skills'
import { SectionHeading } from '../common/SectionHeading'
import { EASE } from '@/lib/constants'

const CATEGORY_ICON: Record<SkillCategory, LucideIcon> = {
  Frontend: Code2,
  Backend: Server,
  Cloud: Cloud,
  DevOps: Container,
  Database: Database,
  AI: Sparkles,
  Testing: Code2,
}

const CATEGORY_BLURB: Record<SkillCategory, string> = {
  Frontend: 'Interfaces & interactions',
  Backend: 'Services & APIs',
  Cloud: 'Infrastructure & delivery',
  DevOps: 'Build, ship & scale',
  Database: 'Data & caching',
  AI: 'Applied GenAI',
  Testing: 'Quality & reliability',
}

function CategoryCard({ category, index }: { category: SkillCategory; index: number }) {
  const accent = categoryColors[category]
  const Icon = CATEGORY_ICON[category]
  const items = skills.filter((s) => s.category === category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800/50 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/25"
    >
      {/* hover glow */}
      <div
        className="pointer-events-none absolute -inset-px -z-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: `radial-gradient(circle at 30% 0%, ${accent}, transparent 70%)` }}
      />
      {/* top accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition-colors duration-300"
          style={{ background: `${accent}1a`, color: accent }}
        >
          <Icon size={18} />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-bone-100">{category}</h3>
          <p className="text-xs text-bone-400">{CATEGORY_BLURB[category]}</p>
        </div>
        <span className="ml-auto font-display text-xs tabular-nums text-bone-500/70">
          0{items.length}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((s) => (
          <span
            key={s.id}
            title={s.context}
            className="cursor-default rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-sm text-bone-200 transition-colors duration-200 hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          >
            {s.label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function Marquee() {
  const row = [...skills, ...skills]
  return (
    <div className="marquee-mask relative mt-14 overflow-hidden py-2">
      <div className="animate-marquee flex w-max gap-4">
        {row.map((s, i) => (
          <span
            key={`${s.id}-${i}`}
            className="whitespace-nowrap font-display text-2xl font-medium text-bone-500/40 sm:text-3xl"
          >
            {s.label}
            <span className="mx-4" style={{ color: categoryColors[s.category] }}>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  const categories = Array.from(new Set(skills.map((s) => s.category))) as SkillCategory[]

  return (
    <section id="skills" className="relative py-28 sm:py-36" aria-label="Skills">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="04 - Toolkit"
          title="My Toolkit"
          description="The stack I build with - grouped by where it lives in the system."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <CategoryCard key={category} category={category} index={i} />
          ))}
        </div>
      </div>

      <Marquee />
    </section>
  )
}
