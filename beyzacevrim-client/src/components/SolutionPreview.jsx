import { Check } from 'lucide-react'

// Abstract interface illustrations drawn with CSS and SVG.
// Each one suggests the shape of a kind of solution; none of them depicts a real product.

const Bar = ({ className = '' }) => <span className={`block h-2 rounded-full bg-ink/15 ${className}`} />

function DashboardPreview() {
  const bars = [40, 65, 50, 85, 60, 95, 72]
  return (
    <div className="flex h-full gap-3">
      <div className="hidden w-1/5 flex-col gap-2 rounded-lg bg-cobalt p-2.5 sm:flex">
        <span className="mb-2 size-5 rounded-md bg-lime" />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-2 rounded-full ${i === 1 ? 'bg-cream' : 'bg-cream/40'}`} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {['bg-lavender', 'bg-lime', 'bg-orange'].map((color) => (
            <div key={color} className="rounded-lg bg-white/70 p-2">
              <span className={`mb-2 block size-3 rounded-full ${color}`} />
              <Bar className="w-3/4" />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1.5 rounded-lg bg-white/70 p-3">
          {bars.map((height, i) => (
            <span
              key={i}
              className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-orange' : 'bg-cobalt/70'}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ChecklistPreview() {
  const steps = [true, true, true, false, false]
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-1.5">
        {steps.map((done, i) => (
          <span key={i} className="flex flex-1 items-center gap-1.5">
            <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-ink ${done ? 'bg-ink text-lime' : 'bg-white'}`}>
              {done && <Check className="size-3" strokeWidth={3} />}
            </span>
            {i < steps.length - 1 && <span className={`h-0.5 flex-1 ${done ? 'bg-ink' : 'bg-ink/20'}`} />}
          </span>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-5 gap-3">
        <div className="col-span-3 flex flex-col gap-2 rounded-lg bg-white/80 p-3">
          {[true, true, false, false].map((done, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`flex size-4 items-center justify-center rounded ${done ? 'bg-orange text-ink' : 'border-2 border-ink/25'}`}>
                {done && <Check className="size-3" strokeWidth={3} />}
              </span>
              <Bar className={i % 2 ? 'w-2/3' : 'w-5/6'} />
            </div>
          ))}
        </div>
        <div className="col-span-2 flex flex-col justify-between rounded-lg bg-ink p-3">
          <span className="h-2 w-2/3 rounded-full bg-cream/50" />
          <span className="h-2 w-1/2 rounded-full bg-cream/30" />
          <span className="mt-auto inline-flex h-5 w-16 rounded-full bg-lime" />
        </div>
      </div>
    </div>
  )
}

function SocialPreview() {
  const chips = { 1: 'bg-cobalt', 4: 'bg-lavender', 6: 'bg-lime', 9: 'bg-cobalt', 11: 'bg-ink', 13: 'bg-lavender' }
  return (
    <div className="grid h-full grid-cols-5 gap-3">
      <div className="col-span-3 grid grid-cols-5 grid-rows-3 gap-1.5 rounded-lg bg-white/75 p-2.5">
        {Array.from({ length: 15 }, (_, i) => (
          <span key={i} className="flex items-end rounded-sm bg-ink/5 p-1">
            {chips[i] && <span className={`h-1.5 w-full rounded-full ${chips[i]}`} />}
          </span>
        ))}
      </div>
      <div className="col-span-2 flex flex-col gap-2 rounded-lg bg-white/90 p-3">
        <div className="flex -space-x-1.5">
          {['bg-cobalt', 'bg-lime', 'bg-lavender', 'bg-ink'].map((color) => (
            <span key={color} className={`size-5 rounded-full border-2 border-white ${color}`} />
          ))}
        </div>
        <Bar className="w-full" />
        <Bar className="w-4/5" />
        <Bar className="w-3/5" />
        <span className="mt-auto h-5 w-14 self-end rounded-full bg-orange" />
      </div>
    </div>
  )
}

