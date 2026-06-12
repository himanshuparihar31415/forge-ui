import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  goQa: () => void;
}

interface Pack {
  id: string;
  title: string;
  questions: string;
  count: number;
  owner: string;
  refreshed: string;
  sources: [string, string, string, string][];
}

const PACKS: Pack[] = [
  {
    id: 'PK-014',
    title: 'Meeting notes & post-call admin burden',
    questions: 'What drives note-filing delay? Where is advisor time actually lost?',
    count: 14,
    owner: 'M. Chen',
    refreshed: '2d ago',
    sources: [
      ['2025 Advisor Survey — admin themes', 'USER FEEDBACK', 'I would automate note-taking first. It is pure duplication.', 'survey-2025 · theme T-12'],
      ['Diary study US-23 — advisor admin week', 'RESEARCH STUDY', 'I say everything on the call, then I retype it. Double work.', 'study US-23 · 14 participants'],
      ['Meeting-record completion dashboard', 'BEHAVIORAL', '41% of notes completed after 18:00; median lag 5.2 hours.', 'dash BHV-07 · rolling 90d'],
      ['Compliance findings — note timeliness', 'BEHAVIORAL', 'Late-note findings up 9% YoY; concentrated in high-meeting-volume advisors.', 'dash BHV-11 · 2025'],
      ['Competitor brief — AI note assistants', 'COMPETITOR INTEL', 'Churned advisors most often cited automatic summaries as the keeper feature.', 'intel CI-204 · 2026-Q1'],
    ],
  },
  {
    id: 'PK-011',
    title: 'Advisor trust in AI-drafted content',
    questions: 'When do advisors accept, edit, or reject AI output?',
    count: 9,
    owner: 'M. Chen',
    refreshed: '1w ago',
    sources: [
      ['Usability sessions — AI draft review', 'RESEARCH STUDY', 'Advisors will not file an unread AI note, but happily edit one.', 'study US-21 · 9 sessions'],
      ['Survey — AI feature sentiment', 'USER FEEDBACK', 'Show me what it got wrong and I will trust what it got right.', 'survey-2025 · theme T-31'],
      ['Edit-distance telemetry, pilot group', 'BEHAVIORAL', 'Median 11% of draft text edited before confirmation.', 'dash BHV-14 · pilot'],
    ],
  },
  {
    id: 'PK-009',
    title: 'Client onboarding drop-off points',
    questions: 'Where do onboarding flows stall, and why?',
    count: 11,
    owner: 'J. Ruiz',
    refreshed: '3d ago',
    sources: [
      ['Funnel analysis — onboarding 2025H2', 'BEHAVIORAL', 'Document-collection step accounts for 62% of stalled onboardings.', 'dash BHV-03'],
      ['Interview study — operations staff', 'RESEARCH STUDY', 'We chase signatures by phone. The portal reminder goes to spam.', 'study US-19'],
      ['NPS verbatims — new households', 'USER FEEDBACK', 'Six weeks of paperwork before my money moved.', 'nps-2025 · Q4'],
    ],
  },
  {
    id: 'PK-008',
    title: 'Rebalancing UX & bulk operations',
    questions: 'How do traders batch? What errors recur?',
    count: 8,
    owner: 'J. Ruiz',
    refreshed: '1w ago',
    sources: [
      ['Session replays — rebalancing module', 'BEHAVIORAL', 'Bulk-approve attempted in 73% of sessions; available in 0%.', 'dash BHV-09'],
      ['Trader interviews — batch workflows', 'RESEARCH STUDY', 'I export to a spreadsheet, fix drift there, and re-import.', 'study US-17'],
    ],
  },
  {
    id: 'PK-006',
    title: 'Accessibility in dense financial tables',
    questions: 'What breaks for screen-reader and keyboard users?',
    count: 7,
    owner: 'M. Chen',
    refreshed: '2w ago',
    sources: [
      ['A11y audit — Advisor Workstation', 'RESEARCH STUDY', 'Data tables lack programmatic headers in 4 of 11 modules.', 'audit AX-05'],
      ['Keyboard-nav usability study', 'RESEARCH STUDY', 'Power users live on the keyboard; mouse-only flows break them.', 'study US-15'],
    ],
  },
  {
    id: 'PK-004',
    title: 'Competitor platform capability tracker',
    questions: 'What are peer platforms shipping each quarter?',
    count: 12,
    owner: 'A. Brooks',
    refreshed: '4d ago',
    sources: [
      ['Quarterly capability matrix', 'COMPETITOR INTEL', 'Three of five tracked platforms now ship AI meeting summaries.', 'intel CI-200 · 2026-Q1'],
      ['Win/loss interview notes', 'COMPETITOR INTEL', 'Automation depth cited in 8 of 12 competitive losses.', 'intel CI-198'],
    ],
  },
];

