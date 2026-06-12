import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  onGenerate: () => void;
}

interface Flag {
  n: number;
  blocking: boolean;
  ref: string;
  text: string;
  suggest: string;
}

const FLAGS: Flag[] = [
  {
    n: 1,
    blocking: true,
    ref: '§2',
    text: '"Shortly after the call ends" — target summary latency is not specified.',
    suggest: 'Draft summary must appear within 2 minutes of processing completion (p95 ≤ 120s).',
  },
  {
    n: 2,
    blocking: true,
    ref: '§1/§5',
    text: '"Faster note filing" has no measurable threshold to write acceptance criteria against.',
    suggest: 'Advisor files a confirmed note in under 5 minutes, vs the 22-minute baseline.',
  },
  {
    n: 3,
    blocking: true,
    ref: '§3',
    text: 'Integration with Document Vault is implied ("filed to the client record") but never stated.',
    suggest: 'Confirmed notes are written to Document Vault via the existing records API; no new retention store.',
  },
  {
    n: 4,
    blocking: false,
    ref: '§3',
    text: 'Recorded-call consent handling is not addressed — assumed to follow the existing compliance flow.',
    suggest: 'Consent capture remains in the current call-recording flow; out of scope here.',
  },
  {
    n: 5,
    blocking: false,
    ref: '§2',
    text: 'Mobile parity is not mentioned. Assume desktop Advisor Workstation first.',
    suggest: 'Desktop-first; mobile review is a fast-follow, not in this story set.',
  },
  {
    n: 6,
    blocking: false,
    ref: '§4',
    text: 'Non-English calls are not mentioned — assumed out of scope for the pilot.',
    suggest: 'English-language calls only for Phase 1.',
  },
];

type FlagStatus = 'open' | 'resolved' | 'assumed' | 'dismissed';

const STATE_MAP: Record<FlagStatus, [string, string]> = {
  open: ['', '#8A93A6'],
  resolved: ['RESOLVED ✓', '#1B7F4D'],
  assumed: ['ASSUMPTION ✓', '#8A6508'],
  dismissed: ['DISMISSED', '#8A93A6'],
};

const Mark = ({ children }: { children: React.ReactNode }) => (
  <span style={{ background: '#FFF3D6', borderBottom: '2px solid #B8860B', borderRadius: 2, padding: '0 2px' }}>{children}</span>
);

