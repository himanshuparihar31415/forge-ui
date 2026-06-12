import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  onHandoff: () => void;
}

const T: Record<string, [string, string]> = {
  EPIC: ['#EAECF5', '#1E2761'],
  STORY: ['#EEF1FF', '#3D5AFE'],
  NFR: ['#F5EBF0', '#6D2E46'],
};

// [id, type, title, prov, jira]
const ROWS: [string, string, string, string, string][] = [
  ['FRG-1042-E1', 'EPIC', 'Advisor Workstation — Client Meeting Notes AI Summary', 'ai', 'ADVW-2210'],
  ['FRG-1042-1', 'STORY', 'Generate draft summary after each recorded call', 'ai', 'ADVW-2211'],
  ['FRG-1042-2', 'STORY', 'Conform drafts to the standing note template', 'ai', 'ADVW-2212'],
  ['FRG-1042-3', 'STORY', 'Deliver the draft within the latency target', 'edited', 'ADVW-2213'],
  ['FRG-1042-4', 'STORY', 'Review, edit and confirm in under 5 minutes', 'edited', 'ADVW-2214'],
  ['FRG-1042-5', 'STORY', 'File confirmed notes to Document Vault', 'ai', 'ADVW-2215'],
  ['FRG-1042-6', 'STORY', 'Handle processing failure and timeout paths', 'ai', 'ADVW-2216'],
  ['FRG-1042-7', 'STORY', 'Capture adoption and time-saved telemetry', 'ai', 'ADVW-2217'],
  ['NFR-S1', 'NFR', 'PII redaction in transcripts', 'ai', 'ADVW-2218'],
  ['NFR-P1', 'NFR', 'p95 summary latency ≤ 120s', 'ai', 'ADVW-2219'],
  ['NFR-A1', 'NFR', 'WCAG 2.1 AA review flow', 'ai', 'ADVW-2220'],
  ['NFR-O1', 'NFR', 'End-to-end trace per summary', 'ai', 'ADVW-2221'],
];

const validation = (title: string, detail: string) => (
  <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 8, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#E7F4EC',
        color: '#1B7F4D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        flex: 'none',
      }}
    >
      ✓
    </span>
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 10.5, color: '#8A93A6' }}>{detail}</div>
    </div>
  </div>
);

