import { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Environment, Lightformer } from '@react-three/drei'
import { Github, ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'
import { LazyCanvas } from '../three/LazyCanvas'
import { ProjectLaptop } from './ProjectLaptop'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { EASE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const reduced = useReducedMotion()

  // Scroll-driven lid: opens smoothly as the card scrolls up into view.
  const openRef = useRef(reduced ? 1 : 0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })
  useEffect(() => {
    if (reduced) {
      openRef.current = 1
      return
    }
    return scrollYProgress.on('change', (v) => {
      openRef.current = Math.min(1, Math.max(0, v))
    })
  }, [scrollYProgress, reduced])

  const projectUrl = project.liveDemo ?? project.github
  const openProject = () => {
    if (projectUrl) window.open(projectUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      ref={ref}
      className={cn('grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-6')}
    >
      {/* Laptop stage */}
      <div
        className="relative order-1"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={openProject}
        onKeyDown={(e) => {
          if (projectUrl && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            openProject()
          }
        }}
        role={projectUrl ? 'link' : undefined}
        tabIndex={projectUrl ? 0 : undefined}
        aria-label={projectUrl ? `Open ${project.title}` : undefined}
        data-cursor="view"
        style={{ cursor: projectUrl ? 'pointer' : undefined }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '150px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mx-auto h-[clamp(300px,34vw,460px)] w-full"
        >
          <LazyCanvas
            className="absolute inset-0 h-full w-full"
            camera={{ position: [0, 1.0, 4.9], fov: 40 }}
            dpr={[1, 1.3]}
            shadows={false}
            fallback={null}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[4, 6, 4]} intensity={1.5} />
            <ProjectLaptop
              media={project.media}
              accent={project.accent}
              openRef={openRef}
              hovered={hovered}
              reduced={reduced}
            />
            <Environment resolution={64}>
              <Lightformer intensity={2} position={[0, 3, 2]} scale={[6, 6, 1]} />
              <Lightformer intensity={1.5} color="#6ea8ff" position={[-3, 1, 3]} scale={[2, 4, 1]} />
              <Lightformer intensity={1.5} color="#ffffff" position={[3, 1, 3]} scale={[2, 4, 1]} />
            </Environment>
          </LazyCanvas>
        </motion.div>
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: EASE }}
        className="order-2 flex flex-col gap-5"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-accent/80">
            Project 0{index + 1}
          </span>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide"
            style={{ borderColor: `${project.accent}55`, color: project.accent }}
          >
            {project.tags.join(' · ')}
          </span>
        </div>
        <h3 className="font-display text-3xl font-semibold leading-tight text-bone-100 sm:text-4xl">
          {project.title}
        </h3>
        <p className="max-w-md text-base leading-relaxed text-bone-300">{project.description}</p>

        {/* Problem / Solution / Impact */}
        <div className="flex max-w-md flex-col gap-4 border-l border-white/10 pl-5">
          {project.details.map((d, i) => (
            <div key={d.label} className="flex gap-3">
              <span
                className="mt-0.5 font-display text-xs tabular-nums"
                style={{ color: project.accent }}
              >
                0{i + 1}
              </span>
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-bone-200">
                  {d.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-bone-400">{d.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-bone-200"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-3">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="inline-flex items-center gap-1.5 rounded-full bg-bone-100 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-white"
            >
              Live demo <ArrowUpRight size={15} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-bone-100 transition-colors hover:border-white/40 hover:bg-white/5"
            >
              <Github size={15} /> Code
            </a>
          )}
          {!project.liveDemo && !project.github && (
            <span className="text-xs italic text-bone-400">Links coming soon</span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
