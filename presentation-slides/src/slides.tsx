import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { CheckIcon } from './components/GardenDecor'
import lukasPortrait from './assets/personas/lukas.jpg'
import sophiePortrait from './assets/personas/sophie.jpg'
import { AppPhones } from './components/AppPhones'

export type SlideDef = {
  id: string
  label: string
  decor?: 'hero' | 'soft' | 'dense' | 'poster'
  className?: string
  content: ReactNode
}

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.4 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
}

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <div className={`section-kicker${n.length > 1 ? ' wide' : ''}`}>
      <span className="num">{n}</span>
      {label}
    </div>
  )
}

function Sep() {
  return <span className="inline-sep" aria-hidden="true" />
}

function SourceNote({ children }: { children: ReactNode }) {
  return <p className="source-note">{children}</p>
}

function GardenPot({ kind }: { kind: 'grow' | 'discover' | 'together' }) {
  return (
    <div className={`pot-plant ${kind}`} aria-hidden="true">
      {kind === 'grow' && (
        <>
          <span className="stem" />
          <span className="leaf l" />
          <span className="leaf r" />
          <span className="leaf top" />
        </>
      )}
      {kind === 'discover' && (
        <>
          <span className="stem" />
          <span className="leaf l" />
          <span className="leaf r" />
          <span className="bloom" />
        </>
      )}
      {kind === 'together' && (
        <>
          <span className="stem a" />
          <span className="stem b" />
          <span className="leaf a" />
          <span className="leaf b" />
          <span className="leaf c" />
        </>
      )}
      <span className="clay" />
    </div>
  )
}

function WhoDot({ who }: { who: 'lukas' | 'sophie' | 'both' }) {
  if (who === 'both') {
    return (
      <span className="who-dots" aria-hidden="true">
        <i className="dot o" />
        <i className="dot p" />
      </span>
    )
  }
  return <i className={`dot ${who === 'lukas' ? 'o' : 'p'}`} aria-hidden="true" />
}

function Bars({
  rows,
  tone,
}: {
  rows: { label: string; value: number }[]
  tone: 'orange' | 'lilac'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const signature = rows.map((row) => `${row.label}:${row.value}`).join('|')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || el.closest('.poster-body')) {
      setProgress(1)
      return
    }
    let frame = 0
    const play = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1100)
        setProgress(1 - (1 - t) ** 3)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      cancelAnimationFrame(frame)
      setProgress(0)
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play()
        else {
          cancelAnimationFrame(frame)
          setProgress(0)
        }
      },
      { threshold: 0.55 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [signature])

  return (
    <div className="bars" ref={ref} aria-label="Bartle player-type mix">
      {rows.map((row) => (
        <div className="bar-row" key={row.label}>
          <span>{row.label}</span>
          <div className="bar-track">
            <div className={`bar-fill ${tone}`} style={{ width: `${row.value * progress}%` }} />
          </div>
          <strong>{Math.round(row.value * progress)}%</strong>
        </div>
      ))}
    </div>
  )
}

const posterMeta: Record<string, { n: string; label: string; col: string; row: number }> = {
  problem: { n: '1', label: 'Problem', col: '1 / span 6', row: 1 },
  goal: { n: '2', label: 'Goal', col: '7 / span 6', row: 1 },
  personas: { n: '3', label: 'Personas', col: '1 / span 8', row: 2 },
  motivators: { n: '5', label: 'Motivators', col: '9 / span 4', row: 2 },
  concept: { n: '4', label: 'Concept', col: '1 / span 8', row: 3 },
  fun: { n: '6', label: 'Fun', col: '9 / span 4', row: 3 },
  journey: { n: '7', label: 'Journey', col: '1 / span 8', row: 4 },
  loop: { n: '8', label: 'Loop', col: '9 / span 4', row: 4 },
  mechanics: { n: '9', label: 'Mechanics', col: '1 / span 8', row: 5 },
  tech: { n: '10', label: 'Tech', col: '9 / span 4', row: 5 },
  ethics: { n: '11', label: 'Ethics', col: '1 / span 12', row: 6 },
}

