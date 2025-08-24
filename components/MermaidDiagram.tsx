'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        themeVariables: {
          darkMode: true,
          background: '#0b1220',
          primaryColor: '#60a5fa',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#60a5fa',
          lineColor: '#475569',
          secondaryColor: '#a78bfa',
          tertiaryColor: '#10b981',
          errorBkgColor: '#ef4444',
          errorTextColor: '#fef2f2',
          fontSize: '14px',
        },
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          padding: 20,
        },
        sequence: {
          diagramMarginX: 50,
          diagramMarginY: 10,
          actorMargin: 50,
          width: 150,
          height: 65,
          boxMargin: 10,
          boxTextMargin: 5,
          noteMargin: 10,
          messageMargin: 35,
          mirrorActors: true,
          bottomMarginAdj: 1,
          useMaxWidth: true,
          rightAngles: false,
          showSequenceNumbers: false,
        },
      });

      mermaid.render('mermaid-diagram', chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-diagram ${className}`}
      style={{ 
        background: 'transparent',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '1rem 0'
      }}
    />
  );
}
