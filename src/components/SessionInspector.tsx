import { useEffect, useRef, useState } from 'react';
import { MONO, SANS } from '../ui';

interface Props {
  onClose: () => void;
  onOpenFull: () => void;
}

const label10 = (mb = 8) =>
  ({ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: mb }) as const;

export default function SessionInspector({ onClose, onOpenFull }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copySession = () => {
    try {
      void navigator.clipboard.writeText('FRG-1042');
    } catch {
      /* clipboard unavailable — demo only */
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(30,39,97,.28)', zIndex: 60 }} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          background: '#FFFFFF',
          zIndex: 61,
          boxShadow: '-16px 0 40px rgba(30,39,97,.16)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'forgeSlideIn .22s ease',
          fontFamily: SANS,
        }}
      >
        <div style={{ flex: 'none', padding: '16px 20px 14px', borderBottom: '1px solid #E4E9F2', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.09em', color: '#8A93A6', marginBottom: 3 }}>SESSION INSPECTOR</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 600, color: '#1E2761' }}>FRG-1042</span>
              <span
                onClick={copySession}
                title="Copy session ID"
                className="hvr-bg-lblue"
                style={{ fontSize: 10, color: '#3D5AFE', cursor: 'pointer', border: '1px solid #E4E9F2', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}
              >
                {copied ? 'copied ✓' : 'copy'}
              </span>
              <span style={{ background: '#EEF1FF', color: '#3D5AFE', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>
                WF-B · NEW FEATURE
              </span>
            </div>
          </div>
          <div
            onClick={onClose}
            className="hvr-bg-fog"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#5B6472',
              fontSize: 14,
            }}
          >
            ✕
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 18 }}>
            <div>
              <div style={label10(0)}>STAGE</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#2A2F3A', marginTop: 2 }}>Definition · in review</div>
            </div>
            <div>
              <div style={label10(0)}>PRODUCT LINE</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#2A2F3A', marginTop: 2 }}>Advisor Workstation</div>
            </div>
            <div>
              <div style={label10(0)}>AGENT</div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: '#2A2F3A', marginTop: 2 }}>req-gen v1.3.2</div>
            </div>
            <div>
              <div style={label10(0)}>COST TO DATE</div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: '#2A2F3A', marginTop: 2 }}>$1.84 · 312k tok</div>
            </div>
          </div>

          <div style={label10()}>STAGE RAIL</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
            {(['Definition', 'Design', 'Build', 'Test', 'Release'] as const).map((stg, i) => (
              <div key={stg} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: 5, borderRadius: 3, background: i === 0 ? '#3D5AFE' : '#E4E9F2' }} />
                <div style={{ fontSize: 9.5, color: i === 0 ? '#3D5AFE' : '#8A93A6', fontWeight: i === 0 ? 700 : 400, marginTop: 4 }}>{stg}</div>
              </div>
            ))}
          </div>

          <div style={label10()}>PARTICIPANTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            {[
              ['PS', 'Priya Sharma · PM', 'active now', '#1B7F4D'],
              ['AV', 'Arjun Verma · Architect', 'handoff pending', '#8A93A6'],
            ].map(([ini, who, note, c]) => (
              <div key={ini} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#EEF1FF',
                    color: '#1E2761',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {ini}
                </span>
                <span style={{ flex: 1 }}>{who}</span>
                <span style={{ fontSize: 10.5, color: c, fontWeight: c === '#1B7F4D' ? 600 : 400 }}>{note}</span>
              </div>
            ))}
          </div>

          <div style={label10()}>ARTIFACTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            {(
              [
                ['Story set · 1 epic, 7 stories, 4 NFR', 'AI-DRAFTED', '#EEF1FF', '#3D5AFE'],
                ['Ambiguity flag resolutions · 6', 'HUMAN-EDITED', '#F0EDF5', '#6D2E46'],
                ['Source brief · Confluence ADVW/417', 'SOURCE', '#F2F5FA', '#5B6472'],
              ] as const
            ).map(([name, prov, bg, color]) => (
              <div key={name} style={{ border: '1px solid #E4E9F2', borderRadius: 7, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{name}</span>
                <span style={{ background: bg, color, fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 999 }}>{prov}</span>
              </div>
            ))}
          </div>

          <div style={label10()}>EDIT TRAIL</div>
          <div
            style={{
              borderLeft: '2px solid #E4E9F2',
              marginLeft: 5,
              paddingLeft: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 18,
            }}
          >
            {(
              [
                ['Story FRG-1042-3 AC-2 edited', 'P. Sharma · 4m ago · latency 5 min → 2 min'],
                ['Flag #2 resolved as assumption', 'P. Sharma · 22m ago · "summary threshold = 5 min"'],
                ['Story set generated', 'req-gen v1.3.2 · 38m ago · trace trc-8841f2'],
                ['Session created from charter', 'P. Sharma · 1h ago · Confluence ADVW/417'],
              ] as const
            ).map(([what, meta]) => (
              <div key={what}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{what}</div>
                <div style={{ fontSize: 10.5, color: '#8A93A6' }}>{meta}</div>
              </div>
            ))}
          </div>

          <div style={label10()}>HITL LEDGER</div>
          <div style={{ background: '#FFF8E6', border: '1px solid #B8860B', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#8A6508' }}>Gate: Story-set approval — pending</div>
            <div style={{ fontSize: 11, color: '#8A6508', marginTop: 2 }}>Required signer: PM (P. Sharma) · SLA 6h remaining</div>
          </div>
          <div style={{ border: '1px solid #E4E9F2', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1B7F4D' }}>Gate: Ambiguity review — approved</div>
            <div style={{ fontSize: 11, color: '#8A93A6', marginTop: 2 }}>Signed priya.sharma@lpl.com · 22m ago · ledger #L-90412</div>
          </div>
        </div>

        <div style={{ flex: 'none', borderTop: '1px solid #E4E9F2', padding: '12px 20px', display: 'flex', gap: 10 }}>
          <div
            onClick={onOpenFull}
            className="hvr-bg-navy"
            style={{
              flex: 1,
              height: 34,
              borderRadius: 7,
              background: '#1E2761',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Open full session
          </div>
          <div
            onClick={onClose}
            className="hvr-bg-grey"
            style={{
              height: 34,
              padding: '0 16px',
              borderRadius: 7,
              border: '1px solid #E4E9F2',
              color: '#2A2F3A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </div>
        </div>
      </div>
    </>
  );
}