function PosterBlock({
  meta,
  children,
}: {
  meta: { n: string; label: string; col: string; row: number }
  children: ReactNode
}) {
  const fitRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fitBox = fitRef.current
    const body = bodyRef.current
    if (!fitBox || !body) return

    const fit = () => {
      const available = fitBox.clientHeight
      if (available < 8) return
      body.style.transform = 'none'
      body.style.width = '100%'
      const natural = body.scrollHeight
      if (natural < 8) return
      let scale = Math.min(1, (available - 1) / natural)
      if (scale >= 0.995) {
        body.style.transform = 'none'
        body.style.width = '100%'
        return
      }
      for (let i = 0; i < 5; i += 1) {
        body.style.width = `${100 / scale}%`
        body.style.transform = `scale(${scale})`
        const visual = body.scrollHeight * scale
        if (visual <= available - 1) return
        scale *= (available - 1) / visual
      }
      body.style.width = `${100 / scale}%`
      body.style.transform = `scale(${scale})`
      const visual = body.scrollHeight * scale
      if (visual > available - 1) {
        body.style.transform = 'none'
        body.style.width = '100%'
        const safe = Math.min(1, (available - 1) / body.scrollHeight)
        body.style.transform = safe < 0.995 ? `scale(${safe})` : 'none'
      }
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(fitBox)
    return () => observer.disconnect()
  }, [])

  return (
    <article className="poster-block" style={{ gridColumn: meta.col, gridRow: meta.row }}>
      <header className="poster-kicker">
        <span className="poster-num">{meta.n}</span>
        <span className="poster-label">{meta.label}</span>
      </header>
      <div className="poster-fit" ref={fitRef}>
        <div className="poster-body" ref={bodyRef}>
          {children}
        </div>
      </div>
    </article>
  )
}

function SlideOverview({ items }: { items: SlideDef[] }) {
  return (
    <MotionConfig reducedMotion="always">
      <div className="overview-grid" aria-label="Everything on one page">
        {items
          .filter((slide) => !['hero', 'app', 'end'].includes(slide.id))
          .map((slide) => (
            <PosterBlock key={slide.id} meta={posterMeta[slide.id]}>
              {slide.content}
            </PosterBlock>
          ))}
      </div>
    </MotionConfig>
  )
}

function HeroBed() {
  return (
    <motion.div
      className="hero-visual"
      {...fade}
      transition={{ ...fade.transition, delay: 0.08 }}
      aria-hidden="true"
    >
      <div className="garden-stage">
        <div className="plant short" style={{ left: '8%' }}>
          <div className="stem" />
          <span className="leaf l" />
          <span className="leaf r" />
          <span className="leaf mid" />
        </div>
        <div className="plant" style={{ left: '24%' }}>
          <div className="stem" />
          <span className="leaf l" />
          <span className="leaf r" />
          <span className="leaf mid" />
        </div>
        <div className="plant tall" style={{ left: '42%' }}>
          <div className="stem" />
          <span className="leaf l" />
          <span className="leaf r" />
          <span className="leaf mid" />
          <span className="bloom" />
        </div>
        <div className="plant" style={{ left: '62%' }}>
          <div className="stem" />
          <span className="leaf l" />
          <span className="leaf r" />
          <span className="leaf mid" />
        </div>
        <div className="plant short" style={{ left: '78%' }}>
          <div className="stem" />
          <span className="leaf l" />
          <span className="leaf r" />
        </div>
        <div className="soil" />
      </div>
    </motion.div>
  )
}

