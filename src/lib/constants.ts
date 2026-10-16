export const SECTIONS = [
  { id: 'hero', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const

/** Shared easing used by Framer Motion + GSAP for a cohesive feel. */
export const EASE = [0.16, 1, 0.3, 1] as const
