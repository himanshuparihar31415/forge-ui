import { useEffect, useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  onApprove: () => void;
}

interface Ac {
  text: string;
  old?: string;
  edited?: boolean;
}

interface Story {
  id: string;
  span: string;
  pts: number;
  pri: string;
  prov: 'ai' | 'edited';
  flagNote?: string;
  title: string;
  stmt: string;
  acs: Ac[];
  nfrs: string[];
}

const DATA: Story[] = [
  {
    id: 'FRG-1042-1',
    span: 'B',
    pts: 5,
    pri: 'High',
    prov: 'ai',
    title: 'Generate draft summary after each recorded call',
    stmt: 'As an advisor, I want a draft meeting summary generated after each recorded client call so that I never start notes from a blank page.',
    acs: [
      { text: 'Given a completed recorded meeting, When processing finishes, Then a draft summary appears on the meeting record.' },
      { text: 'Given a draft exists, When I open the meeting record, Then it is labeled "AI draft — not filed" until confirmed.' },
    ],
    nfrs: ['Performance', 'Observability'],
  },
  {
    id: 'FRG-1042-2',
    span: 'D',
    pts: 3,
    pri: 'High',
    prov: 'ai',
    title: 'Conform drafts to the standing note template',
    stmt: 'As a compliance reviewer, I want every draft structured by the standing template so that filed notes stay consistent across advisors.',
    acs: [
      { text: 'Given a generated draft, Then it contains attendees, topics, decisions, follow-ups and disclosures-discussed sections.' },
      { text: 'Given a section has no content, Then it renders "None recorded" rather than being omitted.' },
    ],
    nfrs: ['Accessibility'],
  },
  {
    id: 'FRG-1042-3',
    span: 'C',
    pts: 5,
    pri: 'Highest',
    prov: 'edited',
    flagNote: 'derived from flag #1 resolution',
    title: 'Deliver the draft within the latency target',
    stmt: 'As an advisor, I want the summary draft shortly after each recorded call so that I can file notes in under 5 minutes.',
    acs: [
      {
        text: 'Given a completed recorded meeting, When processing finishes, Then a draft appears within 2 minutes (p95 ≤ 120s).',
        old: 'within 5 minutes',
        edited: true,
      },
      { text: 'Given processing exceeds the bound, Then the record shows a "delayed" state with an ETA, never a silent failure.' },
    ],
    nfrs: ['Performance', 'Observability'],
  },
  {
    id: 'FRG-1042-4',
    span: 'A',
    pts: 3,
    pri: 'High',
    prov: 'ai',
    flagNote: 'derived from flag #2 resolution',
    title: 'Review, edit and confirm in under 5 minutes',
    stmt: 'As an advisor, I want a one-screen review-and-confirm flow so that filing a note takes under 5 minutes against the 22-minute baseline.',
    acs: [{ text: 'Given a draft, When I confirm it, Then edits, confirmation time and my identity are recorded.' }],
    nfrs: ['Accessibility'],
  },
  {
    id: 'FRG-1042-5',
    span: 'E',
    pts: 5,
    pri: 'High',
    prov: 'ai',
    flagNote: 'derived from flag #3 resolution',
    title: 'File confirmed notes to Document Vault',
    stmt: 'As an operations owner, I want confirmed notes written to Document Vault via the existing records API so that retention stays in one chain.',
    acs: [
      { text: 'Given a confirmed note, Then it is written to Document Vault and linked from the meeting record.' },
      { text: 'Given the records API rejects the write, Then the note is queued for retry and the advisor is notified.' },
    ],
    nfrs: ['Security', 'Observability'],
  },
  {
    id: 'FRG-1042-6',
    span: 'B',
    pts: 3,
    pri: 'Medium',
    prov: 'ai',
    title: 'Handle processing failure and timeout paths',
    stmt: 'As an advisor, I want clear failure states with retry so that a failed summary never blocks manual note filing.',
    acs: [{ text: 'Given processing fails, Then the record offers "retry" and "write manually" with no data loss.' }],
    nfrs: ['Observability'],
  },
  {
    id: 'FRG-1042-7',
    span: 'A',
    pts: 2,
    pri: 'Medium',
    prov: 'ai',
    title: 'Capture adoption and time-saved telemetry',
    stmt: 'As a product owner, I want per-advisor adoption and filing-time metrics so that pilot success (§5) is measurable.',
    acs: [{ text: 'Given a note is filed, Then time-from-call-end and edit-distance from draft are recorded to the measurement framework.' }],
    nfrs: ['Observability'],
  },
];

