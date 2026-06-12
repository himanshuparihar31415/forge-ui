import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

type TabId = 'disc' | 'omis' | 'dev';

// [id, severity, text, sydd, sd, code, fix]
type Finding = [string, string, string, string, string, string, string];

const DATA: Record<TabId, Finding[]> = {
  disc: [
    ['D-01', 'CRITICAL', 'SD §6.1 requires field-level encryption for account numbers at rest; PositionsCache stores plaintext.', '—', '§6.1', 'PositionsCache.java:88', 'Apply envelope encryption per ARB pattern SEC-03; rotate affected cache entries.'],
    ['D-02', 'HIGH', 'SD §4.2 specifies async event processing for trade notifications; implementation uses a synchronous REST call.', '§3.1', '§4.2', 'TradeNotifSvc.java:214', 'Introduce queue-based processing per ARB pattern INT-07; REST path remains as fallback only.'],
    ['D-03', 'MEDIUM', 'SyDD §3.4 mandates retry with exponential backoff; implementation loops with a fixed 1s interval.', '§3.4', '—', 'NotifRetry.java:41', 'Adopt resilience pattern RES-02 (backoff + jitter, max 5 attempts).'],
    ['D-04', 'MEDIUM', 'SD §5.3 requires idempotency keys on notification POSTs; none are generated or checked.', '—', '§5.3', 'NotifController.java:129', 'Generate idempotency key per request; dedupe window 24h per SD §5.3.'],
    ['D-05', 'LOW', 'SyDD §2.2 service naming standard (lpl-adv-*) not followed; repo deploys advwk-* services.', '§2.2', '—', 'helm/values.yaml:12', 'Rename at next minor release; alias old names during transition.'],
  ],
  omis: [
    ['O-01', 'HIGH', 'SD §7.1 specifies dead-letter handling for failed notifications; no DLQ exists in infrastructure.', '—', '§7.1', 'infra/sqs.tf (absent)', 'Provision DLQ with 14-day retention and alerting per INT-07 appendix.'],
    ['O-02', 'MEDIUM', 'SyDD §8.2 requires an audit log entry on notification-preference changes; not implemented.', '§8.2', '—', 'PrefsService.java', 'Emit audit event on every preference mutation; route to the governance ledger.'],
    ['O-03', 'MEDIUM', 'SD §4.5 requires a circuit breaker around the market-data client; calls are unguarded.', '—', '§4.5', 'MarketDataClient.java:57', 'Wrap client in platform circuit breaker (RES-01); trip at 50% failure over 30s.'],
    ['O-04', 'LOW', 'SyDD §9.1 requires a runbook link in the service README; none present.', '§9.1', '—', 'README.md', 'Add runbook link; CI lint rule available to enforce.'],
  ],
  dev: [
    ['V-01', 'HIGH', "Reporting job reads another service's database directly instead of using its API, deviating from ARB DATA-02.", '—', '—', 'ReportingJob.java:203', 'Replace direct read with the positions API; backfill contract test.'],
    ['V-02', 'MEDIUM', 'Custom JWT parsing implemented instead of the platform auth library, deviating from ARB SEC-08.', '—', '—', 'AuthFilter.java:74', 'Swap to platform auth lib; custom parser removed in same change.'],
    ['V-03', 'LOW', 'Log output deviates from the structured-logging standard (plain text, not JSON).', '—', '—', 'log4j2.xml', 'Adopt structured layout; dashboards depend on JSON fields.'],
  ],
};

const SEV: Record<string, [string, string]> = {
  CRITICAL: ['#FDEEEF', '#C7131F'],
  HIGH: ['#FBF0E4', '#B95C00'],
  MEDIUM: ['#FBF6E6', '#8A6508'],
  LOW: ['#F2F5FA', '#5B6472'],
};
const ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const STANDARDS: [string, string, boolean][] = [
  ['Data protection', 'SEC-03', false],
  ['Service auth', 'SEC-08', false],
  ['Async integration', 'INT-07', false],
  ['Resilience', 'RES-01/02', false],
  ['Observability', 'OBS-01', true],
  ['Accessibility', 'AX-01', true],
];

