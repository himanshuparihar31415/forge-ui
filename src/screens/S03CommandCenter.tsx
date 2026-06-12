import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  openInspector: () => void;
  goApprovals: () => void;
  goReview: () => void;
  goHandoff: () => void;
}

const stageStyle: Record<string, [string, string]> = {
  Definition: ['#EEF1FF', '#3D5AFE'],
  Design: ['#E6F5F3', '#0E9C8C'],
  Build: ['#FBF0E4', '#B95C00'],
  Test: ['#F5EBF0', '#6D2E46'],
  Release: ['#EAECF5', '#1E2761'],
};

// [id, wf, stage, line, who, agent, last, cost, mine]
const ROWS: [string, string, string, string, string, string, string, string, boolean][] = [
  ['FRG-1042', 'WF-B', 'Definition', 'Advisor Workstation', 'P. Sharma · PM', 'req-gen v1.3.2', '4m ago', '$1.84', true],
  ['FRG-1041', 'WF-B', 'Build', 'Client Onboarding', 'D. Patel · Dev', 'scaffold-gen v2.0.1', '9m ago', '$3.12', false],
  ['FRG-1039', 'WF-C', 'Test', 'Trading & Rebalancing', 'S. Iqbal · QA', 'test-gen v1.1.0', '12m ago', '$0.97', false],
  ['FRG-1036', 'WF-A', 'Design', 'Advisor Workstation', 'A. Verma · Architect', 'conformance v0.9.4', '26m ago', '$2.45', false],
  ['FRG-1033', 'WF-B', 'Test', 'Client Onboarding', 'S. Iqbal · QA', 'test-gen v1.1.0', '41m ago', '$1.22', false],
  ['FRG-1031', 'WF-C', 'Release', 'Trading & Rebalancing', 'R. Mehta · RM', 'release-notes v0.8.2', '1h ago', '$0.41', false],
  ['FRG-1028', 'WF-B', 'Design', 'Advisor Workstation', 'M. Chen · UX', 'research-qa v1.2.0', '1h ago', '$0.66', false],
  ['FRG-1025', 'WF-A', 'Build', 'Client Onboarding', 'D. Patel · Dev', 'scaffold-gen v2.0.1', '2h ago', '$4.08', false],
  ['FRG-1019', 'WF-B', 'Definition', 'Trading & Rebalancing', 'P. Sharma · PM', 'req-gen v1.3.2', '3h ago', '$1.05', true],
];

const SPEND: [string, string, string, string][] = [
  ['SpecAI', '$52.10', '88%', '#3D5AFE'],
  ['CodeIQ', '$48.75', '82%', '#B95C00'],
  ['IntelliQA', '$34.20', '58%', '#6D2E46'],
  ['Architect Hub', '$26.40', '45%', '#B8860B'],
  ['DesignAI', '$14.85', '25%', '#0E9C8C'],
  ['ReleasePulse', '$7.90', '13%', '#1E2761'],
];

const AGENTS: [string, string, string, string, string][] = [
  ['req-gen', '3.2s', '0.4%', '#1B7F4D', '#5B6472'],
  ['scaffold-gen', '8.7s', '1.1%', '#1B7F4D', '#5B6472'],
  ['test-gen', '5.1s', '0.8%', '#1B7F4D', '#5B6472'],
  ['conformance', '11.4s', '2.6%', '#B8860B', '#8A6508'],
  ['research-qa', '2.4s', '0.2%', '#1B7F4D', '#5B6472'],
];

// Coverage grid: [bg, color, glyph]
const tick: [string, string, string] = ['#E7F4EC', '#1B7F4D', '✓'];
const dash: [string, string, string] = ['#F7F9FC', '#C2CAD8', '—'];
const dim: [string, string, string] = ['#F2F5FA', '#A6AFC0', '·'];
const COVERAGE: { who: string; cells: [string, string, string][] }[] = [
  { who: 'PM', cells: [tick, tick, dash, dash, tick] },
  { who: 'UX', cells: [tick, tick, dash, dash, dash] },
  { who: 'Arch', cells: [tick, tick, tick, dash, dim] },
  { who: 'Dev', cells: [dash, tick, tick, tick, dash] },
  { who: 'QA', cells: [dash, dim, tick, tick, tick] },
];

