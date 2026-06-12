import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

type TabId = 'audit' | 'gates' | 'analytics' | 'policies';

const KIND: Record<string, [string, string]> = {
  ARTIFACT: ['#EEF1FF', '#3D5AFE'],
  GATE: ['#FFF8E6', '#8A6508'],
  EDIT: ['#F0EDF5', '#6D2E46'],
  SYS: ['#F2F5FA', '#5B6472'],
};

// [time, what, kind, meta, dot]
const TIMELINE: [string, string, keyof typeof KIND, string, string][] = [
  ['14:21', 'Story FRG-1042-3 AC-2 edited by reviewer', 'EDIT', 'editor priya.sharma@lpl.com · field acceptance_criteria[1] · diff stored · #L-90412.3', '#6D2E46'],
  ['14:02', 'Story set artifact sealed', 'ARTIFACT', 'model lpl-bedrock/claude-3-7 · prompts req-gen-prompts@2.4.0 · temp 0.3 · seed 8841 · trace trc-8841f2', '#3D5AFE'],
  ['14:01', 'Quality self-score recorded', 'SYS', 'predicted 3.8/5 · calibration v2 · stored for KPI baseline', '#5B6472'],
  ['13:59', 'Gate: ambiguity review — APPROVED', 'GATE', 'signer priya.sharma@lpl.com · IAM LPL-PM verified · ledger #L-90412', '#B8860B'],
  ['13:31', 'Ambiguity flags artifact created', 'ARTIFACT', '6 flags (3 blocking) · model lpl-bedrock/claude-3-7 · prompts@2.4.0 · trace trc-8841f2.2', '#3D5AFE'],
  ['13:24', 'Source brief ingested', 'SYS', 'confluence ADVW/417 · sha256 9f31…c2a8 · verbatim copy retained', '#5B6472'],
  ['13:22', 'Session FRG-1042 created', 'SYS', 'creator priya.sharma@lpl.com · WF-B · entry stage Definition · product line ADVW', '#5B6472'],
];

// [name, a, b, c, signer]
const GATES: [string, string, string, string, string][] = [
  ['Story set → Jira', 'REQ', 'REQ', 'REQ', 'PM'],
  ['Conformance report → Confluence', 'REQ', 'REQ', '—', 'Architect'],
  ['Scaffolding → draft PR', 'AUTO', 'AUTO', 'AUTO', 'developer review in GitHub'],
  ['Tests → repo commit', 'REQ', 'REQ', 'DEFER', 'QA (hotfix: post-hoc 24h)'],
  ['Release notes → publish', 'REQ', 'REQ', 'REQ', 'Release manager'],
  ['Release sign-off', 'REQ', 'REQ', 'REQ', 'Release manager'],
  ['Agent version promotion', 'REQ', 'REQ', 'REQ', 'Admin + ARB + MRM'],
];

// [label, count, color]
const HIST: [string, number, string][] = [
  ['<15m', 14, '#1B7F4D'],
  ['15–30m', 22, '#1B7F4D'],
  ['30–60m', 34, '#1B7F4D'],
  ['60–90m', 26, '#1B7F4D'],
  ['90m–2h', 12, '#B8860B'],
  ['2–4h', 8, '#B8860B'],
  ['4–8h', 4, '#C7131F'],
  ['>8h', 2, '#C7131F'],
];

// [reason, n, pct, w]
const PARETO: [string, number, string, string][] = [
  ['ACs not specific enough', 19, '38%', '95%'],
  ['Scope creep vs brief', 11, '22%', '55%'],
  ['Missing NFR linkage', 8, '16%', '40%'],
  ['Wrong Jira fields/labels', 7, '14%', '35%'],
  ['Other', 5, '10%', '25%'],
];

const BUNDLES: [string, string, string][] = [
  ['forge-egress-zero', 'No data leaves LPL AWS — model, tools, storage', 'v1.4.0'],
  ['forge-github-guard', 'Draft PR only · main branch writes forbidden', 'v1.2.1'],
  ['forge-approval-gates', 'Artifact-class gate matrix enforcement', 'v2.0.0'],
  ['forge-persona-envelope', 'Stage entry by IAM persona mapping', 'v1.1.3'],
];

