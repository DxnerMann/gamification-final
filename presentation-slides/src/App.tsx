import { useCallback, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { GreenhouseBackdrop, LivingPlants } from './components/GardenDecor'
import { SlideShell, slides } from './slides'

export default function App() {
  const deckRef = useRef<HTMLElement>(null)
  const foliageRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const lockRef = useRef(false)
  const [current, setCurrent] = useState(0)
  const [presenting, setPresenting] = useState(false)
  const [hint, setHint] = useState(false)
  const hintTimer = useRef<number | null>(null)

  const goTo = useCallback((index: number, smooth = true) => {
    const next = Math.max(0, Math.min(slides.length - 1, index))
    indexRef.current = next
    setCurrent(next)
    const deck = deckRef.current
    if (!deck) return
    deck.scrollTo({
      top: next * deck.clientHeight,
      behavior: smooth ? 'smooth' : 'auto',
    })
  }, [])

  const showHint = () => {
    setHint(true)
    if (hintTimer.current) window.clearTimeout(hintTimer.current)
    hintTimer.current = window.setTimeout(() => setHint(false), 2800)
  }

  const setPresent = async (on: boolean) => {
    setPresenting(on)
    if (on) {
      showHint()
      try {
        await document.documentElement.requestFullscreen?.()
      } catch {
        /* ignore */
      }
    } else if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch {
        /* ignore */
      }
    }
  }

  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return

    const shiftFoliage = () => {
      const layer = foliageRef.current
      if (!layer) return
      const maxScroll = deck.scrollHeight - deck.clientHeight
      const travel = Math.max(0, layer.offsetHeight - deck.clientHeight)
      const progress = maxScroll <= 0 ? 0 : deck.scrollTop / maxScroll
      layer.style.transform = `translate3d(0, ${-progress * travel}px, 0)`
    }

    const onScroll = () => {
      const idx = Math.round(deck.scrollTop / deck.clientHeight)
      const next = Math.max(0, Math.min(slides.length - 1, idx))
      if (next !== indexRef.current) {
        indexRef.current = next
        setCurrent(next)
      }
      shiftFoliage()
    }

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      e.preventDefault()
      if (lockRef.current || Math.abs(e.deltaY) < 8) return
      lockRef.current = true
      goTo(indexRef.current + (e.deltaY > 0 ? 1 : -1))
      window.setTimeout(() => {
        lockRef.current = false
      }, 680)
    }

    const onResize = () => {
      deck.scrollTo({ top: indexRef.current * deck.clientHeight, behavior: 'auto' })
    }

    shiftFoliage()
    const layer = foliageRef.current
    const onImg = () => shiftFoliage()
    layer?.querySelectorAll('img').forEach((img) => img.addEventListener('load', onImg))

    deck.addEventListener('scroll', onScroll, { passive: true })
    deck.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', onResize)
    return () => {
      deck.removeEventListener('scroll', onScroll)
      deck.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      layer?.querySelectorAll('img').forEach((img) => img.removeEventListener('load', onImg))
    }
  }, [goTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? ''
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        goTo(indexRef.current + 1)
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        goTo(indexRef.current - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(slides.length - 1)
      } else if (e.key === 'p' || e.key === 'P') {
        void setPresent(!presenting)
      } else if (e.key === 'Escape' && presenting) {
        void setPresent(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [goTo, presenting])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#hero">
        Skip to content
      </a>

      <GreenhouseBackdrop shiftRef={foliageRef} />
      <LivingPlants hidden={current === slides.length - 1} />

      <nav className="section-nav" aria-label="Section navigation">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={i === current ? 'active' : ''}
            aria-label={s.label}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => goTo(i)}
          >
            <span>{s.label}</span>
          </button>
        ))}
      </nav>

      <div className={`keyboard-hint ${hint ? 'show' : ''}`} role="status">
        Use ← → or ↑ ↓ to navigate · P for Present · Esc to exit
      </div>

      <main ref={deckRef} className="deck" id="deck">
        {slides.map((slide) => (
          <SlideShell key={slide.id} slide={slide}>
            {slide.content}
          </SlideShell>
        ))}
      </main>
    </MotionConfig>
  )
}
