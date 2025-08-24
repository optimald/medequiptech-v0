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
        <header className="mb-0.5">
          <h2 className="text-sm font-semibold tracking-tight text-center text-slate-200">{title}</h2>
        </header>
      )}

      {/* Scrollable container for entire swimlane panel */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-400">
        <div className="min-w-max">
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
        <div className={`sticky top-4 select-none rounded-md border border-slate-600/40 bg-slate-800/80 shadow-md overflow-hidden`}>          
          <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />
          <div className="px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-100">{name}</div>
        </div>
      </div>

      {/* Lane track column */}
      <div className="relative">
        {/* Lane boundaries */}
        <div className="absolute inset-x-0 top-0 h-px bg-slate-700/60" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-slate-700/60" />

        <div className="overflow-x-auto scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-400 relative group">
          <div className="flex items-stretch gap-2.5 py-1 min-w-max pr-6">
            {steps.map((s, i) => (
              <Step key={i} text={s} showArrow={i !== steps.length - 1} />
            ))}

            {/* Handoff to next lane indicator */}
            {showHandoff && (
              <div className="relative flex items-center">
                <ArrowRight />
                <div className="ml-1.5 flex items-center gap-1 text-xs text-slate-400">
                  <span className="inline-flex h-3.5 items-center rounded-full border border-slate-600 bg-slate-800 px-1.5 text-slate-300">handoff</span>
                  <span>↓ {nextLaneName}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Scroll fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-800 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-800 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
    </>
  );
}

function Step({ text, showArrow }: { text: string; showArrow?: boolean }) {
  return (
    <div className="flex items-center">
      <div className="rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1 shadow-md min-w-[160px] max-w-[240px] text-xs font-medium text-slate-100 leading-tight">
        {text}
      </div>
      {showArrow && <div className="mx-1.5"><ArrowRight /></div>}
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