interface KpiCard {
  name: string;
  value: string;
  unit?: string;
  points: string;
  lineColor: string;
  note: string;
  noteColor: string;
  amber?: boolean;
}

const KPIS: KpiCard[] = [
  {
    name: 'Story quality',
    value: '3.7',
    unit: '/ 5.0',
    points: '0,14 15,13 30,15 45,11 60,10 75,8 90,7',
    lineColor: '#1B7F4D',
    note: '✓ 84% of sets ≥3.5 (target 80%)',
    noteColor: '#1B7F4D',
  },
  {
    name: 'PM review time',
    value: '74',
    unit: 'min median',
    points: '0,5 15,7 30,6 45,9 60,11 75,12 90,13',
    lineColor: '#1B7F4D',
    note: '✓ target ≤90 min',
    noteColor: '#1B7F4D',
  },
  {
    name: 'Scaffolding acceptance',
    value: '57%',
    points: '0,16 15,15 30,13 45,14 60,11 75,10 90,9',
    lineColor: '#B8860B',
    note: '▲ trending up · target ≥60%',
    noteColor: '#8A6508',
    amber: true,
  },
  {
    name: 'QA test acceptance',
    value: '71%',
    points: '0,15 15,12 30,13 45,10 60,9 75,9 90,7',
    lineColor: '#1B7F4D',
    note: '✓ target ≥70%',
    noteColor: '#1B7F4D',
  },
  {
    name: 'Sprint defect rate',
    value: '0.96×',
    unit: 'baseline',
    points: '0,6 15,8 30,7 45,10 60,9 75,11 90,12',
    lineColor: '#1B7F4D',
    note: '✓ target ≤1.0×',
    noteColor: '#1B7F4D',
  },
];

