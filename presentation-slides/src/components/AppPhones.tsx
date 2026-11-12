import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import sophiePortrait from '../assets/personas/sophie.jpg'

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.4 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
}

function MiniPlant({ stage }: { stage: number }) {
  return (
    <span className="mini-plant" data-stage={stage} aria-hidden="true">
      <span className="flower" />
      <span className="leaf l" />
      <span className="leaf r" />
      <span className="stem" />
      <span className="seed" />
      <span className="pot" />
    </span>
  )
}

function Phone({
  tone,
  caption,
  children,
}: {
  tone: 'orange' | 'green' | 'lilac'
  caption: string
  children: ReactNode
}) {
  return (
    <figure className={`handset ${tone}`}>
      <div className="handset-frame">
        <div className="handset-screen">
          <div className="handset-status">
            <span>9:41</span>
            <span className="handset-sig" aria-hidden="true" />
          </div>
          {children}
          <span className="handset-home" aria-hidden="true" />
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function GardenPhone() {
  const beds = [
    { name: 'Mean', hint: 'Sprout' },
    { name: 'Variance', hint: 'Seed' },
    { name: 'Regression', hint: 'Resting' },
  ]
  const [stages, setStages] = useState([2, 1, 0])
  const rank = stages.every((stage) => stage >= 2) ? 'Gardener' : 'Seed'
  const nextIndex = stages.reduce((best, stage, i) => (stage < stages[best] ? i : best), 0)
  const allBloom = stages.every((stage) => stage >= 3)

  const water = (index: number) => {
    setStages((current) =>
      current.map((stage, i) => (i === index ? Math.min(3, stage + 1) : stage)),
    )
  }

  return (
    <Phone tone="orange" caption="Lukas · the garden">
      <div className="app-head">
        <span className="app-kicker">Statistics · 18 days left</span>
        <strong className="app-title">Your bed</strong>
        <span className="app-rank">Rank · {rank}</span>
      </div>
      <button type="button" className="app-card" onClick={() => water(nextIndex)} disabled={allBloom}>
        <span>{allBloom ? 'This week' : 'Next seed'}</span>
        <strong>{allBloom ? 'The bed is in bloom' : `${beds[nextIndex].name} · 10 min`}</strong>
      </button>
      <div className="app-bed">
        {beds.map((bed, index) => {
          const stage = stages[index]
          const label = stage === 0 ? 'Resting' : stage === 1 ? 'Seed' : stage === 2 ? 'Sprout' : 'Bloom'
          return (
            <button
              key={bed.name}
              type="button"
              className="plot"
              data-stage={stage}
              onClick={() => water(index)}
              aria-label={`${bed.hint === 'Resting' && stage === 0 ? 'Wake' : 'Water'} ${bed.name}, now ${label}`}
            >
              <MiniPlant stage={stage} />
              <span className="plot-name">{bed.name}</span>
              <span className="plot-stage">{label}</span>
            </button>
          )
        })}
      </div>
      <p className="app-note">
        {stages[2] === 0
          ? 'Regression is resting. One tap wakes it.'
          : stages.every((stage) => stage >= 3)
            ? 'The bed is in bloom. Nothing to punish, nothing to lose.'
            : 'Tap a plant to water it.'}
      </p>
    </Phone>
  )
}

function SeedPhone() {
  const steps = [
    { id: 'read', label: 'Read the definition' },
    { id: 'say', label: 'Explain it aloud' },
    { id: 'try', label: 'Answer one question' },
  ] as const
  const [done, setDone] = useState<string[]>([])
  const [refused, setRefused] = useState(false)
  const stage = done.length

  const toggle = (id: string) => {
    setRefused(false)
    setDone((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <Phone tone="green" caption="Today’s seed">
      <div className="app-head">
        <span className="app-kicker">10 minutes · AI Seed Assistant</span>
        <strong className="app-title">Variance</strong>
        <span className="app-rank">{stage === 3 ? 'Planted' : `${stage} of 3`}</span>
      </div>
      <div className="seed-hero">
        <MiniPlant stage={stage} />
      </div>
      <div className="seed-steps">
        {steps.map((step) => {
          const on = done.includes(step.id)
          return (
            <button
              key={step.id}
              type="button"
              className={on ? 'on' : ''}
              aria-pressed={on}
              onClick={() => toggle(step.id)}
            >
              <span className="tick" aria-hidden="true" />
              {step.label}
            </button>
          )
        })}
      </div>
      <button type="button" className="seed-trap" onClick={() => setRefused(true)}>
        Ask it for the formula
      </button>
      <p className="app-note">
        {refused
          ? 'It asks a question. It never writes the answer.'
          : stage === 3
            ? 'Seed finished. The plant grew one stage.'
            : 'Check a step. The plant grows with you.'}
      </p>
    </Phone>
  )
}

function CommunityPhone() {
  const people = [
    { id: 'sophie', name: 'You', plants: [3, 2], note: 'Your plot. Two species this week.' },
    { id: 'mira', name: 'Mira', plants: [2], note: 'Exam season. You share this bed.' },
    { id: 'jonas', name: 'Jonas', plants: [0], note: 'Resting this week. The garden waits.' },
  ] as const
  const [who, setWho] = useState<(typeof people)[number]['id']>('sophie')
  const [gifted, setGifted] = useState(false)
  const person = people.find((item) => item.id === who) ?? people[0]
  const plants = who === 'mira' && gifted ? [...person.plants, 1] : [...person.plants]

  return (
    <Phone tone="lilac" caption="Sophie · together">
      <div className="app-head">
        <span className="app-kicker">Community garden</span>
        <strong className="app-title">Exam season</strong>
        <span className="app-rank">No rankings. Shared beds.</span>
      </div>
      <div className="friend-row">
        {people.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === who ? 'on' : ''}
            aria-pressed={item.id === who}
            onClick={() => setWho(item.id)}
          >
            {item.id === 'sophie' ? (
              <img src={sophiePortrait} alt="" />
            ) : (
              <span>{item.name.slice(0, 1)}</span>
            )}
            {item.name}
          </button>
        ))}
      </div>
      <div className="app-bed slim">
        {plants.map((stage, index) => (
          <div key={`${who}-${index}`} className="plot static" data-stage={stage}>
            <MiniPlant stage={stage} />
            <span className="plot-stage">
              {who === 'mira' && gifted && index === plants.length - 1
                ? 'Cutting'
                : stage === 0
                  ? 'Resting'
                  : stage === 2
                    ? 'Sprout'
                    : 'Bloom'}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="gift"
        disabled={gifted}
        onClick={() => {
          setGifted(true)
          setWho('mira')
        }}
      >
        {gifted ? 'Cutting is with Mira' : 'Gift a cutting'}
      </button>
      <p className="app-note">{person.note}</p>
    </Phone>
  )
}

export function AppPhones() {
  return (
    <>
      <div className="section-kicker wide">
        <span className="num">12</span>
        App
      </div>
      <motion.h2 {...fade}>The garden, in your hand</motion.h2>
      <div className="phone-row">
        <GardenPhone />
        <SeedPhone />
        <CommunityPhone />
      </div>
    </>
  )
}
