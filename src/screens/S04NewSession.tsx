import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  onCreate: () => void;
}

type Wf = 'A' | 'B' | 'C';

const WF_DEFS: [Wf, string, string][] = [
  ['A', 'Existing App Upgrade', 'Framework, language, dependency and security remediation on an existing codebase.'],
  ['B', 'New Feature', 'Brief to production-ready stories, scaffolding, tests and release notes for net-new capability.'],
  ['C', 'Bug Fix / Hotfix', 'Defect-driven flow with optional expedited hotfix path and post-hoc review.'],
];

const LINE_DEFS: [string, string, number][] = [
  ['Advisor Workstation', 'ADVW', 41],
  ['Client Onboarding', 'CONB', 28],
  ['Trading & Rebalancing', 'TRRB', 17],
];

const STAGE_DEFS: [string, boolean, string][] = [
  ['Definition', true, 'Brief → stories'],
  ['Design', true, 'Research & architecture'],
  ['Build', false, 'Requires Developer'],
  ['Test', false, 'Requires QA'],
  ['Release', true, 'Readiness & notes'],
];

const SOURCE_DEFS: [string, string, string, string][] = [
  ['confluence', 'C', 'Link Confluence page', 'Pull a charter or PRD straight from an LPL Confluence space.'],
  ['paste', '¶', 'Paste charter text', 'Paste the brief; Forge keeps the verbatim source for traceability.'],
  ['upload', '↑', 'Upload document', 'DOCX or PDF. Parsed, indexed, and linked as the source artifact.'],
  ['chat', '✎', 'Describe in chat', 'Draft the brief conversationally; ambiguity flags appear as you type.'],
];

const WF_NAME: Record<Wf, string> = { A: 'Existing App Upgrade', B: 'New Feature', C: 'Bug Fix / Hotfix' };
const JIRA: Record<string, string> = { 'Advisor Workstation': 'ADVW', 'Client Onboarding': 'CONB', 'Trading & Rebalancing': 'TRRB' };

