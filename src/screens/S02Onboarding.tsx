import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  onFinish: () => void;
}

const LINES: [string, string, string][] = [
  ['Advisor Workstation', 'ADVW', '41 Forge sessions to date'],
  ['Client Onboarding', 'CONB', '28 Forge sessions to date'],
  ['Trading & Rebalancing', 'TRRB', '17 Forge sessions to date'],
];

const NOTIF: [string, string, string][] = [
  ['inapp', 'HITL pending — in-app', 'Immediate banner + bell, with SLA countdown'],
  ['email', 'HITL pending — email', 'Falls back to email after 30 minutes unseen'],
  ['digest', 'Activity digest', 'Sessions, gates and KPIs in one summary'],
];

export default function S02Onboarding({ onFinish }: Props) {
  const [step, setStep] = useState(1);
  const [lines, setLines] = useState<Record<string, boolean>>({
    'Advisor Workstation': true,
    'Client Onboarding': true,
    'Trading & Rebalancing': false,
  });
  const [notifs, setNotifs] = useState<Record<string, boolean>>({ inapp: true, email: true, digest: false });
  const [cadence, setCadence] = useState('Daily');

  const barColor = (n: number) => (step >= n ? '#3D5AFE' : '#E4E9F2');

  return (
    <div
      data-screen-label="S2 · First-run Onboarding"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        color: '#2A2F3A',
        background: '#F7F9FC',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          width: 560,
          background: '#FFFFFF',
          border: '1px solid #E4E9F2',
          borderRadius: 14,
          boxShadow: '0 18px 50px rgba(30,39,97,.08)',
          animation: 'obIn .3s ease',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px 30px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: '#1E2761',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 14,
                color: '#FFFFFF',
              }}
            >
              F
            </div>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, color: '#1E2761' }}>Welcome to Forge</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: '#8A93A6' }}>step {step} of 3 · once per user</span>
          </div>
          <div style={{ display: 'flex', gap: 5, margin: '14px 0 22px' }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: barColor(1) }} />
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: barColor(2) }} />
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: barColor(3) }} />
          </div>
        </div>

        <div style={{ padding: '0 30px 24px', minHeight: 300 }}>
          {/* Step 1 */}
          {step === 1 && (
            <div style={{ animation: 'obIn .25s ease' }}>
              <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: '#1E2761', marginBottom: 4 }}>Your persona &amp; entry stages</div>
              <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 16 }}>
                Read from LPL IAM — display only. If this looks wrong, contact your Forge admin.
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  border: '1px solid #E4E9F2',
                  borderRadius: 10,
                  padding: '14px 16px',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#1E2761',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  PS
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1E2761' }}>You are: Priya Sharma · Product Manager</div>
                  <div style={{ fontSize: 11, color: '#5B6472', marginTop: 2 }}>
                    priya.sharma@lpl.com · IAM <span style={{ fontFamily: MONO }}>LPL-PM</span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: '#FAFBFE',
                  border: '1px solid #F0F3F9',
                  borderRadius: 10,
                  padding: '13px 16px',
                  fontSize: 12.5,
                  lineHeight: 1.7,
                  color: '#5B6472',
                }}
              >
                You can initiate <strong style={{ color: '#2A2F3A' }}>Workflows A, B and C at the Definition stage</strong>, enter Design and Release
                stages, and resume any session handed to you. Stages outside your envelope stay visible but read-only — nothing is hidden silently.
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ animation: 'obIn .25s ease' }}>
              <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: '#1E2761', marginBottom: 4 }}>Scope your product lines</div>
              <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 16 }}>
                Filters your Command Center and search — you can change this anytime in Settings.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {LINES.map(([name, jira, note]) => {
                  const on = lines[name];
                  return (
                    <div
                      key={name}
                      onClick={() => setLines((s) => ({ ...s, [name]: !s[name] }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        border: `1.5px solid ${on ? '#3D5AFE' : '#E4E9F2'}`,
                        background: on ? '#F5F8FE' : '#FFFFFF',
                        borderRadius: 10,
                        padding: '13px 16px',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: 17,
                          height: 17,
                          borderRadius: 5,
                          border: `1.5px solid ${on ? '#3D5AFE' : '#C9D3E4'}`,
                          background: on ? '#3D5AFE' : '#FFFFFF',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9,
                          fontWeight: 700,
                          flex: 'none',
                        }}
                      >
                        {on ? '✓' : ''}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1E2761' }}>{name}</div>
                        <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 1 }}>
                          Jira {jira} · {note}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div style={{ animation: 'obIn .25s ease' }}>
              <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: '#1E2761', marginBottom: 4 }}>Notifications</div>
              <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 16 }}>HITL gates wait on you — choose how Forge gets your attention.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NOTIF.map(([id, name, desc]) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', borderBottom: '1px solid #F0F3F9' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                      <div style={{ fontSize: 11, color: '#8A93A6', marginTop: 1 }}>{desc}</div>
                    </div>
                    <span
                      onClick={() => setNotifs((s) => ({ ...s, [id]: !s[id] }))}
                      style={{
                        width: 34,
                        height: 19,
                        borderRadius: 999,
                        background: notifs[id] ? '#3D5AFE' : '#C9D3E4',
                        position: 'relative',
                        cursor: 'pointer',
                        flex: 'none',
                        transition: 'background .15s',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: notifs[id] ? 17 : 2,
                          width: 15,
                          height: 15,
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          boxShadow: '0 1px 3px rgba(0,0,0,.25)',
                          transition: 'left .15s',
                        }}
                      />
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                <span style={{ fontSize: 12, color: '#5B6472' }}>Digest cadence</span>
                {['Daily', 'Weekly', 'Off'].map((label) => (
                  <span
                    key={label}
                    onClick={() => setCadence(label)}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 12px',
                      borderRadius: 999,
                      cursor: 'pointer',
                      border: `1px solid ${cadence === label ? '#3D5AFE' : '#E4E9F2'}`,
                      background: cadence === label ? '#EEF1FF' : '#FFFFFF',
                      color: cadence === label ? '#3D5AFE' : '#5B6472',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 30px', borderTop: '1px solid #E4E9F2', background: '#FAFBFE' }}>
          {step > 1 && (
            <span onClick={() => setStep((s) => s - 1)} className="hvr-c-navy" style={{ fontSize: 12, fontWeight: 600, color: '#5B6472', cursor: 'pointer' }}>
              ← Back
            </span>
          )}
          <div style={{ flex: 1 }} />
          <div
            onClick={() => {
              if (step < 3) setStep((s) => s + 1);
              else onFinish();
            }}
            className="hvr-bg-blue"
            style={{
              height: 36,
              padding: '0 22px',
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
            {step < 3 ? 'Continue' : 'Finish → Command Center'}
          </div>
        </div>
      </div>
    </div>
  );
}
