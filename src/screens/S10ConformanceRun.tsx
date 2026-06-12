import { useEffect, useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  onRun: () => void;
}

const STEPS: [string, string][] = [
  ['Fetching inputs', 'SyDD · SD · repo @ a3f9c12'],
  ['Analyzing implementation vs design intent', '212 files · 41 SD sections'],
  ['Drafting findings with traceability refs', 'severity + remediation per finding'],
];

const PATTERNS: [string, string][] = [
  ['ARB-approved patterns v3.2', 'current · 48 patterns'],
  ['ARB-approved patterns v3.1', 'previous · 46 patterns'],
  ['Integration patterns only', 'subset · INT-01…INT-12'],
];

export default function S10ConformanceRun({ onRun }: Props) {
  const [asBuilt, setAsBuilt] = useState(false);
  const [pattern, setPattern] = useState('ARB-approved patterns v3.2');
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    if (phase < 0 || phase >= 3) return;
    const t = window.setTimeout(() => setPhase((p) => p + 1), 1600);
    return () => window.clearTimeout(t);
  }, [phase]);

  const complete = phase >= 3;

  return (
    <div data-screen-label="S10 · Architect Hub Conformance Run" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: '#B8860B' }} />
          <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Architect Hub · Conformance Run</h1>
          <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
            FRG-1036
          </span>
          <span style={{ background: '#FBF6E6', color: '#8A6508', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}>WF-A · DESIGN</span>
        </div>
        <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 18, marginLeft: 22 }}>
          Compare system design intent (SyDD/SD) against the implementation — findings land in the review queue.
        </div>

        {/* Inputs */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '18px 20px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 12 }}>INPUTS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div
              style={{
                border: `1px solid ${asBuilt ? '#B8860B' : '#E4E9F2'}`,
                borderRadius: 8,
                padding: '12px 14px',
                background: asBuilt ? '#FBF6E6' : '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#5B6472' }}>SyDD · SYSTEM DESIGN DOC</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>Confluence picker</span>
              </div>
              {!asBuilt && (
                <>
                  <div style={{ fontFamily: MONO, fontSize: 12, color: '#1E2761' }}>ARCH/SyDD-AdvisorWorkstation-v4.1</div>
                  <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 3 }}>last updated 2025-11-03 · A. Verma</div>
                </>
              )}
              {asBuilt && (
                <>
                  <div style={{ fontSize: 12, color: '#8A6508', fontWeight: 600 }}>Will generate as-built draft from code</div>
                  <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 3 }}>Workflow-A path — draft SyDD published for review after the run</div>
                </>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, borderTop: '1px dashed #E4E9F2', paddingTop: 9 }}>
                <span
                  onClick={() => setAsBuilt((a) => !a)}
                  style={{
                    width: 30,
                    height: 17,
                    borderRadius: 999,
                    background: asBuilt ? '#B8860B' : '#C9D3E4',
                    position: 'relative',
                    cursor: 'pointer',
                    flex: 'none',
                    transition: 'background .15s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: asBuilt ? 15 : 2,
                      width: 13,
                      height: 13,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,.25)',
                      transition: 'left .15s',
                    }}
                  />
                </span>
                <span style={{ fontSize: 11, color: '#5B6472' }}>No current SyDD? Generate as-built draft from code</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ border: '1px solid #E4E9F2', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#5B6472' }}>SD · SOLUTION DESIGN</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: 10, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>Confluence picker</span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: '#1E2761' }}>ARCH/SD-TradeNotifications-v2.0</div>
                <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 3 }}>last updated 2026-01-19 · A. Verma</div>
              </div>
              <div style={{ border: '1px solid #E4E9F2', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#5B6472' }}>REPOSITORY · BRANCH</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: 10, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>GitHub picker</span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: '#1E2761' }}>lpl/advisor-workstation · main</div>
                <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 3 }}>
                  read-only clone inside LPL AWS · HEAD <span style={{ fontFamily: MONO }}>a3f9c12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pattern set */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '18px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>PATTERN SET</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: '#8A93A6' }}>checked against every finding</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {PATTERNS.map(([name, meta]) => (
              <div
                key={name}
                onClick={() => setPattern(name)}
                className="hvr-bc-gold"
                style={{
                  border: `1.5px solid ${pattern === name ? '#B8860B' : '#E4E9F2'}`,
                  background: pattern === name ? '#FBF6E6' : '#FFFFFF',
                  borderRadius: 8,
                  padding: '11px 13px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1E2761' }}>{name}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6', marginTop: 3 }}>{meta}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Run / progress */}
        {phase < 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              onClick={() => setPhase(0)}
              className="hvr-op92"
              style={{
                height: 40,
                padding: '0 24px',
                borderRadius: 8,
                background: '#B8860B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Run conformance analysis
            </div>
            <span style={{ fontSize: 11, color: '#8A93A6' }}>~4 min on this repo size · estimated $2.10 · conformance v0.9.4</span>
          </div>
        )}

        {phase >= 0 && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              {!complete && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    border: '2px solid #F0E3C0',
                    borderTopColor: '#B8860B',
                    borderRadius: '50%',
                    animation: 'spinrun .8s linear infinite',
                  }}
                />
              )}
              {complete && (
                <span
                  style={{
                    display: 'flex',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#E7F4EC',
                    color: '#1B7F4D',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1E2761' }}>
                {complete ? 'Run complete — conformance v0.9.4' : 'Running conformance analysis…'}
              </span>
              <div style={{ flex: 1 }} />
              <span className="hvr-underline" style={{ fontFamily: MONO, fontSize: 10.5, color: '#3D5AFE', cursor: 'pointer' }}>
                live trace · langfuse trc-91d4a7 ↗
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {STEPS.map(([label, detail], i) => {
                const done = phase > i;
                const active = phase === i;
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 9.5,
                        fontWeight: 700,
                        background: done ? '#E7F4EC' : active ? '#FBF6E6' : '#F2F5FA',
                        color: done ? '#1B7F4D' : active ? '#8A6508' : '#A6AFC0',
                        flex: 'none',
                      }}
                    >
                      {done ? '✓' : String(i + 1)}
                    </span>
                    <span style={{ fontSize: 12.5, color: done || active ? '#2A2F3A' : '#A6AFC0', fontWeight: active ? 600 : 400 }}>{label}</span>
                    <span style={{ flex: 1, borderBottom: '1px dashed #F0F3F9' }} />
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#8A93A6' }}>{done ? detail : active ? 'in progress…' : 'queued'}</span>
                  </div>
                );
              })}
            </div>
            {complete && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, borderTop: '1px solid #F0F3F9', paddingTop: 14 }}>
                <span style={{ fontSize: 12.5, color: '#1B7F4D', fontWeight: 600 }}>
                  12 findings drafted — 5 discrepancies · 4 omissions · 3 deviations
                </span>
                <div style={{ flex: 1 }} />
                <div
                  onClick={() => setPhase(0)}
                  className="hvr-bg-grey"
                  style={{
                    height: 34,
                    padding: '0 14px',
                    borderRadius: 7,
                    border: '1px solid #E4E9F2',
                    color: '#5B6472',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Re-run
                </div>
                <div
                  onClick={onRun}
                  className="hvr-bg-navy"
                  style={{
                    height: 34,
                    padding: '0 18px',
                    borderRadius: 7,
                    background: '#1E2761',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Review findings →
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
