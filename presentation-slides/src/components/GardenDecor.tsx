import { useId } from 'react'
import { motion } from 'framer-motion'

type Props = {
  variant?: 'hero' | 'soft' | 'dense' | 'poster'
}

const petals = [
  { left: '7%', top: '16%', size: 14, color: '#ff9f7a', delay: 0, dur: 14 },
  { left: '16%', top: '74%', size: 11, color: '#e7b3ff', delay: 1.2, dur: 16 },
  { left: '80%', top: '18%', size: 13, color: '#ff6b8a', delay: 0.6, dur: 13 },
  { left: '90%', top: '68%', size: 12, color: '#ffb347', delay: 2, dur: 15 },
  { left: '46%', top: '10%', size: 10, color: '#ffd60a', delay: 1.5, dur: 17 },
  { left: '64%', top: '82%', size: 15, color: '#7dcea0', delay: 0.3, dur: 18 },
  { left: '28%', top: '40%', size: 9, color: '#ffcc66', delay: 2.4, dur: 12 },
  { left: '72%', top: '38%', size: 11, color: '#c9a0dc', delay: 0.9, dur: 14 },
]

function Flower({
  x,
  y,
  scale = 1,
  hue = 'warm',
  sway = 0,
}: {
  x: string
  y: string
  scale?: number
  hue?: 'warm' | 'rose' | 'gold' | 'lilac'
  sway?: number
}) {
  const petal =
    hue === 'rose' ? '#ff7a9a' : hue === 'gold' ? '#ffcc33' : hue === 'lilac' ? '#c77dff' : '#ff9500'
  const petalSoft =
    hue === 'rose' ? '#ffb3c6' : hue === 'gold' ? '#ffe08a' : hue === 'lilac' ? '#e7c6ff' : '#ffb347'

  return (
    <motion.g
      style={{ transformOrigin: `${x}px ${y}px` }}
      animate={{ rotate: [-3 - sway, 3 + sway, -3 - sway] }}
      transition={{ duration: 5 + sway, repeat: Infinity, ease: 'easeInOut' }}
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx={x}
          cy={y}
          rx={7 * scale}
          ry={12 * scale}
          fill={deg % 120 === 0 ? petal : petalSoft}
          opacity={0.9}
          transform={`rotate(${deg} ${x} ${y}) translate(0 ${-10 * scale})`}
        />
      ))}
      <circle cx={x} cy={y} r={5 * scale} fill="#fff6d6" />
      <circle cx={x} cy={y} r={2.4 * scale} fill={hue === 'lilac' ? '#f3e8ff' : '#ffd60a'} />
    </motion.g>
  )
}

function LeafSpray({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const dir = flip ? -1 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      <path d="M0 40 C 18 28, 34 10, 40 -8 C 22 2, 8 18, 0 40Z" fill="#5caf6e" opacity="0.55" />
      <path d="M6 44 C 28 40, 48 28, 58 8 C 40 18, 22 32, 6 44Z" fill="#8fd19a" opacity="0.5" />
      <path d="M-4 36 C 8 20, 12 4, 10 -12 C 2 4, -2 20, -4 36Z" fill="#3d8b4f" opacity="0.4" />
    </g>
  )
}

export function GardenDecor({ variant = 'soft' }: Props) {
  const gradId = useId().replace(/:/g, '')
  const dense = variant === 'dense' || variant === 'poster'
  const hero = variant === 'hero'
  const poster = variant === 'poster'

  return (
    <div className={`garden-decor ${poster ? 'is-poster' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="decor-svg">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6b4f32" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3d8b4f" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        <motion.ellipse
          cx="180"
          cy="740"
          rx="300"
          ry="130"
          fill="rgba(92, 175, 110, 0.1)"
          animate={{ rx: [280, 310, 280] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="1040"
          cy="70"
          rx="260"
          ry="150"
          fill="rgba(255, 159, 122, 0.1)"
          animate={{ ry: [140, 165, 140] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.path
          d="M -10 180 C 90 130, 140 70, 100 10 C 180 70, 240 150, 200 240 C 290 170, 360 90, 410 30"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={poster ? 4 : 3}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
        />
        <motion.path
          d="M 1210 600 C 1080 650, 1020 720, 1070 790 C 980 720, 910 640, 960 540 C 860 620, 780 710, 710 780"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={poster ? 4 : 3}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.4, delay: 0.15, ease: 'easeOut' }}
        />

        <LeafSpray x={36} y={70} />
        <LeafSpray x={1140} y={600} flip />
        {(hero || dense) && (
          <>
            <LeafSpray x={70} y={500} />
            <LeafSpray x={1080} y={90} flip />
          </>
        )}

        <Flower x="120" y="96" scale={1.2} hue="warm" sway={1} />
        <Flower x="68" y="158" scale={0.78} hue="rose" sway={2} />
        <Flower x="168" y="150" scale={0.62} hue="gold" sway={1.4} />
        <Flower x="1090" y="690" scale={1.25} hue="gold" sway={1.5} />
        <Flower x="1148" y="628" scale={0.82} hue="warm" sway={2.2} />
        <Flower x="1036" y="736" scale={0.7} hue="lilac" sway={1.1} />
        {(hero || dense) && (
          <>
            <Flower x="1040" y="128" scale={0.95} hue="rose" sway={1.2} />
            <Flower x="980" y="86" scale={0.62} hue="lilac" sway={1.8} />
            <Flower x="170" y="650" scale={1} hue="gold" sway={1.6} />
            <Flower x="110" y="700" scale={0.7} hue="rose" sway={2} />
          </>
        )}
        {poster && (
          <>
            <Flower x="220" y="70" scale={0.7} hue="lilac" sway={1.3} />
            <Flower x="980" y="200" scale={0.85} hue="warm" sway={1.7} />
            <Flower x="200" y="560" scale={0.8} hue="rose" sway={1.1} />
            <Flower x="1000" y="520" scale={0.75} hue="gold" sway={2} />
          </>
        )}
      </svg>

      {petals.map((p, i) => (
        <motion.span
          key={i}
          className="petal"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size * 1.35,
            background: p.color,
          }}
          animate={{
            y: [0, -26, 10, -16, 0],
            x: [0, 12, -8, 10, 0],
            rotate: [35, 80, 20, 60, 35],
            opacity: [0.35, 0.7, 0.45, 0.65, 0.35],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.2 5 8.7 9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
