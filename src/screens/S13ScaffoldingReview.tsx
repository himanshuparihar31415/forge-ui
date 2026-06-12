import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

type LineKind = 'plain' | 'anno' | 'kw' | 'stub';
type CodeLine = [string, LineKind];

const FILES: [string, number][] = [
  ['SummaryService.java', 142],
  ['SummaryController.java', 88],
  ['TranscriptClient.java', 64],
  ['SummaryRepository.java', 51],
  ['SummaryConfig.java', 39],
  ['SummaryServiceTest.java', 120],
  ['helm/values.yaml', 47],
];

const CODE: Record<string, CodeLine[]> = {
  'SummaryService.java': [
    ['package com.lpl.advw.summary;', 'plain'],
    ['', 'plain'],
    ['@Service', 'anno'],
    ['public class SummaryService {', 'kw'],
    ['', 'plain'],
    ['  private final TranscriptClient transcripts;', 'plain'],
    ['  private final SummaryRepository repository;', 'plain'],
    ['  private final MeterRegistry metrics; // OBS-01', 'plain'],
    ['', 'plain'],
    ['  @EventListener(CallCompletedEvent.class)', 'anno'],
    ['  public void onCallCompleted(CallCompletedEvent event) {', 'kw'],
    ['    var transcript = transcripts.fetchRedacted(event.callId()); // SEC-03: PII pre-redacted', 'plain'],
    ['', 'plain'],
    ['    // FORGE-STUB: implement business logic — see AC-3', 'stub'],
    ['    // Assemble summary sections per the standing note template:', 'stub'],
    ['    // attendees, topics, decisions, follow-ups, disclosures discussed.', 'stub'],
    ['    Summary draft = Summary.draftOf(event.callId());', 'plain'],
    ['', 'plain'],
    ['    repository.save(draft.withState(DraftState.AI_DRAFT_NOT_FILED)); // AC-2', 'plain'],
    ['    metrics.timer("summary.latency").record(event.elapsed()); // NFR-P1', 'plain'],
    ['  }', 'kw'],
    ['}', 'kw'],
  ],
  'SummaryController.java': [
    ['package com.lpl.advw.summary;', 'plain'],
    ['', 'plain'],
    ['@RestController', 'anno'],
    ['@RequestMapping("/api/v1/meetings/{meetingId}/summary")', 'anno'],
    ['public class SummaryController {', 'kw'],
    ['', 'plain'],
    ['  @GetMapping', 'anno'],
    ['  public SummaryView get(@PathVariable String meetingId) {', 'kw'],
    ['    // FORGE-STUB: implement business logic — see AC-1', 'stub'],
    ['    // Return draft with state + provenance chip for the record UI.', 'stub'],
    ['    throw new NotImplementedException();', 'plain'],
    ['  }', 'kw'],
    ['', 'plain'],
    ['  @PostMapping("/confirm")', 'anno'],
    ['  public ResponseEntity<Void> confirm(@PathVariable String meetingId) {', 'kw'],
    ['    // FORGE-STUB: confirmation records identity + edit distance (AC in 2214)', 'stub'],
    ['    throw new NotImplementedException();', 'plain'],
    ['  }', 'kw'],
    ['}', 'kw'],
  ],
  'TranscriptClient.java': [
    ['package com.lpl.advw.summary;', 'plain'],
    ['', 'plain'],
    ['@Component', 'anno'],
    ['public class TranscriptClient {', 'kw'],
    ['', 'plain'],
    ['  @Retryable(maxAttempts = 5, backoff = @Backoff(multiplier = 2)) // RES-02', 'anno'],
    ['  public RedactedTranscript fetchRedacted(String callId) {', 'kw'],
    ['    // Redaction happens upstream — raw text never enters this service (NFR-S1).', 'plain'],
    ['    // FORGE-STUB: wire to transcript platform endpoint per INT-07.', 'stub'],
    ['    throw new NotImplementedException();', 'plain'],
    ['  }', 'kw'],
    ['}', 'kw'],
  ],
};

