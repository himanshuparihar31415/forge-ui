import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  goMatrix: () => void;
}

// [id, title, type, ac, script]
const CASES: [string, string, string, string, string][] = [
  ['TC-2211-01', 'Draft appears on meeting record after processing', 'FUNC', 'AC-1', 'generated'],
  ['TC-2211-02', 'Draft labeled "AI draft — not filed" until confirmed', 'FUNC', 'AC-2', 'generated'],
  ['TC-2211-03', 'Summary sections follow standing note template', 'UNIT', 'AC-3', 'generated'],
  ['TC-2213-01', 'Draft visible within 120s (p95) of call end', 'FUNC', 'AC-1', 'generated'],
  ['TC-2213-02', 'Delayed state with ETA when bound exceeded', 'FUNC', 'AC-2', 'generated'],
  ['TC-2215-01', 'Confirmed note written to Document Vault + linked', 'FUNC', 'AC-1', 'generated'],
  ['TC-2216-01', 'Failure offers retry and manual path, no data loss', 'UNIT', 'AC-1', 'generated'],
  ['TC-2217-01', 'Filing emits time + edit-distance telemetry', 'UNIT', 'AC-1', 'needs input'],
];

type ScriptLine = [string, 'plain' | 'anno' | 'kw'];

const SCRIPTS: Record<string, [string, ScriptLine[]]> = {
  'TC-2211-01': [
    'SummaryDraftAppearsTest.java',
    [
      ['@Test // TC-2211-01 — ADVW-2211 AC-1', 'anno'],
      ['void draftAppearsWhenProcessingFinishes() {', 'kw'],
      ['  var call = testInfra.completedRecordedCall();', 'plain'],
      ['  events.publish(new CallCompletedEvent(call.id()));', 'plain'],
      ['', 'plain'],
      ['  await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->', 'plain'],
      ['    assertThat(meetingRecord(call.id()).summaryDraft())', 'plain'],
      ['      .isPresent());', 'plain'],
      ['}', 'kw'],
    ],
  ],
  'TC-2213-02': [
    'DelayedStateTest.java',
    [
      ['@Test // TC-2213-02 — ADVW-2213 AC-2', 'anno'],
      ['void delayedStateShownWhenLatencyBoundExceeded() {', 'kw'],
      ['  clock.freeze();', 'plain'],
      ['  events.publish(slowProcessingCall());', 'plain'],
      ['  clock.advance(Duration.ofSeconds(121));', 'plain'],
      ['', 'plain'],
      ['  assertThat(recordView().state()).isEqualTo(DELAYED_WITH_ETA);', 'plain'],
      ['  assertThat(recordView().silentFailure()).isFalse();', 'plain'],
      ['}', 'kw'],
    ],
  ],
};

// [kind, id, title, note]
const REGS: [string, string, string, string][] = [
  ['ADD', 'REG-ADVW-311', 'Meeting record render with AI-draft chip present', 'suggested → REG-ADVW-CORE'],
  ['ADD', 'REG-ADVW-312', 'Vault write retry idempotency under duplicate confirm', 'suggested → REG-ADVW-CORE'],
  ['ADD', 'REG-ADVW-313', 'Summary latency alarm does not fire under p50 load', 'suggested → REG-ADVW-CORE'],
  ['ADD', 'REG-ADVW-314', 'Note search includes confirmed AI-drafted notes', 'suggested → REG-ADVW-CORE'],
  ['IMPACT', 'REG-ADVW-118', 'Meeting record load — selector changed by summary panel', 'update assertion'],
  ['IMPACT', 'REG-ADVW-124', 'Record timeline ordering with new draft events', 'update fixture'],
];

const TYPE: Record<string, [string, string]> = { FUNC: ['#EEF1FF', '#3D5AFE'], UNIT: ['#EAECF5', '#1E2761'] };

