import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

type TabId = 'traces' | 'health' | 'cost' | 'capacity';

// [name, kind, left%, width%, barColor, indent, dur, log]
const SPANS: [string, string, number, number, string, string, string, string][] = [
  ['session · FRG-1042 generation', 'AGENT', 0, 100, '#1E2761', '0px', '38.2s', 'root span — req-gen v1.3.2, prompts@2.4.0, policy envelope standard.'],
  ['fetch · confluence ADVW/417', 'TOOL', 1, 6, '#0E9C8C', '14px', '2.1s', 'GET charter · 1,840 words · etag matched cache.'],
  ['llm · ambiguity flag pass', 'LLM', 8, 22, '#3D5AFE', '14px', '8.4s', 'decision: 6 flags raised (3 blocking) — generation withheld until resolution (RFP rule).'],
  ['gate · flags resolved by PM', 'HITL', 31, 9, '#B8860B', '14px', 'wait', 'human action: 3 resolved, 2 assumptions, 1 dismissed · signed priya.sharma@lpl.com.'],
  ['llm · story-hierarchy draft', 'LLM', 41, 38, '#3D5AFE', '14px', '14.6s', 'decision: 1 epic / 7 stories / 4 NFR from resolved charter; NFR coverage check 4/4 · temp 0.3.'],
  ['tool · jira schema validate', 'TOOL', 80, 7, '#0E9C8C', '14px', '2.7s', 'all required ADVW fields present · 0 schema violations.'],
  ['llm · quality self-score', 'LLM', 88, 8, '#3D5AFE', '14px', '3.1s', 'predicted 3.8/5 vs team 4-wk avg 3.7 · calibration v2.'],
  ['emit · artifacts + ledger entry', 'SYS', 97, 3, '#5B6472', '14px', '1.3s', 'story set persisted · ledger #L-90412 · trace sealed.'],
];

const KIND: Record<string, [string, string]> = {
  AGENT: ['#EAECF5', '#1E2761'],
  TOOL: ['#E6F5F3', '#0E9C8C'],
  LLM: ['#EEF1FF', '#3D5AFE'],
  HITL: ['#FFF8E6', '#8A6508'],
  SYS: ['#F2F5FA', '#5B6472'],
};

// [name, p95, err, fallbacks, circuit, incident, dot]
const HEALTH: [string, string, string, string, string, string, string][] = [
  ['req-gen', '3.2s', '0.4%', '0', 'CLOSED', 'none in 14 days', '#1B7F4D'],
  ['research-qa', '2.4s', '0.2%', '0', 'CLOSED', 'none in 30 days', '#1B7F4D'],
  ['conformance', '11.4s', '2.6%', '3', 'HALF-OPEN', 'fallback model engaged 09:14 — recovered', '#B8860B'],
  ['scaffold-gen', '8.7s', '1.1%', '1', 'CLOSED', 'retry storm 06-08, resolved', '#1B7F4D'],
  ['test-gen', '5.1s', '0.8%', '0', 'CLOSED', 'none in 21 days', '#1B7F4D'],
];

// [name, amt, w, color, tok, perArtifact, amber]
const COSTS: [string, string, string, string, string, string, boolean][] = [
  ['req-gen', '$612', '88%', '#3D5AFE', '98M', '$2.10', false],
  ['scaffold-gen', '$540', '78%', '#B95C00', '81M', '$6.80', true],
  ['test-gen', '$388', '56%', '#6D2E46', '64M', '$2.90', false],
  ['conformance', '$301', '43%', '#B8860B', '44M', '$4.20', false],
  ['research-qa', '$176', '25%', '#0E9C8C', '31M', '$1.40', false],
  ['release-notes', '$84', '12%', '#1E2761', '12M', '$2.20', false],
];

