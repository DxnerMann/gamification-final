import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import lukasPortrait from '../assets/personas/lukas.jpg'
import sophiePortrait from '../assets/personas/sophie.jpg'

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.4 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
}

type Kind = 'moss' | 'fern' | 'flower'
type Page = 'plan' | 'grow' | 'garden' | 'together'

const seeds = [
  { id: 'variance', topic: 'Variance', method: 'Flashcards', kind: 'moss', minutes: 10, hint: 'How far do the values spread around the mean?' },
  { id: 'median', topic: 'Mean vs. median', method: 'Summary', kind: 'fern', minutes: 10, hint: 'What happens to each one if you add one huge value?' },
  { id: 'regression', topic: 'Regression', method: 'Quiz', kind: 'flower', minutes: 15, hint: 'What does the slope tell you when x grows by one?' },
  { id: 'probability', topic: 'Probability', method: 'Flashcards', kind: 'moss', minutes: 10, hint: 'How many outcomes are there, and how many count?' },
] as const satisfies readonly { id: string; topic: string; method: string; kind: Kind; minutes: number; hint: string }[]

type SeedId = (typeof seeds)[number]['id']

const species: Record<Kind, string> = { moss: 'moss', fern: 'a fern', flower: 'a flower' }
const stageName = ['Resting', 'Seed', 'Sprout', 'Bloom']
const harvestGoal = 30
const demoMs = 6000

const guide: Record<
  Page,
  {
    step: string
    title: string
    text: string
    mechanics: string[]
    motives: string[]
    who: 'lukas' | 'sophie'
    tryIt: string
  }
> = {
  plan: {
    step: 'Plan',
    title: 'A huge exam becomes small seeds',
    text: 'The exam date comes in from Moodle. The AI Seed Assistant splits “prepare for the statistics exam” into 10-minute seeds. Lukas does not get a plan pushed on him. He picks the seed he wants next.',
    mechanics: ['AI Seed Assistant', 'Seeds', 'Pick your next seed', 'LMS and calendar'],
    motives: ['Mastery', 'Autonomy'],
    who: 'lukas',
    tryIt: 'Tap “Split into seeds”, then pick one.',
  },
  grow: {
    step: 'Grow',
    title: 'One short seed, one plant grows',
    text: 'A short timer, one method, one species. The assistant explains with questions and never writes the answer. When seeds finish fast, the next ones grow bigger plants.',
    mechanics: ['Seeds', 'Species per method', 'Adaptive difficulty'],
    motives: ['Mastery', 'Curiosity'],
    who: 'lukas',
    tryIt: 'Start the timer, or ask the assistant something.',
  },
  garden: {
    step: 'Garden',
    title: 'Progress you can see',
    text: 'Every topic is a plant, every method its own species. The exam harvest fills up toward the exam date. A plant that was skipped is resting, not dead.',
    mechanics: ['Growth stages', 'Exam harvest', 'Gardener rank'],
    motives: ['Mastery', 'Purpose'],
    who: 'lukas',
    tryIt: 'Wake the resting plant, or tap a plant to start its seed.',
  },
  together: {
    step: 'Together',
    title: 'A shared bed, not a scoreboard',
    text: 'Sophie’s study group grows one bed before the exam. Exam season brings a rare plant. A cutting shares a summary with a beginner. Nobody is ranked.',
    mechanics: ['Community garden', 'Gifting cuttings', 'Seasonal events', 'Rare plants'],
    motives: ['Relatedness', 'Purpose', 'Curiosity'],
    who: 'sophie',
    tryIt: 'Switch between gardeners and gift a cutting.',
  },
}

const pages: Page[] = ['plan', 'grow', 'garden', 'together']

function MiniPlant({ stage, kind, fixed }: { stage: number; kind: Kind; fixed?: boolean }) {
  return (
    <span
      className={`mini-plant${fixed ? ' fixed' : ''}`}
      data-stage={stage}
      data-kind={kind}
      aria-hidden="true"
    >
      <span className="flower" />
      <span className="leaf l" />
      <span className="leaf r" />
      <span className="stem" />
      <span className="seed" />
      <span className="pot" />
    </span>
  )
}

