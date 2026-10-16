/**
 * Central profile configuration.
 * ──────────────────────────────────────────────────────────────────────
 * EDIT EVERYTHING ABOUT ADWAY HERE. All external links are configured in one
 * place so they are trivial to update. Values marked `TODO` are placeholders -
 * replace them with real URLs/text. The UI never hardcodes these anywhere else.
 */

export const profile = {
  name: 'Adway Ujjwal',
  firstName: 'Adway',
  role: 'Senior Software Engineer',
  company: 'Walmart Global Tech',
  team: 'Catalog Engineering',
  location: 'Bangalore, India',
  positioning: 'Full Stack Engineer + AI / GenAI enthusiast',

  // Short marketing lines used across hero / contact.
  tagline: 'Building scalable systems, beautiful interfaces, and intelligent products.',
  heroHeadline: "Hi, I'm Adway.",
  heroSub: 'Senior Software Engineer',
  heroSupporting: 'Currently building at Walmart Global Tech.',

  // ── External links ──────────────────────────────────────────────────
  // Replace placeholders. `topmate` powers every "Book a 1:1" button.
  links: {
    topmate: 'https://topmate.io/adwayujjwal',
    linkedin: 'https://www.linkedin.com/in/adwayujjwal',
    github: 'https://github.com/adyujjwal',
    leetcode: 'https://leetcode.com/u/adwayujwal/',
    email: 'mailto:adway.ujjwal@outlook.com',
  },

  // SEO
  seo: {
    title: 'Adway Ujjwal - Senior Software Engineer',
    description:
      'Senior Software Engineer building scalable systems, intelligent products, and delightful interfaces.',
  },
} as const

export type Profile = typeof profile