interface Nfr {
  id: string;
  cat: string;
  span: string;
  title: string;
  detail: string;
}

const NFRS: Nfr[] = [
  {
    id: 'NFR-S1',
    cat: 'SECURITY',
    span: 'F',
    title: 'PII redaction in transcripts',
    detail: 'Transcript PII is redacted before model input; raw audio and text never leave the LPL boundary.',
  },
  {
    id: 'NFR-P1',
    cat: 'PERFORMANCE',
    span: 'C',
    title: 'p95 summary latency ≤ 120s',
    detail: 'Measured call-end → draft-visible, alerting at p95 > 100s; sourced from flag #1 resolution.',
  },
  {
    id: 'NFR-A1',
    cat: 'ACCESSIBILITY',
    span: 'D',
    title: 'WCAG 2.1 AA review flow',
    detail: 'Review-and-confirm flow fully keyboard navigable; draft states announced to screen readers.',
  },
  {
    id: 'NFR-O1',
    cat: 'OBSERVABILITY',
    span: 'B',
    title: 'End-to-end trace per summary',
    detail: 'Every draft carries a trace ID linking transcript → model call → record write for audit replay.',
  },
];

const CAT: Record<string, [string, string]> = {
  SECURITY: ['#FDEEEF', '#C7131F'],
  PERFORMANCE: ['#EEF1FF', '#3D5AFE'],
  ACCESSIBILITY: ['#E6F5F3', '#0E9C8C'],
  OBSERVABILITY: ['#EAECF5', '#1E2761'],
};