const DENIALS: [string, string, string][] = [
  ['scaffold-gen attempted push to main', '09:41', 'forge-github-guard/rule-3 · agent retried with draft PR → succeeded'],
  ['Bulk-approve API call (8 items)', '08:17', 'forge-approval-gates/rule-1 · bulk approval is not a permitted action'],
  ['Session entry at Build by LPL-PM role', 'yesterday', 'forge-persona-envelope/rule-2 · PM not qualified for Build entry'],
  ['External webhook from release-notes', 'yesterday', 'forge-egress-zero/rule-1 · destination outside LPL boundary'],
];

const gateChip = (v: string): [string, string] => (v === 'REQ' ? ['#FFF8E6', '#8A6508'] : v === 'DEFER' ? ['#FDEEEF', '#C7131F'] : ['#F2F5FA', '#8A93A6']);

export default function S21GovernanceAudit() {
  const [tab, setTab] = useState<TabId>('audit');
  const [exported, setExported] = useState(false);

  const tabs: [TabId, string][] = [
    ['audit', 'Audit search'],
    ['gates', 'Gate policy'],
    ['analytics', 'Approvals analytics'],
    ['policies', 'Policy bundles'],
  ];

  return (
    <div data-screen-label="S21 · Governance & Audit" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Governance &amp; Audit</h1>
        <span style={{ fontSize: 12.5, color: '#5B6472' }}>Every artifact reconstructable — the FINRA screen</span>
      </div>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E4E9F2', marginBottom: 14 }}>
        {tabs.map(([id, label]) => (
          <div
            key={id}
            onClick={() => setTab(id)}
            className="hvr-c-navy"
            style={{
              padding: '9px 16px',
              fontSize: 12.5,
              fontWeight: 600,
              color: tab === id ? '#1E2761' : '#8A93A6',
              borderBottom: `2px solid ${tab === id ? '#1E2761' : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* AUDIT SEARCH */}
      {tab === 'audit' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                flex: 'none',
                width: 340,
                height: 34,
                background: '#FFFFFF',
                border: '1px solid #E4E9F2',
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '0 12px',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="#8A93A6" strokeWidth="1.3" />
                <path d="M8.6 8.6 12 12" stroke="#8A93A6" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                defaultValue="FRG-1042"
                style={{ flex: 1, border: 'none', outline: 'none', fontFamily: MONO, fontSize: 12, color: '#1E2761', background: 'transparent' }}
              />
            </div>
            <div style={{ flex: 1 }} />
            <div
              onClick={() => setExported(true)}
              className="hvr-op92"
              style={{
                height: 34,
                padding: '0 16px',
                borderRadius: 7,
                background: exported ? '#1B7F4D' : '#1E2761',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {exported ? 'Examiner package exported ✓' : 'Export examiner package'}
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>FULL RECONSTRUCTION · FRG-1042</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10.5, color: '#8A93A6' }}>model ver · prompt ver · gen config · reviewer · timestamp, per artifact</span>
            </div>
            {TIMELINE.map(([time, what, kind, meta, dot]) => (
              <div key={time + what} style={{ display: 'flex', gap: 14, padding: '11px 16px', borderBottom: '1px solid #F0F3F9' }}>
                <div style={{ width: 54, flex: 'none', textAlign: 'right' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{time}</span>
                </div>
                <div style={{ width: 10, flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: dot, marginTop: 3 }} />
                  <span style={{ flex: 1, width: 1.5, background: '#F0F3F9', marginTop: 3 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{what}</span>
                    <span
                      style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: KIND[kind][0], color: KIND[kind][1] }}
                    >
                      {kind}
                    </span>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6', marginTop: 3 }}>{meta}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* GATE POLICY */}
      {tab === 'gates' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>
              ARTIFACT CLASSES REQUIRING APPROVAL · PER WORKFLOW
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10.5, color: '#8A93A6' }}>view-only · edits require admin + ARB ticket</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr repeat(3,1fr) 1.2fr',
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
            <span>ARTIFACT CLASS</span>
            <span style={{ textAlign: 'center' }}>WF-A</span>
            <span style={{ textAlign: 'center' }}>WF-B</span>
            <span style={{ textAlign: 'center' }}>WF-C</span>
            <span>REQUIRED SIGNER</span>
          </div>
          {GATES.map(([name, a, b, c, signer]) => (
            <div
              key={name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr repeat(3,1fr) 1.2fr',
                gap: 8,
                padding: '9px 16px',
                borderBottom: '1px solid #F0F3F9',
                fontSize: 12,
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 600 }}>{name}</span>
              {[a, b, c].map((v, i) => (
                <span key={i} style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 9px',
                      borderRadius: 999,
                      background: gateChip(v)[0],
                      color: gateChip(v)[1],
                    }}
                  >
                    {v}
                  </span>
                </span>
              ))}
              <span style={{ fontSize: 11, color: '#5B6472' }}>{signer}</span>
            </div>
          ))}
          <div style={{ padding: '10px 16px', background: '#FFF8E6', borderTop: '1px solid #E8D9A8', fontSize: 11, color: '#7A5E0E' }}>
            Hotfix path (WF-C toggle) defers — never skips — the test-commit gate: post-hoc review required within 24h.
          </div>
        </div>
      )}

      {/* APPROVALS ANALYTICS */}
      {tab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>APPROVAL LATENCY DISTRIBUTION</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10, color: '#8A93A6' }}>feeds ≤90-min KPI</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110 }}>
              {HIST.map(([label, n, color]) => (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div title={n + ' approvals'} style={{ width: '100%', height: Math.round(n * 2.8), borderRadius: '4px 4px 0 0', background: color }} />
                  <span style={{ fontSize: 8.5, color: '#8A93A6', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', marginTop: 10, fontSize: 11, color: '#5B6472' }}>
              <span>
                median <strong style={{ fontFamily: MONO }}>74 min</strong>
              </span>
              <div style={{ flex: 1 }} />
              <span>
                p90 <strong style={{ fontFamily: MONO }}>2.6h</strong> · 6% breach SLA
              </span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 12 }}>REJECTION REASONS · PARETO</div>
            {PARETO.map(([reason, n, pct, w]) => (
              <div key={reason} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', fontSize: 11.5, marginBottom: 3 }}>
                  <span>{reason}</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>
                    {n} · {pct}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#F0F3F9' }}>
                  <div style={{ width: w, height: 6, borderRadius: 3, background: '#6D2E46' }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 10 }}>
              Top reason feeds the req-gen eval backlog — AC specificity prompts updated in v1.3.2.
            </div>
          </div>
        </div>
      )}

      {/* POLICY BUNDLES */}
      {tab === 'policies' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 14, alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE', fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>
              ACTIVE OPA BUNDLES
            </div>
            {BUNDLES.map(([name, desc, ver]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #F0F3F9' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1B7F4D', flex: 'none' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: '#1E2761' }}>{name}</div>
                  <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 1 }}>{desc}</div>
                </div>
                <span style={{ fontFamily: MONO, fontSize: 10, color: '#5B6472' }}>{ver}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE', fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>
              DENIED-ACTION LOG · 24H
            </div>
            {DENIALS.map(([what, when, rule]) => (
              <div key={what} style={{ padding: '10px 16px', borderBottom: '1px solid #F0F3F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#C7131F', background: '#FDEEEF', borderRadius: 999, padding: '1px 7px' }}>
                    DENIED
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{what}</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{when}</span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6', marginTop: 3 }}>{rule}</div>
              </div>
            ))}
            <div style={{ padding: '10px 16px', fontSize: 10.5, color: '#8A93A6', background: '#FAFBFE' }}>
              Denials are expected behavior — the envelope working as designed. Nothing is hidden silently from users.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
