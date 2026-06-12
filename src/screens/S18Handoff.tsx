import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

// [name, role, iam, initials, qualified, note]
const TARGETS: [string, string, string, string, boolean, string][] = [
  ['A. Verma', 'Solution Architect', 'LPL-ARCH', 'AV', true, 'qualified ✓'],
  ['L. Moreau', 'Solution Architect', 'LPL-ARCH', 'LM', true, 'qualified ✓'],
  ['M. Chen', 'UX Researcher', 'LPL-UIUX', 'MC', true, 'qualified ✓'],
  ['D. Patel', 'Senior Developer', 'LPL-DEV', 'DP', false, 'not stage-qualified'],
];

const PKG: [string, string][] = [
  ['Story set · 1 epic, 7 stories, 4 NFR', '12 items'],
  ['Edit trail · every tracked change', '9 events'],
  ['Ambiguity flags + resolutions', '6 flags'],
  ['Decision log', '4 decisions'],
  ['Source brief + link', 'ADVW/417'],
  ['Cost & trace bundle', '$1.84 · trc-8841f2'],
];

type Phase = 'compose' | 'sent' | 'accepted';

export default function S18Handoff() {
  const [phase, setPhase] = useState<Phase>('compose');
  const [target, setTarget] = useState('A. Verma');

  return (
    <div data-screen-label="S18 · Handoff" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Handoff</h1>
          <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
            FRG-1042
          </span>
          <span style={{ fontSize: 12.5, color: '#5B6472' }}>Definition → Design · from P. Sharma (PM)</span>
        </div>
        <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 18 }}>
          Context moves whole — artifacts, edit trail, open flags and decisions travel together. Exit criterion B5 evidence is generated
          automatically.
        </div>

        {phase === 'compose' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14, alignItems: 'start' }}>
            {/* Target persona */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 4 }}>TARGET PERSONA</div>
              <div style={{ fontSize: 10.5, color: '#8A93A6', marginBottom: 12 }}>Filtered to roles qualified for the Design stage.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TARGETS.map(([name, role, iam, initials, ok, note]) => (
                  <div
                    key={name}
                    onClick={() => ok && setTarget(name)}
                    title={ok ? undefined : 'Design stage requires Architect or UX role'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      border: `1.5px solid ${target === name && ok ? '#3D5AFE' : '#E4E9F2'}`,
                      background: target === name && ok ? '#F5F8FE' : '#FFFFFF',
                      borderRadius: 8,
                      padding: '10px 12px',
                      cursor: ok ? 'pointer' : 'not-allowed',
                      opacity: ok ? 1 : 0.55,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#EEF1FF',
                        color: '#1E2761',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        flex: 'none',
                      }}
                    >
                      {initials}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</div>
                      <div style={{ fontSize: 10.5, color: '#8A93A6' }}>
                        {role} · IAM {iam}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: ok ? '#1B7F4D' : '#A6AFC0' }}>{note}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 7 }}>NOTE · OPTIONAL</div>
                <textarea
                  placeholder="Anything the architect should look at first…"
                  defaultValue="Flag #3 resolution assumes the existing records API — please sanity-check capacity before conformance run."
                  style={{
                    width: '100%',
                    height: 62,
                    border: '1px solid #E4E9F2',
                    borderRadius: 7,
                    padding: '9px 11px',
                    fontSize: 12,
                    fontFamily: SANS,
                    resize: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Context package */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>CONTEXT PACKAGE · NOTHING IS DROPPED</span>
                <div style={{ flex: 1 }} />
                <span style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}>
                  COMPLETE ✓
                </span>
              </div>
              {PKG.map(([name, meta]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #F0F3F9' }}>
                  <span
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: '50%',
                      background: '#E7F4EC',
                      color: '#1B7F4D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 700,
                      flex: 'none',
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: 12, flex: 1 }}>{name}</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{meta}</span>
                </div>
              ))}
              <div
                onClick={() => setPhase('sent')}
                className="hvr-bg-blue"
                style={{
                  marginTop: 14,
                  height: 38,
                  borderRadius: 7,
                  background: '#3D5AFE',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Send handoff to A. Verma
              </div>
              <div style={{ fontSize: 10.5, color: '#A6AFC0', marginTop: 8, textAlign: 'center' }}>
                Lands in the recipient's Command Center · "Needs my action"
              </div>
            </div>
          </div>
        )}

        {/* Receipt view */}
        {phase !== 'compose' && (
          <div style={{ animation: 'hoIn .25s ease' }}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E4E9F2',
                borderRadius: 10,
                padding: 16,
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#E7F4EC',
                  color: '#1B7F4D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flex: 'none',
                }}
              >
                ✓
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1B7F4D' }}>Handoff sent · waiting for acceptance</div>
                <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 2 }}>
                  A. Verma was notified in-app and by email · SLA 24h · you keep read access throughout.
                </div>
              </div>
              <span onClick={() => setPhase('compose')} className="hvr-underline" style={{ fontSize: 11, color: '#8A93A6', cursor: 'pointer' }}>
                demo: reset
              </span>
            </div>

            {/* Recipient side */}
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6', marginBottom: 10 }}>RECIPIENT VIEW · A. VERMA</div>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #B8860B', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <span
                  style={{
                    background: '#FFF8E6',
                    border: '1px solid #B8860B',
                    color: '#8A6508',
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 999,
                    padding: '2px 8px',
                  }}
                >
                  HANDOFF REQUEST
                </span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: '#5B6472' }}>FRG-1042 · Definition → Design</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10.5, color: '#8A93A6' }}>IAM role re-verified: LPL-ARCH ✓</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#5B6472', lineHeight: 1.6, marginBottom: 12 }}>
                "Flag #3 resolution assumes the existing records API — please sanity-check capacity before conformance run." — P. Sharma
              </div>
              {phase === 'sent' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <div
                    onClick={() => setPhase('accepted')}
                    className="hvr-bg-navy"
                    style={{
                      height: 36,
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
                    Accept handoff
                  </div>
                  <div
                    className="hvr-bg-red"
                    style={{
                      height: 36,
                      padding: '0 16px',
                      borderRadius: 7,
                      border: '1px solid #C7131F',
                      color: '#C7131F',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Decline with reason
                  </div>
                </div>
              )}
              {phase === 'accepted' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#E7F4EC',
                    border: '1px solid #BFE3CD',
                    borderRadius: 8,
                    padding: '11px 14px',
                    animation: 'hoIn .25s ease',
                  }}
                >
                  <span style={{ fontSize: 14 }}>✓</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1B7F4D' }}>Context restored — zero loss verified ✓</div>
                    <div style={{ fontSize: 11, color: '#5B6472', marginTop: 2 }}>
                      All 6 package items checked against source hashes · evidence attached to exit criterion B5 · ledger #L-90414.
                    </div>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>handoff #38 of WF-B</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