function NetworkPreview() {
  const nodes = [
    { x: 50, y: 50, r: 9, fill: 'var(--color-cobalt)' },
    { x: 18, y: 25, r: 6, fill: 'var(--color-orange)' },
    { x: 82, y: 22, r: 6, fill: 'var(--color-lime)' },
    { x: 20, y: 78, r: 6, fill: 'var(--color-lime)' },
    { x: 80, y: 76, r: 6, fill: 'var(--color-ink)' },
    { x: 50, y: 12, r: 4, fill: 'var(--color-ink)' },
    { x: 92, y: 50, r: 4, fill: 'var(--color-orange)' },
  ]
  const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 5], [2, 6], [4, 6], [1, 3]]
  return (
    <div className="grid h-full grid-cols-5 gap-3">
      <div className="col-span-3 rounded-lg bg-white/70 p-2">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          {edges.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="var(--color-ink)" strokeOpacity="0.35" strokeWidth="1" />
          ))}
          {nodes.map((node, i) => (
            <circle key={i} cx={node.x} cy={node.y} r={node.r} fill={node.fill} />
          ))}
        </svg>
      </div>
      <div className="col-span-2 flex flex-col gap-2">
        {['bg-cobalt', 'bg-orange', 'bg-lime'].map((color) => (
          <div key={color} className="flex flex-1 items-center gap-2 rounded-lg bg-white/85 px-2.5">
            <span className={`size-5 shrink-0 rounded-md ${color}`} />
            <span className="flex flex-1 flex-col gap-1">
              <Bar className="w-full" />
              <Bar className="w-1/2" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WebsitePreview() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="size-4 rounded-full bg-orange" />
        <span className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-1.5 w-6 rounded-full bg-ink/20" />
          ))}
        </span>
      </div>
      <div className="flex flex-1 items-center gap-3 rounded-lg bg-lavender/60 p-3">
        <div className="flex flex-1 flex-col gap-2">
          <span className="h-3 w-5/6 rounded-full bg-ink" />
          <span className="h-3 w-2/3 rounded-full bg-ink" />
          <Bar className="mt-1 w-3/4" />
          <span className="mt-1 h-5 w-16 rounded-full bg-cobalt" />
        </div>
        <span className="hidden aspect-square h-full max-h-20 rounded-full bg-lime sm:block" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['bg-cobalt', 'bg-orange', 'bg-lime'].map((color) => (
          <div key={color} className="rounded-lg bg-white/80 p-2">
            <span className={`mb-1.5 block h-6 rounded-md ${color}`} />
            <Bar className="w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

function IntegrationsPreview() {
  const services = [
    { x: 16, y: 20, fill: 'var(--color-cobalt)' },
    { x: 84, y: 20, fill: 'var(--color-orange)' },
    { x: 16, y: 80, fill: 'var(--color-lavender)' },
    { x: 84, y: 80, fill: 'var(--color-ink)' },
  ]
  return (
    <div className="h-full rounded-lg bg-white/75 p-2">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden="true">
        {services.map((service) => (
          <line
            key={`${service.x}-${service.y}`}
            x1="50"
            y1="50"
            x2={service.x}
            y2={service.y}
            stroke="var(--color-ink)"
            strokeOpacity="0.45"
            strokeWidth="1.2"
            strokeDasharray="3 2.5"
          />
        ))}
        {services.map((service) => (
          <rect key={`n-${service.x}-${service.y}`} x={service.x - 8} y={service.y - 8} width="16" height="16" rx="4" fill={service.fill} />
        ))}
        <rect x="35" y="35" width="30" height="30" rx="7" fill="var(--color-lime)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M44 47 h12 l-3 -3 M56 53 h-12 l3 3" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const VARIANTS = {
  website: WebsitePreview,
  integrations: IntegrationsPreview,
  dashboard: DashboardPreview,
  checklist: ChecklistPreview,
  social: SocialPreview,
  network: NetworkPreview,
}

export default function SolutionPreview({ variant, className = '' }) {
  const Illustration = VARIANTS[variant] ?? DashboardPreview

  return (
    <div className={`overflow-hidden rounded-xl border-2 border-ink bg-cream shadow-[6px_6px_0_0_var(--color-ink)] ${className}`} aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b-2 border-ink px-3 py-2">
        <span className="size-2.5 rounded-full bg-orange" />
        <span className="size-2.5 rounded-full bg-lime" />
        <span className="size-2.5 rounded-full bg-lavender" />
        <span className="ml-3 h-3 flex-1 rounded-full bg-ink/10" />
      </div>
      <div className="aspect-[16/10] p-3 sm:p-4">
        <Illustration />
      </div>
    </div>
  )
}