const genericCode = (name: string): CodeLine[] => [
  ['// ' + name, 'plain'],
  ['// AI-drafted scaffolding — open in IDE for full content.', 'plain'],
  ['', 'plain'],
  ['// FORGE-STUB: implement business logic — see linked ACs.', 'stub'],
];

const LINE_COLOR: Record<LineKind, string> = { stub: '#B95C00', anno: '#6D2E46', kw: '#1E2761', plain: '#2A2F3A' };

export default function S13ScaffoldingReview() {
  const [sel, setSel] = useState('SummaryService.java');
  const [accepted, setAccepted] = useState<Record<string, boolean>>({
    'SummaryService.java': true,
    'SummaryRepository.java': true,
    'SummaryConfig.java': true,
    'SummaryServiceTest.java': true,
  });
  const [pr, setPr] = useState(false);

  const lines = CODE[sel] || genericCode(sel);
  const acceptedCount = Object.values(accepted).filter(Boolean).length + 3; // +3 accepted among unlisted files
  const pct = Math.round((acceptedCount / 12) * 100);

  return (
    <div data-screen-label="S13 · CodeIQ Scaffolding Review" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#B95C00' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>CodeIQ · Scaffolding Review</h1>
        <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
          FRG-1041
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#3D5AFE' }}>ADVW-2211-1</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#5B6472' }}>
          accepted{' '}
          <strong style={{ fontFamily: MONO, color: pct >= 60 ? '#1B7F4D' : '#B95C00' }}>
            {acceptedCount}/12 files · {pct}%
          </strong>{' '}
          <span style={{ color: '#8A93A6' }}>feeds ≥60% KPI</span>
        </span>
        <div
          onClick={() => setPr(true)}
          className="hvr-op92"
          style={{
            height: 34,
            padding: '0 16px',
            borderRadius: 7,
            background: pr ? '#1B7F4D' : '#1E2761',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {pr ? 'Draft PR #482 open ↗' : 'Create draft PR'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 248px', gap: 14, alignItems: 'start' }}>
        {/* LEFT · story context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 8 }}>STORY</div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.45 }}>Generate draft summary after each recorded call</div>
            <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 5, lineHeight: 1.55 }}>
              As an advisor, I want a draft meeting summary generated after each recorded client call so that I never start notes from a blank page.
            </div>
            <div style={{ marginTop: 10, background: '#FAFBFE', border: '1px solid #F0F3F9', borderRadius: 7, padding: '9px 11px' }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', color: '#8A93A6', marginBottom: 5 }}>ACCEPTANCE CRITERIA</div>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: '#5B6472' }}>
                <span style={{ fontFamily: MONO, color: '#A6AFC0' }}>AC-1</span> Draft appears on the meeting record when processing finishes
                <br />
                <span style={{ fontFamily: MONO, color: '#A6AFC0' }}>AC-2</span> Draft labeled "AI draft — not filed" until confirmed
                <br />
                <span style={{ fontFamily: MONO, color: '#A6AFC0' }}>AC-3</span> Summary content assembled per note template
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 8 }}>APPLICABLE LPL STANDARDS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>SEC-03 · data-at-rest encryption ✓</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>INT-07 · async integration ✓</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>OBS-01 · structured logs + traces ✓</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>RES-02 · retry with backoff ✓</span>
            </div>
          </div>
          {/* File tree */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', padding: '4px 6px 8px' }}>GENERATED FILES · 12</div>
            {FILES.map(([name, lc]) => {
              const acc = !!accepted[name];
              return (
                <div
                  key={name}
                  onClick={() => setSel(name)}
                  className="hvr-bg-orange"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: sel === name ? '#FBF0E4' : 'transparent',
                  }}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccepted((a) => ({ ...a, [name]: !a[name] }));
                    }}
                    title="Accept file"
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 4,
                      border: `1.5px solid ${acc ? '#1B7F4D' : '#C9D3E4'}`,
                      background: acc ? '#1B7F4D' : '#FFFFFF',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 700,
                      flex: 'none',
                    }}
                  >
                    {acc ? '✓' : ''}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 11,
                      color: sel === name ? '#B95C00' : '#5B6472',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {name}
                  </span>
                  <span style={{ fontSize: 9, color: '#A6AFC0' }}>{lc} ln</span>
                </div>
              );
            })}
            <div style={{ fontSize: 9.5, color: '#A6AFC0', padding: '8px 6px 2px' }}>+5 more (config, tests, helm)</div>
          </div>
        </div>

        {/* CENTER · code viewer */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: '#1E2761' }}>{sel}</span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#3D5AFE', background: '#EEF1FF', borderRadius: 999, padding: '2px 7px' }}>AI-DRAFTED</span>
            <div style={{ flex: 1 }} />
            <span className="hvr-underline" style={{ fontSize: 11, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
              Edit in place
            </span>
            <span className="hvr-underline" style={{ fontSize: 11, color: '#3D5AFE', fontWeight: 600, cursor: 'pointer' }}>
              Regenerate via chat
            </span>
          </div>
          <div style={{ background: '#FBFCFE', padding: '14px 0', fontFamily: MONO, fontSize: 11.5, lineHeight: 1.75, overflowX: 'auto' }}>
            {lines.map(([text, kind], i) => (
              <div key={i} style={{ display: 'flex', background: kind === 'stub' ? '#FBF0E4' : 'transparent' }}>
                <span style={{ width: 40, flex: 'none', textAlign: 'right', paddingRight: 14, color: '#C2CAD8', fontSize: 10, userSelect: 'none' }}>
                  {i + 1}
                </span>
                <span style={{ whiteSpace: 'pre', color: LINE_COLOR[kind] }}>{text === '' ? ' ' : text}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: '10px 14px',
              borderTop: '1px solid #E4E9F2',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FAFBFE',
            }}
          >
            <span style={{ fontSize: 10.5, color: '#8A93A6' }}>
              Stubs marked <span style={{ fontFamily: MONO, color: '#B95C00' }}>FORGE-STUB</span> are intentionally unimplemented — business logic
              stays with you.
            </span>
          </div>
        </div>

        {/* RIGHT · drift panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 9 }}>CANDIDATE ARCHITECTURE</div>
            <div
              className="hvr-bc-orange"
              style={{
                border: '1px dashed #C9D3E4',
                borderRadius: 7,
                height: 110,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#FAFBFE',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 10, color: '#8A93A6' }}>component diagram</span>
              <span style={{ fontFamily: MONO, fontSize: 9.5, color: '#A6AFC0' }}>summary-svc → queue → record-api</span>
              <span style={{ fontSize: 10, color: '#3D5AFE', fontWeight: 600 }}>open full size →</span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #BFE3CD', borderRadius: 9, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#E7F4EC',
                  color: '#1B7F4D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1B7F4D' }}>0 drift findings</span>
            </div>
            <div style={{ fontSize: 11, color: '#5B6472', marginTop: 6, lineHeight: 1.55 }}>
              Checked against ARB patterns v3.2 — nothing blocks a draft PR. Drift violations would hold the PR button.
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 8 }}>OUT-OF-SCOPE GUARD</div>
            <div style={{ fontSize: 11.5, color: '#5B6472', lineHeight: 1.6 }}>
              Forge never commits to <span style={{ fontFamily: MONO }}>main</span>. The only GitHub action available is a <strong>draft PR</strong>;
              merging stays with human code review.
            </div>
          </div>
          {pr && (
            <div style={{ background: '#FFFFFF', border: '1.5px solid #1B7F4D', borderRadius: 9, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1B7F4D' }}>Draft PR created ✓</div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#3D5AFE', marginTop: 5 }}>lpl/advisor-workstation #482 ↗</div>
              <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 6, lineHeight: 1.5 }}>
                PR body auto-includes session FRG-1041, provenance chips and trace trc-83b1c9.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
