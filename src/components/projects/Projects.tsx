import { useEffect } from 'react'
import { projects } from '@/data/projects'
import { SectionHeading } from '../common/SectionHeading'
import { ProjectCard } from './ProjectCard'

export function Projects() {
  // Warm the HTTP cache for the project videos on idle, so the laptop screens
  // render instantly once their canvases spin up during scroll.
  useEffect(() => {
    const run = () => {
      projects.forEach((p) => {
        if (/\.(mp4|webm|mov|m4v)$/i.test(p.media)) fetch(p.media).catch(() => {})
      })
    }
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    const id = w.requestIdleCallback ? w.requestIdleCallback(run) : window.setTimeout(run, 1500)
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(id as number)
      else clearTimeout(id as number)
    }
  }, [])

  return (
    <section id="projects" className="relative py-28 sm:py-36" aria-label="Projects">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="02 - Selected work"
          title="Things I've Built"
          description="Products I've designed, built, and shipped end to end, from AI tooling to augmented reality and immersive 3D web."
        />

        <div className="mt-20 flex flex-col gap-24 sm:gap-28">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
