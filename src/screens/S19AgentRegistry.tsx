import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Agent {
  name: string;
  id: string;
  ver: string;
  owner: string;
  lifecycle: 'PILOT' | 'PROD' | 'DRAFT' | 'PLANNED';
  policy: string;
  mrm: string;
  arb: string;
  eval: string;
  active: boolean;
  desc: string;
  module: string;
  manifest: string;
  versions: [string, string, string, string][];
}

const AGENTS: Agent[] = [
  {
    name: 'req-gen',
    id: 'agt-pm-001',
    ver: 'v1.3.2',
    owner: 'LPL+Vendor squad A · PM',
    lifecycle: 'PILOT',
    policy: 'standard',
    mrm: '✓',
    arb: '✓',
    eval: '0.91',
    active: true,
    desc: 'Brief → epic/story/NFR hierarchy with ambiguity flags',
    module: '#3D5AFE',
    manifest: `{
  "agent": "req-gen",
  "version": "1.3.2",
  "model": "lpl-bedrock/claude-3-7",
  "prompts": "req-gen-prompts@2.4.0",
  "tools": ["jira", "confluence"],
  "policy_envelope": {
    "writes": "draft-only",
    "approval": "PM-signed",
    "egress": "none"
  }
}`,
    versions: [
      ['v1.3.2', 'AC phrasing tightened · eval 0.91', '6d', '#1B7F4D'],
      ['v1.3.1', 'NFR category coverage fix', '3w', '#8A93A6'],
      ['v1.3.0', 'Flag-before-generate enforced', '6w', '#8A93A6'],
    ],
  },
  {
    name: 'research-qa',
    id: 'agt-ux-002',
    ver: 'v1.2.0',
    owner: 'Vendor squad B · UI/UX',
    lifecycle: 'PILOT',
    policy: 'standard',
    mrm: '✓',
    arb: '✓',
    eval: '0.88',
    active: true,
    desc: 'Cited answers over the unified insight index',
    module: '#0E9C8C',
    manifest: `{
  "agent": "research-qa",
  "version": "1.2.0",
  "model": "lpl-bedrock/claude-3-7",
  "prompts": "research-prompts@1.8.2",
  "index": "insight-index@nightly",
  "policy_envelope": {
    "citation_floor": 0.95,
    "egress": "none"
  }
}`,
    versions: [
      ['v1.2.0', 'Gap detection added · eval 0.88', '2w', '#1B7F4D'],
      ['v1.1.4', 'Citation dedupe', '5w', '#8A93A6'],
    ],
  },
  {
    name: 'conformance',
    id: 'agt-ar-003',
    ver: 'v0.9.4',
    owner: 'LPL arch guild · Architect',
    lifecycle: 'PILOT',
    policy: 'standard',
    mrm: '✓',
    arb: '✓',
    eval: '0.86',
    active: true,
    desc: 'SyDD/SD vs implementation findings with traceability',
    module: '#B8860B',
    manifest: `{
  "agent": "conformance",
  "version": "0.9.4",
  "model": "lpl-bedrock/claude-3-7",
  "prompts": "conf-prompts@0.9.1",
  "patterns": "arb-patterns@3.2",
  "policy_envelope": {
    "repo_access": "read-only",
    "egress": "none"
  }
}`,
    versions: [
      ['v0.9.4', 'Severity calibration · eval 0.86', '1w', '#1B7F4D'],
      ['v0.9.3', 'As-built SyDD draft mode', '4w', '#8A93A6'],
    ],
  },
  {
    name: 'scaffold-gen',
    id: 'agt-dv-004',
    ver: 'v2.0.1',
    owner: 'Vendor squad A · Developer',
    lifecycle: 'PILOT',
    policy: 'restricted',
    mrm: '✓',
    arb: '✓',
    eval: '0.84',
    active: true,
    desc: 'Story → scaffolding, stubs, sub-tasks, diagram, deploy-seed',
    module: '#B95C00',
    manifest: `{
  "agent": "scaffold-gen",
  "version": "2.0.1",
  "model": "lpl-bedrock/claude-3-7",
  "prompts": "scaffold-prompts@3.1.0",
  "tools": ["github-draft-pr"],
  "policy_envelope": {
    "github": "draft-pr-only",
    "main_branch": "forbidden",
    "egress": "none"
  }
}`,
    versions: [
      ['v2.0.1', 'Drift pre-check before PR · eval 0.84', '4d', '#1B7F4D'],
      ['v2.0.0', 'Deploy-seed generation', '3w', '#8A93A6'],
      ['v1.9.2', 'Stub marker standard', '7w', '#8A93A6'],
    ],
  },
  {
    name: 'test-gen',
    id: 'agt-qa-005',
    ver: 'v1.1.0',
    owner: 'LPL QA guild · QA',
    lifecycle: 'PILOT',
    policy: 'standard',
    mrm: '✓',
    arb: '✓',
    eval: '0.89',
    active: true,
    desc: 'AC-linked test cases + scripts, coverage gaps, regression',
    module: '#6D2E46',
    manifest: `{
  "agent": "test-gen",
  "version": "1.1.0",
  "model": "lpl-bedrock/claude-3-7",
  "prompts": "test-prompts@1.5.0",
  "frameworks": ["junit5", "karate"],
  "policy_envelope": {
    "commit": "QA-signed-only",
    "egress": "none"
  }
}`,
    versions: [
      ['v1.1.0', 'Coverage-gap panel mandatory · eval 0.89', '2w', '#1B7F4D'],
      ['v1.0.3', 'Karate convention detect', '6w', '#8A93A6'],
    ],
  },
  {
    name: 'release-notes',
    id: 'agt-rm-006',
    ver: 'v0.8.2',
    owner: 'LPL release mgmt · RM',
    lifecycle: 'PILOT',
    policy: 'standard',
    mrm: '✓',
    arb: 'rev',
    eval: '0.82',
    active: true,
    desc: 'Readiness composition + release notes drafts',
    module: '#1E2761',
    manifest: `{
  "agent": "release-notes",
  "version": "0.8.2",
  "model": "lpl-bedrock/claude-3-7",
  "prompts": "rel-prompts@0.6.0",
  "policy_envelope": {
    "publish": "RM-signed",
    "egress": "none"
  }
}`,
    versions: [['v0.8.2', 'Risk model inputs · eval 0.82', '1w', '#1B7F4D']],
  },
  {
    name: 'sydd-asbuilt',
    id: 'agt-ar-007',
    ver: '—',
    owner: 'Phase 2 · Architect',
    lifecycle: 'PLANNED',
    policy: '—',
    mrm: '—',
    arb: '—',
    eval: '—',
    active: false,
    desc: 'As-built SyDD generation as standalone agent',
    module: '#B8860B',
    manifest: '{ "status": "Phase 2 — planned" }',
    versions: [],
  },
  {
    name: 'defect-triage',
    id: 'agt-qa-008',
    ver: '—',
    owner: 'Phase 2 · QA',
    lifecycle: 'PLANNED',
    policy: '—',
    mrm: '—',
    arb: '—',
    eval: '—',
    active: false,
    desc: 'WF-C intake triage and reproduction hints',
    module: '#6D2E46',
    manifest: '{ "status": "Phase 2 — planned" }',
    versions: [],
  },
  {
    name: 'perf-profile',
    id: 'agt-dv-009',
    ver: '—',
    owner: 'Phase 3 · Developer',
    lifecycle: 'PLANNED',
    policy: '—',
    mrm: '—',
    arb: '—',
    eval: '—',
    active: false,
    desc: 'Performance profiling against NFR budgets',
    module: '#B95C00',
    manifest: '{ "status": "Phase 3 — planned" }',
    versions: [],
  },
  {
    name: 'doc-sync',
    id: 'agt-ar-010',
    ver: '—',
    owner: 'Phase 3 · Architect',
    lifecycle: 'PLANNED',
    policy: '—',
    mrm: '—',
    arb: '—',
    eval: '—',
    active: false,
    desc: 'Keeps SyDD/SD in sync with merged changes',
    module: '#B8860B',
    manifest: '{ "status": "Phase 3 — planned" }',
    versions: [],
  },
  {
    name: 'adoption-coach',
    id: 'agt-pm-011',
    ver: '—',
    owner: 'Phase 3 · PM',
    lifecycle: 'PLANNED',
    policy: '—',
    mrm: '—',
    arb: '—',
    eval: '—',
    active: false,
    desc: 'Nudges and playbooks from measurement framework',
    module: '#3D5AFE',
    manifest: '{ "status": "Phase 3 — planned" }',
    versions: [],
  },
];

