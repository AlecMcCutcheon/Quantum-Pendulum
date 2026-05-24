import type { MajorGlyphId } from "../types";

/** Large archetype geometry — centered at 0,0, ~±40 unit span */
export function majorSymbolPaths(id: MajorGlyphId): string {
  switch (id) {
    case "observer":
      return `<circle cx="0" cy="8" r="6" fill="inherit"/><path d="M0,-28 L8,-8 -8,-8 Z" fill="none" stroke-width="inherit"/><circle cx="0" cy="-20" r="3" fill="inherit"/>`;
    case "catalyst":
      return `<path d="M-22,0 Q-22,-18 0,-18 Q22,-18 22,0 Q22,18 0,18 Q-22,18 -22,0 M-22,0 Q-22,18 0,18 Q22,18 22,0 Q22,-18 0,-18 Q-22,-18 -22,0" fill="none" stroke-width="inherit"/><line x1="0" y1="-24" x2="0" y2="24" stroke-width="inherit" opacity="0.5"/>`;
    case "superposition":
      return `<ellipse cx="-12" cy="0" rx="14" ry="22" fill="none" stroke-width="inherit"/><ellipse cx="12" cy="0" rx="14" ry="22" fill="none" stroke-width="inherit"/><rect x="-4" y="-28" width="8" height="56" fill="inherit" fill-opacity="0.2"/>`;
    case "field":
      return `<path d="M0,-20 Q25,0 0,25 Q-25,0 0,-20" fill="inherit" fill-opacity="0.2" stroke-width="inherit"/><circle cx="0" cy="2" r="8" fill="none" stroke-width="inherit"/>`;
    case "constant":
      return `<rect x="-24" y="-18" width="48" height="36" rx="4" fill="none" stroke-width="inherit"/><path d="M-12,-6 L12,-6 M-12,6 L12,6" stroke-width="inherit"/>`;
    case "axiom":
      return `<path d="M0,-24 L16,16 L-16,16 Z" fill="none" stroke-width="inherit"/><rect x="-6" y="0" width="12" height="20" fill="inherit" fill-opacity="0.25"/>`;
    case "entanglement":
      return `<circle cx="-14" cy="0" r="12" fill="none" stroke-width="inherit"/><circle cx="14" cy="0" r="12" fill="none" stroke-width="inherit"/><path d="M-2,-8 Q0,0 2,8" fill="none" stroke-width="inherit"/>`;
    case "trajectory":
      return `<rect x="-28" y="-12" width="56" height="24" rx="6" fill="inherit" fill-opacity="0.15" stroke-width="inherit"/><circle cx="-18" cy="0" r="5" fill="inherit"/><circle cx="18" cy="0" r="5" fill="inherit"/>`;
    case "coherence":
      return `<path d="M-20,8 Q0,-20 20,8" fill="none" stroke-width="inherit"/><circle cx="0" cy="12" r="10" fill="none" stroke-width="inherit"/>`;
    case "soliton":
      return `<polygon points="0,-22 8,-6 22,-6 10,6 14,22 0,14 -14,22 -10,6 -22,-6 -8,-6" fill="none" stroke-width="inherit"/><circle cx="0" cy="0" r="5" fill="inherit"/>`;
    case "phaseWheel":
      return `<circle cx="0" cy="0" r="26" fill="none" stroke-width="inherit"/><path d="M0,-26 L8,-8 L0,0 L-8,8 Z" fill="inherit" fill-opacity="0.3"/><circle cx="0" cy="0" r="4" fill="inherit"/>`;
    case "symmetry":
      return `<line x1="0" y1="-28" x2="0" y2="28" stroke-width="inherit"/><path d="M-20,-8 H20 M-16,8 H16" stroke-width="inherit"/><circle cx="-20" cy="-8" r="6" fill="none" stroke-width="inherit"/><circle cx="20" cy="-8" r="6" fill="none" stroke-width="inherit"/>`;
    case "invertedFrame":
      return `<line x1="0" y1="-26" x2="0" y2="26" stroke-width="inherit"/><circle cx="0" cy="-8" r="14" fill="none" stroke-width="inherit"/><rect x="-8" y="8" width="16" height="14" fill="inherit" fill-opacity="0.2"/>`;
    case "decay":
      return `<path d="M-18,12 L0,-20 L18,12 Z" fill="none" stroke-width="inherit"/><circle cx="0" cy="14" r="8" fill="inherit" fill-opacity="0.15"/><line x1="-24" y1="20" x2="24" y2="20" stroke-width="inherit"/>`;
    case "mixer":
      return `<path d="M-22,-12 H22 M-22,12 H22" stroke-width="inherit"/><circle cx="-12" cy="0" r="8" fill="none" stroke-width="inherit"/><circle cx="12" cy="0" r="8" fill="none" stroke-width="inherit"/><path d="M-4,-8 L4,8" stroke-width="inherit"/>`;
    case "trapWell":
      return `<rect x="-16" y="-8" width="32" height="24" rx="8" fill="none" stroke-width="inherit"/><line x1="-10" y1="-20" x2="10" y2="-20" stroke-width="inherit"/><circle cx="0" cy="4" r="4" fill="inherit"/>`;
    case "cascade":
      return `<rect x="-10" y="-28" width="20" height="40" fill="inherit" fill-opacity="0.2" stroke-width="inherit"/><path d="M-24,8 L0,-12 L24,8" fill="none" stroke-width="inherit"/><line x1="-28" y1="18" x2="28" y2="18" stroke-width="inherit"/>`;
    case "guidingQuanta":
      return `<polygon points="0,-24 6,-4 24,-4 8,8 14,24 0,16 -14,24 -8,8 -24,-4 -6,-4" fill="none" stroke-width="inherit"/><circle cx="0" cy="-8" r="4" fill="inherit"/>`;
    case "darkSector":
      return `<path d="M-20,4 Q0,-16 20,4 Q0,20 -20,4" fill="inherit" fill-opacity="0.25" stroke-width="inherit"/><circle cx="-8" cy="2" r="3" fill="inherit"/><circle cx="10" cy="6" r="2" fill="inherit"/>`;
    case "fullEmission":
      return `<circle cx="0" cy="0" r="22" fill="inherit" fill-opacity="0.2" stroke-width="inherit"/><line x1="0" y1="-32" x2="0" y2="32" stroke-width="inherit" opacity="0.6"/><line x1="-32" y1="0" x2="32" y2="0" stroke-width="inherit" opacity="0.6"/>`;
    case "measurement":
      return `<path d="M0,-24 L18,12 L-18,12 Z" fill="none" stroke-width="inherit"/><line x1="0" y1="-8" x2="0" y2="18" stroke-width="inherit"/><circle cx="0" cy="18" r="4" fill="inherit"/>`;
    case "closedSystem":
      return `<ellipse cx="0" cy="0" rx="28" ry="20" fill="none" stroke-width="inherit"/><ellipse cx="0" cy="0" rx="18" ry="12" fill="inherit" fill-opacity="0.15"/><circle cx="0" cy="-22" r="4" fill="inherit"/>`;
  }
}

export function renderMajorSymbol(
  id: MajorGlyphId,
  cx: number,
  cy: number,
  scale: number,
  fill: string,
  stroke: string,
  strokeWidth: number,
): string {
  const sw = strokeWidth / scale;
  return `<g transform="translate(${cx},${cy}) scale(${scale})" fill="${fill}" stroke="${stroke}" stroke-width="${sw}">
    ${majorSymbolPaths(id)}
  </g>`;
}
