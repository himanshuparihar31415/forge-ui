import { useState } from 'react';
import { MONO, PROV, SANS, SERIF } from '../ui';

interface Props {
  openInspector: () => void;
  goHandoff: () => void;
}

interface Stage {
  name: string;
  state: 'active' | 'next' | 'idle';
  persona: string;
  agent: string;
  artifacts: string;
  gate: string;
  detail: {
    artifacts: [string, string][];
    ledger: string;
    telemetry: string;
  };
}

const STAGES: Stage[] = [
  {
    name: 'Definition',
    state: 'active',
    persona: 'P. Sharma · PM',
    agent: 'req-gen v1.3.2',
    artifacts: '3',
    gate: '⏳ Story-set approval pending · SLA 6h',
    detail: {
      artifacts: [
        ['Story set · 1 epic, 7 stories, 4 NFR', 'AI-DRAFTED'],
        ['Flag resolutions · 6', 'HUMAN-EDITED'],
        ['Source brief · ADVW/417', 'SOURCE'],
      ],
      ledger:
        'Gate 1 · Ambiguity review — approved, signed priya.sharma@lpl.com · 22m ago · #L-90412 — Gate 2 · Story-set approval — pending (PM)',
      telemetry: 'elapsed 1h 04m · cost $1.84 · 312k tokens · trace trc-8841f2 · review timer 41:23 (≤90-min KPI)',
    },
  },
  {
    name: 'Design',
    state: 'next',
    persona: 'A. Verma · Architect',
    agent: 'conformance v0.9.4',
    artifacts: '—',
    gate: '✓ awaiting handoff from Definition',
    detail: {
      artifacts: [
        ['Conformance report (queued)', 'PLANNED'],
        ['Research pack PK-014 linked', 'SOURCE'],
      ],
      ledger: 'No gates reached — stage opens on handoff acceptance.',
      telemetry: 'not started',
    },
  },
  {
    name: 'Build',
    state: 'idle',
    persona: 'D. Patel · Developer',
    agent: 'scaffold-gen v2.0.1',
    artifacts: '—',
    gate: '—',
    detail: { artifacts: [['Scaffolding + stubs (planned)', 'PLANNED']], ledger: 'No gates reached.', telemetry: 'not started' },
  },
  {
    name: 'Test',
    state: 'idle',
    persona: 'S. Iqbal · QA',
    agent: 'test-gen v1.1.0',
    artifacts: '—',
    gate: '—',
    detail: { artifacts: [['Test cases + matrix (planned)', 'PLANNED']], ledger: 'No gates reached.', telemetry: 'not started' },
  },
  {
    name: 'Release',
    state: 'idle',
    persona: 'R. Mehta · RM',
    agent: 'release-notes v0.8.2',
    artifacts: '—',
    gate: '—',
    detail: { artifacts: [['Readiness checklist (planned)', 'PLANNED']], ledger: 'No gates reached.', telemetry: 'not started' },
  },
];

export default function S17WorkflowLanes({ openInspector, goHandoff }: Props) {
  const [sel, setSel] = useState('Definition');
  const selStage = STAGES.find((s) => s.name === sel)!;

  return (
    <div data-screen-label="S17 · Workflow Lane View" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Workflow Lane View</h1>
        <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
          FRG-1042
        </span>
        <span style={{ background: '#EEF1FF', color: '#3D5AFE', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}>
          WF-B · NEW FEATURE
        </span>
        <span style={{ fontSize: 12, color: '#5B6472' }}>Advisor Workstation · Client Meeting Notes AI Summary</span>
        <div style={{ flex: 1 }} />
        <span style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '3px 9px' }}>
          ALL HITL GATES HONORED · 2/2 SO FAR
        </span>
        <span onClick={goHandoff} className="hvr-underline" style={{ fontSize: 11.5, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
          Hand off →
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 20 }}>
        The shared spine made visible — one session, five stages, every gate signed. This view doubles as per-run exit-review evidence.
      </div>

      {/* Stage rail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 0, marginBottom: 18, alignItems: 'stretch' }}>
        {STAGES.map((sg, i) => {
          const isSel = sel === sg.name;
          const active = sg.state === 'active';
          const gateColor = sg.gate.startsWith('⏳') ? '#8A6508' : sg.gate.startsWith('✓') ? '#1B7F4D' : '#A6AFC0';
          return (
            <div key={sg.name} style={{ position: 'relative', padding: '0 6px' }}>
              {i !== 0 && (
                <div style={{ position: 'absolute', top: 21, left: -6, right: -6, height: 2, background: i <= 1 ? '#3D5AFE' : '#E4E9F2' }} />
              )}
              <div
                onClick={() => setSel(sg.name)}
                className="hvr-shadow-stage"
                style={{
                  position: 'relative',
                  background: '#FFFFFF',
                  border: `1.5px solid ${isSel ? '#3D5AFE' : '#E4E9F2'}`,
                  borderRadius: 10,
                  padding: '13px 14px',
                  cursor: 'pointer',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      background: active ? '#EEF1FF' : '#F2F5FA',
                      color: active ? '#3D5AFE' : '#A6AFC0',
                      flex: 'none',
                    }}
                  >
                    {active ? '●' : String(i + 1)}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: active ? '#1E2761' : '#5B6472' }}>{sg.name}</span>
                </div>
                <div style={{ fontSize: 10.5, color: '#5B6472', lineHeight: 1.7 }}>
                  <div>
                    persona <strong style={{ color: '#2A2F3A' }}>{sg.persona}</strong>
                  </div>
                  <div>
                    agent <span style={{ fontFamily: MONO, fontSize: 10 }}>{sg.agent}</span>
                  </div>
                  <div>
                    artifacts <strong style={{ color: '#2A2F3A' }}>{sg.artifacts}</strong>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 9,
                    borderTop: '1px solid #F0F3F9',
                    paddingTop: 8,
                    fontSize: 10,
                    lineHeight: 1.5,
                    color: gateColor,
                    fontWeight: 600,
                  }}
                >
                  {sg.gate}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected stage detail */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>STAGE DETAIL · {selStage.name.toUpperCase()}</span>
          <div style={{ flex: 1 }} />
          <span onClick={openInspector} className="hvr-underline" style={{ fontSize: 11, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
            Session Inspector
          </span>
          <span className="hvr-underline" style={{ fontSize: 11, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
            Open module workspace →
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
          <div style={{ padding: '14px 16px', borderRight: '1px solid #F0F3F9' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 8 }}>ARTIFACTS</div>
            {selStage.detail.artifacts.map(([name, prov]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: '#3D5AFE', flex: 'none' }} />
                <span style={{ flex: 1 }}>{name}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 999,
                    background: PROV[prov][0],
                    color: PROV[prov][1],
                  }}
                >
                  {prov}
                </span>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 16px', borderRight: '1px solid #F0F3F9' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 8 }}>GATE LEDGER</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.8, color: '#5B6472' }}>{selStage.detail.ledger}</div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 8 }}>RUN TELEMETRY</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.8, color: '#5B6472' }}>{selStage.detail.telemetry}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
