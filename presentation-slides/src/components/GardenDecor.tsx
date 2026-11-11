import type { RefObject } from 'react'

const base = import.meta.env.BASE_URL

function src(file: string) {
  return `${base}world/${file}`
}

export function GreenhouseBackdrop({
  shiftRef,
}: {
  shiftRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="world" aria-hidden="true">
      <div className="world-shift" ref={shiftRef}>
        <img src={src('bg-journey.jpg')} alt="" />
      </div>
    </div>
  )
}

export function LivingPlants({ hidden }: { hidden?: boolean }) {
  return (
    <div className={`living-plants ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <span className="cut vine left">
        <img src={src('plant-vine.png')} alt="" />
      </span>
      <span className="cut vine right">
        <img src={src('plant-vine.png')} alt="" />
      </span>
      <span className="cut fern">
        <img src={src('plant-corner.png')} alt="" />
      </span>
      <span className="cut corner">
        <img src={src('plant-corner.png')} alt="" />
      </span>
      <span className="cut sprig">
        <img src={src('plant-corner.png')} alt="" />
      </span>
    </div>
  )
}

export function PosterPlants() {
  return (
    <div className="poster-plants" aria-hidden="true">
      <img className="pp vine-l sway" src={src('plant-vine.png')} alt="" />
      <img className="pp vine-r sway" src={src('plant-vine.png')} alt="" />
      <img className="pp fern-bl sway-slow" src={src('plant-corner.png')} alt="" />
      <img className="pp corner-tr sway" src={src('plant-corner.png')} alt="" />
      <img className="pp sprig-a sway-slow" src={src('plant-corner.png')} alt="" />
      <img className="pp sprig-b sway" src={src('plant-corner.png')} alt="" />
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
