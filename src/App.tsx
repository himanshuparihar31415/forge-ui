import { useState } from 'react';
import { ACCESS, MODNAMES, PERSONAS, REQ, type PersonaId, type ScreenId } from './types';
import { MONO, SANS, SERIF } from './ui';
import SessionInspector from './components/SessionInspector';
import S01SignIn from './screens/S01SignIn';
import S02Onboarding from './screens/S02Onboarding';
import S03CommandCenter from './screens/S03CommandCenter';
import S04NewSession from './screens/S04NewSession';
import S05BriefIntake from './screens/S05BriefIntake';
import S06ReviewWorkspace from './screens/S06ReviewWorkspace';
import S07ApprovalPublish from './screens/S07ApprovalPublish';
import S08ResearchQA from './screens/S08ResearchQA';
import S09ResearchPacks from './screens/S09ResearchPacks';
import S10ConformanceRun from './screens/S10ConformanceRun';
import S11FindingsReview from './screens/S11FindingsReview';
import S12TaskBoard from './screens/S12TaskBoard';
import S13ScaffoldingReview from './screens/S13ScaffoldingReview';
import S14TestGeneration from './screens/S14TestGeneration';
import S15TraceabilityMatrix from './screens/S15TraceabilityMatrix';
import S16ReleaseReadiness from './screens/S16ReleaseReadiness';
import S17WorkflowLanes from './screens/S17WorkflowLanes';
import S18Handoff from './screens/S18Handoff';
import S19AgentRegistry from './screens/S19AgentRegistry';
import S20Observability from './screens/S20Observability';
import S21GovernanceAudit from './screens/S21GovernanceAudit';
import S22Evaluation from './screens/S22Evaluation';
import S23Settings from './screens/S23Settings';
import S24ApprovalQueue from './screens/S24ApprovalQueue';

interface Module {
  mod: string;
  label: string;
  color: string;
  abbrev: string;
  kids: [ScreenId, string][];
}

