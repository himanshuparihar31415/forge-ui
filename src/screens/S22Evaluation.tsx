import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

const KIND: Record<string, [string, string]> = {
  GOLDEN: ['#E7F4EC', '#1B7F4D'],
  REGRESS: ['#EEF1FF', '#3D5AFE'],
  ADVERS: ['#FDEEEF', '#C7131F'],
};

// [name, kind, size, owner, ver]
const DATASETS: [string, keyof typeof KIND, string, string, string][] = [
  ['eval-stories-golden', 'GOLDEN', '240 briefs + reference sets', 'PM guild', 'v3.1'],
  ['eval-stories-regress', 'REGRESS', '1,120 prior generations', 'platform', 'v3.1'],
  ['eval-stories-advers', 'ADVERS', '85 ambiguous/hostile briefs', 'MRM', 'v2.4'],
  ['eval-findings-golden', 'GOLDEN', '96 SyDD/SD/code triples', 'arch guild', 'v1.8'],
  ['eval-tests-golden', 'GOLDEN', '150 story→test references', 'QA guild', 'v2.0'],
];

// [agent, dataset, score, gate, pass]
const RUNS: [string, string, string, string, boolean][] = [
  ['req-gen@1.3.2', 'stories-golden v3.1', '0.91', '0.85', true],
  ['req-gen@1.3.2', 'stories-advers v2.4', '0.87', '0.80', true],
  ['test-gen@1.1.0', 'tests-golden v2.0', '0.89', '0.85', true],
  ['research-qa@1.2.0', 'citations-golden v1.2', '0.88', '0.85', true],
  ['conformance@0.9.4', 'findings-golden v1.8', '0.86', '0.85', true],
  ['scaffold-gen@2.1.0-rc', 'scaffold-golden v2.2', '0.81', '0.85', false],
];

const BOARDS: Record<string, { dev: string; shadow: string; canary: string; prod: string }> = {
  'req-gen': { dev: 'v1.4.0-dev', shadow: 'v1.3.3', canary: '—', prod: 'v1.3.2 (pilot)' },
  'scaffold-gen': { dev: 'v2.1.0-rc', shadow: '—', canary: '—', prod: 'v2.0.1 (pilot)' },
  'test-gen': { dev: 'v1.2.0-dev', shadow: 'v1.1.1', canary: 'v1.1.1', prod: 'v1.1.0 (pilot)' },
};

// [kind, where, what, when, bg, color]
const DRIFT: [string, string, string, string, string, string][] = [
  ['BLOCKED PR', 'lpl/client-onboarding #311', 'Direct DB cross-service read (DATA-02) introduced in scaffold edit — PR held until remediated.', '1h ago', '#FDEEEF', '#C7131F'],
  ['WARN', 'lpl/advisor-workstation #482', 'New dependency outside approved registry — exception requested.', '3h ago', '#FBF6E6', '#8A6508'],
  ['RESOLVED', 'lpl/trading-rebal #198', 'Sync call replaced with queue per INT-07 — drift cleared.', '1d ago', '#E7F4EC', '#1B7F4D'],
  ['WARN', 'prompts req-gen@2.4.1-rc', 'Output-length drift +22% vs golden — flagged before promotion.', '2d ago', '#FBF6E6', '#8A6508'],
];