export default function S20Observability() {
  const [tab, setTab] = useState<TabId>('traces');
  const [span, setSpan] = useState('llm · story-hierarchy draft');

  const selSpan = SPANS.find((sp) => sp[0] === span) || SPANS[0];

  const tabs: [TabId, string][] = [
    ['traces', 'Traces'],
    ['health', 'Health'],
    ['cost', 'Cost · P10'],
    ['capacity', 'Capacity'],
  ];

  return (
    <div data-screen-label="S20 · Observability" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Observability</h1>
        <span style={{ fontSize: 12.5, color: '#5B6472' }}>Traces · health · cost · capacity — every agent decision is replayable</span>
      </div>

      {/* Tabs */}
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

      {/* TRACES */}
      {tab === 'traces' && (
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
            <span style={{ fontSize: 11, color: '#8A93A6' }}>1 trace matched · Langfuse-style explorer, hosted in LPL AWS</span>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: '#1E2761' }}>trc-8841f2</span>
              <span style={{ fontSize: 11, color: '#5B6472' }}>req-gen v1.3.2 · story-set generation · FRG-1042</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>total 38.2s · $0.61 · 96k tok</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              {SPANS.map((sp) => (
                <div
                  key={sp[0]}
                  onClick={() => setSpan(sp[0])}
                  className="hvr-bg-row"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0', cursor: 'pointer' }}
                >
                  <span
                    style={{
                      width: 210,
                      flex: 'none',
                      fontFamily: MONO,
                      fontSize: 10.5,
                      color: '#5B6472',
                      paddingLeft: sp[5],
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {sp[0]}
                  </span>
                  <span
                    style={{
                      width: 54,
                      flex: 'none',
                      fontSize: 9,
                      fontWeight: 700,
                      color: KIND[sp[1]][1],
                      background: KIND[sp[1]][0],
                      borderRadius: 999,
                      padding: '1px 0',
                      textAlign: 'center',
                    }}
                  >
                    {sp[1]}
                  </span>
                  <div style={{ flex: 1, position: 'relative', height: 16, background: '#FAFBFE', borderRadius: 4 }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: 3,
                        bottom: 3,
                        left: sp[2] + '%',
                        width: sp[3] + '%',
                        borderRadius: 3,
                        background: sp[4],
                      }}
                    />
                  </div>
                  <span style={{ width: 52, flex: 'none', textAlign: 'right', fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{sp[6]}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, borderTop: '1px solid #F0F3F9', paddingTop: 11 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 6 }}>
                  DECISION LOG · {selSpan[0].toUpperCase()}
                </div>
                <div
                  style={{
                    background: '#FBFCFE',
                    border: '1px solid #F0F3F9',
                    borderRadius: 7,
                    padding: '10px 12px',
                    fontFamily: MONO,
                    fontSize: 10.5,
                    lineHeight: 1.8,
                    color: '#5B6472',
                  }}
                >
                  {selSpan[7]}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* HEALTH */}
      {tab === 'health' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 80px 80px 110px 110px 1fr',
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
            <span>AGENT</span>
            <span>P95</span>
            <span>ERR RATE</span>
            <span>FALLBACKS 24H</span>
            <span>CIRCUIT</span>
            <span>LAST INCIDENT</span>
          </div>
          {HEALTH.map(([name, p95, err, fallbacks, cb, incident, dot]) => (
            <div
              key={name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 80px 80px 110px 110px 1fr',
                gap: 8,
                padding: '10px 16px',
                borderBottom: '1px solid #F0F3F9',
                fontSize: 12,
                alignItems: 'center',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
                <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600 }}>{name}</span>
              </span>
              <span style={{ fontFamily: MONO, fontSize: 11 }}>{p95}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: parseFloat(err) > 2 ? '#B8860B' : '#5B6472' }}>{err}</span>
              <span style={{ fontFamily: MONO, fontSize: 11 }}>{fallbacks}</span>
              <span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: cb === 'CLOSED' ? '#E7F4EC' : '#FFF8E6',
                    color: cb === 'CLOSED' ? '#1B7F4D' : '#8A6508',
                  }}
                >
                  {cb}
                </span>
              </span>
              <span style={{ fontSize: 11, color: '#8A93A6' }}>{incident}</span>
            </div>
          ))}
          <div style={{ padding: '11px 16px', fontSize: 11, color: '#8A93A6', background: '#FAFBFE' }}>
            Self-healing: failed calls retry with fallback model (max 3) before surfacing a human-readable error card with trace ID — never a stack
            trace.
          </div>
        </div>
      )}

      {/* COST */}
      {tab === 'cost' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 14, alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>SPEND BY AGENT · LAST 30 DAYS</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10.5, color: '#8A93A6' }}>dimension: agent · workflow · stage · persona</span>
            </div>
            {COSTS.map(([name, amt, w, color, tok, perArtifact, amber]) => (
              <div
                key={name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 130px 90px',
                  gap: 10,
                  padding: '9px 16px',
                  borderBottom: '1px solid #F0F3F9',
                  fontSize: 12,
                  alignItems: 'center',
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}>{name}</span>
                <div style={{ height: 7, borderRadius: 4, background: '#F0F3F9' }}>
                  <div style={{ width: w, height: 7, borderRadius: 4, background: color }} />
                </div>
                <span style={{ fontFamily: MONO, fontSize: 11, color: '#5B6472' }}>
                  {amt} · {tok}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: amber ? '#B8860B' : '#1B7F4D', textAlign: 'right' }}>{perArtifact}</span>
              </div>
            ))}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 130px 90px',
                gap: 10,
                padding: '8px 16px',
                background: '#FAFBFE',
                fontSize: 10,
                color: '#8A93A6',
                fontWeight: 700,
                letterSpacing: '.05em',
              }}
            >
              <span />
              <span />
              <span>SPEND · TOKENS</span>
              <span style={{ textAlign: 'right' }}>$/ACCEPTED ↑</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#1E2761', borderRadius: 10, padding: 16, color: '#FFFFFF' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', opacity: 0.7 }}>
                COST PER ACCEPTED ARTIFACT · PRIORITY-1 LENS
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                <span style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700 }}>$3.40</span>
                <span style={{ fontSize: 11.5, opacity: 0.75 }}>blended · ↓18% vs 4 weeks ago</span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, lineHeight: 1.5 }}>
                Spend only counts when a human accepts the artifact — rejected generations are pure cost.
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 10 }}>BUDGET ALERTS</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0', borderBottom: '1px solid #F0F3F9', fontSize: 12 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#B8860B' }} />
                <span style={{ flex: 1 }}>CodeIQ at 82% of monthly budget</span>
                <span style={{ fontSize: 10, color: '#8A93A6' }}>2h ago</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0', fontSize: 12 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1B7F4D' }} />
                <span style={{ flex: 1 }}>All other modules under 70%</span>
                <span style={{ fontSize: 10, color: '#8A93A6' }}>now</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAPACITY */}
      {tab === 'capacity' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>CONCURRENT SESSIONS</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
              <span style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: '#1E2761' }}>37</span>
              <span style={{ fontSize: 13, color: '#8A93A6' }}>/ 100 Phase-1 ceiling</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: '#F0F3F9', marginTop: 12 }}>
              <div style={{ width: '37%', height: 8, borderRadius: 4, background: '#3D5AFE' }} />
            </div>
            <div style={{ display: 'flex', marginTop: 8, fontSize: 10.5, color: '#8A93A6' }}>
              <span>peak today 52</span>
              <div style={{ flex: 1 }} />
              <span>autoscale headroom ✓</span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 12 }}>BY WORKFLOW · NOW</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(
                [
                  ['WF-A', '6', '16%', '#1E2761'],
                  ['WF-B', '22', '59%', '#3D5AFE'],
                  ['WF-C', '9', '24%', '#6D2E46'],
                ] as const
              ).map(([wf, n, w, color]) => (
                <div key={wf}>
                  <div style={{ display: 'flex', fontSize: 11.5, marginBottom: 4 }}>
                    <span style={{ fontFamily: MONO }}>{wf}</span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontFamily: MONO, color: '#5B6472' }}>{n}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: '#F0F3F9' }}>
                    <div style={{ width: w, height: 6, borderRadius: 3, background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 12 }}>All compute inside LPL AWS us-east-1 · zero data egress.</div>
          </div>
        </div>
      )}
    </div>
  );
}