const MODULES: Module[] = [
  {
    mod: 'specai',
    label: 'SpecAI',
    color: '#3D5AFE',
    abbrev: 'SP',
    kids: [
      ['s5', 'Brief Intake'],
      ['s6', 'Review Workspace'],
      ['s7', 'Approval & Publish'],
    ],
  },
  {
    mod: 'protoai',
    label: 'ProtoAI',
    color: '#0E9C8C',
    abbrev: 'PR',
    kids: [
      ['s8', 'Research Q&A'],
      ['s9', 'Research Packs'],
      ['s10', 'Conformance Run'],
      ['s11', 'Findings Review'],
    ],
  },
  {
    mod: 'codeiq',
    label: 'CodeIQ',
    color: '#B95C00',
    abbrev: 'CO',
    kids: [
      ['s12', 'Task Board'],
      ['s13', 'Scaffolding Review'],
    ],
  },
  {
    mod: 'intelliqa',
    label: 'IntelliQA',
    color: '#6D2E46',
    abbrev: 'QA',
    kids: [
      ['s14', 'Test Generation'],
      ['s15', 'Traceability Matrix'],
    ],
  },
  {
    mod: 'release',
    label: 'ReleasePulse',
    color: '#1E2761',
    abbrev: 'RP',
    kids: [['s16', 'Release Readiness']],
  },
];

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('s3');
  const [persona, setPersona] = useState<PersonaId>('pm');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openModule, setOpenModule] = useState('specai');

  const p = PERSONAS.find((x) => x.id === persona)!;

  const go = (id: ScreenId, mod?: string) => {
    setScreen(id);
    setMenuOpen(false);
    if (mod !== undefined) setOpenModule(mod);
  };

  const openInspector = () => setInspectorOpen(true);
  const closeInspector = () => setInspectorOpen(false);

  const locked = !!ACCESS[screen] && !ACCESS[screen]!.includes(persona);
  const roText = locked
    ? `Read-only — ${MODNAMES[screen] || 'this workspace'} requires the ${REQ[screen]} role. Your IAM role: ${p.iam} (${p.role}). Actions are disabled; this view is recorded to the audit ledger.`
    : '';

  // ===== Full-bleed entry flows (sign-in / onboarding) =====
  if (screen === 's1' || screen === 's2') {
    return (
      <div style={{ height: '100vh', overflow: 'auto' }}>
        {screen === 's1' && <S01SignIn onSignIn={() => go('s2')} />}
        {screen === 's2' && <S02Onboarding onFinish={() => go('s3')} />}
      </div>
    );
  }

  // ===== Left-nav row builders =====
  const itemRow = (id: ScreenId, label: string, opts: { badge?: string; kid?: boolean; modColor?: string } = {}) => {
    const active = screen === id;
    const isLocked = !!ACCESS[id] && !ACCESS[id]!.includes(persona);
    return (
      <div
        key={id}
        onClick={() => go(id)}
        title={isLocked ? `Requires ${REQ[id]} role — your IAM role: ${p.iam}. Opens read-only.` : undefined}
        className="hvr-bg-fog"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          height: 30,
          padding: `0 10px 0 ${opts.kid ? 22 : 13}px`,
          margin: '1px 8px',
          borderRadius: 6,
          cursor: 'pointer',
          background: active ? '#EEF1FF' : 'transparent',
          color: active ? '#1E2761' : isLocked ? '#8A93A6' : '#2A2F3A',
          fontWeight: active ? 600 : 400,
          fontSize: 13,
          boxShadow: `inset 3px 0 0 ${active ? opts.modColor || '#3D5AFE' : 'transparent'}`,
          whiteSpace: 'nowrap',
        }}
      >
        {opts.kid && <span style={{ width: 8, height: 8, borderRadius: 3, background: opts.modColor, flex: 'none' }} />}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        {opts.badge && (
          <span
            style={{
              background: '#C7131F',
              color: '#FFFFFF',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              padding: '1px 6px',
              lineHeight: 1.4,
            }}
          >
            {opts.badge}
          </span>
        )}
        {isLocked && (
          <span
            style={{
              color: '#A6AFC0',
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: '.04em',
              border: '1px solid #E4E9F2',
              borderRadius: 4,
              padding: '0 4px',
            }}
          >
            VIEW
          </span>
        )}
      </div>
    );
  };

  const headerRow = (key: string, label: string) => (
    <div key={key} style={{ padding: '16px 16px 5px', fontSize: 10, fontWeight: 700, letterSpacing: '.09em', color: '#8A93A6', whiteSpace: 'nowrap' }}>
      {label}
    </div>
  );

  const moduleRow = (m: Module) => {
    const open = openModule === m.mod;
    const activeIn = m.kids.some((k) => k[0] === screen);
    return (
      <div key={m.mod}>
        <div
          onClick={() => setOpenModule(open ? '' : m.mod)}
          className="hvr-bg-fog"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            height: 30,
            padding: '0 10px 0 13px',
            margin: '1px 8px',
            borderRadius: 6,
            cursor: 'pointer',
            color: activeIn ? '#1E2761' : '#2A2F3A',
            fontWeight: activeIn ? 600 : 500,
            fontSize: 13,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 3, background: m.color, flex: 'none' }} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.label}</span>
          <span style={{ color: '#8A93A6', fontSize: 9 }}>{open ? '▾' : '▸'}</span>
        </div>
        {open && m.kids.map(([kid, klabel]) => itemRow(kid, klabel, { kid: true, modColor: m.color }))}
      </div>
    );
  };

  const minis: [ScreenId, string, string, string?, ScreenId[]?][] = [
    ['s3', 'CC', 'Command Center'],
    ['s24', 'AQ', 'Approval Queue'],
    ['s17', 'WF', 'Workflow Lanes'],
    ['s18', 'HO', 'Handoff'],
    ...MODULES.map((m): [ScreenId, string, string, string, ScreenId[]] => [m.kids[0][0], m.abbrev, m.label, m.color, m.kids.map((k) => k[0])]),
    ['s19', 'AR', 'Agent Registry'],
    ['s20', 'OB', 'Observability'],
    ['s21', 'GO', 'Governance & Audit'],
    ['s22', 'EV', 'Evaluation'],
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: SANS, color: '#2A2F3A', overflow: 'hidden' }}>
      {/* ======= TOP BAR ======= */}
      <div
        style={{
          height: 56,
          flex: 'none',
          background: '#FFFFFF',
          borderBottom: '1px solid #E4E9F2',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 16px',
          position: 'relative',
          zIndex: 40,
        }}
      >
        <div
          onClick={() => setNavCollapsed((c) => !c)}
          title="Collapse navigation"
          className="hvr-bg-fog"
          style={{ width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5B6472' }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 3.5h11M2 7.5h11M2 11.5h11" stroke="#5B6472" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <div onClick={() => go('s3')} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
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
              fontSize: 15,
              color: '#FFFFFF',
            }}
          >
            F
          </div>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, color: '#1E2761' }}>Forge</span>
          <span
            style={{
              background: '#FFF8E6',
              border: '1px solid #B8860B',
              color: '#8A6508',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.08em',
              padding: '2px 7px',
              borderRadius: 4,
            }}
          >
            PILOT
          </span>
        </div>

        <div
          title="Global search — sessions, stories, artifacts, agents, trace IDs"
          className="hvr-bc-grey"
          style={{
            flex: 'none',
            width: 330,
            marginLeft: 16,
            height: 32,
            background: '#F2F5FA',
            border: '1px solid #E4E9F2',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 10px',
            cursor: 'text',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="#8A93A6" strokeWidth="1.3" />
            <path d="M8.6 8.6 12 12" stroke="#8A93A6" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span style={{ flex: 1, fontSize: 12.5, color: '#8A93A6', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            Search sessions, stories, artifacts, traces…
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: '#8A93A6',
              border: '1px solid #E4E9F2',
              background: '#FFFFFF',
              borderRadius: 4,
              padding: '1px 5px',
            }}
          >
            ⌘K
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <div
          onClick={() => go('s3')}
          title="Workflow run counters vs Phase-1 exit thresholds — open Command Center evidence"
          className="hvr-bg-fog"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 30,
            padding: '0 10px',
            border: '1px solid #E4E9F2',
            borderRadius: 6,
            cursor: 'pointer',
            background: '#FFFFFF',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1B7F4D', animation: 'forgePulse 2.4s infinite' }} />
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: '#2A2F3A' }}>A 3/5 · B 14/20 · C 22/30</span>
        </div>

        <div
          onClick={() => go('s24')}
          title="Approval queue — 4 HITL items pending"
          className="hvr-bg-fog"
          style={{ position: 'relative', width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3-1.5 4.5-1.5 4.5h12s-1.5-1.5-1.5-4.5A4.5 4.5 0 0 0 8 1.5z"
              stroke="#5B6472"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path d="M6.5 13a1.6 1.6 0 0 0 3 0" stroke="#5B6472" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 1,
              background: '#C7131F',
              color: '#FFFFFF',
              fontSize: 9,
              fontWeight: 700,
              borderRadius: 999,
              padding: '1px 4.5px',
              border: '1.5px solid #FFFFFF',
            }}
          >
            4
          </span>
        </div>

        <div
          title="Help & documentation"
          className="hvr-bg-fog"
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#5B6472',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ?
        </div>

        <div style={{ width: 1, height: 24, background: '#E4E9F2' }} />

        <div
          onClick={() => setMenuOpen((o) => !o)}
          className="hvr-bg-fog"
          style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', borderRadius: 6 }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: '#1E2761',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {p.initials}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1E2761' }}>{p.name}</div>
            <div style={{ fontSize: 10.5, color: '#5B6472' }}>{p.role}</div>
          </div>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5 5 6.5 8 3.5" stroke="#8A93A6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
            <div
              style={{
                position: 'absolute',
                top: 52,
                right: 12,
                width: 280,
                background: '#FFFFFF',
                border: '1px solid #E4E9F2',
                borderRadius: 10,
                boxShadow: '0 12px 32px rgba(30,39,97,.14)',
                zIndex: 50,
                padding: 6,
                animation: 'forgeFadeIn .15s ease',
              }}
            >
              <div style={{ padding: '8px 10px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6' }}>SWITCH PERSONA · DEMO</div>
              {PERSONAS.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => {
                    setPersona(pr.id);
                    setMenuOpen(false);
                  }}
                  className="hvr-bg-fog"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 10px',
                    borderRadius: 7,
                    cursor: 'pointer',
                    background: pr.id === persona ? '#EEF1FF' : 'transparent',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#EEF1FF',
                      color: '#1E2761',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10.5,
                      fontWeight: 600,
                      flex: 'none',
                    }}
                  >
                    {pr.initials}
                  </div>
                  <div style={{ flex: 1, lineHeight: 1.25 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2A2F3A' }}>{pr.name}</div>
                    <div style={{ fontSize: 10.5, color: '#5B6472' }}>
                      {pr.role} · IAM {pr.iam}
                    </div>
                  </div>
                  {pr.id === persona && <span style={{ color: '#3D5AFE', fontSize: 12, fontWeight: 700 }}>✓</span>}
                </div>
              ))}
              <div
                style={{
                  borderTop: '1px solid #E4E9F2',
                  margin: '6px 4px 2px',
                  padding: '8px 6px 4px',
                  fontSize: 10.5,
                  color: '#8A93A6',
                  lineHeight: 1.45,
                }}
              >
                Persona &amp; entry stages are read from LPL IAM. Switching here simulates a different signed-in user.
              </div>
            </div>
          </>
        )}
      </div>

      {/* ======= BODY ======= */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT NAV */}
        <div
          style={{
            width: navCollapsed ? 64 : 240,
            flex: 'none',
            background: '#FFFFFF',
            borderRight: '1px solid #E4E9F2',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width .18s ease',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '10px 8px 4px' }}>
            <div
              onClick={() => go('s4')}
              title="Start a new Forge session"
              className="hvr-bg-blue"
              style={{
                height: 34,
                borderRadius: 7,
                background: '#3D5AFE',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1 }}>+</span>
              {!navCollapsed && <span>New Session</span>}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 8 }}>
            {!navCollapsed ? (
              <>
                {itemRow('s3', 'Command Center')}
                {itemRow('s24', 'Approval Queue', { badge: '4' })}
                {itemRow('s17', 'Workflow Lanes')}
                {itemRow('s18', 'Handoff')}
                {headerRow('hV', 'VERTICALS')}
                {MODULES.map(moduleRow)}
                {headerRow('hP', 'PLATFORM')}
                {itemRow('s19', 'Agent Registry')}
                {itemRow('s20', 'Observability')}
                {itemRow('s21', 'Governance & Audit')}
                {itemRow('s22', 'Evaluation')}
                {headerRow('hE', 'ENTRY FLOWS · DEMO')}
                {itemRow('s1', 'Sign-in')}
                {itemRow('s2', 'Onboarding')}
              </>
            ) : (
              minis.map(([id, abbrev, title, color, kidIds]) => {
                const active = kidIds ? kidIds.includes(screen) : screen === id;
                return (
                  <div
                    key={'m' + id}
                    onClick={() => go(id)}
                    title={title}
                    style={{
                      width: 40,
                      height: 34,
                      margin: '3px auto',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: active ? '#EEF1FF' : 'transparent',
                      color: active ? '#1E2761' : color || '#5B6472',
                      fontSize: 10,
                      fontWeight: 700,
                      boxShadow: `inset 3px 0 0 ${active ? color || '#3D5AFE' : 'transparent'}`,
                    }}
                  >
                    {abbrev}
                  </div>
                );
              })
            )}
          </div>
          <div style={{ flex: 'none', borderTop: '1px solid #E4E9F2', padding: 8 }}>
            <div
              onClick={() => go('s23')}
              title="Settings"
              className="hvr-bg-fog"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                height: 30,
                padding: '0 10px',
                borderRadius: 6,
                cursor: 'pointer',
                background: screen === 's23' ? '#EEF1FF' : 'transparent',
                color: '#2A2F3A',
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flex: 'none' }}>
                <circle cx="7" cy="7" r="2" stroke="#5B6472" strokeWidth="1.3" />
                <path
                  d="M7 1.2v1.6M7 11.2v1.6M1.2 7h1.6M11.2 7h1.6M2.9 2.9l1.1 1.1M10 10l1.1 1.1M11.1 2.9 10 4M4 10l-1.1 1.1"
                  stroke="#5B6472"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              {!navCollapsed && <span>Settings</span>}
            </div>
            {!navCollapsed && (
              <div style={{ padding: '8px 10px 2px', fontSize: 10, color: '#A6AFC0', lineHeight: 1.5 }}>
                Forge runs inside LPL AWS
                <br />
                Zero data egress
              </div>
            )}
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: '#F7F9FC', position: 'relative' }}>
          {locked && (
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 30,
                background: '#FFF8E6',
                borderBottom: '1px solid #B8860B',
                padding: '8px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 12.5,
                color: '#8A6508',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flex: 'none' }}>
                <rect x="3" y="6" width="8" height="6" rx="1" stroke="#B8860B" strokeWidth="1.3" />
                <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#B8860B" strokeWidth="1.3" />
              </svg>
              <span>{roText}</span>
            </div>
          )}

          {screen === 's3' && (
            <S03CommandCenter openInspector={openInspector} goApprovals={() => go('s24')} goReview={() => go('s6')} goHandoff={() => go('s18')} />
          )}
          {screen === 's4' && <S04NewSession onCreate={() => go('s5')} />}
          {screen === 's5' && <S05BriefIntake onGenerate={() => go('s6')} />}
          {screen === 's6' && <S06ReviewWorkspace onApprove={() => go('s7')} />}
          {screen === 's7' && <S07ApprovalPublish onHandoff={() => go('s18')} />}
          {screen === 's8' && <S08ResearchQA goPacks={() => go('s9')} />}
          {screen === 's9' && <S09ResearchPacks goQa={() => go('s8')} />}
          {screen === 's10' && <S10ConformanceRun onRun={() => go('s11')} />}
          {screen === 's11' && <S11FindingsReview />}
          {screen === 's12' && <S12TaskBoard goScaffold={() => go('s13')} />}
          {screen === 's13' && <S13ScaffoldingReview />}
          {screen === 's14' && <S14TestGeneration goMatrix={() => go('s15')} />}
          {screen === 's15' && <S15TraceabilityMatrix />}
          {screen === 's16' && <S16ReleaseReadiness openInspector={openInspector} />}
          {screen === 's17' && <S17WorkflowLanes openInspector={openInspector} goHandoff={() => go('s18')} />}
          {screen === 's18' && <S18Handoff />}
          {screen === 's19' && <S19AgentRegistry />}
          {screen === 's20' && <S20Observability />}
          {screen === 's21' && <S21GovernanceAudit />}
          {screen === 's22' && <S22Evaluation />}
          {screen === 's23' && <S23Settings />}
          {screen === 's24' && <S24ApprovalQueue openInspector={openInspector} />}
        </div>
      </div>

      {/* ======= SESSION INSPECTOR (global slide-over) ======= */}
      {inspectorOpen && (
        <SessionInspector
          onClose={closeInspector}
          onOpenFull={() => {
            setInspectorOpen(false);
            setScreen('s17');
          }}
        />
      )}
    </div>
  );
}
