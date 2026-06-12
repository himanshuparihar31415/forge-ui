export type PersonaId = 'pm' | 'ux' | 'arch' | 'dev' | 'qa';

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  iam: string;
  initials: string;
}

export type ScreenId =
  | 's1'
  | 's2'
  | 's3'
  | 's4'
  | 's5'
  | 's6'
  | 's7'
  | 's8'
  | 's9'
  | 's10'
  | 's11'
  | 's12'
  | 's13'
  | 's14'
  | 's15'
  | 's16'
  | 's17'
  | 's18'
  | 's19'
  | 's20'
  | 's21'
  | 's22'
  | 's23'
  | 's24';

export const PERSONAS: Persona[] = [
  { id: 'pm', name: 'Priya Sharma', role: 'Product Manager', iam: 'LPL-PM', initials: 'PS' },
  { id: 'ux', name: 'Maya Chen', role: 'UX Researcher', iam: 'LPL-UIUX', initials: 'MC' },
  { id: 'arch', name: 'Arjun Verma', role: 'Solution Architect', iam: 'LPL-ARCH', initials: 'AV' },
  { id: 'dev', name: 'Dev Patel', role: 'Senior Developer', iam: 'LPL-DEV', initials: 'DP' },
  { id: 'qa', name: 'Sara Iqbal', role: 'QA Engineer', iam: 'LPL-QA', initials: 'SI' },
];

/** Screens gated to specific personas; everyone else opens them read-only. */
export const ACCESS: Partial<Record<ScreenId, PersonaId[]>> = {
  s5: ['pm'],
  s6: ['pm'],
  s7: ['pm'],
  s8: ['ux'],
  s9: ['ux'],
  s10: ['arch'],
  s11: ['arch'],
  s12: ['dev'],
  s13: ['dev'],
  s14: ['qa'],
  s15: ['qa'],
  s19: ['arch'],
  s20: ['arch'],
  s21: ['arch'],
  s22: ['arch'],
};

export const REQ: Partial<Record<ScreenId, string>> = {
  s5: 'PM',
  s6: 'PM',
  s7: 'PM',
  s8: 'UI/UX',
  s9: 'UI/UX',
  s10: 'Architect',
  s11: 'Architect',
  s12: 'Developer',
  s13: 'Developer',
  s14: 'QA',
  s15: 'QA',
  s19: 'Admin / Architect',
  s20: 'Admin',
  s21: 'Admin / Compliance',
  s22: 'Admin / Architect',
};

export const MODNAMES: Partial<Record<ScreenId, string>> = {
  s5: 'SpecAI',
  s6: 'SpecAI',
  s7: 'SpecAI',
  s8: 'DesignAI',
  s9: 'DesignAI',
  s10: 'Architect Hub',
  s11: 'Architect Hub',
  s12: 'CodeIQ',
  s13: 'CodeIQ',
  s14: 'IntelliQA',
  s15: 'IntelliQA',
  s19: 'Agent Registry',
  s20: 'Observability',
  s21: 'Governance',
  s22: 'Evaluation',
};