export default function S03CommandCenter({ openInspector, goApprovals, goReview, goHandoff }: Props) {
  const [filter, setFilter] = useState('all');

  const filtered = ROWS.filter((r) => (filter === 'all' ? true : filter === 'mine' ? r[8] : r[1] === filter));

  const chips: [string, string][] = [
    ['all', 'All'],
    ['mine', 'Mine'],
    ['WF-A', 'A'],
    ['WF-B', 'B'],
    ['WF-C', 'C'],
  ];

  const wfCard = (code: string, name: string, runs: string, total: string, pct: string, footer: string) => (
    <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: '#5B6472' }}>{code}</span>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 8 }}>
        <span style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 700, color: '#1E2761' }}>
          {runs}
          <span style={{ fontSize: 13, color: '#8A93A6' }}>/{total}</span>
        </span>
        <span style={{ fontSize: 10.5, color: '#5B6472' }}>runs to exit</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: '#EFF3FB', margin: '7px 0' }}>
        <div style={{ width: pct, height: 5, borderRadius: 3, background: '#3D5AFE' }} />
      </div>
      <div style={{ fontSize: 10.5, color: '#5B6472' }}>{footer}</div>
    </div>
  );

  return (
    <div data-screen-label="S3 · Command Center" style={{ padding: '22px 28px 40px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Command Center</h1>
        <span style={{ fontSize: 12.5, color: '#5B6472' }}>Phase 1 pilot · 3 product lines · Wednesday, Jun 11</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#8A93A6' }}>
          Exit-evidence data refreshed <span style={{ fontFamily: MONO }}>2m</span> ago
        </span>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* ===== MAIN COLUMN ===== */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Row 1 · Needs my action */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A6508' }}>NEEDS MY ACTION</span>
              <span
                style={{
                  background: '#FFF8E6',
                  border: '1px solid #B8860B',
                  color: '#8A6508',
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 999,
                  padding: '1px 7px',
                }}
              >
                3
              </span>
              <div style={{ flex: 1 }} />
              <span onClick={goApprovals} className="hvr-underline" style={{ fontSize: 11.5, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
                Open approval queue →
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div
                onClick={goReview}
                className="hvr-shadow-amber"
                style={{ background: '#FFF8E6', border: '1px solid #B8860B', borderRadius: 8, padding: '12px 14px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: '#3D5AFE' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#3D5AFE' }}>SPECAI</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A6508' }}>SLA 6h left</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>
                  Story set <span style={{ fontFamily: MONO, fontSize: 12 }}>FRG-1042</span> awaiting PM approval
                </div>
                <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 3 }}>Advisor Workstation · 1 epic · 7 stories · 4 NFR</div>
              </div>
              <div
                onClick={goHandoff}
                className="hvr-shadow-amber"
                style={{ background: '#FFF8E6', border: '1px solid #B8860B', borderRadius: 8, padding: '12px 14px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: '#1E2761' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1E2761' }}>HANDOFF</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A6508' }}>12m ago</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>Handoff request from A. Verma (Architect)</div>
                <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 3 }}>
                  Session <span style={{ fontFamily: MONO, fontSize: 11 }}>FRG-0991</span> · context package ready
                </div>
              </div>
              <div
                onClick={goApprovals}
                className="hvr-shadow-amber"
                style={{ background: '#FFF8E6', border: '1px solid #B8860B', borderRadius: 8, padding: '12px 14px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: '#6D2E46' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#6D2E46' }}>INTELLIQA</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A6508' }}>SLA 22h left</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>Regression additions need sign-off</div>
                <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 3 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11 }}>FRG-1033</span> · 4 tests → suite REG-ADVW-CORE
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 · Exit-criteria KPIs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6' }}>EXIT-CRITERIA KPIS</span>
              <span style={{ fontSize: 10.5, color: '#A6AFC0' }}>source: LPL Measurement Framework · 4-week trend</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
              {KPIS.map((k) => (
                <div
                  key={k.name}
                  style={{ background: '#FFFFFF', border: `1px solid ${k.amber ? '#B8860B' : '#E4E9F2'}`, borderRadius: 8, padding: '12px 14px' }}
                >
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#5B6472', marginBottom: 6 }}>{k.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: k.amber ? '#8A6508' : '#1E2761' }}>{k.value}</span>
                    {k.unit && <span style={{ fontSize: 11, color: '#8A93A6' }}>{k.unit}</span>}
                  </div>
                  <svg width="100%" height="20" viewBox="0 0 90 20" preserveAspectRatio="none" style={{ margin: '6px 0 4px' }}>
                    <polyline points={k.points} fill="none" stroke={k.lineColor} strokeWidth="1.5" />
                  </svg>
                  <div style={{ fontSize: 10, color: k.noteColor, fontWeight: 600 }}>{k.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 · Workflow operations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6' }}>WORKFLOW OPERATIONS</span>
              <span style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '1px 8px' }}>
                HITL GATES HONORED 100% · 217/217
              </span>
              <div style={{ flex: 1 }} />
              <div
                className="hvr-bg-fog"
                style={{
                  height: 26,
                  padding: '0 12px',
                  border: '1px solid #E4E9F2',
                  borderRadius: 6,
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#1E2761',
                  cursor: 'pointer',
                }}
              >
                Export exit-review evidence
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.35fr', gap: 10 }}>
              {wfCard('WF-A', 'Existing App Upgrade', '3', '5', '60%', 'Product lines 2/2 ✓ · Handoffs 11')}
              {wfCard('WF-B', 'New Feature', '14', '20', '70%', 'Product lines 3/3 ✓ · Handoffs 38')}
              {wfCard('WF-C', 'Bug Fix / Hotfix', '22', '30', '73%', 'Hotfixes 3/5 · Handoffs 19')}
              <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#5B6472' }}>Persona-entry coverage</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 9.5, color: '#A6AFC0', fontFamily: MONO }}>exit B4</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '44px repeat(5,1fr)', gap: 2, fontSize: 9, color: '#8A93A6', alignItems: 'center' }}>
                  <span />
                  {['Def', 'Des', 'Bld', 'Tst', 'Rel'].map((c) => (
                    <span key={c} style={{ textAlign: 'center' }}>
                      {c}
                    </span>
                  ))}
                  {COVERAGE.map((cv) => (
                    <span key={cv.who} style={{ display: 'contents' }}>
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: '#5B6472' }}>{cv.who}</span>
                      {cv.cells.map(([bg, color, glyph], i) => (
                        <span
                          key={i}
                          style={{ textAlign: 'center', height: 15, borderRadius: 3, background: bg, color, fontSize: 9, lineHeight: '15px' }}
                        >
                          {glyph}
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: '#8A93A6', marginTop: 6 }}>22 of 25 permitted entries exercised · 3 pending</div>
              </div>
            </div>
          </div>

          {/* Row 4 · Live sessions */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderBottom: '1px solid #E4E9F2' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6' }}>LIVE SESSIONS</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>{filtered.length} active</span>
              <div style={{ flex: 1 }} />
              {chips.map(([id, label]) => (
                <span
                  key={id}
                  onClick={() => setFilter(id)}
                  className="hvr-bc-blue"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    border: `1px solid ${filter === id ? '#3D5AFE' : '#E4E9F2'}`,
                    background: filter === id ? '#EEF1FF' : '#FFFFFF',
                    color: filter === id ? '#3D5AFE' : '#5B6472',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '92px 56px 86px 1.2fr 1fr 1.1fr 70px 58px',
                gap: 8,
                padding: '7px 14px',
                borderBottom: '1px solid #E4E9F2',
                background: '#FAFBFE',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '.06em',
                color: '#8A93A6',
              }}
            >
              <span>SESSION</span>
              <span>WF</span>
              <span>STAGE</span>
              <span>PRODUCT LINE</span>
              <span>ACTIVE PERSONA</span>
              <span>AGENT</span>
              <span>LAST ACT</span>
              <span style={{ textAlign: 'right' }}>COST</span>
            </div>
            {filtered.map((r) => (
              <div
                key={r[0]}
                onClick={openInspector}
                title="Open Session Inspector"
                className="hvr-bg-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '92px 56px 86px 1.2fr 1fr 1.1fr 70px 58px',
                  gap: 8,
                  padding: '8px 14px',
                  borderBottom: '1px solid #F0F3F9',
                  fontSize: 12,
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: '#3D5AFE' }}>{r[0]}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: '#5B6472' }}>{r[1]}</span>
                <span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 999,
                      background: stageStyle[r[2]][0],
                      color: stageStyle[r[2]][1],
                    }}
                  >
                    {r[2]}
                  </span>
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r[3]}</span>
                <span style={{ color: '#5B6472', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r[4]}</span>
                <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r[5]}
                </span>
                <span style={{ fontSize: 11, color: '#8A93A6' }}>{r[6]}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, textAlign: 'right' }}>{r[7]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT RAIL ===== */}
        <div style={{ width: 264, flex: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6' }}>TODAY'S SPEND</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: '#1E2761' }}>$184.20</span>
            </div>
            {SPEND.map(([mod, amt, w, color]) => (
              <div key={mod} style={{ marginBottom: 7 }}>
                <div style={{ display: 'flex', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: '#5B6472' }}>{mod}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: MONO, fontSize: 10.5 }}>{amt}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: '#F0F3F9' }}>
                  <div style={{ width: w, height: 4, borderRadius: 2, background: color }} />
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #E4E9F2', marginTop: 10, paddingTop: 9 }}>
              <div style={{ display: 'flex', fontSize: 10.5, color: '#5B6472', marginBottom: 4 }}>
                <span>Daily budget</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: MONO }}>61% of $300</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: '#F0F3F9' }}>
                <div style={{ width: '61%', height: 5, borderRadius: 3, background: '#1B7F4D' }} />
              </div>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6', marginBottom: 10 }}>AGENT HEALTH · 5 PRIORITY</div>
            {AGENTS.map(([name, p95, err, dot, errColor]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #F0F3F9' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flex: 'none' }} />
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, flex: 1 }}>{name}</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: '#5B6472' }}>{p95}</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: errColor }}>{err}</span>
              </div>
            ))}
            <div style={{ fontSize: 9.5, color: '#A6AFC0', marginTop: 8 }}>p95 latency · error rate · 15-min window</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6', marginBottom: 8 }}>CAPACITY</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: '#1E2761' }}>37</span>
              <span style={{ fontSize: 11, color: '#8A93A6' }}>/ 100 concurrent sessions</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: '#F0F3F9', marginTop: 7 }}>
              <div style={{ width: '37%', height: 5, borderRadius: 3, background: '#3D5AFE' }} />
            </div>
            <div style={{ fontSize: 10, color: '#8A93A6', marginTop: 6 }}>Phase-1 ceiling · LPL AWS us-east-1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
