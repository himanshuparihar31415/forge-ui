import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

const COLS: [string, string][] = [
  ['TC-2211-01', 'Draft appears after processing'],
  ['TC-2211-02', 'AI-draft label until confirmed'],
  ['TC-2211-03', 'Template conformance'],
  ['TC-2213-01', 'Draft within 120s p95'],
  ['TC-2213-02', 'Delayed state with ETA'],
  ['TC-2215-01', 'Vault write + link'],
  ['TC-2216-01', 'Failure retry, no data loss'],
  ['TC-2217-01', 'Telemetry on filing'],
];

const ROWS: [string, string, number[]][] = [
  ['FRG-1042-1', 'AC-1', [1, 0, 0, 1, 0, 0, 0, 0]],
  ['FRG-1042-1', 'AC-2', [0, 1, 0, 0, 0, 0, 0, 0]],
  ['FRG-1042-2', 'AC-1', [0, 0, 1, 0, 0, 0, 0, 0]],
  ['FRG-1042-2', 'AC-2', [0, 0, 1, 0, 0, 0, 0, 0]],
  ['FRG-1042-3', 'AC-1', [0, 0, 0, 1, 0, 0, 0, 0]],
  ['FRG-1042-3', 'AC-2', [0, 0, 0, 0, 1, 0, 0, 0]],
  ['FRG-1042-4', 'AC-1', [0, 0, 0, 0, 0, 0, 0, 1]],
  ['FRG-1042-5', 'AC-1', [0, 0, 0, 0, 0, 1, 0, 0]],
  ['FRG-1042-5', 'AC-2', [0, 0, 0, 0, 0, 0, 0, 0]],
  ['FRG-1042-6', 'AC-1', [0, 0, 0, 0, 0, 0, 1, 0]],
  ['FRG-1042-7', 'AC-1', [0, 0, 0, 0, 0, 0, 0, 1]],
];

const GRID = '230px repeat(8,1fr) 86px';

export default function S15TraceabilityMatrix() {
  const [uncoveredOnly, setUncoveredOnly] = useState(false);

  const visible = ROWS.filter((r) => !uncoveredOnly || r[2].every((c) => c === 0));
  const colCov = COLS.map((_, i) => ROWS.reduce((a, r) => a + r[2][i], 0));
  const coveredRows = ROWS.filter((r) => r[2].some((c) => c === 1)).length;
  const total = Math.round((coveredRows / ROWS.length) * 100) + '%';

  return (
    <div data-screen-label="S15 · IntelliQA Traceability Matrix" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#6D2E46' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>IntelliQA · Traceability Matrix</h1>
        <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
          FRG-1042 → FRG-1039
        </span>
        <div style={{ flex: 1 }} />
        <span
          onClick={() => setUncoveredOnly((u) => !u)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 11.5,
            fontWeight: 600,
            border: `1px solid ${uncoveredOnly ? '#6D2E46' : '#E4E9F2'}`,
            background: uncoveredOnly ? '#F5EBF0' : '#FFFFFF',
            color: uncoveredOnly ? '#6D2E46' : '#5B6472',
            borderRadius: 6,
            padding: '5px 11px',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: 26, height: 14, borderRadius: 999, background: uncoveredOnly ? '#6D2E46' : '#C9D3E4', position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: uncoveredOnly ? 14 : 2,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(0,0,0,.3)',
                transition: 'left .15s',
              }}
            />
          </span>
          Uncovered only
        </span>
        <span
          className="hvr-bg-fog"
          style={{ fontSize: 11.5, fontWeight: 600, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 6, padding: '5px 11px', cursor: 'pointer' }}
        >
          Export · Confluence
        </span>
        <span
          className="hvr-bg-fog"
          style={{ fontSize: 11.5, fontWeight: 600, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 6, padding: '5px 11px', cursor: 'pointer' }}
        >
          Export · CSV
        </span>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: GRID, borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
          <div style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#8A93A6', display: 'flex', alignItems: 'flex-end' }}>
            STORY · AC ↓ / TEST CASE →
          </div>
          {COLS.map(([id, title]) => (
            <div key={id} title={title} style={{ padding: '10px 4px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: MONO, fontSize: 9.5, color: '#6D2E46', fontWeight: 600 }}>
                {id}
              </span>
            </div>
          ))}
          <div
            style={{
              padding: '10px 12px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.06em',
              color: '#8A93A6',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            COVERAGE
          </div>
        </div>

        {/* Rows */}
        {visible.map((r, ri) => {
          const covered = r[2].some((c) => c === 1);
          return (
            <div
              key={ri + r[0] + r[1]}
              className="hvr-bg-mauve"
              style={{ display: 'grid', gridTemplateColumns: GRID, borderBottom: '1px solid #F0F3F9', background: covered ? 'transparent' : '#FFF5F5' }}
            >
              <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color: '#3D5AFE' }}>{r[0]}</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{r[1]}</span>
              </div>
              {r[2].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0', borderLeft: '1px solid #F7F9FC' }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      background: c ? '#E7F4EC' : covered ? 'transparent' : '#FDEEEF',
                      color: c ? '#1B7F4D' : '#C7131F',
                    }}
                  >
                    {c ? '✓' : covered ? '' : '✗'}
                  </span>
                </div>
              ))}
              <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color: covered ? '#1B7F4D' : '#C7131F' }}>
                  {covered ? '100%' : '0%'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Column coverage footer */}
        <div style={{ display: 'grid', gridTemplateColumns: GRID, background: '#FAFBFE' }}>
          <div style={{ padding: '9px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#8A93A6' }}>TESTS PER COLUMN</div>
          {colCov.map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', borderLeft: '1px solid #F7F9FC' }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: '#5B6472' }}>{v}</span>
            </div>
          ))}
          <div style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: '#1E2761' }}>{total}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 12, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5B6472' }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: '#E7F4EC',
              color: '#1B7F4D',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              fontWeight: 700,
            }}
          >
            ✓
          </span>{' '}
          covered by test
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5B6472' }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: '#FDEEEF',
              color: '#C7131F',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              fontWeight: 700,
            }}
          >
            ✗
          </span>{' '}
          uncovered AC (also raised in the coverage-gap panel)
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, color: '#A6AFC0' }}>Matrix is exported with the release evidence package.</span>
      </div>
    </div>
  );
}