export default function S06ReviewWorkspace({ onApprove }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'FRG-1042-3': true, 'FRG-1042-1': true });
  const [diff, setDiff] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [seconds, setSeconds] = useState(2483);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [paused]);

  const fmt = (n: number) => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');

  const hoveredSpan = (() => {
    const all: { id: string; span: string }[] = [...DATA, ...NFRS];
    const h = all.find((x) => x.id === hover);
    return h ? h.span : null;
  })();
  const hl = (sp: string) => (hoveredSpan === sp ? '#FFE9A8' : 'transparent');

  const Hl = ({ sp, children }: { sp: string; children: React.ReactNode }) => (
    <span style={{ background: hl(sp), borderRadius: 2, padding: '0 2px', transition: 'background .15s' }}>{children}</span>
  );

  return (
    <div
      data-screen-label="S6 · SpecAI Review Workspace"
      style={{ padding: '22px 28px 60px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400, position: 'relative' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#3D5AFE' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>SpecAI · Review Workspace</h1>
        <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
          FRG-1042
        </span>
        <div style={{ flex: 1 }} />
        <span
          title="Predicted by story-quality model from your team's review history"
          style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#5B6472' }}
        >
          predicted <strong style={{ color: '#1E2761' }}>3.8/5</strong> · team 4-wk avg 3.7
        </span>
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', color: '#8A93A6' }}>REVIEW</span>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: '#1E2761' }}>{fmt(seconds)}</span>
          <span
            onClick={() => setPaused((p) => !p)}
            title="Pausable — time counts toward the ≤90-min KPI"
            style={{ fontSize: 10, fontWeight: 700, color: '#3D5AFE', cursor: 'pointer' }}
          >
            {paused ? 'RESUME' : 'PAUSE'}
          </span>
        </div>
        <div
          onClick={onApprove}
          className="hvr-bg-navy"
          style={{
            height: 34,
            padding: '0 16px',
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
          Proceed to approval →
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: '#8A93A6', marginBottom: 14, marginLeft: 22 }}>
        Hover a story to highlight its source sentences in the brief · every edit is tracked to the audit ledger
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span
          onClick={() => setDiff((d) => !d)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 11.5,
            fontWeight: 600,
            border: `1px solid ${diff ? '#3D5AFE' : '#E4E9F2'}`,
            background: diff ? '#EEF1FF' : '#FFFFFF',
            color: diff ? '#3D5AFE' : '#5B6472',
            borderRadius: 6,
            padding: '5px 11px',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: 26, height: 14, borderRadius: 999, background: diff ? '#3D5AFE' : '#C9D3E4', position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: diff ? 14 : 2,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(0,0,0,.3)',
                transition: 'left .15s',
              }}
            />
          </span>
          Diff · AI draft vs current
        </span>
        <span
          className="hvr-bg-fog"
          style={{ fontSize: 11.5, fontWeight: 600, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 6, padding: '5px 11px', cursor: 'pointer' }}
        >
          Accept all NFR stories
        </span>
        <span
          className="hvr-bg-fog"
          style={{ fontSize: 11.5, fontWeight: 600, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 6, padding: '5px 11px', cursor: 'pointer' }}
        >
          Re-order
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, color: '#A6AFC0' }}>
          1 epic · 7 stories · 4 NFR stories · <span style={{ fontFamily: MONO }}>j/k</span> navigate · <span style={{ fontFamily: MONO }}>e</span> edit ·{' '}
          <span style={{ fontFamily: MONO }}>a</span> approve
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 18, alignItems: 'start' }}>
        {/* LEFT · brief, highlight-synced */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden', position: 'sticky', top: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>ORIGINAL BRIEF</span>
            <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#3D5AFE' }}>ADVW/417</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: '#8A93A6' }}>highlight-synced</span>
          </div>
          <div style={{ padding: '18px 20px', fontSize: 13, lineHeight: 1.75 }}>
            <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: '#1E2761', marginBottom: 12 }}>Client Meeting Notes — AI Summary</div>
            <p style={{ margin: '0 0 11px' }}>
              <strong>§1 Problem.</strong> Advisors spend an average of 22 minutes after each client meeting writing and filing notes. Compliance
              requires notes within 24 hours; <Hl sp="A">faster onboarding of meeting notes was the #2 ask in the 2025 advisor survey</Hl>.
            </p>
            <p style={{ margin: '0 0 11px' }}>
              <strong>§2 Proposal.</strong> When a recorded client call completes,{' '}
              <Hl sp="B">generate a draft meeting summary in the Advisor Workstation meeting record</Hl> <Hl sp="C">shortly after the call ends</Hl>.
              The advisor reviews, edits and confirms the note.{' '}
              <Hl sp="D">Summaries must follow the standing note template (attendees, topics, decisions, follow-ups, disclosures discussed)</Hl>.
            </p>
            <p style={{ margin: '0 0 11px' }}>
              <strong>§3 Scope.</strong> Applies to recorded calls in supported meeting platforms.{' '}
              <Hl sp="E">Confirmed notes are filed to the client record and become part of the books-and-records retention chain</Hl>.{' '}
              <Hl sp="F">Transcript text never leaves the LPL boundary</Hl>.
            </p>
            <p style={{ margin: '0 0 11px' }}>
              <strong>§4 Out of scope.</strong> Live in-call assistance; summaries of unrecorded calls; client-facing summaries.
            </p>
            <p style={{ margin: 0 }}>
              <strong>§5 Success.</strong> <Hl sp="A">Advisors file notes materially faster</Hl> with no increase in compliance findings. Adoption
              across the pilot advisor group within one quarter.
            </p>
            <div style={{ marginTop: 14, borderTop: '1px dashed #E4E9F2', paddingTop: 10, fontSize: 11, color: '#8A93A6', lineHeight: 1.5 }}>
              Resolved flags carried into this set: #1 latency ≤2 min · #2 filing &lt;5 min · #3 Document Vault API · 3 assumptions logged.
            </div>
          </div>
        </div>

        {/* RIGHT · generated hierarchy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Epic */}
          <div style={{ background: '#1E2761', borderRadius: 10, padding: '14px 16px', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', background: 'rgba(255,255,255,.16)', borderRadius: 999, padding: '2px 8px' }}>
                EPIC
              </span>
              <span style={{ fontFamily: MONO, fontSize: 11, opacity: 0.75 }}>FRG-1042-E1</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.05em', background: 'rgba(255,255,255,.16)', borderRadius: 999, padding: '2px 8px' }}>
                AI-DRAFTED · AWAITING REVIEW
              </span>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 16.5, fontWeight: 700, marginTop: 7 }}>Advisor Workstation — Client Meeting Notes AI Summary</div>
            <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 3 }}>Jira ADVW · target pilot advisor group · 7 stories + 4 NFR stories below</div>
          </div>

          {/* Stories */}
          {DATA.map((st) => {
            const open = !!expanded[st.id];
            return (
              <div
                key={st.id}
                onMouseEnter={() => setHover(st.id)}
                onMouseLeave={() => setHover(null)}
                className="hvr-shadow"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${hover === st.id ? '#3D5AFE' : '#E4E9F2'}`,
                  borderRadius: 9,
                  padding: '12px 14px',
                  transition: 'border .15s, box-shadow .15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: '#3D5AFE' }}>{st.id}</span>
                  <span style={{ fontSize: 10, color: '#8A93A6' }}>
                    Story · {st.pts} pts · {st.pri}
                  </span>
                  {st.flagNote && (
                    <span style={{ fontSize: 9.5, color: '#8A6508', background: '#FFF8E6', borderRadius: 999, padding: '1px 7px', fontWeight: 600 }}>
                      {st.flagNote}
                    </span>
                  )}
                  <div style={{ flex: 1 }} />
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: '.04em',
                      padding: '2px 7px',
                      borderRadius: 999,
                      background: st.prov === 'edited' ? '#F0EDF5' : '#EEF1FF',
                      color: st.prov === 'edited' ? '#6D2E46' : '#3D5AFE',
                    }}
                  >
                    {st.prov === 'edited' ? 'HUMAN-EDITED' : 'AI-DRAFTED'}
                  </span>
                  <span
                    onClick={() => setExpanded((e) => ({ ...e, [st.id]: !e[st.id] }))}
                    className="hvr-bg-fog"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#8A93A6',
                      fontSize: 9,
                    }}
                  >
                    {open ? '▲' : '▼'}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, lineHeight: 1.4 }}>{st.title}</div>
                <div style={{ fontSize: 12, color: '#5B6472', marginTop: 4, lineHeight: 1.55 }}>{st.stmt}</div>

                {open && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ background: '#FAFBFE', border: '1px solid #F0F3F9', borderRadius: 7, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 6 }}>ACCEPTANCE CRITERIA</div>
                      {st.acs.map((ac, i) => (
                        <div key={i} style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 5, display: 'flex', gap: 7 }}>
                          <span style={{ color: '#A6AFC0', fontFamily: MONO, fontSize: 10.5, paddingTop: 2, flex: 'none' }}>AC-{i + 1}</span>
                          <span>
                            {ac.edited && diff && (
                              <>
                                <span style={{ textDecoration: 'line-through', color: '#C7131F', background: '#FDEEEF', borderRadius: 2, padding: '0 2px' }}>
                                  {ac.old}
                                </span>{' '}
                              </>
                            )}
                            <span style={{ background: ac.edited && diff ? '#E7F4EC' : 'transparent', borderRadius: 2, padding: '0 2px' }}>{ac.text}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {st.nfrs.map((n) => {
                        const k = n.toUpperCase();
                        const [bg, color] = CAT[k] || ['#F2F5FA', '#5B6472'];
                        return (
                          <span key={n} style={{ fontSize: 9.5, fontWeight: 700, color, background: bg, borderRadius: 999, padding: '2px 8px' }}>
                            {n}
                          </span>
                        );
                      })}
                      <div style={{ flex: 1 }} />
                      <span className="hvr-underline" style={{ fontSize: 10.5, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
                        Edit inline
                      </span>
                      <span
                        onClick={() => setChatOpen(true)}
                        className="hvr-underline"
                        style={{ fontSize: 10.5, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Rewrite via chat
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* NFR stories */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6' }}>NFR STORIES · 4/4 CATEGORIES COVERED</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {NFRS.map((nf) => (
              <div
                key={nf.id}
                onMouseEnter={() => setHover(nf.id)}
                onMouseLeave={() => setHover(null)}
                className="hvr-shadow"
                style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: '11px 13px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color: '#3D5AFE' }}>{nf.id}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: CAT[nf.cat][1], background: CAT[nf.cat][0], borderRadius: 999, padding: '2px 8px' }}>
                    {nf.cat}
                  </span>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: '#EEF1FF', color: '#3D5AFE' }}>
                    AI-DRAFTED
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, lineHeight: 1.45 }}>{nf.title}</div>
                <div style={{ fontSize: 11, color: '#5B6472', marginTop: 3, lineHeight: 1.5 }}>{nf.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat-rewrite drawer */}
      <div style={{ position: 'fixed', right: 24, bottom: 20, zIndex: 45 }}>
        {chatOpen && (
          <div
            style={{
              width: 360,
              background: '#FFFFFF',
              border: '1px solid #E4E9F2',
              borderRadius: 12,
              boxShadow: '0 16px 48px rgba(30,39,97,.2)',
              overflow: 'hidden',
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: '#1E2761', color: '#FFFFFF' }}>
              <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>Rewrite with SpecAI</span>
              <span style={{ fontSize: 9.5, background: 'rgba(255,255,255,.16)', borderRadius: 999, padding: '2px 8px' }}>SCOPED · FRG-1042-3</span>
              <span onClick={() => setChatOpen(false)} style={{ cursor: 'pointer', fontSize: 12, opacity: 0.8 }}>
                ✕
              </span>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 9, maxHeight: 240, overflowY: 'auto' }}>
              <div
                style={{
                  alignSelf: 'flex-end',
                  background: '#EEF1FF',
                  color: '#1E2761',
                  borderRadius: '10px 10px 3px 10px',
                  padding: '8px 11px',
                  fontSize: 12,
                  maxWidth: '85%',
                  lineHeight: 1.5,
                }}
              >
                Rewrite story 3 with stricter ACs — the 5-minute target is too loose.
              </div>
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#F7F9FC',
                  border: '1px solid #F0F3F9',
                  borderRadius: '10px 10px 10px 3px',
                  padding: '8px 11px',
                  fontSize: 12,
                  maxWidth: '90%',
                  lineHeight: 1.5,
                }}
              >
                Tightened AC-1 to a 2-minute draft latency and added an explicit p95 bound. The change is marked as a tracked edit on FRG-1042-3 —
                toggle <strong>Diff</strong> to compare against the AI draft.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, padding: '0 14px 10px', flexWrap: 'wrap' }}>
              <span
                className="hvr-bg-lblue"
                style={{ fontSize: 10.5, color: '#3D5AFE', border: '1px solid #C9D6FF', borderRadius: 999, padding: '3px 10px', cursor: 'pointer' }}
              >
                Split epic by user type
              </span>
              <span
                className="hvr-bg-lblue"
                style={{ fontSize: 10.5, color: '#3D5AFE', border: '1px solid #C9D6FF', borderRadius: 999, padding: '3px 10px', cursor: 'pointer' }}
              >
                Add negative-path ACs
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderTop: '1px solid #E4E9F2' }}>
              <input
                placeholder="Instruct SpecAI… (scoped to selection)"
                style={{ flex: 1, border: '1px solid #E4E9F2', borderRadius: 7, padding: '8px 11px', fontSize: 12, fontFamily: SANS, outline: 'none' }}
              />
              <span
                className="hvr-bg-blue"
                style={{ background: '#3D5AFE', color: '#FFFFFF', borderRadius: 7, padding: '8px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Send
              </span>
            </div>
          </div>
        )}
        <div
          onClick={() => setChatOpen((o) => !o)}
          className="hvr-bg-navy"
          style={{
            marginLeft: 'auto',
            width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#1E2761',
            color: '#FFFFFF',
            borderRadius: 999,
            padding: '10px 18px',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(30,39,97,.3)',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7EE3A8' }} />
          {chatOpen ? 'Close rewrite drawer' : 'Rewrite via chat'}
        </div>
      </div>
    </div>
  );
}
