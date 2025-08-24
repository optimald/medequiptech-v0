'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mermaid, setMermaid] = useState<any>(null);

  // Dynamically import mermaid
  useEffect(() => {
    const loadMermaid = async () => {
      try {
        const mermaidModule = await import('mermaid');
        setMermaid(mermaidModule.default);
      } catch (err) {
        console.error('Failed to load mermaid:', err);
        setError('Failed to load diagram library');
      }
    };
    
    loadMermaid();
  }, []);

  // Initialize mermaid when loaded
  useEffect(() => {
    if (mermaid) {
      mermaid.initialize({
        startOnLoad: false,
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
    }
  }, [mermaid]);

  // Render diagram when mermaid is ready and chart changes
  useEffect(() => {
    if (containerRef.current && chart && mermaid && !isRendered) {
      const renderDiagram = async () => {
        try {
          // Generate unique ID for this diagram
          const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          console.log('Rendering diagram with ID:', uniqueId);
          console.log('Chart content:', chart.substring(0, 100) + '...');
          
          // Clear previous content
          containerRef.current!.innerHTML = '';
          
          // Render the diagram
          const { svg } = await mermaid.render(uniqueId, chart);
          
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            setIsRendered(true);
            setError(null);
            console.log('Diagram rendered successfully');
          }
        } catch (err) {
          console.error('Mermaid rendering error:', err);
          setError('Failed to render diagram');
          // Fallback to text representation
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div style="color: #94a3b8; text-align: center; padding: 2rem;">
                <p>Diagram could not be rendered</p>
                <p style="font-size: 0.875rem; margin-top: 1rem;">Error: ${err instanceof Error ? err.message : 'Unknown error'}</p>
                <p style="font-size: 0.875rem; margin-top: 1rem;">Chart definition:</p>
                <pre style="background: rgba(51, 65, 85, 0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.75rem; color: #cbd5e1;">${chart}</pre>
              </div>
            `;
          }
        }
      };

      renderDiagram();
    }
  }, [chart, mermaid, isRendered]);

  // Reset rendered state when chart changes
  useEffect(() => {
    setIsRendered(false);
  }, [chart]);

  if (!mermaid) {
    return (
      <div 
        className={`mermaid-diagram ${className}`}
        style={{ 
          background: 'transparent',
          borderRadius: '8px',
          overflow: 'hidden',
          margin: '1rem 0',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ color: '#94a3b8', textAlign: 'center' }}>
          <p>Loading diagram library...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-diagram ${className}`}
      style={{ 
        background: 'transparent',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '1rem 0',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {!isRendered && !error && (
        <div style={{ color: '#94a3b8', textAlign: 'center' }}>
          <p>Rendering diagram...</p>
        </div>
      )}
    </div>
  );
}