export default function S04NewSession({ onCreate }: Props) {
  const [step, setStep] = useState(1);
  const [wf, setWf] = useState<Wf>('B');
  const [hotfix, setHotfix] = useState(false);
  const [line, setLine] = useState('Advisor Workstation');
  const [stage, setStage] = useState('Definition');
  const [source, setSource] = useState('confluence');

  const steps: [number, string][] = [
    [1, 'Workflow'],
    [2, 'Product line'],
    [3, 'Entry stage'],
    [4, 'Intake source'],
  ];

  return (
    <div data-screen-label="S4 · New Session" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
          <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>New Session</h1>
          <span style={{ fontSize: 12.5, color: '#5B6472' }}>
            A session ID is minted on creation and becomes the audit spine for everything produced.
          </span>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '18px 0 22px' }}>
          {steps.map(([n, label], i) => {
            const done = step > n;
            const active = step === n;
            return (
              <span key={n} style={{ display: 'contents' }}>
                <div onClick={() => n < step && setStep(n)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      background: active ? '#3D5AFE' : done ? '#E7F4EC' : '#FFFFFF',
                      color: active ? '#FFFFFF' : done ? '#1B7F4D' : '#8A93A6',
                      border: `1.5px solid ${active ? '#3D5AFE' : done ? '#1B7F4D' : '#E4E9F2'}`,
                    }}
                  >
                    {done ? '✓' : String(n)}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: active ? '#1E2761' : '#8A93A6', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i !== 3 && <div style={{ width: 42, height: 1.5, background: '#E4E9F2', margin: '0 12px' }} />}
              </span>
            );
          })}
        </div>

        {/* STEP 1 · Workflow */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {WF_DEFS.map(([code, name, desc]) => {
              const sel = wf === code;
              return (
                <div
                  key={code}
                  onClick={() => setWf(code)}
                  className="hvr-bc-blue"
                  style={{
                    background: '#FFFFFF',
                    border: `1.5px solid ${sel ? '#3D5AFE' : '#E4E9F2'}`,
                    borderRadius: 10,
                    padding: 18,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `1.5px solid ${sel ? '#3D5AFE' : '#C9D3E4'}`,
                      background: sel ? '#3D5AFE' : '#FFFFFF',
                      boxShadow: 'inset 0 0 0 3px #FFFFFF',
                    }}
                  />
                  <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: '#5B6472', marginBottom: 8 }}>WORKFLOW {code}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: '#1E2761', marginBottom: 6 }}>{name}</div>
                  <div style={{ fontSize: 12, color: '#5B6472', lineHeight: 1.5 }}>{desc}</div>
                  {code === 'C' && (
                    <div style={{ display: 'flex', marginTop: 12, borderTop: '1px solid #E4E9F2', paddingTop: 10, alignItems: 'center', gap: 8 }}>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setHotfix((h) => !h);
                          setWf('C');
                        }}
                        style={{
                          width: 30,
                          height: 17,
                          borderRadius: 999,
                          background: hotfix ? '#3D5AFE' : '#C9D3E4',
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
                            left: hotfix ? 15 : 2,
                            width: 13,
                            height: 13,
                            borderRadius: '50%',
                            background: '#FFFFFF',
                            boxShadow: '0 1px 3px rgba(0,0,0,.25)',
                            transition: 'left .15s',
                          }}
                        />
                      </span>
                      <span style={{ fontSize: 11.5, color: '#5B6472' }}>Hotfix — expedited gates, post-hoc review</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 2 · Product line + Jira */}
        {step === 2 && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#5B6472', marginBottom: 10 }}>Product line</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              {LINE_DEFS.map(([name, jira, sessions]) => (
                <div
                  key={name}
                  onClick={() => setLine(name)}
                  className="hvr-bc-blue"
                  style={{
                    border: `1.5px solid ${line === name ? '#3D5AFE' : '#E4E9F2'}`,
                    background: line === name ? '#F5F8FE' : '#FFFFFF',
                    borderRadius: 8,
                    padding: '12px 14px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E2761' }}>{name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, color: '#8A93A6', marginTop: 3 }}>
                    Jira {jira} · {sessions} sessions to date
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#5B6472', marginBottom: 8 }}>Jira binding</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: '1px solid #E4E9F2',
                borderRadius: 8,
                padding: '10px 14px',
                background: '#FAFBFE',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1B7F4D' }} />
              <span style={{ fontSize: 12.5 }}>
                Connected as <span style={{ fontFamily: MONO, fontSize: 11.5 }}>forge-svc@lpl.com</span> · project{' '}
                <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600 }}>{JIRA[line]}</span>
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>Change</span>
            </div>
          </div>
        )}

        {/* STEP 3 · Entry stage */}
        {step === 3 && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#5B6472', marginBottom: 4 }}>Entry stage</div>
            <div style={{ fontSize: 11.5, color: '#8A93A6', marginBottom: 14 }}>
              Filtered to your qualified stages. You are signed in as <strong>Priya Sharma · Product Manager</strong> (IAM LPL-PM).
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
              {STAGE_DEFS.map(([name, ok, note]) => {
                const sel = stage === name;
                return (
                  <div
                    key={name}
                    onClick={() => ok && setStage(name)}
                    title={ok ? undefined : "Not in your persona's qualified entry stages — IAM role LPL-PM"}
                    className="hvr-bc-grey"
                    style={{
                      border: `1.5px solid ${sel ? '#3D5AFE' : '#E4E9F2'}`,
                      background: !ok ? '#FAFBFE' : sel ? '#F5F8FE' : '#FFFFFF',
                      borderRadius: 8,
                      padding: '14px 12px',
                      cursor: ok ? 'pointer' : 'not-allowed',
                      opacity: ok ? 1 : 0.75,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: ok ? '#1E2761' : '#A6AFC0' }}>{name}</div>
                    <div style={{ fontSize: 10, color: '#8A93A6', marginTop: 4 }}>{note}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4 · Intake source */}
        {step === 4 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {SOURCE_DEFS.map(([id, glyph, name, desc]) => (
                <div
                  key={id}
                  onClick={() => setSource(id)}
                  className="hvr-bc-blue"
                  style={{
                    background: '#FFFFFF',
                    border: `1.5px solid ${source === id ? '#3D5AFE' : '#E4E9F2'}`,
                    borderRadius: 10,
                    padding: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: '#EEF1FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      color: '#3D5AFE',
                      fontWeight: 700,
                      flex: 'none',
                    }}
                  >
                    {glyph}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1E2761' }}>{name}</div>
                    <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 3, lineHeight: 1.45 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {source === 'confluence' && (
              <div style={{ marginTop: 12 }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 8 }}>CONFLUENCE PAGE</div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      border: '1px solid #E4E9F2',
                      borderRadius: 7,
                      padding: '9px 12px',
                      background: '#FAFBFE',
                    }}
                  >
                    <span style={{ fontFamily: MONO, fontSize: 12, color: '#3D5AFE' }}>confluence.lpl.com/ADVW/417</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}>
                      REACHABLE ✓
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 8 }}>
                    "Client Meeting Notes — AI Summary" · charter, 1,840 words · last edited 2d ago by R. Osborne
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
          {step > 1 && (
            <div
              onClick={() => setStep((s) => s - 1)}
              className="hvr-bg-grey"
              style={{
                height: 36,
                padding: '0 18px',
                borderRadius: 7,
                border: '1px solid #E4E9F2',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: '#2A2F3A',
                cursor: 'pointer',
              }}
            >
              Back
            </div>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 11.5, color: '#8A93A6', marginRight: 6 }}>
            WF-{wf} · {WF_NAME[wf]} · {line} · entry at {stage}
          </div>
          <div
            onClick={() => {
              if (step < 4) setStep((s) => s + 1);
              else onCreate();
            }}
            className="hvr-bg-blue"
            style={{
              height: 36,
              padding: '0 22px',
              borderRadius: 7,
              background: '#3D5AFE',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {step < 4 ? 'Continue' : 'Create session → SpecAI'}
          </div>
        </div>
        <div style={{ fontSize: 10.5, color: '#A6AFC0', marginTop: 12, textAlign: 'right' }}>
          Creating a session mints a session ID, opens an audit ledger entry, and routes you to the owning module.
        </div>
      </div>
    </div>
  );
}