export default function S07ApprovalPublish({ onHandoff }: Props) {
  const [published, setPublished] = useState(false);
  const [reject, setReject] = useState(false);

  return (
    <div data-screen-label="S7 · SpecAI Approval & Publish" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: '#3D5AFE' }} />
          <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>SpecAI · Approval &amp; Publish</h1>
          <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
            FRG-1042
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ background: '#F2F5FA', color: '#5B6472', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 9px' }}>
            READ-ONLY · FINAL REVIEW
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 18, marginLeft: 22 }}>
          All edits consolidated · review time so far 41 min (within ≤90-min target)
        </div>

        {/* Validation strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {validation('Jira schema valid', 'All required ADVW fields present')}
          {validation('NFR coverage 4/4', 'Security · Performance · Accessibility · Observability')}
          {validation('Traceability complete', 'Every story maps to brief §, flags resolved')}
        </div>

        {/* Consolidated list */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>
              PUBLISHING · 1 EPIC · 7 STORIES · 4 NFR STORIES → JIRA ADVW
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10.5, color: '#8A93A6' }}>2 human edits · 6 flags resolved</span>
          </div>
          {ROWS.map(([id, type, title, prov, jira]) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderBottom: '1px solid #F0F3F9' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: '#3D5AFE', width: 92, flex: 'none' }}>{id}</span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: T[type][1], background: T[type][0], borderRadius: 999, padding: '2px 7px', flex: 'none' }}>
                {type}
              </span>
              <span style={{ fontSize: 12.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
              {published && <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#1B7F4D' }}>{jira} ✓</span>}
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  background: prov === 'edited' ? '#F0EDF5' : '#EEF1FF',
                  color: prov === 'edited' ? '#6D2E46' : '#3D5AFE',
                  flex: 'none',
                }}
              >
                {prov === 'edited' ? 'HUMAN-EDITED' : 'AI-DRAFTED'}
              </span>
            </div>
          ))}
        </div>

        {/* HITL approval block / published state */}
        {!published && (
          <div style={{ background: '#FFF8E6', border: '1.5px solid #B8860B', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: '#B8860B',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flex: 'none',
                }}
              >
                ✋
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#5C4404' }}>Human approval gate — story-set publication</div>
                <div style={{ fontSize: 12.5, color: '#7A5E0E', lineHeight: 1.6, marginTop: 5 }}>
                  Approve and publish <strong>1 epic, 7 stories and 4 NFR stories</strong> to Jira project <span style={{ fontFamily: MONO }}>ADVW</span>.
                  This action will be signed with your identity (<span style={{ fontFamily: MONO }}>priya.sharma@lpl.com</span>) and recorded to the
                  audit ledger as gate <span style={{ fontFamily: MONO }}>L-90413</span>. Approval cannot be performed in bulk and cannot be delegated
                  to an agent.
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                  <div
                    onClick={() => {
                      setPublished(true);
                      setReject(false);
                    }}
                    className="hvr-bg-navy"
                    style={{
                      height: 38,
                      padding: '0 20px',
                      borderRadius: 7,
                      background: '#1E2761',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Approve &amp; publish — signed
                  </div>
                  <div
                    onClick={() => setReject((r) => !r)}
                    className="hvr-bg-red"
                    style={{
                      height: 38,
                      padding: '0 18px',
                      borderRadius: 7,
                      border: '1px solid #C7131F',
                      color: '#C7131F',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Reject with reason
                  </div>
                  <div
                    className="hvr-bg-cream2"
                    style={{
                      height: 38,
                      padding: '0 18px',
                      borderRadius: 7,
                      border: '1px solid #B8860B',
                      color: '#8A6508',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Return to editing
                  </div>
                </div>
                {reject && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      placeholder="Rejection reason (required) — recorded to the ledger and returned to the SpecAI workspace…"
                      style={{
                        width: '100%',
                        height: 64,
                        border: '1px solid #E8D9A8',
                        borderRadius: 7,
                        padding: '9px 12px',
                        fontSize: 12,
                        fontFamily: SANS,
                        resize: 'none',
                        outline: 'none',
                        background: '#FFFFFF',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {published && (
          <div style={{ background: '#FFFFFF', border: '1.5px solid #1B7F4D', borderRadius: 10, padding: '18px 20px', animation: 'pubIn .25s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: '#1B7F4D',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flex: 'none',
                }}
              >
                ✓
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1B7F4D' }}>Published to Jira ADVW — gate approved &amp; signed</div>
                <div style={{ fontSize: 12.5, color: '#5B6472', lineHeight: 1.6, marginTop: 5 }}>
                  Signed <span style={{ fontFamily: MONO }}>priya.sharma@lpl.com</span> · just now · ledger entry{' '}
                  <span style={{ fontFamily: MONO }}>L-90413</span>. Every Jira issue carries the session ID and provenance chip in its description. 12
                  issues created: <span style={{ fontFamily: MONO, color: '#1B7F4D' }}>ADVW-2210 … ADVW-2221 ✓</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <div
                    onClick={onHandoff}
                    className="hvr-bg-blue"
                    style={{
                      height: 38,
                      padding: '0 20px',
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
                    Hand off to Architect →
                  </div>
                  <div
                    onClick={() => setPublished(false)}
                    className="hvr-bg-grey"
                    style={{
                      height: 38,
                      padding: '0 18px',
                      borderRadius: 7,
                      border: '1px solid #E4E9F2',
                      color: '#5B6472',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Demo: reset to pending
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ fontSize: 10.5, color: '#A6AFC0', marginTop: 14, textAlign: 'center' }}>
          Approval actions always open this full review context — one-click approval from lists is deliberately not provided.
        </div>
      </div>
    </div>
  );
}
