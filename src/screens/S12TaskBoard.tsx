import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  goScaffold: () => void;
}

const T: Record<string, [string, string]> = {
  SCAFFOLD: ['#FBF0E4', '#B95C00'],
  STUBS: ['#EEF1FF', '#3D5AFE'],
  'SUB-TASKS': ['#EAECF5', '#1E2761'],
  DIAGRAM: ['#E6F5F3', '#0E9C8C'],
  'DEPLOY-SEED': ['#F5EBF0', '#6D2E46'],
};

type Drift = 'ok' | 'warn' | 'pending';

interface Card {
  ref: string;
  type: keyof typeof T;
  title: string;
  drift: Drift;
  age: string;
}

const COLUMNS: { name: string; cards: Card[] }[] = [
  {
    name: 'BACKLOG',
    cards: [
      { ref: 'ADVW-2215-1', type: 'SUB-TASKS', title: 'Document Vault write path — decompose story', drift: 'pending', age: '2d' },
      { ref: 'ADVW-2216-1', type: 'SCAFFOLD', title: 'Failure & retry handling service shell', drift: 'pending', age: '2d' },
    ],
  },
  {
    name: 'FORGE DRAFTING',
    cards: [
      { ref: 'ADVW-2211-2', type: 'STUBS', title: 'Summary generation client + interface stubs', drift: 'pending', age: '18m' },
      { ref: 'ADVW-2213-3', type: 'DIAGRAM', title: 'Latency budget — candidate architecture diagram', drift: 'pending', age: '6m' },
    ],
  },
  {
    name: 'AWAITING MY REVIEW',
    cards: [
      { ref: 'ADVW-2211-1', type: 'SCAFFOLD', title: 'Summary service scaffolding (12 files)', drift: 'ok', age: '1h' },
      { ref: 'ADVW-2212-1', type: 'SCAFFOLD', title: 'Note-template renderer module', drift: 'warn', age: '3h' },
      { ref: 'ADVW-2214-2', type: 'DEPLOY-SEED', title: 'Review-flow feature flag + deploy seed', drift: 'ok', age: '4h' },
    ],
  },
  {
    name: 'PR OPEN',
    cards: [{ ref: 'ADVW-2210-9', type: 'SCAFFOLD', title: 'Meeting-record event consumer', drift: 'ok', age: '1d' }],
  },
  {
    name: 'DONE',
    cards: [
      { ref: 'ADVW-2210-4', type: 'STUBS', title: 'Transcript redaction interface', drift: 'ok', age: '2d' },
      { ref: 'ADVW-2210-2', type: 'SUB-TASKS', title: 'Epic decomposition — 14 sub-tasks', drift: 'ok', age: '3d' },
    ],
  },
];

const CMDS = [
  'forge draft ADVW-2211-2',
  'forge review --next',
  'forge drift-check .',
  'forge regenerate src/SummarySvc.java',
  'forge pr --draft',
  'forge session FRG-1041',
];

const driftMeta = (d: Drift): [string, string, string] =>
  d === 'ok' ? ['drift check ✓', '#1B7F4D', '#1B7F4D'] : d === 'warn' ? ['1 drift finding', '#B95C00', '#B95C00'] : ['drift pending', '#A6AFC0', '#C9D3E4'];

export default function S12TaskBoard({ goScaffold }: Props) {
  const [cmdsOpen, setCmdsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div data-screen-label="S12 · CodeIQ Task Board" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#B95C00' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>CodeIQ · Task Board</h1>
        <span style={{ fontSize: 12.5, color: '#5B6472' }}>Dev Patel's Jira sub-tasks · sprint ADVW-S14</span>
        <div style={{ flex: 1 }} />
        <span style={{ background: '#FBF0E4', color: '#B95C00', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '3px 9px' }}>
          SCAFFOLDING ACCEPTANCE 57% · TARGET ≥60
        </span>
      </div>

      {/* IDE banner */}
      <div
        style={{
          background: '#1E2761',
          borderRadius: 9,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 16,
          color: '#FFFFFF',
        }}
      >
        <span style={{ fontSize: 16 }}>✨</span>
        <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5 }}>
          Your primary surface is the IDE — every action here is also a <strong>Cursor / Copilot / Claude</strong> command. This board mirrors state
          for visibility.
        </div>
        <div
          onClick={() => setCmdsOpen((o) => !o)}
          className="hvr-bg-white20"
          style={{
            height: 30,
            padding: '0 14px',
            borderRadius: 6,
            background: 'rgba(255,255,255,.12)',
            display: 'flex',
            alignItems: 'center',
            fontSize: 11.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {cmdsOpen ? 'Hide command palette' : 'Show command palette'}
        </div>
      </div>
      {cmdsOpen && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E4E9F2',
            borderRadius: 9,
            padding: '12px 16px',
            margin: '-8px 0 16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
          }}
        >
          {CMDS.map((cmd) => (
            <div
              key={cmd}
              onClick={() => {
                try {
                  void navigator.clipboard.writeText(cmd);
                } catch {
                  /* clipboard unavailable — demo only */
                }
                setCopied(cmd);
              }}
              title="Click to copy"
              className="hvr-bg-orange hvr-bc-orange"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid #F0F3F9',
                borderRadius: 6,
                padding: '7px 10px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#B95C00', flex: 1 }}>{cmd}</span>
              <span style={{ fontSize: 9.5, color: '#A6AFC0' }}>{copied === cmd ? 'copied ✓' : 'copy'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, alignItems: 'start' }}>
        {COLUMNS.map((col) => (
          <div key={col.name} style={{ background: '#F2F5FA', borderRadius: 10, padding: 10, minHeight: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '2px 4px 10px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: '#5B6472' }}>{col.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#8A93A6', background: '#FFFFFF', borderRadius: 999, padding: '1px 7px' }}>
                {col.cards.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.cards.map((cd) => {
                const [driftLabel, driftColor, driftDot] = driftMeta(cd.drift);
                return (
                  <div
                    key={cd.ref}
                    onClick={goScaffold}
                    className="hvr-shadow-row"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E4E9F2',
                      borderLeft: `3px solid ${T[cd.type][1]}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, color: '#3D5AFE' }}>{cd.ref}</span>
                      <div style={{ flex: 1 }} />
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 700,
                          letterSpacing: '.04em',
                          color: T[cd.type][1],
                          background: T[cd.type][0],
                          borderRadius: 999,
                          padding: '1px 6px',
                        }}
                      >
                        {cd.type}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{cd.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: driftDot, flex: 'none' }} />
                      <span style={{ fontSize: 9.5, color: driftColor, fontWeight: 600 }}>{driftLabel}</span>
                      <div style={{ flex: 1 }} />
                      <span style={{ fontSize: 9.5, color: '#A6AFC0' }}>{cd.age}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10.5, color: '#A6AFC0', marginTop: 14 }}>
        Forge never commits to main — merging stays with human code review. Cards open the scaffolding review workspace.
      </div>
    </div>
  );
}
