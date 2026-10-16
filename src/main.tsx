import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Dev-only animation preview: open any URL with `?lab`
const AnimationLab = lazy(() =>
  import('./components/dev/AnimationLab').then((m) => ({ default: m.AnimationLab })),
)
const isLab = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('lab')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isLab ? (
      <Suspense fallback={null}>
        <AnimationLab />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
