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
        <header className="mb-2">
          <h2 className="text-base font-semibold tracking-tight text-center text-slate-200">{title}</h2>
        </header>
      )}

      {/* Two column grid: optimized lane label width, maximum track space */}
      <div className="grid grid-cols-[160px,1fr] gap-x-4 gap-y-2 lg:gap-x-6 lg:gap-y-3">
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
        <div className={`sticky top-4 select-none rounded-lg border border-slate-600/40 bg-slate-800/80 shadow-lg overflow-hidden`}>          
          <div className={`h-2 w-full bg-gradient-to-r ${color}`} />
          <div className="px-3 py-2 text-sm font-semibold tracking-wide text-slate-100">{name}</div>
        </div>
      </div>

      {/* Lane track column */}
      <div className="relative">
        {/* Lane boundaries */}
        <div className="absolute inset-x-0 top-0 h-px bg-slate-700/60" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-slate-700/60" />

        <div className="overflow-x-auto">
          <div className="flex items-stretch gap-3 py-2.5 min-w-max pr-8">
            {steps.map((s, i) => (
              <Step key={i} text={s} showArrow={i !== steps.length - 1} />
            ))}

            {/* Handoff to next lane indicator */}
            {showHandoff && (
              <div className="relative flex items-center">
                <ArrowRight />
                <div className="ml-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="inline-flex h-4 items-center rounded-full border border-slate-600 bg-slate-800 px-2 text-slate-300">handoff</span>
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
      <div className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 shadow-lg min-w-[180px] max-w-[260px] text-sm font-medium text-slate-100 leading-tight">
        {text}
      </div>
      {showArrow && <div className="mx-2"><ArrowRight /></div>}
    </div>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 48 24" width="40" height="20" className="opacity-90 text-slate-400">
      <path d="M2 12 H36" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M30 6 L36 12 L30 18" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