export default function S22Evaluation() {
  const [agent, setAgent] = useState('req-gen');
  const [rolled, setRolled] = useState(false);

  const board = BOARDS[agent];
  const stages: [string, string][] = [
    ['DEV', board.dev],
    ['SHADOW', board.shadow],
    ['CANARY', board.canary],
    ['PROD', board.prod],
  ];

  return (
    <div data-screen-label="S22 · Evaluation" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Evaluation</h1>
        <span style={{ fontSize: 12.5, color: '#5B6472' }}>Datasets, eval runs and the promotion pipeline · P6</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#8A93A6' }}>No agent reaches Prod without eval → MRM → ARB → security ✓</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 14, marginBottom: 14, alignItems: 'start' }}>
        {/* Datasets */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE', fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>
            DATASETS REGISTRY
          </div>
          {DATASETS.map(([name, kind, size, owner, ver]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #F0F3F9' }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  background: KIND[kind][0],
                  color: KIND[kind][1],
                  flex: 'none',
                }}
              >
                {kind}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: '#1E2761' }}>{name}</div>
                <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 1 }}>
                  {size} · owner {owner}
                </div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 10, color: '#5B6472' }}>{ver}</span>
            </div>
          ))}
        </div>

        {/* Run results */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE', fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>
            RECENT EVAL RUNS · AGENT@VERSION × DATASET
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.2fr 70px 70px 90px',
              gap: 8,
              padding: '8px 16px',
              borderBottom: '1px solid #E4E9F2',
              background: '#FAFBFE',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.06em',
              color: '#8A93A6',
            }}
          >
            <span>AGENT</span>
            <span>DATASET</span>
            <span>SCORE</span>
            <span>GATE</span>
            <span>RESULT</span>
          </div>
          {RUNS.map(([ag, dataset, score, gate, pass], i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.2fr 70px 70px 90px',
                gap: 8,
                padding: '9px 16px',
                borderBottom: '1px solid #F0F3F9',
                fontSize: 11.5,
                alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}>{ag}</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>{dataset}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: pass ? '#1B7F4D' : '#C7131F' }}>{score}</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#8A93A6' }}>≥{gate}</span>
              <span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: pass ? '#E7F4EC' : '#FDEEEF',
                    color: pass ? '#1B7F4D' : '#C7131F',
                  }}
                >
                  {pass ? 'PASS' : 'FAIL — HELD'}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, alignItems: 'start' }}>
        {/* Promotion board */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>PROMOTION BOARD</span>
            <div style={{ flex: 1 }} />
            {Object.keys(BOARDS).map((name) => (
              <span
                key={name}
                onClick={() => setAgent(name)}
                style={{
                  fontFamily: MONO,
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  border: `1px solid ${agent === name ? '#1E2761' : '#E4E9F2'}`,
                  background: agent === name ? '#EAECF5' : '#FFFFFF',
                  color: agent === name ? '#1E2761' : '#5B6472',
                }}
              >
                {name}
              </span>
            ))}
          </div>
          <div style={{ padding: '18px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
              {stages.map(([name, ver], i) => {
                const has = ver !== '—';
                const isProd = name === 'PROD';
                return (
                  <div key={name} style={{ position: 'relative', padding: '0 6px' }}>
                    {i !== 0 && (
                      <div style={{ position: 'absolute', top: 18, left: -6, right: -6, height: 2, background: has ? '#3D5AFE' : '#E4E9F2' }} />
                    )}
                    <div
                      style={{
                        position: 'relative',
                        background: isProd ? '#EAECF5' : has ? '#FFFFFF' : '#FAFBFE',
                        border: `1.5px solid ${isProd ? '#1E2761' : has ? '#E4E9F2' : '#F0F3F9'}`,
                        borderRadius: 9,
                        padding: '11px 12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: isProd ? '#1E2761' : has ? '#5B6472' : '#A6AFC0', letterSpacing: '.04em' }}>
                        {name}
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 10, color: '#5B6472', marginTop: 4 }}>{ver}</div>
                      <div style={{ fontSize: 9.5, color: has ? '#1B7F4D' : '#A6AFC0', marginTop: 3, fontWeight: 600 }}>
                        {isProd ? 'serving' : has ? 'gates green' : 'empty'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#8A93A6' }}>PROMOTION GATE</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#1B7F4D', background: '#E7F4EC', borderRadius: 999, padding: '2px 8px' }}>
                EVAL ✓ 0.91 ≥ 0.85
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#1B7F4D', background: '#E7F4EC', borderRadius: 999, padding: '2px 8px' }}>MRM ✓</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#1B7F4D', background: '#E7F4EC', borderRadius: 999, padding: '2px 8px' }}>ARB ✓</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#8A6508', background: '#FFF8E6', borderRadius: 999, padding: '2px 8px' }}>
                SECURITY · IN REVIEW
              </span>
              <div style={{ flex: 1 }} />
              <span
                onClick={() => setRolled(true)}
                className="hvr-bg-red"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#C7131F',
                  border: '1px solid #C7131F',
                  borderRadius: 6,
                  padding: '4px 12px',
                  cursor: 'pointer',
                }}
              >
                {rolled ? 'Rolled back ✓' : 'One-click rollback'}
              </span>
            </div>
          </div>
        </div>

        {/* Drift feed */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>DRIFT FINDINGS FEED · P8</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: '#8A93A6' }}>pre-PR blocks listed</span>
          </div>
          {DRIFT.map(([kind, where, what, when, bg, color]) => (
            <div key={where} style={{ padding: '10px 16px', borderBottom: '1px solid #F0F3F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: bg, color }}>{kind}</span>
                <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>{where}</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 9.5, color: '#A6AFC0' }}>{when}</span>
              </div>
              <div style={{ fontSize: 11.5, marginTop: 4, lineHeight: 1.5 }}>{what}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