const LC: Record<string, [string, string]> = {
  PILOT: ['#FFF8E6', '#8A6508'],
  PROD: ['#E7F4EC', '#1B7F4D'],
  DRAFT: ['#F2F5FA', '#5B6472'],
  PLANNED: ['#F7F9FC', '#A6AFC0'],
};

const GRID = '1.2fr 90px 64px 1fr 70px 70px 56px 56px 60px';

export default function S19AgentRegistry() {
  const [sel, setSel] = useState('req-gen');
  const [rolled, setRolled] = useState(false);

  const a = AGENTS.find((x) => x.name === sel)!;

  return (
    <div data-screen-label="S19 · Agent Registry" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Agent Registry</h1>
        <span style={{ fontSize: 12.5, color: '#5B6472' }}>Single inventory of every agent Forge can run · P1</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#5B6472' }}>
          <strong>5</strong> active in pilot · <strong>6</strong> planned Phase 2/3
        </span>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Table */}
        <div style={{ flex: 1, minWidth: 0, background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: GRID,
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
            <span>AGENT</span>
            <span>ID</span>
            <span>VER</span>
            <span>OWNER · PERSONA</span>
            <span>LIFECYCLE</span>
            <span>POLICY</span>
            <span>MRM</span>
            <span>ARB</span>
            <span style={{ textAlign: 'right' }}>EVAL</span>
          </div>
          {AGENTS.map((ag) => (
            <div
              key={ag.name}
              onClick={() => {
                setSel(ag.name);
                setRolled(false);
              }}
              className="hvr-bg-row"
              style={{
                display: 'grid',
                gridTemplateColumns: GRID,
                gap: 8,
                padding: '9px 14px',
                borderBottom: '1px solid #F0F3F9',
                fontSize: 12,
                alignItems: 'center',
                cursor: 'pointer',
                background: sel === ag.name ? '#F5F8FE' : 'transparent',
                opacity: ag.active ? 1 : 0.55,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: ag.module, flex: 'none' }} />
                <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: '#1E2761' }}>{ag.name}</span>
              </span>
              <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{ag.id}</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#5B6472' }}>{ag.ver}</span>
              <span style={{ fontSize: 11, color: '#5B6472', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ag.owner}</span>
              <span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 999,
                    background: LC[ag.lifecycle][0],
                    color: LC[ag.lifecycle][1],
                  }}
                >
                  {ag.lifecycle}
                </span>
              </span>
              <span style={{ fontSize: 10, color: '#5B6472' }}>{ag.policy}</span>
              <span style={{ fontSize: 11, color: ag.mrm === '✓' ? '#1B7F4D' : '#A6AFC0', fontWeight: 600 }}>{ag.mrm}</span>
              <span style={{ fontSize: 11, color: ag.arb === '✓' ? '#1B7F4D' : ag.arb === 'rev' ? '#B8860B' : '#A6AFC0', fontWeight: 600 }}>
                {ag.arb}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  textAlign: 'right',
                  color: ag.eval !== '—' && parseFloat(ag.eval) >= 0.85 ? '#1B7F4D' : '#5B6472',
                }}
              >
                {ag.eval}
              </span>
            </div>
          ))}
        </div>

        {/* Detail drawer */}
        <div
          style={{
            width: 330,
            flex: 'none',
            background: '#FFFFFF',
            border: '1px solid #E4E9F2',
            borderRadius: 10,
            overflow: 'hidden',
            animation: 'drawIn .2s ease',
            position: 'sticky',
            top: 16,
          }}
        >
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #E4E9F2', background: '#FAFBFE' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: '#1E2761' }}>{a.name}</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#8A93A6' }}>{a.ver}</span>
              <div style={{ flex: 1 }} />
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  background: LC[a.lifecycle][0],
                  color: LC[a.lifecycle][1],
                }}
              >
                {a.lifecycle}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#5B6472', marginTop: 4 }}>{a.desc}</div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', marginBottom: 7 }}>MANIFEST</div>
            <div
              style={{
                background: '#FBFCFE',
                border: '1px solid #F0F3F9',
                borderRadius: 7,
                padding: '10px 12px',
                fontFamily: MONO,
                fontSize: 10,
                lineHeight: 1.8,
                color: '#5B6472',
                whiteSpace: 'pre',
                overflowX: 'auto',
              }}
            >
              {a.manifest}
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: '#8A93A6', margin: '13px 0 7px' }}>VERSION HISTORY</div>
            {a.versions.map(([ver, note, when, color]) => (
              <div key={ver} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 0', borderBottom: '1px solid #F0F3F9', fontSize: 11 }}>
                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, color }}>{ver}</span>
                <span style={{ flex: 1, color: '#5B6472' }}>{note}</span>
                <span style={{ fontSize: 9.5, color: '#A6AFC0' }}>{when}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <div
                className="hvr-bg-grey"
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: 7,
                  border: '1px solid #E4E9F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#5B6472',
                  cursor: 'pointer',
                }}
              >
                Eval history
              </div>
              <div
                onClick={() => setRolled(true)}
                className="hvr-bg-red"
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: 7,
                  border: '1px solid #C7131F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#C7131F',
                  cursor: 'pointer',
                }}
              >
                {rolled ? 'Rolled back ✓' : 'Rollback'}
              </div>
            </div>
            <div style={{ fontSize: 9.5, color: '#A6AFC0', marginTop: 8 }}>
              Rollback requires admin role · pins previous semver + prompts@version across all sessions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
