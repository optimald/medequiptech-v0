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
  const [svgContent, setSvgContent] = useState<string>('');

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
          fontSize: '18px',
          nodeTextColor: '#e2e8f0',
          nodeBkgColor: '#1e293b',
          nodeBorderColor: '#475569',
        },
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          padding: 60,
          useMaxWidth: true,
          nodeSpacing: 80,
          rankSpacing: 100,
          wrap: true,
          nodeMinWidth: 200,
          nodeMinHeight: 80,
          maxTextSize: 300,
        },
        sequence: {
          diagramMarginX: 60,
          diagramMarginY: 20,
          actorMargin: 60,
          width: 180,
          height: 80,
          boxMargin: 15,
          boxTextMargin: 8,
          noteMargin: 15,
          messageMargin: 40,
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
    if (chart && mermaid && !isRendered) {
      const renderDiagram = async () => {
        try {
          // Generate unique ID for this diagram
          const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          console.log('Rendering diagram with ID:', uniqueId);
          console.log('Chart content:', chart.substring(0, 100) + '...');
          
          // Render the diagram to get SVG content
          const { svg } = await mermaid.render(uniqueId, chart);
          
          // Store SVG content in state instead of directly manipulating DOM
          setSvgContent(svg);
          setIsRendered(true);
          setError(null);
          console.log('Diagram rendered successfully');
        } catch (err) {
          console.error('Mermaid rendering error:', err);
          setError('Failed to render diagram');
        }
      };

      renderDiagram();
    }
  }, [chart, mermaid, isRendered]);

  // Reset rendered state when chart changes
  useEffect(() => {
    setIsRendered(false);
    setSvgContent('');
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

  if (error) {
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
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
          <p>Diagram could not be rendered</p>
          <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>Error: {error}</p>
          <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>Chart definition:</p>
          <pre style={{ 
            background: 'rgba(51, 65, 85, 0.3)', 
            padding: '1rem', 
            borderRadius: '8px', 
            overflowX: 'auto', 
            fontSize: '0.75rem', 
            color: '#cbd5e1',
            maxWidth: '100%'
          }}>
            {chart}
          </pre>
        </div>
      </div>
    );
  }

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
      {!isRendered && (
        <div style={{ color: '#94a3b8', textAlign: 'center' }}>
          <p>Rendering diagram...</p>
        </div>
      )}
      
      {isRendered && svgContent && (
        <div 
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ 
            width: '100%', 
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      )}
    </div>
  );
}