export default function S14TestGeneration({ goMatrix }: Props) {
  const [src, setSrc] = useState<'stories' | 'pr'>('stories');
  const [tab, setTab] = useState<'cases' | 'reg'>('cases');
  const [sel, setSel] = useState('TC-2211-01');
  const [committed, setCommitted] = useState(false);

  const def: [string, ScriptLine[]] = [
    'GeneratedTest.java',
    [
      ['// Script for ' + sel, 'plain'],
      ['// Linked to its AC for traceability; runnable in LPL test infra.', 'plain'],
      ['', 'plain'],
      ['@Test', 'anno'],
      ['void generatedScenario() { /* full script opens in IDE */ }', 'kw'],
    ],
  ];
  const [selFile, lines] = SCRIPTS[sel] || def;
  const isCases = tab === 'cases';

  return (
    <div data-screen-label="S14 · IntelliQA Test Generation" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#6D2E46' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>IntelliQA · Test Generation</h1>
        <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
          FRG-1039
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '3px 9px' }}>
          QA TEST ACCEPTANCE 71% · TARGET ≥70
        </span>
        <span onClick={goMatrix} className="hvr-underline" style={{ fontSize: 11.5, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
          Traceability matrix →
        </span>
      </div>

      {/* Input strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>INPUT</span>
        <div style={{ display: 'flex', border: '1px solid #E4E9F2', borderRadius: 7, overflow: 'hidden', background: '#FFFFFF' }}>
          <span
            onClick={() => setSrc('stories')}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: src === 'stories' ? '#F5EBF0' : '#FFFFFF',
              color: src === 'stories' ? '#6D2E46' : '#5B6472',
            }}
          >
            Story set FRG-1042 · 12 issues
          </span>
          <span
            onClick={() => setSrc('pr')}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: src === 'pr' ? '#F5EBF0' : '#FFFFFF',
              color: src === 'pr' ? '#6D2E46' : '#5B6472',
              borderLeft: '1px solid #E4E9F2',
            }}
          >
            PR #482 · summary-svc
          </span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#8A93A6' }}>test-gen v1.1.0 · framework: JUnit 5 + Karate (repo convention)</span>
      </div>

      {/* Coverage gap panel */}
      <div
        style={{
          background: '#FFF8E6',
          border: '1.5px solid #B8860B',
          borderRadius: 10,
          padding: '13px 16px',
          marginBottom: 14,
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: '#B8860B',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            flex: 'none',
          }}
        >
          !
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#5C4404' }}>
            Coverage gaps — must be resolved or explicitly waived before commit
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <span
              style={{ fontSize: 11, fontWeight: 600, color: '#7A5E0E', background: '#FFFFFF', border: '1px solid #E8D9A8', borderRadius: 6, padding: '4px 10px' }}
            >
              AC without tests: <span style={{ fontFamily: MONO }}>FRG-1042-5 · AC-2</span> (records-API timeout path)
            </span>
            <span
              style={{ fontSize: 11, fontWeight: 600, color: '#7A5E0E', background: '#FFFFFF', border: '1px solid #E8D9A8', borderRadius: 6, padding: '4px 10px' }}
            >
              Uncovered branches: <span style={{ fontFamily: MONO }}>3</span> in <span style={{ fontFamily: MONO }}>SummaryService.onCallCompleted</span>
            </span>
            <span
              className="hvr-bg-lblue"
              style={{ fontSize: 11, fontWeight: 600, color: '#3D5AFE', background: '#FFFFFF', border: '1px solid #C9D6FF', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}
            >
              Generate tests for gaps
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E4E9F2', marginBottom: 12 }}>
        <div
          onClick={() => setTab('cases')}
          style={{
            padding: '9px 16px',
            fontSize: 12.5,
            fontWeight: 600,
            color: isCases ? '#1E2761' : '#8A93A6',
            borderBottom: `2px solid ${isCases ? '#6D2E46' : 'transparent'}`,
            cursor: 'pointer',
          }}
        >
          Generated test cases{' '}
          <span style={{ fontSize: 10, background: '#F5EBF0', color: '#6D2E46', borderRadius: 999, padding: '1px 7px', fontWeight: 700 }}>8</span>
        </div>
        <div
          onClick={() => setTab('reg')}
          style={{
            padding: '9px 16px',
            fontSize: 12.5,
            fontWeight: 600,
            color: !isCases ? '#1E2761' : '#8A93A6',
            borderBottom: `2px solid ${!isCases ? '#6D2E46' : 'transparent'}`,
            cursor: 'pointer',
          }}
        >
          Regression suggestions{' '}
          <span style={{ fontSize: 10, background: '#F2F5FA', color: '#5B6472', borderRadius: 999, padding: '1px 7px', fontWeight: 700 }}>12 + 4</span>
        </div>
      </div>

      {isCases && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 14, alignItems: 'start' }}>
          {/* Test case table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '96px 1fr 76px 64px 86px',
                gap: 8,
                padding: '8px 14px',
                borderBottom: '1px solid #E4E9F2',
                background: '#FAFBFE',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '.06em',
                color: '#8A93A6',
              }}
            >
              <span>ID</span>
              <span>TITLE</span>
              <span>TYPE</span>
              <span>AC</span>
              <span>SCRIPT</span>
            </div>
            {CASES.map(([id, title, type, ac, script]) => (
              <div
                key={id}
                onClick={() => setSel(id)}
                className="hvr-bg-mauve"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '96px 1fr 76px 64px 86px',
                  gap: 8,
                  padding: '9px 14px',
                  borderBottom: '1px solid #F0F3F9',
                  fontSize: 12,
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: sel === id ? '#F5EBF0' : 'transparent',
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color: '#6D2E46' }}>{id}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
                <span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: TYPE[type][0], color: TYPE[type][1] }}>
                    {type}
                  </span>
                </span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: '#5B6472' }}>{ac}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: script === 'generated' ? '#1B7F4D' : '#B8860B' }}>
                  {script === 'generated' ? 'generated ✓' : 'needs input'}
                </span>
              </div>
            ))}
          </div>

          {/* Script viewer */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, overflow: 'hidden', position: 'sticky', top: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
              <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: '#1E2761' }}>{selFile}</span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#1B7F4D', background: '#E7F4EC', borderRadius: 999, padding: '2px 7px' }}>
                RUNNABLE IN LPL TEST INFRA
              </span>
              <div style={{ flex: 1 }} />
              <span className="hvr-underline" style={{ fontSize: 11, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
                Run
              </span>
            </div>
            <div style={{ background: '#FBFCFE', padding: '12px 0', fontFamily: MONO, fontSize: 11, lineHeight: 1.75, overflowX: 'auto' }}>
              {lines.map(([text, kind], i) => (
                <div key={i} style={{ display: 'flex' }}>
                  <span style={{ width: 36, flex: 'none', textAlign: 'right', paddingRight: 12, color: '#C2CAD8', fontSize: 9.5, userSelect: 'none' }}>
                    {i + 1}
                  </span>
                  <span style={{ whiteSpace: 'pre', color: kind === 'anno' ? '#6D2E46' : kind === 'kw' ? '#1E2761' : '#2A2F3A' }}>
                    {text === '' ? ' ' : text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isCases && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: '16px 18px' }}>
          <div style={{ fontSize: 12.5, lineHeight: 1.6, color: '#5B6472', marginBottom: 12 }}>
            <strong style={{ color: '#2A2F3A' }}>12 existing regression tests are impacted by this change</strong> — signatures touched in
            summary-svc and record-api. <strong style={{ color: '#2A2F3A' }}>4 additions suggested</strong> to suite{' '}
            <span style={{ fontFamily: MONO, fontSize: 11.5 }}>REG-ADVW-CORE</span>:
          </div>
          {REGS.map(([kind, id, title, note]) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F0F3F9' }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  background: kind === 'ADD' ? '#E7F4EC' : '#FBF6E6',
                  color: kind === 'ADD' ? '#1B7F4D' : '#8A6508',
                  flex: 'none',
                }}
              >
                {kind}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#6D2E46', width: 120, flex: 'none' }}>{id}</span>
              <span style={{ fontSize: 12, flex: 1 }}>{title}</span>
              <span style={{ fontSize: 10.5, color: '#8A93A6' }}>{note}</span>
            </div>
          ))}
        </div>
      )}

      {/* HITL */}
      <div
        style={{
          marginTop: 16,
          background: '#FFF8E6',
          border: '1.5px solid #B8860B',
          borderRadius: 10,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
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
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#5C4404' }}>Approve &amp; commit tests to the repo</div>
          <div style={{ fontSize: 11.5, color: '#7A5E0E', marginTop: 3 }}>
            8 test cases + 4 regression additions · signed sara.iqbal@lpl.com · recorded to ledger · acceptance feeds the ≥70% KPI.
          </div>
        </div>
        <div
          onClick={() => setCommitted(true)}
          className="hvr-op92"
          style={{
            height: 38,
            padding: '0 20px',
            borderRadius: 7,
            background: committed ? '#1B7F4D' : '#1E2761',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {committed ? 'Committed ✓ · ledger L-90488' : 'Approve & commit — signed'}
        </div>
      </div>
    </div>
  );
}
