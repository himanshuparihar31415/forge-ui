import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  openInspector: () => void;
}

// [name, detail, ref, green]
const CHECKS: [string, string, string, boolean][] = [
  ['Stories approved & published', '1 epic · 7 stories · 4 NFR → Jira ADVW', 'L-90413', true],
  ['Tests passed', '41/41 generated + regression green in LPL test infra', 'run #2214', true],
  ['Regression suite green', 'REG-ADVW-CORE · 118 tests · 14m 02s', 'run #2215', true],
  ['Conformance report published', '12 findings dispositioned · ARCH space', 'L-90471', true],
  ['Deploy-seed reviewed', 'Awaiting developer review of feature flag + seed', 'ADVW-2214-2', false],
  ['Change-failure risk acceptable', '0.91× baseline — under 1.0× threshold', 'model v2', true],
];

export default function S16ReleaseReadiness({ openInspector }: Props) {
  const [notes, setNotes] = useState(false);

  return (
    <div data-screen-label="S16 · ReleasePulse Release Readiness" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#1E2761' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>ReleasePulse · Release Readiness</h1>
        <span style={{ fontSize: 12.5, color: '#5B6472' }}>Feature set: Client Meeting Notes AI Summary · Advisor Workstation 2026.07</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: '#8A93A6', border: '1px dashed #C9D3E4', borderRadius: 5, padding: '3px 8px' }}>
          agent composition assumed — thin in RFP
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, alignItems: 'start' }}>
        {/* Readiness checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>READINESS CHECKLIST</span>
              <div style={{ flex: 1 }} />
              <span style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 9px' }}>
                5 OF 6 GREEN
              </span>
            </div>
            {CHECKS.map(([name, detail, ref, green]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid #F0F3F9' }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: green ? '#E7F4EC' : '#FBF6E6',
                    color: green ? '#1B7F4D' : '#8A6508',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    flex: 'none',
                  }}
                >
                  {green ? '✓' : '…'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#8A93A6', marginTop: 1 }}>{detail}</div>
                </div>
                <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>{ref}</span>
              </div>
            ))}
          </div>

          {/* Release notes draft */}
          {!notes && (
            <div
              onClick={() => setNotes(true)}
              className="hvr-bc-blue"
              style={{
                background: '#FFFFFF',
                border: '1px dashed #C9D3E4',
                borderRadius: 10,
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#EEF1FF',
                  color: '#3D5AFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  flex: 'none',
                }}
              >
                ✦
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1E2761' }}>Generate release notes draft</div>
                <div style={{ fontSize: 11, color: '#8A93A6', marginTop: 2 }}>
                  release-notes v0.8.2 drafts from approved stories + PRs · opens side-by-side review → approval
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#3D5AFE', fontWeight: 600 }}>Generate →</span>
            </div>
          )}
          {notes && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>RELEASE NOTES · DRAFT</span>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#3D5AFE', background: '#EEF1FF', borderRadius: 999, padding: '2px 7px' }}>
                  AI-DRAFTED · AWAITING REVIEW
                </span>
                <div style={{ flex: 1 }} />
                <span className="hvr-underline" style={{ fontSize: 11, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
                  Open side-by-side review →
                </span>
              </div>
              <div style={{ padding: '14px 16px', fontSize: 12.5, lineHeight: 1.7, color: '#5B6472' }}>
                <strong style={{ color: '#1E2761' }}>Advisor Workstation 2026.07 — Client Meeting Notes AI Summary.</strong> After each recorded
                client call, a draft meeting summary now appears on the meeting record within 2 minutes. Advisors review, edit and confirm; confirmed
                notes file to Document Vault automatically. Includes PII-redacted processing, full audit trace per summary, and delayed-state handling
                — no silent failures.
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Workflow C lane */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>WORKFLOW C LANE · DEFECTS &amp; HOTFIXES</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ border: '1px solid #F0F3F9', borderRadius: 8, padding: '11px 13px' }}>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: '#1E2761' }}>4</div>
                <div style={{ fontSize: 10.5, color: '#5B6472', marginTop: 2 }}>open defects in feature set</div>
                <div style={{ fontSize: 10, color: '#8A93A6', marginTop: 3 }}>0 critical · 1 high · 3 medium</div>
              </div>
              <div style={{ border: '1px solid #F0F3F9', borderRadius: 8, padding: '11px 13px' }}>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: '#1E2761' }}>
                  3<span style={{ fontSize: 13, color: '#8A93A6' }}>/5</span>
                </div>
                <div style={{ fontSize: 10.5, color: '#5B6472', marginTop: 2 }}>hotfix-tagged sessions</div>
                <div style={{ fontSize: 10, color: '#8A93A6', marginTop: 3 }}>toward Phase-1 exit evidence</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              <div
                onClick={openInspector}
                className="hvr-bg-row"
                style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #F0F3F9', borderRadius: 7, padding: '7px 11px', cursor: 'pointer' }}
              >
                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color: '#3D5AFE' }}>FRG-1031</span>
                <span style={{ fontSize: 11.5, flex: 1 }}>Vault retry storm under records-API brownout</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#C7131F', background: '#FDEEEF', borderRadius: 999, padding: '1px 6px' }}>HOTFIX</span>
              </div>
              <div
                onClick={openInspector}
                className="hvr-bg-row"
                style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #F0F3F9', borderRadius: 7, padding: '7px 11px', cursor: 'pointer' }}
              >
                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color: '#3D5AFE' }}>FRG-1027</span>
                <span style={{ fontSize: 11.5, flex: 1 }}>Summary chip overlaps long attendee lists</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#8A6508', background: '#FBF6E6', borderRadius: 999, padding: '1px 6px' }}>WF-C</span>
              </div>
            </div>
          </div>

          {/* Risk + latency trend */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 10 }}>
              CHANGE-FAILURE RISK VS BASELINE
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: '#1B7F4D' }}>0.91×</span>
              <span style={{ fontSize: 11, color: '#8A93A6' }}>baseline · modeled from change size, test depth, drift findings</span>
            </div>
            <div style={{ borderTop: '1px solid #F0F3F9', marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>RELEASE LATENCY TREND</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: '#8A93A6' }}>priority-2 KPI</span>
              </div>
              <svg width="100%" height="46" viewBox="0 0 220 46" preserveAspectRatio="none">
                <polyline points="0,12 31,15 62,14 93,20 124,24 155,28 186,31 217,34" fill="none" stroke="#1B7F4D" strokeWidth="1.8" />
                <line x1="0" y1="22" x2="220" y2="22" stroke="#C9D3E4" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
              <div style={{ display: 'flex', fontSize: 10, color: '#8A93A6' }}>
                <span>baseline 18.5d</span>
                <div style={{ flex: 1 }} />
                <span style={{ color: '#1B7F4D', fontWeight: 600 }}>current 14.2d · ↓23%</span>
              </div>
            </div>
          </div>

          {/* HITL */}
          <div style={{ background: '#FFF8E6', border: '1.5px solid #B8860B', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#5C4404' }}>Release sign-off gate</div>
            <div style={{ fontSize: 11, color: '#7A5E0E', marginTop: 3, lineHeight: 1.55 }}>
              Blocked: 1 readiness item amber (deploy-seed review). Sign-off opens when all six are green — signed by the release manager, recorded to
              the ledger.
            </div>
            <div
              style={{
                height: 34,
                marginTop: 10,
                borderRadius: 7,
                background: '#E4E9F2',
                color: '#A6AFC0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'not-allowed',
              }}
            >
              Approve release — blocked
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