const KIND: Record<string, [string, string]> = {
  'USER FEEDBACK': ['#EEF1FF', '#3D5AFE'],
  'RESEARCH STUDY': ['#E6F5F3', '#0E9C8C'],
  BEHAVIORAL: ['#EAECF5', '#1E2761'],
  'COMPETITOR INTEL': ['#FBF0E4', '#B95C00'],
};

export default function S09ResearchPacks({ goQa }: Props) {
  const [sel, setSel] = useState('PK-014');
  const selPack = PACKS.find((pk) => pk.id === sel) || PACKS[0];

  return (
    <div data-screen-label="S9 · DesignAI Research Packs" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#0E9C8C' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>DesignAI · Research Packs</h1>
        <span style={{ background: '#E6F5F3', color: '#0E9C8C', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}>PROTOAI</span>
        <div style={{ flex: 1 }} />
        <div
          title="Weekly active researchers vs ≥70% adoption target"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E4E9F2',
            borderRadius: 7,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}
        >
          <span style={{ fontSize: 10.5, color: '#5B6472' }}>Weekly active researchers</span>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: '#1B7F4D' }}>9/12 · 75%</span>
          <span style={{ width: 54, height: 5, borderRadius: 3, background: '#F0F3F9', display: 'inline-block' }}>
            <span style={{ display: 'block', width: '75%', height: 5, borderRadius: 3, background: '#1B7F4D' }} />
          </span>
          <span style={{ fontSize: 10, color: '#8A93A6' }}>target ≥70%</span>
        </div>
        <span onClick={goQa} className="hvr-underline" style={{ fontSize: 11.5, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
          ← Ask the library
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 18, alignItems: 'start' }}>
        {/* Pack gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PACKS.map((pk) => (
            <div
              key={pk.id}
              onClick={() => setSel(pk.id)}
              className="hvr-shadow"
              style={{
                background: '#FFFFFF',
                border: `1.5px solid ${pk.id === sel ? '#0E9C8C' : '#E4E9F2'}`,
                borderRadius: 10,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'border .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{pk.id}</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: '#8A93A6' }}>refreshed {pk.refreshed}</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1E2761', lineHeight: 1.4 }}>{pk.title}</div>
              <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 4, lineHeight: 1.5 }}>{pk.questions}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9, fontSize: 10.5, color: '#8A93A6' }}>
                <span>
                  <strong style={{ color: '#5B6472' }}>{pk.count}</strong> sources
                </span>
                <span>
                  owner <strong style={{ color: '#5B6472' }}>{pk.owner}</strong>
                </span>
                <div style={{ flex: 1 }} />
                <span style={{ color: '#0E9C8C', fontWeight: 600 }}>Open →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pack detail */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden', position: 'sticky', top: 16 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>PACK DETAIL</span>
              <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{selPack.id}</span>
              <div style={{ flex: 1 }} />
              <span
                className="hvr-op90"
                style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF', background: '#0E9C8C', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}
              >
                Export to Confluence
              </span>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: '#1E2761', marginTop: 8 }}>{selPack.title}</div>
            <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 3 }}>
              {selPack.questions} · curated by {selPack.owner} · {selPack.count} ordered sources
            </div>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {selPack.sources.map(([title, kind, excerpt, ref], i) => (
              <div key={i} style={{ border: '1px solid #F0F3F9', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 11 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
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
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{title}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: KIND[kind][1], background: KIND[kind][0], borderRadius: 999, padding: '1px 6px' }}>
                      {kind}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#5B6472', fontStyle: 'italic', marginTop: 3, lineHeight: 1.5 }}>"{excerpt}"</div>
                  <div style={{ fontFamily: MONO, fontSize: 9.5, color: '#A6AFC0', marginTop: 4 }}>{ref}</div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 10.5, color: '#A6AFC0', marginTop: 2 }}>
              Sources are pointers into the unified insight index — excerpts stay linked to their originals for audit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
