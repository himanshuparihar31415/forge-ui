import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

// [glyph, name, detail, status, bg, color]
const CONNS: [string, string, string, string, string, string][] = [
  ['J', 'Jira', 'projects ADVW · CONB · TRRB · svc forge-svc@lpl.com', 'CONNECTED', '#E7F4EC', '#1B7F4D'],
  ['C', 'Confluence', 'spaces ADVW · ARCH · RES', 'CONNECTED', '#E7F4EC', '#1B7F4D'],
  ['G', 'GitHub Enterprise', 'org lpl · draft-PR scope only', 'CONNECTED', '#E7F4EC', '#1B7F4D'],
  ['T', 'Test infrastructure', 'endpoint test-infra.lpl.internal · JUnit 5 + Karate', 'DEGRADED', '#FBF6E6', '#8A6508'],
];

const NOTIF: [string, string, string][] = [
  ['hitl', 'HITL pending — in-app', 'Immediate, with SLA countdown'],
  ['email', 'HITL pending — email', 'Falls back to email after 30 min unseen'],
  ['digest', 'Daily digest', 'Summary of sessions, gates and KPIs at 08:00'],
];

export default function S23Settings() {
  const [lines, setLines] = useState<Record<string, boolean>>({
    'Advisor Workstation': true,
    'Client Onboarding': true,
    'Trading & Rebalancing': false,
  });
  const [notifs, setNotifs] = useState<Record<string, boolean>>({ hitl: true, email: true, digest: false });
  const [theme, setTheme] = useState<'light' | 'hc'>('light');

  const lt = theme === 'light';
  const hc = !lt;

  return (
    <div data-screen-label="S23 · Settings" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 18px', fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Settings</h1>

        {/* Profile */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6' }}>PROFILE &amp; PERSONA</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: '#8A93A6', border: '1px solid #E4E9F2', borderRadius: 4, padding: '2px 7px' }}>
              READ-ONLY · FROM LPL IAM
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#1E2761',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              PS
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1E2761' }}>Priya Sharma</div>
              <div style={{ fontSize: 11.5, color: '#5B6472' }}>
                priya.sharma@lpl.com · Product Manager · IAM <span style={{ fontFamily: MONO }}>LPL-PM</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 10.5, color: '#8A93A6', lineHeight: 1.6 }}>
              Qualified entry stages
              <br />
              <strong style={{ color: '#2A2F3A' }}>Definition · Design · Release</strong>
            </div>
          </div>
        </div>

        {/* Connections */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 12 }}>CONNECTIONS</div>
          {CONNS.map(([glyph, name, detail, status, bg, color]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderBottom: '1px solid #F0F3F9' }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: '#F2F5FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#5B6472',
                  flex: 'none',
                }}
              >
                {glyph}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6', marginTop: 1 }}>{detail}</div>
              </div>
              <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: bg, color }}>{status}</span>
            </div>
          ))}
        </div>

        {/* Product line scoping */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 12 }}>PRODUCT-LINE SCOPING</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.keys(lines).map((name) => {
              const on = lines[name];
              return (
                <span
                  key={name}
                  onClick={() => setLines((s) => ({ ...s, [name]: !s[name] }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    fontSize: 12,
                    fontWeight: 600,
                    border: `1.5px solid ${on ? '#3D5AFE' : '#E4E9F2'}`,
                    background: on ? '#EEF1FF' : '#FFFFFF',
                    color: on ? '#3D5AFE' : '#5B6472',
                    borderRadius: 999,
                    padding: '6px 14px',
                    cursor: 'pointer',
                  }}
                >
                  {on ? '✓' : '+'} {name}
                </span>
              );
            })}
          </div>
          <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 10 }}>
            Scoping filters Command Center, sessions and search — it does not change permissions.
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 12 }}>NOTIFICATIONS</div>
          {NOTIF.map(([id, name, desc]) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F0F3F9' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 1 }}>{desc}</div>
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

        {/* Appearance + About */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 12 }}>APPEARANCE</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span
                onClick={() => setTheme('light')}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1.5px solid ${lt ? '#3D5AFE' : '#E4E9F2'}`,
                  background: lt ? '#EEF1FF' : '#FFFFFF',
                  color: lt ? '#3D5AFE' : '#5B6472',
                  borderRadius: 7,
                  padding: '8px 0',
                  cursor: 'pointer',
                }}
              >
                Light · default
              </span>
              <span
                onClick={() => setTheme('hc')}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1.5px solid ${hc ? '#3D5AFE' : '#E4E9F2'}`,
                  background: hc ? '#EEF1FF' : '#FFFFFF',
                  color: hc ? '#3D5AFE' : '#5B6472',
                  borderRadius: 7,
                  padding: '8px 0',
                  cursor: 'pointer',
                }}
              >
                High contrast
              </span>
            </div>
            <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 10 }}>
              WCAG 2.1 AA in both modes · full keyboard nav in review workspaces.
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 12 }}>ABOUT</div>
            <div style={{ fontSize: 11.5, color: '#5B6472', lineHeight: 1.9 }}>
              Forge <span style={{ fontFamily: MONO }}>v0.9.2-pilot</span> · environment <span style={{ fontFamily: MONO, color: '#8A6508' }}>PILOT</span>
              <br />
              Deployed in <strong>LPL AWS us-east-1</strong>
              <br />
              All data resides in LPL AWS — zero egress
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
