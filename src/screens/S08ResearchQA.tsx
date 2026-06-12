import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  goPacks: () => void;
}

const KIND: Record<string, [string, string]> = {
  'USER FEEDBACK': ['#EEF1FF', '#3D5AFE'],
  'RESEARCH STUDY': ['#E6F5F3', '#0E9C8C'],
  BEHAVIORAL: ['#EAECF5', '#1E2761'],
  'COMPETITOR INTEL': ['#FBF0E4', '#B95C00'],
};

// [n, kind, title, excerpt, ref, conf]
const SRC: [number, string, string, string, string, string][] = [
  [1, 'USER FEEDBACK', '2025 Advisor Survey — open-text themes', 'Note-taking after meetings is the thing I would automate first. It is pure duplication.', 'survey-2025 · n=1,847 · theme T-12', '0.94'],
  [2, 'RESEARCH STUDY', 'Diary study US-23 — advisor admin week', 'I say everything on the call, then I retype it. Double work, every single meeting.', 'study US-23 · 14 participants · 2025-Q3', '0.91'],
  [3, 'BEHAVIORAL', 'Meeting-record completion dashboard', '41% of meeting notes are completed after 18:00 local; median lag call-end → filed is 5.2 hours.', 'dash BHV-07 · rolling 90 days', '0.89'],
  [4, 'COMPETITOR INTEL', 'Competitor brief — AI note assistants', 'Churned advisors most often cited automatic meeting summaries as the capability they kept.', 'intel CI-204 · 2026-Q1', '0.83'],
];

const RELATED = [
  'How long do advisors actually spend on compliance notes per week?',
  'What makes advisors trust or distrust AI-drafted content?',
  'Which note sections do compliance reviewers reject most often?',
];

