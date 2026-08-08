/**
 * Abstract circuit-network graphic built from the brand's own visual
 * language (see docs/brand-guide-page-*.png) rather than a generic
 * gradient blob or stock 3D render — no photography is available yet (see
 * docs/design-direction.md imagery notes).
 */
export function HeroGraphic() {
  const nodes = [
    [40, 60],
    [120, 40],
    [200, 90],
    [280, 50],
    [340, 120],
    [260, 180],
    [160, 200],
    [80, 160],
    [220, 260],
    [320, 240],
  ];
  return (
    <svg viewBox="0 0 380 320" fill="none" className="h-full w-full" aria-hidden="true">
      <g stroke="var(--color-brand-blue)" strokeWidth="1.25" strokeOpacity="0.35">
        <line x1="40" y1="60" x2="120" y2="40" />
        <line x1="120" y1="40" x2="200" y2="90" />
        <line x1="200" y1="90" x2="280" y2="50" />
        <line x1="280" y1="50" x2="340" y2="120" />
        <line x1="200" y1="90" x2="160" y2="200" />
        <line x1="160" y1="200" x2="80" y2="160" />
        <line x1="160" y1="200" x2="260" y2="180" />
        <line x1="260" y1="180" x2="340" y2="120" />
        <line x1="160" y1="200" x2="220" y2="260" />
        <line x1="220" y1="260" x2="320" y2="240" />
        <line x1="260" y1="180" x2="320" y2="240" />
      </g>
      {nodes.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i % 3 === 0 ? 5 : 3}
          fill={i % 3 === 0 ? "var(--color-brand-blue)" : "none"}
          stroke="var(--color-brand-blue)"
          strokeWidth="1.25"
        />
      ))}
      <circle cx="190" cy="150" r="46" fill="none" stroke="var(--color-brand-blue)" strokeWidth="1.5" />
      <circle cx="190" cy="150" r="30" fill="var(--color-brand-blue)" fillOpacity="0.08" />
    </svg>
  );
}