export default function S11FindingsReview() {
  const [tab, setTab] = useState<TabId>('disc');
  const [status, setStatus] = useState<Record<string, 'accepted' | 'dismissed'>>({});
  const [adjusted, setAdjusted] = useState<Record<string, number>>({});
  const [published, setPublished] = useState(false);

  const tabs: [TabId, string, number][] = [
    ['disc', 'Discrepancies', DATA.disc.length],
    ['omis', 'Omissions', DATA.omis.length],
    ['dev', 'Deviations', DATA.dev.length],
  ];

  const all = [...DATA.disc, ...DATA.omis, ...DATA.dev];
  const reviewed = all.filter((f) => status[f[0]]).length;
  const ready = reviewed === all.length;

  return (
    <div data-screen-label="S11 · Architect Hub Findings Review" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#B8860B' }} />
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Architect Hub · Findings Review</h1>
        <span style={{ fontFamily: MONO, fontSize: 12, color: '#5B6472', border: '1px solid #E4E9F2', background: '#FFFFFF', borderRadius: 5, padding: '2px 8px' }}>
          FRG-1036
        </span>
        <span style={{ background: '#FBF6E6', color: '#8A6508', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px' }}>
          CONFORMANCE V0.9.4 · RUN 2026-06-11
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '3px 9px' }}>
          FINDINGS ACCEPTANCE 91% · TARGET ≥90
        </span>
        <span style={{ background: '#E7F4EC', color: '#1B7F4D', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '3px 9px' }}>
          TRACEABLE 97% · TARGET ≥95
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 16, marginLeft: 22 }}>
        Every architect action — accept, adjust, dismiss — is tracked to the audit ledger with justification.
      </div>

      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        {/* MAIN */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E4E9F2', marginBottom: 12 }}>
            {tabs.map(([id, label, count]) => (
              <div
                key={id}
                onClick={() => setTab(id)}
                className="hvr-c-navy"
                style={{
                  padding: '9px 16px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: tab === id ? '#1E2761' : '#8A93A6',
                  borderBottom: `2px solid ${tab === id ? '#B8860B' : 'transparent'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                {label}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: tab === id ? '#FBF6E6' : '#F2F5FA',
                    color: tab === id ? '#8A6508' : '#8A93A6',
                    borderRadius: 999,
                    padding: '1px 7px',
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ alignSelf: 'center', fontSize: 10.5, color: '#8A93A6' }}>
              {reviewed} of {all.length} findings reviewed
            </span>
          </div>

          {/* Findings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DATA[tab].map((f) => {
              const [id, sev0, text, sydd, sd, code, fix] = f;
              const adj = adjusted[id] || 0;
              const sev = ORDER[Math.min(ORDER.indexOf(sev0) + adj, 3)];
              const st = status[id];
              return (
                <div
                  key={id}
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${st === 'accepted' ? '#BFE3CD' : '#E4E9F2'}`,
                    borderRadius: 9,
                    padding: '13px 15px',
                    opacity: st === 'dismissed' ? 0.55 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: '.04em',
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: SEV[sev][0],
                        color: SEV[sev][1],
                        flex: 'none',
                      }}
                    >
                      {sev}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{id}</span>
                    {adj > 0 && (
                      <span style={{ fontSize: 9.5, color: '#8A6508', background: '#FFF8E6', borderRadius: 999, padding: '1px 7px', fontWeight: 600 }}>
                        severity adjusted
                      </span>
                    )}
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: st === 'accepted' ? '#1B7F4D' : '#8A93A6' }}>
                      {st === 'accepted' ? 'ACCEPTED ✓' : st === 'dismissed' ? 'DISMISSED' : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, marginTop: 7 }}>{text}</div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap', fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>
                    {sydd !== '—' && <span>SyDD {sydd}</span>}
                    {sd !== '—' && <span>SD {sd}</span>}
                    <span className="hvr-underline" style={{ color: '#3D5AFE', cursor: 'pointer' }}>
                      {code} →
                    </span>
                    <span style={{ color: '#1B7F4D' }}>traceability ✓</span>
                  </div>
                  <div
                    style={{
                      marginTop: 9,
                      background: '#FAFBFE',
                      border: '1px solid #F0F3F9',
                      borderRadius: 7,
                      padding: '9px 12px',
                      fontSize: 12,
                      color: '#5B6472',
                      lineHeight: 1.55,
                    }}
                  >
                    <strong style={{ color: '#2A2F3A' }}>Remediation:</strong> {fix}
                  </div>
                  {!st && (
                    <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
                      <span
                        onClick={() => setStatus((s) => ({ ...s, [id]: 'accepted' }))}
                        className="hvr-bg-green"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#1B7F4D',
                          border: '1px solid #BFE3CD',
                          borderRadius: 6,
                          padding: '4px 11px',
                          cursor: 'pointer',
                        }}
                      >
                        Accept
                      </span>
                      <span
                        onClick={() =>
                          setAdjusted((a) => ({ ...a, [id]: Math.min((a[id] || 0) + 1, 3 - ORDER.indexOf(sev0)) }))
                        }
                        className="hvr-bg-cream"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#8A6508',
                          border: '1px solid #E8D9A8',
                          borderRadius: 6,
                          padding: '4px 11px',
                          cursor: 'pointer',
                        }}
                      >
                        Adjust severity ↓
                      </span>
                      <span
                        onClick={() => setStatus((s) => ({ ...s, [id]: 'dismissed' }))}
                        className="hvr-bg-grey"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#5B6472',
                          border: '1px solid #E4E9F2',
                          borderRadius: 6,
                          padding: '4px 11px',
                          cursor: 'pointer',
                        }}
                      >
                        Dismiss with justification
                      </span>
                    </div>
                  )}
                  {st === 'dismissed' && (
                    <div style={{ marginTop: 8, fontSize: 11, color: '#8A93A6', borderTop: '1px dashed #E4E9F2', paddingTop: 7 }}>
                      Justification recorded: accepted risk for this release window — revisit at next ARB review. Logged to ledger.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

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
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#5C4404' }}>Approve &amp; publish conformance report to Confluence</div>
              <div style={{ fontSize: 11.5, color: '#7A5E0E', marginTop: 3 }}>
                Signed with your identity (arjun.verma@lpl.com) · recorded to the audit ledger · report lands in ARCH space with full traceability
                refs.
              </div>
            </div>
            <div
              onClick={() => ready && setPublished(true)}
              className="hvr-op92"
              style={{
                height: 38,
                padding: '0 20px',
                borderRadius: 7,
                background: published ? '#1B7F4D' : ready ? '#1E2761' : '#E4E9F2',
                color: ready || published ? '#FFFFFF' : '#A6AFC0',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                fontWeight: 600,
                cursor: ready ? 'pointer' : 'not-allowed',
              }}
            >
              {published ? 'Published ✓ · ledger L-90471' : ready ? 'Approve & publish — signed' : 'Review all findings first'}
            </div>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div style={{ width: 264, flex: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6', marginBottom: 10 }}>STANDARDS COMPLIANCE</div>
            {STANDARDS.map(([name, ref, pass]) => (
              <div key={ref} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #F0F3F9' }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: pass ? '#E7F4EC' : '#FDEEEF',
                    color: pass ? '#1B7F4D' : '#C7131F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 700,
                    flex: 'none',
                  }}
                >
                  {pass ? '✓' : '✗'}
                </span>
                <span style={{ fontSize: 11.5, flex: 1 }}>{name}</span>
                <span style={{ fontFamily: MONO, fontSize: 9.5, color: '#8A93A6' }}>{ref}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6', marginBottom: 10 }}>DRIFT VS ARB PATTERNS</div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: '#5B6472' }}>3 of 48 patterns drifted in this codebase:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#B95C00', background: '#FBF0E4', borderRadius: 5, padding: '4px 9px' }}>
                INT-07 · async integration
              </span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#C7131F', background: '#FDEEEF', borderRadius: 5, padding: '4px 9px' }}>
                SEC-03 · data-at-rest crypto
              </span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#B95C00', background: '#FBF0E4', borderRadius: 5, padding: '4px 9px' }}>
                DATA-02 · service data access
              </span>
            </div>
            <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 9 }}>Drift findings also feed CodeIQ pre-PR checks (P8).</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6', marginBottom: 8 }}>THIS RUN</div>
            <div style={{ fontSize: 11.5, color: '#5B6472', lineHeight: 1.8 }}>
              12 findings · 212 files analyzed
              <br />
              41 SD sections · 38 SyDD sections
              <br />
              cost <span style={{ fontFamily: MONO }}>$2.04</span> · 6m 12s
              <br />
              trace <span style={{ fontFamily: MONO, color: '#3D5AFE' }}>trc-91d4a7 ↗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