export default function S08ResearchQA({ goPacks }: Props) {
  const [query, setQuery] = useState('What do advisors say about meeting notes and post-call admin work?');
  const [cite, setCite] = useState<number | null>(null);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);

  const Cite = ({ n }: { n: number }) => (
    <span
      onMouseEnter={() => setCite(n)}
      onMouseLeave={() => setCite(null)}
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: '#0E9C8C',
        background: '#E6F5F3',
        borderRadius: 4,
        padding: '1px 5px',
        cursor: 'default',
        verticalAlign: 2,
      }}
    >
      {n}
    </span>
  );

  return (
    <div data-screen-label="S8 · DesignAI Research Q&A" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#0E9C8C' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>DesignAI · Research Q&amp;A</h1>
        <span style={{ background: '#E6F5F3', color: '#0E9C8C', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}>PROTOAI</span>
        <div style={{ flex: 1 }} />
        <span onClick={goPacks} className="hvr-underline" style={{ fontSize: 11.5, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
          Browse research packs →
        </span>
      </div>

      {/* Query box */}
      <div style={{ maxWidth: 880, margin: '0 auto 14px' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #0E9C8C',
            borderRadius: 12,
            padding: '6px 8px 6px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 6px 22px rgba(14,156,140,.08)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: 'none' }}>
            <circle cx="7" cy="7" r="5" stroke="#0E9C8C" strokeWidth="1.4" />
            <path d="M10.8 10.8 14.6 14.6" stroke="#0E9C8C" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask the research library…"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14.5, fontFamily: SANS, color: '#2A2F3A', background: 'transparent', padding: '10px 0' }}
          />
          <span
            className="hvr-op90"
            style={{ background: '#0E9C8C', color: '#FFFFFF', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Ask
          </span>
        </div>
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 10, fontSize: 11, color: '#8A93A6' }}>
          <span>
            <strong style={{ color: '#5B6472' }}>12,400</strong> user-feedback items
          </span>
          <span>
            <strong style={{ color: '#5B6472' }}>86</strong> research studies
          </span>
          <span>
            <strong style={{ color: '#5B6472' }}>240</strong> competitor-intel briefs
          </span>
          <span>
            <strong style={{ color: '#5B6472' }}>18</strong> behavioral dashboards
          </span>
          <span style={{ color: '#A6AFC0' }}>· unified insight index, refreshed nightly</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, alignItems: 'start', maxWidth: 1180, margin: '0 auto' }}>
        {/* Answer */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>SYNTHESIZED ANSWER</span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: '#5B6472' }}>research-qa v1.2.0 · trc-77c204</span>
            <div style={{ flex: 1 }} />
            <span
              title="Share of claims carrying a verifiable citation — KPI target ≥95%"
              style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}
            >
              CITATION COVERAGE 96%
            </span>
          </div>
          <div style={{ padding: '18px 20px', fontSize: 13.5, lineHeight: 1.8 }}>
            <p style={{ margin: '0 0 12px' }}>
              Post-meeting administrative work is advisors' most-cited operational pain. In the 2025 advisor survey, note-writing and filing ranked as
              the <strong>#2 overall ask</strong>, with a median self-reported effort of 20–25 minutes per meeting <Cite n={1} />. Diary-study
              participants described the task as "double work" — retyping what was already said on the call <Cite n={2} />.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Behavioral data corroborates this: 41% of meeting records are completed after 6 pm, suggesting notes are deferred to end-of-day batches,
              which compliance flags as a timeliness risk <Cite n={3} />. Competitor platforms have begun shipping AI note drafts; advisors who
              switched cite "summary in the record before I'm back at my desk" as the headline benefit <Cite n={4} />.
            </p>
            <p style={{ margin: 0 }}>
              Design implication: the review-and-confirm step is where trust is won — usability sessions show advisors will not file an unread AI
              note, but will happily edit one <Cite n={2} />.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, borderTop: '1px solid #F0F3F9', paddingTop: 12 }}>
              <span style={{ fontSize: 11, color: '#8A93A6' }}>Was this useful? Feeds the ≥4.0/5 usefulness KPI.</span>
              <span
                onClick={() => setVote('up')}
                className="hvr-bc-teal"
                style={{
                  fontSize: 12,
                  border: `1px solid ${vote === 'up' ? '#0E9C8C' : '#E4E9F2'}`,
                  background: vote === 'up' ? '#E6F5F3' : '#FFFFFF',
                  borderRadius: 6,
                  padding: '3px 10px',
                  cursor: 'pointer',
                }}
              >
                👍 {vote === 'up' ? '· thanks' : ''}
              </span>
              <span
                onClick={() => setVote('down')}
                className="hvr-bc-red"
                style={{
                  fontSize: 12,
                  border: `1px solid ${vote === 'down' ? '#C7131F' : '#E4E9F2'}`,
                  background: vote === 'down' ? '#FDEEEF' : '#FFFFFF',
                  borderRadius: 6,
                  padding: '3px 10px',
                  cursor: 'pointer',
                }}
              >
                👎
              </span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10.5, color: '#A6AFC0' }}>answered in 2.4s</span>
            </div>
          </div>

          {/* Gap callout */}
          <div
            style={{
              margin: '0 16px 16px',
              background: '#FFF8E6',
              border: '1px solid #B8860B',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 13 }}>⚠</span>
            <span style={{ fontSize: 12, color: '#7A5E0E', lineHeight: 1.5 }}>
              <strong>Research gap:</strong> no studies found on advisor mobile usage after 2024 — flagged to the research backlog as{' '}
              <span style={{ fontFamily: MONO, fontSize: 11 }}>GAP-118</span>.
            </span>
          </div>

          {/* Related */}
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 8 }}>RELATED QUESTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {RELATED.map((q) => (
                <span
                  key={q}
                  onClick={() => setQuery(q)}
                  className="hvr-bg-teal hvr-bc-teal"
                  style={{
                    fontSize: 12.5,
                    color: '#0E9C8C',
                    cursor: 'pointer',
                    border: '1px solid #E4E9F2',
                    borderRadius: 7,
                    padding: '8px 12px',
                    background: '#FAFBFE',
                  }}
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cited sources rail */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6', marginBottom: 10 }}>CITED SOURCES · 4</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SRC.map(([n, kind, title, excerpt, ref, conf]) => (
              <div
                key={n}
                style={{
                  background: '#FFFFFF',
                  border: `1.5px solid ${cite === n ? '#0E9C8C' : '#E4E9F2'}`,
                  borderRadius: 9,
                  padding: '12px 14px',
                  transition: 'border .15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      background: '#E6F5F3',
                      color: '#0E9C8C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      flex: 'none',
                    }}
                  >
                    {n}
                  </span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: '.04em',
                      color: KIND[kind][1],
                      background: KIND[kind][0],
                      borderRadius: 999,
                      padding: '2px 7px',
                    }}
                  >
                    {kind}
                  </span>
                  <div style={{ flex: 1 }} />
                  <span title="Retrieval confidence" style={{ fontFamily: MONO, fontSize: 10, color: '#5B6472' }}>
                    {conf}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.4 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 5, lineHeight: 1.55, fontStyle: 'italic' }}>"{excerpt}"</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6', marginTop: 6 }}>{ref}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
