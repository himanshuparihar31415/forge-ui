// Shared font stacks and small design tokens used across all screens.

export const SANS = "'Inter','Segoe UI',sans-serif";
export const SERIF = "'Source Serif 4',Cambria,serif";
export const MONO = "'JetBrains Mono',monospace";

/** Module accent colors (verticals). */
export const MODULE_COLORS = {
  specai: '#3D5AFE',
  protoai: '#0E9C8C',
  codeiq: '#B95C00',
  intelliqa: '#6D2E46',
  release: '#1E2761',
} as const;

/** Provenance chip palettes. */
export const PROV: Record<string, [string, string]> = {
  'AI-DRAFTED': ['#EEF1FF', '#3D5AFE'],
  'HUMAN-EDITED': ['#F0EDF5', '#6D2E46'],
  SOURCE: ['#F2F5FA', '#5B6472'],
  PLANNED: ['#F7F9FC', '#A6AFC0'],
};
