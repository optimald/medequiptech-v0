import React from 'react';

interface SwimlaneFlowProps {
  lanes: {
    name: string;
    color: string;
    steps: string[];
  }[];
  title?: string;
}

export default function SwimlaneFlow({ lanes, title }: SwimlaneFlowProps) {
  return (
    <div className="w-full text-slate-100">
      {title && (
        <header className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-center">{title}</h2>
        </header>
      )}

      {/* Two column grid: lane label at left, scrollable lane track at right */}
      <div className="grid grid-cols-[180px,1fr] gap-x-6 gap-y-6">
        {lanes.map((lane, laneIdx) => (
          <Lane
            key={lane.name}
            {...lane}
            showHandoff={laneIdx < lanes.length - 1}
            nextLaneName={lanes[laneIdx + 1]?.name}
          />
        ))}
      </div>
    </div>
  );
}

function Lane({
  name,
  color,
  steps,
  showHandoff,
  nextLaneName,
}: {
  name: string;
  color: string;
  steps: string[];
  showHandoff?: boolean;
  nextLaneName?: string;
}) {
  return (
    <>
      {/* Lane label column */}
      <div className="relative">
        <div className={`sticky top-4 select-none rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-sm overflow-hidden`}>          
          <div className={`h-2 w-full bg-gradient-to-r ${color}`} />
          <div className="px-4 py-3 text-sm font-medium tracking-wide">{name}</div>
        </div>
      </div>

      {/* Lane track column */}
      <div className="relative">
        {/* Lane boundaries */}
        <div className="absolute inset-x-0 top-0 h-px bg-slate-800/80" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-slate-800/80" />

        <div className="overflow-x-auto">
          <div className="flex items-stretch gap-6 py-6 min-w-max pr-16">
            {steps.map((s, i) => (
              <Step key={i} text={s} showArrow={i !== steps.length - 1} />
            ))}

            {/* Handoff to next lane indicator */}
            {showHandoff && (
              <div className="relative flex items-center">
                <ArrowRight />
                <div className="ml-4 flex items-center gap-2 text-xs text-slate-400">
                  <span className="inline-flex h-6 items-center rounded-full border border-slate-700 bg-slate-900/80 px-3">handoff</span>
                  <span>↓ {nextLaneName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Step({ text, showArrow }: { text: string; showArrow?: boolean }) {
  return (
    <div className="flex items-center">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-md min-w-[220px] text-sm">
        {text}
      </div>
      {showArrow && <div className="mx-3"><ArrowRight /></div>}
    </div>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 48 24" width="48" height="24" className="opacity-80">
      <path d="M2 12 H40" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M34 6 L40 12 L34 18" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