export default function S05BriefIntake({ onGenerate }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<Record<number, FlagStatus>>({ 1: 'open', 2: 'open', 3: 'open', 4: 'open', 5: 'open', 6: 'open' });
  const [resolutions, setResolutions] = useState<Record<number, string>>({});

  const setFlag = (n: number, st: FlagStatus, res?: string) => {
    setStatus((s) => ({ ...s, [n]: st }));
    if (res !== undefined) setResolutions((r) => ({ ...r, [n]: res }));
    setEditing(null);
  };

  const blockingOpen = FLAGS.filter((f) => f.blocking && status[f.n] === 'open').length;
  const ready = blockingOpen === 0;

  return (
    <div data-screen-label="S5 · SpecAI Brief Intake" style={{ padding: '22px 28px 40px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#3D5AFE' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>SpecAI · Brief Intake</h1>
        <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
          FRG-1042
        </span>
        <span style={{ background: '#EEF1FF', color: '#3D5AFE', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}>WF-B · DEFINITION</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: '#8A93A6' }}>
          Flags are raised <strong>before</strong> any story generation
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18, alignItems: 'start' }}>
        {/* LEFT · the brief */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>SOURCE BRIEF</span>
            <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#3D5AFE' }}>confluence.lpl.com/ADVW/417</span>
            <div style={{ flex: 1 }} />
            <span style={{ background: '#F2F5FA', color: '#5B6472', fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>
              VERBATIM · READ-ONLY
            </span>
          </div>
          <div style={{ padding: '20px 22px', fontSize: 13.5, lineHeight: 1.75, color: '#2A2F3A' }}>
            <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: '#1E2761', marginBottom: 4 }}>Client Meeting Notes — AI Summary</div>
            <div style={{ fontSize: 11, color: '#8A93A6', marginBottom: 14 }}>
              Charter · Advisor Workstation · last edited 2d ago by R. Osborne · 1,840 words
            </div>
            <p style={{ margin: '0 0 12px' }}>
              <strong>§1 Problem.</strong> Advisors spend an average of 22 minutes after each client meeting writing and filing notes. Compliance
              requires notes within 24 hours; advisors report this as their top administrative burden, and{' '}
              <Mark>faster onboarding of meeting notes</Mark> was the #2 ask in the 2025 advisor survey.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>§2 Proposal.</strong> When a recorded client call completes, generate a draft meeting summary in the Advisor Workstation meeting
              record <Mark>shortly after the call ends</Mark>. The advisor reviews, edits and confirms the note. Summaries must follow the standing
              note template (attendees, topics, decisions, follow-ups, disclosures discussed).
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>§3 Scope.</strong> Applies to recorded calls in supported meeting platforms. Confirmed notes are{' '}
              <Mark>filed to the client record</Mark> and become part of the books-and-records retention chain. Transcript text never leaves the LPL
              boundary.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>§4 Out of scope.</strong> Live in-call assistance; summaries of unrecorded calls; client-facing summaries.
            </p>
            <p style={{ margin: 0 }}>
              <strong>§5 Success.</strong> Advisors file notes materially faster with no increase in compliance findings. Adoption across the pilot
              advisor group within one quarter.
            </p>
          </div>
        </div>

        {/* RIGHT · ambiguity & assumption flags */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6' }}>AMBIGUITY &amp; ASSUMPTION FLAGS</span>
            <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>req-gen v1.3.2</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: ready ? '#1B7F4D' : '#8A6508' }}>
              {ready ? 'All blocking flags handled ✓' : `${blockingOpen} blocking flag${blockingOpen > 1 ? 's' : ''} open`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FLAGS.map((f) => {
              const st = status[f.n];
              const isOpen = st === 'open';
              const isEditing = editing === f.n;
              const res = resolutions[f.n];
              const draft = drafts[f.n] !== undefined ? drafts[f.n] : f.suggest;
              return (
                <div
                  key={f.n}
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${isOpen && f.blocking ? '#B8860B' : '#E4E9F2'}`,
                    borderRadius: 9,
                    padding: '12px 14px',
                    opacity: st === 'dismissed' ? 0.6 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: '.05em',
                        padding: '2px 7px',
                        borderRadius: 999,
                        background: f.blocking ? '#FFF8E6' : '#F2F5FA',
                        color: f.blocking ? '#8A6508' : '#5B6472',
                      }}
                    >
                      {f.blocking ? 'BLOCKING' : 'SOFT'}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>
                      #{f.n} · {f.ref}
                    </span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: STATE_MAP[st][1] }}>{STATE_MAP[st][0]}</span>
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.5, fontWeight: 500 }}>{f.text}</div>

                  {isOpen && !isEditing && (
                    <div style={{ display: 'flex', marginTop: 10, gap: 6, flexWrap: 'wrap' }}>
                      <span
                        onClick={() => setEditing(f.n)}
                        className="hvr-bg-lblue"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#3D5AFE',
                          border: '1px solid #C9D6FF',
                          borderRadius: 6,
                          padding: '4px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        Resolve inline
                      </span>
                      <span
                        onClick={() => setFlag(f.n, 'assumed', 'Carried as assumption: ' + f.suggest)}
                        className="hvr-bg-cream"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#8A6508',
                          border: '1px solid #E8D9A8',
                          borderRadius: 6,
                          padding: '4px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        Accept as assumption
                      </span>
                      <span
                        onClick={() => setFlag(f.n, 'dismissed', 'Dismissed with note: not relevant to this charter — recorded for audit.')}
                        className="hvr-bg-grey"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#5B6472',
                          border: '1px solid #E4E9F2',
                          borderRadius: 6,
                          padding: '4px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        Dismiss with note
                      </span>
                    </div>
                  )}

                  {isEditing && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          value={draft}
                          onChange={(e) => setDrafts((d) => ({ ...d, [f.n]: e.target.value }))}
                          style={{
                            flex: 1,
                            border: '1px solid #C9D6FF',
                            borderRadius: 6,
                            padding: '7px 10px',
                            fontSize: 12,
                            fontFamily: SANS,
                            color: '#2A2F3A',
                            outline: 'none',
                            background: '#F5F8FE',
                          }}
                        />
                        <span
                          onClick={() => setFlag(f.n, 'resolved', 'Resolution: ' + draft)}
                          className="hvr-bg-blue"
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            color: '#FFFFFF',
                            background: '#3D5AFE',
                            borderRadius: 6,
                            padding: '7px 13px',
                            cursor: 'pointer',
                            alignSelf: 'center',
                          }}
                        >
                          Apply
                        </span>
                      </div>
                    </div>
                  )}

                  {res && (
                    <div style={{ marginTop: 9, borderTop: '1px dashed #E4E9F2', paddingTop: 8, fontSize: 11.5, color: '#5B6472', lineHeight: 1.45 }}>
                      {res}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Generate footer */}
          <div
            style={{
              marginTop: 14,
              background: '#FFFFFF',
              border: '1px solid #E4E9F2',
              borderRadius: 9,
              padding: '13px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: ready ? '#1B7F4D' : '#8A6508' }}>
                {ready ? 'Ready — generation is unblocked.' : 'Resolve all blocking flags to enable generation.'}
              </div>
              <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 2 }}>
                Estimated generation: ~$0.62 · ≈96k tokens · soft flags carried into the story set as assumptions
              </div>
            </div>
            <div
              onClick={() => ready && onGenerate()}
              className={ready ? 'hvr-op92' : undefined}
              style={{
                height: 38,
                padding: '0 20px',
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: ready ? 'pointer' : 'not-allowed',
                background: ready ? '#3D5AFE' : '#E4E9F2',
                color: ready ? '#FFFFFF' : '#A6AFC0',
              }}
            >
              Generate story set →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