function TabIcon({ page }: { page: Page }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {page === 'plan' && (
        <>
          <ellipse cx="12" cy="14" rx="5" ry="6.5" />
          <path d="M12 7.5c0-2 1.2-3.6 3.2-4.4" />
        </>
      )}
      {page === 'grow' && (
        <>
          <circle cx="12" cy="13" r="7.5" />
          <path d="M12 13V9M10 3h4" />
        </>
      )}
      {page === 'garden' && (
        <>
          <path d="M12 21V10" />
          <path d="M12 13c-4 0-6-2.5-6-6 4 0 6 2.5 6 6zM12 11c0-3.5 2-6 6-6 0 3.5-2 6-6 6z" />
          <path d="M5 21h14" />
        </>
      )}
      {page === 'together' && (
        <>
          <circle cx="8.5" cy="9" r="3" />
          <circle cx="16" cy="10" r="2.6" />
          <path d="M3.5 19c.6-3.2 2.6-5 5-5s4.4 1.8 5 5M13.5 18.5c.5-2.4 1.6-3.7 3-3.7s2.6 1.3 3.2 3.7" />
        </>
      )}
    </svg>
  )
}

export function AppPhones() {
  const [page, setPage] = useState<Page>('plan')
  const [split, setSplit] = useState(false)
  const [seedId, setSeedId] = useState<SeedId>('variance')
  const [stages, setStages] = useState<Record<SeedId, number>>({
    variance: 1,
    median: 3,
    regression: 2,
    probability: 0,
  })
  const [harvest, setHarvest] = useState(12)
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [reply, setReply] = useState<'explain' | 'write' | null>(null)
  const [friend, setFriend] = useState<'you' | 'sophie' | 'mira'>('sophie')
  const [gifted, setGifted] = useState(false)
  const startRef = useRef(0)

  const seed = seeds.find((item) => item.id === seedId) ?? seeds[0]
  const rank = harvest >= 15 ? 'Gardener' : 'Seed'
  const info = guide[page]

  const finishSeed = () => {
    setRunning(false)
    setProgress(1)
    setFinished(true)
    setStages((current) => ({ ...current, [seedId]: Math.min(3, Math.max(1, current[seedId]) + 1) }))
    setHarvest((current) => Math.min(harvestGoal, current + 1))
  }

  useEffect(() => {
    if (!running) return
    startRef.current = performance.now() - progress * demoMs
    const id = window.setInterval(() => {
      const next = Math.min(1, (performance.now() - startRef.current) / demoMs)
      setProgress(next)
      if (next >= 1) {
        window.clearInterval(id)
        finishSeed()
      }
    }, 80)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const pickSeed = (id: SeedId) => {
    setSeedId(id)
    setProgress(0)
    setRunning(false)
    setFinished(false)
    setReply(null)
    setPage('grow')
  }

  const remaining = Math.ceil(seed.minutes * 60 * (1 - progress))
  const clock = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`

  const friends = {
    you: { name: 'You', img: lukasPortrait, plants: [{ kind: 'moss', stage: stages.variance }, { kind: 'fern', stage: stages.median }] },
    sophie: { name: 'Sophie', img: sophiePortrait, plants: [{ kind: 'flower', stage: 3 }, { kind: 'fern', stage: 2 }] },
    mira: { name: 'Mira', img: null, plants: [{ kind: 'moss', stage: 1 }] },
  } as const satisfies Record<string, { name: string; img: string | null; plants: readonly { kind: Kind; stage: number }[] }>
  const shown = friends[friend]
  const friendNote =
    friend === 'mira'
      ? gifted
        ? 'Your cutting arrived. Mira got your variance summary.'
        : 'Mira just started. She is still on her first seed.'
      : friend === 'sophie'
        ? 'Sophie’s study group shares this bed.'
        : 'Your plot in the shared bed.'

  let screen: ReactNode
  if (page === 'plan') {
    screen = (
      <>
        <div className="app-head">
          <span className="app-kicker">Seed Assistant</span>
          <strong className="app-title">Plan</strong>
        </div>
        <div className="exam-card">
          <div>
            <span>Statistics exam</span>
            <strong>2 Dec · 18 days left</strong>
          </div>
          <em>from Moodle</em>
        </div>
        <p className="task-bubble">“Prepare for the statistics exam”</p>
        {!split ? (
          <button type="button" className="app-primary" onClick={() => setSplit(true)}>
            Split into seeds
          </button>
        ) : (
          <div className="seed-list">
            <span className="list-label">Pick your next seed</span>
            {seeds.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={item.id === seedId ? 'on' : ''}
                style={{ animationDelay: `${index * 90}ms` }}
                onClick={() => pickSeed(item.id)}
              >
                <MiniPlant stage={2} kind={item.kind} fixed />
                <span className="seed-text">
                  <strong>{item.topic}</strong>
                  <span>
                    {item.method} · {item.minutes} min
                  </span>
                </span>
                <span className="chev" aria-hidden="true">
                  ›
                </span>
              </button>
            ))}
          </div>
        )}
      </>
    )
  } else if (page === 'grow') {
    screen = (
      <>
        <div className="app-head">
          <span className="app-kicker">Today’s seed · {seed.method}</span>
          <strong className="app-title">{seed.topic}</strong>
          <span className="app-sub">{seed.method} grows {species[seed.kind]}</span>
        </div>
        <div className="timer" style={{ ['--p' as string]: progress }}>
          <div className="timer-face">
            <MiniPlant stage={Math.max(1, stages[seedId])} kind={seed.kind} fixed />
            <strong>{finished ? 'Done' : clock}</strong>
          </div>
        </div>
        <button
          type="button"
          className="app-primary"
          onClick={() => {
            if (finished) setPage('garden')
            else if (running) finishSeed()
            else setRunning(true)
          }}
        >
          {finished ? 'See it in the garden' : running ? 'Finish now' : `Start ${seed.minutes} min`}
        </button>
        {finished ? (
          <p className="app-hint">You finished fast. Your next seeds grow bigger plants: {seed.minutes + 5} min.</p>
        ) : (
          <div className="assistant">
            <div className="chips">
              <button type="button" className={reply === 'explain' ? 'on' : ''} onClick={() => setReply('explain')}>
                Explain it
              </button>
              <button type="button" className={reply === 'write' ? 'on' : ''} onClick={() => setReply('write')}>
                Write it for me
              </button>
            </div>
            {reply && (
              <p className="bubble">
                {reply === 'explain'
                  ? `Try first: ${seed.hint.charAt(0).toLowerCase()}${seed.hint.slice(1)} Say it in one sentence.`
                  : 'I don’t write graded work. Let’s outline it: what are your three key ideas?'}
              </p>
            )}
          </div>
        )}
      </>
    )
  } else if (page === 'garden') {
    screen = (
      <>
        <div className="app-head">
          <span className="app-kicker">Statistics bed</span>
          <strong className="app-title">Garden</strong>
          <span className="app-sub">Rank · {rank}</span>
        </div>
        <div className="harvest">
          <div>
            <span>Exam harvest</span>
            <strong>
              {harvest} of {harvestGoal} seeds
            </strong>
          </div>
          <span className="harvest-bar">
            <i style={{ width: `${(harvest / harvestGoal) * 100}%` }} />
          </span>
        </div>
        <div className="app-bed four">
          {seeds.map((item) => {
            const stage = stages[item.id]
            return (
              <button
                key={item.id}
                type="button"
                className="plot"
                onClick={() =>
                  stage === 0
                    ? setStages((current) => ({ ...current, [item.id]: 1 }))
                    : pickSeed(item.id)
                }
              >
                <MiniPlant stage={stage} kind={item.kind} />
                <span className="plot-name">{item.topic.split(' ')[0]}</span>
                <span className="plot-stage">{stageName[stage]}</span>
              </button>
            )
          })}
        </div>
        <p className="app-note">
          {stages.probability === 0
            ? 'Probability is resting. One tap wakes it.'
            : 'Nothing dies here. Tap a plant to plant its next seed.'}
        </p>
      </>
    )
  } else {
    screen = (
      <>
        <div className="app-head">
          <span className="app-kicker">Community garden</span>
          <strong className="app-title">Together</strong>
          <span className="app-sub">No rankings. One shared bed.</span>
        </div>
        <div className="season">
          <MiniPlant stage={3} kind="flower" fixed />
          <div>
            <span>Exam season · until 15 Dec</span>
            <strong>Rare Moonflower</strong>
          </div>
        </div>
        <div className="friend-row">
          {(Object.keys(friends) as (keyof typeof friends)[]).map((id) => {
            const item = friends[id]
            return (
              <button
                key={id}
                type="button"
                className={id === friend ? 'on' : ''}
                aria-pressed={id === friend}
                onClick={() => setFriend(id)}
              >
                {item.img ? <img src={item.img} alt="" /> : <span>{item.name.slice(0, 1)}</span>}
                {item.name}
              </button>
            )
          })}
        </div>
        <div className="app-bed slim">
          {[...shown.plants, ...(friend === 'mira' && gifted ? [{ kind: 'fern' as Kind, stage: 1 }] : [])].map(
            (plant, index, list) => (
              <div key={`${friend}-${index}`} className="plot static">
                <MiniPlant stage={plant.stage} kind={plant.kind} />
                <span className="plot-stage">
                  {friend === 'mira' && gifted && index === list.length - 1 ? 'Cutting' : stageName[plant.stage]}
                </span>
              </div>
            ),
          )}
        </div>
        <button
          type="button"
          className="gift"
          disabled={gifted}
          onClick={() => {
            setGifted(true)
            setFriend('mira')
          }}
        >
          {gifted ? 'Cutting sent to Mira' : 'Gift Mira a cutting'}
        </button>
        <p className="app-note">{friendNote}</p>
      </>
    )
  }

  return (
    <>
      <div className="section-kicker wide">
        <span className="num">12</span>
        App
      </div>
      <motion.h2 {...fade}>The garden, in your hand</motion.h2>
      <div className="app-demo">
        <div className="demo-phone">
          <div className="handset-frame">
            <div className="handset-screen">
              <div className="handset-status">
                <span>9:41</span>
                <span className="handset-sig" aria-hidden="true" />
              </div>
              <div className="app-page" key={page}>
                {screen}
              </div>
              <nav className="tabbar" aria-label="App pages">
                {pages.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={item === page ? 'on' : ''}
                    aria-current={item === page ? 'page' : undefined}
                    onClick={() => setPage(item)}
                  >
                    <TabIcon page={item} />
                    {guide[item].step}
                  </button>
                ))}
              </nav>
              <span className="handset-home" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="app-guide">
          <ol className="guide-steps">
            {pages.map((item, index) => (
              <li key={item}>
                <button
                  type="button"
                  className={item === page ? 'on' : ''}
                  onClick={() => setPage(item)}
                >
                  <span className="n">{index + 1}</span>
                  {guide[item].step}
                </button>
              </li>
            ))}
          </ol>
          <AnimatePresence mode="wait">
            <motion.article
              key={page}
              className="panel guide-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className={`guide-for ${info.who === 'lukas' ? 'orange' : 'lilac'}`}>
                <i className={`dot ${info.who === 'lukas' ? 'o' : 'p'}`} aria-hidden="true" />
                {info.who === 'lukas' ? 'Lukas' : 'Sophie'}
                <span className="inline-sep" aria-hidden="true" />
                {info.who === 'lukas' ? 'against overwhelm' : 'against boredom'}
              </p>
              <h3>{info.title}</h3>
              <p className="guide-text">{info.text}</p>
              <dl className="guide-meta">
                <dt>Mechanics</dt>
                <dd>
                  {info.mechanics.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </dd>
                <dt>Motives</dt>
                <dd>
                  {info.motives.map((item) => (
                    <span key={item} className="tag motive">
                      {item}
                    </span>
                  ))}
                </dd>
              </dl>
              <p className="guide-try">
                <span>Try it</span>
                {info.tryIt}
              </p>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