const deckSlides: SlideDef[] = [
  {
    id: 'hero',
    label: 'Home',
    decor: 'hero',
    className: 'hero-slide',
    content: (
      <div className="hero-grid">
        <motion.div className="hero-copy" {...fade}>
          <p className="eyebrow">Gamified learning</p>
          <h1>StudyGarden</h1>
          <p className="hero-tagline">Grow your knowledge, one seed at a time.</p>
          <p className="hero-support">
            Studying becomes a garden. Small seeds keep students in flow, plants show real
            progress, and friends grow a plot together.
          </p>
        </motion.div>
        <HeroBed />
      </div>
    ),
  },
  {
    id: 'problem',
    label: 'Problem',
    decor: 'soft',
    className: 'soft',
    content: (
      <>
        <Kicker n="1" label="Problem" />
        <motion.h2 {...fade}>Students leave the flow channel</motion.h2>
        <motion.p className="lede" {...fade}>
          Studying either overwhelms them (“prepare for the statistics exam”) or bores them
          with the same repetition. Both push them out of flow, so they procrastinate.
        </motion.p>
        <motion.div className="panel flow-wrap" {...fade}>
          <div className="flow-chart" role="img" aria-label="Flow channel: challenge versus skill">
            <svg viewBox="0 0 440 300">
              <defs>
                <linearGradient id="flowGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34c759" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#34c759" stopOpacity="0.42" />
                </linearGradient>
              </defs>
              <rect x="48" y="16" width="360" height="236" rx="18" fill="#f6e2c4" stroke="rgba(139,107,69,0.35)" />
              <line x1="70" y1="236" x2="390" y2="236" stroke="#c4b5a0" strokeWidth="1.5" />
              <line x1="70" y1="236" x2="70" y2="36" stroke="#c4b5a0" strokeWidth="1.5" />
              <text x="230" y="268" textAnchor="middle" fill="#3a3128" fontSize="13">
                Skill →
              </text>
              <text x="26" y="146" textAnchor="middle" fill="#3a3128" fontSize="13" transform="rotate(-90 26 146)">
                Challenge →
              </text>
              <path d="M70 36 L70 140 L190 36 Z" fill="rgba(255,149,0,0.16)" />
              <path d="M250 236 L390 236 L390 120 Z" fill="rgba(175,82,222,0.12)" />
              <path
                d="M70 236 C 140 190, 220 140, 300 88 C 340 62, 370 48, 390 40 L390 100 C 340 128, 260 180, 180 214 C 130 232, 90 234, 70 236 Z"
                fill="url(#flowGrad)"
              />
              <path
                d="M108 222 C 114 220, 130 213, 141 208 C 152 203, 163 198, 174 192 C 185 187, 196 181, 207 175 C 218 169, 229 162, 240 156 C 251 150, 262 144, 273 137 C 284 131, 295 124, 306 117 C 317 110, 328 103, 339 97 C 350 91, 367 82, 372 79"
                fill="none"
                stroke="#34c759"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text x="100" y="72" fill="#c75b00" fontSize="12" fontWeight="700">
                ANXIETY
              </text>
              <text x="292" y="210" fill="#8944ab" fontSize="12" fontWeight="700">
                BOREDOM
              </text>
              <text x="178" y="156" fill="#248a3d" fontSize="13" fontWeight="700">
                FLOW
              </text>
              <circle r="7" fill="#1d1d1f" stroke="#fff" strokeWidth="2">
                <animateMotion
                  dur="4.8s"
                  repeatCount="indefinite"
                  path="M108 222 C 114 220, 130 213, 141 208 C 152 203, 163 198, 174 192 C 185 187, 196 181, 207 175 C 218 169, 229 162, 240 156 C 251 150, 262 144, 273 137 C 284 131, 295 124, 306 117 C 317 110, 328 103, 339 97 C 350 91, 367 82, 372 79"
                />
              </circle>
            </svg>
          </div>
          <div className="flow-copy">
            <p>
              <WhoDot who="lukas" /> Challenge &gt; skill → anxiety. The exam feels huge, so they
              never start.
            </p>
            <p>
              <WhoDot who="sophie" /> Challenge &lt; skill → boredom. The same notes, so they quit
              after a few days.
            </p>
            <p>
              <i className="dot g" /> Challenge ≈ skill → flow. That is where StudyGarden holds them.
            </p>
          </div>
        </motion.div>
        <SourceNote>Csikszentmihalyi (1990), Flow</SourceNote>
      </>
    ),
  },
  {
    id: 'goal',
    label: 'Goal',
    decor: 'soft',
    className: 'alt',
    content: (
      <>
        <Kicker n="2" label="Goal · target audience" />
        <motion.h2 {...fade}>Keep students in the flow channel</motion.h2>
        <motion.p className="lede" {...fade}>
          Break overwhelming tasks into small, doable steps. Keep studying varied and fun, so
          students start earlier and keep going.
        </motion.p>
        <motion.div className="grid-2" {...fade}>
          <ul className="checklist">
            <li>
              <span className="check">
                <CheckIcon />
              </span>
              <span className="check-line">
                Seeds small enough to finish today
                <span className="check-sep" aria-hidden="true" />
                <span className="check-why">against overwhelm</span>
              </span>
            </li>
            <li>
              <span className="check">
                <CheckIcon />
              </span>
              <span className="check-line">
                New species and methods
                <span className="check-sep" aria-hidden="true" />
                <span className="check-why">against boredom</span>
              </span>
            </li>
            <li>
              <span className="check">
                <CheckIcon />
              </span>
              Early starts and steady care, instead of last-minute cramming.
            </li>
          </ul>
          <article className="panel audience">
            <h3>Who it is for</h3>
            <p>
              Bachelor and master’s students who regularly study for exams and assignments, and
              who already live on their phone.
            </p>
            <div className="legend">
              <span>
                <i className="dot o" /> Lukas · overwhelm
              </span>
              <span>
                <i className="dot p" /> Sophie · boredom
              </span>
            </div>
          </article>
        </motion.div>
        <SourceNote>Csikszentmihalyi (1990), Flow</SourceNote>
      </>
    ),
  },
  {
    id: 'personas',
    label: 'Personas',
    decor: 'soft',
    className: 'alt compact personas-slide',
    content: (
      <>
        <Kicker n="3" label="Personas" />
        <motion.h2 {...fade}>Two ways of leaving the garden</motion.h2>
        <div className="persona-pair">
          <motion.article className="panel persona-card" {...fade}>
            <div className="who-head">
              <img className="avatar lukas" src={lukasPortrait} alt="" />
              <div>
                <h3>Lukas Becker</h3>
                <p className="role">
                  <WhoDot who="lukas" /> The Procrastinator · Achiever
                </p>
              </div>
            </div>
            <ul className="facts">
              <li>22 · Business Administration, 5th semester, Stuttgart</li>
              <li>Shared flat · 12 h/week side job · lives in stats and streaks</li>
            </ul>
            <Bars
              tone="orange"
              rows={[
                { label: 'Achiever', value: 87 },
                { label: 'Explorer', value: 73 },
                { label: 'Socializer', value: 40 },
                { label: 'Killer', value: 0 },
              ]}
            />
            <p className="limbic orange">
              <span>Limbic type</span> Dominance
            </p>
            <div className="persona-story">
              <p>
                400 statistics slides, then YouTube. Two weeks before the exam he panics. He does
                not know where to begin, and the guilt makes starting harder.
              </p>
              <p>
                <strong>Needs</strong> small seeds, visible growth, one clear next step.
                <strong> Fears</strong> repeating the semester.
              </p>
              <p className="thread">Overwhelm → mastery → “I actually started.”</p>
            </div>
          </motion.article>
          <motion.article className="panel persona-card" {...fade}>
            <div className="who-head">
              <img className="avatar sophie" src={sophiePortrait} alt="" />
              <div>
                <h3>Sophie Wagner</h3>
                <p className="role">
                  <WhoDot who="sophie" /> The Bored One · Socializer / Explorer
                </p>
              </div>
            </div>
            <ul className="facts">
              <li>24 · Psychology, 1st master’s semester, Karlsruhe</li>
              <li>Lives alone · bouldering, board games, Notion, WhatsApp</li>
            </ul>
            <Bars
              tone="lilac"
              rows={[
                { label: 'Achiever', value: 33 },
                { label: 'Explorer', value: 53 },
                { label: 'Socializer', value: 100 },
                { label: 'Killer', value: 13 },
              ]}
            />
            <p className="limbic lilac">
              <span>Limbic type</span> Harmony
            </p>
            <div className="persona-story">
              <p>
                Every semester starts with a colourful plan. A few days of the same notes and she
                drifts to Instagram. Her old study group moved away.
              </p>
              <p>
                <strong>Needs</strong> new species, seasons, a community garden.
                <strong> Fears</strong> studying alone and losing the subject.
              </p>
              <p className="thread lilac">Boredom → curiosity → “I helped someone grow.”</p>
            </div>
          </motion.article>
        </div>
        <SourceNote>Bartle, player types; Häusel, Limbic Map</SourceNote>
      </>
    ),
  },
  {
    id: 'concept',
    label: 'Concept',
    decor: 'dense',
    className: 'soft compact',
    content: (
      <>
        <Kicker n="4" label="Concept" />
        <motion.h2 {...fade}>Every module is a garden bed</motion.h2>
        <motion.p className="lede" {...fade}>
          Every topic is a plant, every study session is care. Big tasks split into seeds:
          10–15 minute micro-tasks. Plants grow as you learn, and different methods grow different
          species, so the garden never looks the same.
        </motion.p>
        <motion.div className="pipeline" {...fade}>
          <span className="pipe-seed" aria-hidden="true" />
          <div className="pipe-step">
            <h3>Seeds</h3>
            <p>10–15 min micro-tasks from a huge exam.</p>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
          <div className="pipe-step">
            <h3>Care</h3>
            <p>One short session waters the bed.</p>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
          <div className="pipe-step">
            <h3>Grow</h3>
            <p>Visible growth mirrors mastery.</p>
          </div>
        </motion.div>
        <motion.div className="map-grid" {...fade}>
          <span>
            <strong>Bed</strong> module
          </span>
          <span>
            <strong>Plant</strong> topic
          </span>
          <span>
            <strong>Seed</strong> 10–15 min
          </span>
          <span>
            <strong>Water</strong> one session
          </span>
          <span>
            <strong>Moss</strong> flashcards
          </span>
          <span>
            <strong>Fern</strong> summary
          </span>
          <span>
            <strong>Flower</strong> quiz
          </span>
          <span>
            <strong>Rare</strong> linked topics
          </span>
          <span>
            <strong>Cutting</strong> help a beginner
          </span>
          <span>
            <strong>Shared bed</strong> study group
          </span>
        </motion.div>
        <p className="footnote">
          Unlike Forest, which only rewards putting the phone away, StudyGarden structures the
          studying itself: seeds against overwhelm, variety against boredom.
        </p>
        <SourceNote>Csikszentmihalyi (1990), Flow</SourceNote>
      </>
    ),
  },
  {
    id: 'motivators',
    label: 'Motivators',
    decor: 'soft',
    className: 'alt compact',
    content: (
      <>
        <Kicker n="5" label="Motivators" />
        <motion.h2 {...fade}>Same motives, different way in</motion.h2>
        <motion.p className="lede" {...fade}>
          Lukas and Sophie get stuck in different places, so StudyGarden opens a different door for each.
        </motion.p>
        <motion.div className="motive-matrix panel" {...fade}>
          <span className="mm-corner">Intrinsic</span>
          <span className="mm-head orange">
            <WhoDot who="lukas" /> Lukas <Sep /> overwhelm
          </span>
          <span className="mm-head lilac">
            <WhoDot who="sophie" /> Sophie <Sep /> boredom
          </span>
          {(
            [
              ['Mastery', 'getting better', 'Small seeds make progress visible every day', 'Harder species keep the challenge up'],
              ['Autonomy', 'choosing yourself', 'He picks the next seed, not the whole exam', 'She picks methods and species'],
              ['Curiosity', 'finding something new', 'One new species at a time, no pressure', 'Rare plants and seasons keep it fresh'],
              ['Purpose', 'it matters', 'Exam harvest: every seed counts toward passing', 'Gifting cuttings: helping others grow'],
            ] as const
          ).map(([motive, meaning, lukas, sophie]) => (
            <Fragment key={motive}>
              <div className="mm-motive">
                <strong>{motive}</strong>
                <span>{meaning}</span>
              </div>
              <p className="mm-cell orange">{lukas}</p>
              <p className="mm-cell lilac">{sophie}</p>
            </Fragment>
          ))}
        </motion.div>
        <motion.p className="mm-extrinsic" {...fade}>
          <strong>Extrinsic</strong> Rare plants and decorations <Sep /> Recognition in the
          community garden <Sep /> Gardener rank: Seed → Gardener → Botanist
        </motion.p>
        <SourceNote>Ryan &amp; Deci (2000); Pink (2009), Drive</SourceNote>
      </>
    ),
  },
  {
    id: 'fun',
    label: 'Fun',
    decor: 'dense',
    className: 'soft',
    content: (
      <>
        <Kicker n="6" label="Fun" />
        <motion.h2 {...fade}>A garden that grew because of you</motion.h2>
        <motion.p className="lede" {...fade}>
          Fun in StudyGarden is looking at your garden after a week and seeing that it grew
          because of you.
        </motion.p>
        <motion.div className="grid-3" {...fade}>
          <article className="fun-card">
            <GardenPot kind="grow" />
            <h3>
              <WhoDot who="lukas" /> Growing
            </h3>
            <p>Watch your own garden come alive after each session.</p>
          </article>
          <article className="fun-card">
            <GardenPot kind="discover" />
            <h3>
              <WhoDot who="sophie" /> Discovering
            </h3>
            <p>Rare plants and seasonal surprises keep the plot new.</p>
          </article>
          <article className="fun-card">
            <GardenPot kind="together" />
            <h3>
              <WhoDot who="sophie" /> Together
            </h3>
            <p>A shared garden with friends, not a scoreboard.</p>
          </article>
        </motion.div>
        <SourceNote>Ryan &amp; Deci (2000); Pink (2009), Drive</SourceNote>
      </>
    ),
  },
  {
    id: 'journey',
    label: 'Journey',
    decor: 'soft',
    className: 'alt compact',
    content: (
      <>
        <Kicker n="7" label="Player journey" />
        <motion.h2 {...fade}>Onboarding, habit, then elder</motion.h2>
        <motion.p className="lede" {...fade}>
          Difficulty grows with the student so they stay in flow. A break does not kill the garden.
        </motion.p>
        <motion.div className="journey" {...fade}>
          <article className="stage">
            <span className="stage-badge orange">Seed · balcony box</span>
            <h3>Onboarding</h3>
            <ul>
              <li>Plant the first module in a short tutorial</li>
              <li>AI splits the first big task into seeds</li>
              <li>One 10-minute seed → first sprout</li>
              <li>Choose a first species</li>
            </ul>
            <p className="aim">
              <WhoDot who="lukas" /> Success in the first 5 minutes
            </p>
          </article>
          <article className="stage">
            <span className="stage-badge lilac">Gardener · own garden</span>
            <h3>Habit building</h3>
            <ul>
              <li>Weekly rhythm, not daily pressure</li>
              <li>New species by trying new methods</li>
              <li>Bigger plants need longer seeds</li>
              <li>Join or create a community garden</li>
            </ul>
            <p className="aim">
              <WhoDot who="sophie" /> Routine plus variety
            </p>
          </article>
          <article className="stage">
            <span className="stage-badge">Botanist · botanical garden</span>
            <h3>Elder</h3>
            <ul>
              <li>Rare plants by linking topics</li>
              <li>Gift cuttings: tips, summaries, mentoring</li>
              <li>Lead a garden before an exam</li>
              <li>Seasonal events in exam phases</li>
            </ul>
            <p className="aim">Mastery and purpose, long term</p>
          </article>
        </motion.div>
        <p className="footnote">
          After a break the garden is resting, not dying. One seed wakes it. A new semester is a
          new season: new beds, new species.
        </p>
        <SourceNote>Csikszentmihalyi (1990), Flow</SourceNote>
      </>
    ),
  },
  {
    id: 'loop',
    label: 'Loop',
    decor: 'dense',
    className: 'soft compact',
    content: (
      <>
        <Kicker n="8" label="Engagement loop" />
        <motion.h2 {...fade}>The same circle, twice</motion.h2>
        <motion.p className="lede" {...fade}>
          Call to action, a small action, visible progress, a good feeling, then the next reason
          to come back.
        </motion.p>
        <motion.div className="loop-cols" {...fade}>
          <article className="panel loop-card orange">
            <h3>Seed · beginner</h3>
            <ol>
              <li>
                <strong>Call</strong> Plant your first module and get your first seed
              </li>
              <li>
                <strong>Action</strong> Finish one 10-minute seed
              </li>
              <li>
                <strong>Progress</strong> Your first sprout appears
              </li>
              <li>
                <strong>Feeling</strong> Pride <Sep /> “I actually started!”
              </li>
            </ol>
          </article>
          <article className="panel loop-card lilac">
            <h3>Botanist · expert</h3>
            <ol>
              <li>
                <strong>Call</strong> The study group’s garden needs care before the exam
              </li>
              <li>
                <strong>Action</strong> Grow a rare plant or gift a cutting
              </li>
              <li>
                <strong>Progress</strong> Rare species and Botanist rank
              </li>
              <li>
                <strong>Feeling</strong> Purpose <Sep /> “I helped someone grow.”
              </li>
            </ol>
          </article>
        </motion.div>
        <SourceNote>Ryan &amp; Deci (2000); Pink (2009), Drive</SourceNote>
      </>
    ),
  },
  {
    id: 'mechanics',
    label: 'Mechanics',
    decor: 'soft',
    className: 'alt compact',
    content: (
      <>
        <Kicker n="9" label="Mechanics → dynamics → activities" />
        <motion.h2 {...fade}>Each mechanic answers one problem</motion.h2>
        <motion.div className="mech-grid" {...fade}>
          {(
            [
              ['Seeds', 'Small wins, no overwhelm', 'Split a task, finish one 10-min seed', 'lukas', ['Mastery'], 'grow'],
              ['Growth stages / Pick your next seed', 'Visible progress, own choice', 'Watch it bloom, choose what comes next', 'lukas', ['Mastery', 'Autonomy'], 'discover'],
              ['Adaptive difficulty', 'Challenge grows with skill', 'Bigger plants need longer seeds', 'both', ['Mastery'], 'grow'],
              ['Species per method', 'Curiosity and variety', 'Flashcards, quizzes, summaries', 'sophie', ['Autonomy'], 'discover'],
              ['Rare plants', 'Discovery', 'Connect topics or finish a study week', 'sophie', ['Curiosity'], 'discover'],
              ['Seasonal events', 'Novelty over time', 'Exam season, new-semester season', 'sophie', ['Curiosity'], 'together'],
              ['Community garden', 'Social commitment', 'Grow a shared bed with the group', 'sophie', ['Relatedness'], 'together'],
              ['Gifting cuttings', 'Purpose, recognition', 'Share summaries, mentor beginners', 'sophie', ['Purpose'], 'together'],
              ['Gardener rank / Exam harvest', 'A long-term goal that counts', 'Seed → Botanist, the exam bed fills up', 'lukas', ['Mastery', 'Purpose'], 'grow'],
            ] as const
          ).map(([title, dynamic, activity, who, motives, plant]) => (
            <article key={title} className={`mech-card ${who === 'lukas' ? 'orange' : who === 'sophie' ? 'lilac' : 'both'}`}>
              <span className="mech-icon">
                <GardenPot kind={plant} />
              </span>
              <div className="mech-copy">
                <h3>{title}</h3>
                <p className="dynamic">{dynamic}</p>
                <p className="activity">{activity}</p>
                <p className="mech-for">
                  <WhoDot who={who} />{' '}
                  {motives.map((motive, i) => (
                    <Fragment key={motive}>
                      {i > 0 && <Sep />}
                      {motive}
                    </Fragment>
                  ))}
                </p>
              </div>
            </article>
          ))}
        </motion.div>
        <SourceNote>Ryan &amp; Deci (2000); Pink (2009), Drive</SourceNote>
      </>
    ),
  },
  {
    id: 'tech',
    label: 'Tech',
    decor: 'soft',
    className: 'soft compact',
    content: (
      <>
        <Kicker n="10" label="Technologies" />
        <motion.h2 {...fade}>Each tool holds up a mechanic</motion.h2>
        <motion.ul className="checklist tech-list" {...fade}>
          <li>
            <span className="check">
              <CheckIcon />
            </span>
            <span>
              <strong>Phone app + home-screen widget → engagement loop.</strong> The garden is one
              tap away.
            </span>
          </li>
          <li>
            <span className="check">
              <CheckIcon />
            </span>
            <span>
              <strong>AI Seed Assistant → seeds.</strong> Turns “prepare the statistics exam” into
              10-minute seeds from the slides and the exam date.
            </span>
          </li>
          <li>
            <span className="check">
              <CheckIcon />
            </span>
            <span>
              <strong>Adaptive difficulty → plant size.</strong> It watches how fast seeds finish
              and keeps challenge near skill.
            </span>
          </li>
          <li>
            <span className="check">
              <CheckIcon />
            </span>
            <span>
              <strong>LMS and calendar → beds.</strong> Moodle or ILIAS, plus Google or Outlook, so
              modules and exam dates appear on their own.
            </span>
          </li>
        </motion.ul>
        <SourceNote>Csikszentmihalyi (1990), Flow</SourceNote>
      </>
    ),
  },
  {
    id: 'ethics',
    label: 'Ethics',
    decor: 'dense',
    className: 'alt compact',
    content: (
      <>
        <Kicker n="11" label="Ethics" />
        <motion.h2 {...fade}>Care without punishment</motion.h2>
        <motion.div className="ethics-grid" {...fade}>
          <article className="panel">
            <h3>Wellbeing</h3>
            <p>
              Streaks and lost progress create guilt. Plants never die. They rest. Illness and
              exam weeks are not punished. One seed wakes the garden.
            </p>
          </article>
          <article className="panel">
            <h3>Fairness</h3>
            <p>
              Study-time leaderboards reward free time, not side jobs or care duties. Progress is
              compared only with your past self. Community gardens collaborate.
            </p>
          </article>
          <article className="panel">
            <h3>Academic integrity</h3>
            <p>
              The AI Seed Assistant structures and explains. It never writes graded work. It plans
              seeds and asks questions instead of giving answers.
            </p>
          </article>
          <article className="panel">
            <h3>Privacy</h3>
            <p>
              Learning data stays with the student. It is never shared with lecturers or the
              university, it is GDPR-compliant, and it can be deleted.
            </p>
          </article>
          <article className="panel ethics-wide">
            <h3>Healthy use</h3>
            <p>
              No endless notifications. Students choose reminder times, and the app suggests a
              break after a long session.
            </p>
          </article>
        </motion.div>
        <SourceNote>Key challenges and barriers in gamification</SourceNote>
      </>
    ),
  },
  {
    id: 'app',
    label: 'App',
    decor: 'soft',
    className: 'soft compact',
    content: <AppPhones />,
  },
  {
    id: 'end',
    label: 'Thank you',
    decor: 'hero',
    className: 'hero-slide end-slide',
    content: (
      <div className="hero-grid">
        <div className="end-drift" aria-hidden="true">
          {(
            [
              [6, 0, 11, 'leaf'], [15, 4.2, 13, 'seed'], [24, 1.6, 10, 'leaf'], [33, 6.8, 12, 'petal'],
              [44, 2.9, 14, 'seed'], [55, 0.8, 11, 'leaf'], [63, 5.4, 13, 'petal'], [72, 3.3, 10, 'leaf'],
              [81, 7.6, 12, 'seed'], [90, 1.9, 14, 'leaf'], [96, 5.9, 11, 'petal'], [38, 8.8, 13, 'leaf'],
            ] as const
          ).map(([left, delay, duration, kind], i) => (
            <span
              key={i}
              className={kind}
              style={{ left: `${left}%`, animationDelay: `-${delay}s`, animationDuration: `${duration}s` }}
            />
          ))}
        </div>
        <motion.div className="hero-copy" {...fade}>
          <p className="eyebrow">StudyGarden</p>
          <h1>Thank You</h1>
          <p className="end-questions">Questions?</p>
        </motion.div>
        <HeroBed />
      </div>
    ),
  },
]

export const slides: SlideDef[] = [
  ...deckSlides,
  {
    id: 'overview',
    label: 'Overview',
    decor: 'poster',
    className: 'poster-slide',
    content: <SlideOverview items={deckSlides} />,
  },
]

export function SlideShell({
  slide,
  children,
}: {
  slide: SlideDef
  children: ReactNode
}) {
  return (
    <section
      className={`slide ${slide.className ?? ''}`}
      id={slide.id}
      data-section={slide.id}
      data-label={slide.label}
    >
      <div className="slide-inner">{children}</div>
    </section>
  )
}
