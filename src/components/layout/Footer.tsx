import { Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '@/data/profile'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-white/5 bg-ink-950 py-10">
      <div className="flex w-full flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-10 lg:px-16">
        <div className="text-center sm:text-left">
          <p className="font-display text-sm font-semibold tracking-wide text-bone-100">
            {profile.name}
          </p>
          <p className="mt-1 text-xs text-bone-400">
            {profile.role} · {profile.location}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            data-cursor="interactive"
            className="text-bone-400 transition-colors hover:text-bone-100"
          >
            <Linkedin size={18} />
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            data-cursor="interactive"
            className="text-bone-400 transition-colors hover:text-bone-100"
          >
            <Github size={18} />
          </a>
          <a
            href={profile.links.email}
            aria-label="Email"
            data-cursor="interactive"
            className="text-bone-400 transition-colors hover:text-bone-100"
          >
            <Mail size={18} />
          </a>
        </div>

        <p className="text-xs text-bone-400">© {year} {profile.name}</p>
      </div>
    </footer>
  )
}
