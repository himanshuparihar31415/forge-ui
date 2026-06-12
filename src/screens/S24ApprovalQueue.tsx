import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  openInspector: () => void;
}

type SlaState = 'urgent' | 'soon' | 'ok';

interface Item {
  id: number;
  mod: string;
  modColor: string;
  what: string;
  session: string;
  detail: string;
  sla: string;
  slaState: SlaState;
  age: string;
}

const ITEMS: Item[] = [
  {
    id: 1,
    mod: 'SpecAI',
    modColor: '#3D5AFE',
    what: 'Story set awaiting PM approval',
    session: 'FRG-1042',
    detail: 'Advisor Workstation · 1 epic · 7 stories · 4 NFR · 2 human edits consolidated',
    sla: 'SLA 6h left',
    slaState: 'soon',
    age: 'waiting 1h',
  },
  {
    id: 2,
    mod: 'Handoff',
    modColor: '#1E2761',
    what: 'Handoff request from A. Verma (Architect)',
    session: 'FRG-0991',
    detail: 'Design → Build · context package complete · note attached',
    sla: 'SLA 22h left',
    slaState: 'ok',
    age: 'waiting 12m',
  },
  {
    id: 3,
    mod: 'IntelliQA',
    modColor: '#6D2E46',
    what: 'Regression additions need sign-off',
    session: 'FRG-1033',
    detail: '4 tests → suite REG-ADVW-CORE · impacts 12 existing tests',
    sla: 'SLA 22h left',
    slaState: 'ok',
    age: 'waiting 3h',
  },
  {
    id: 4,
    mod: 'Architect Hub',
    modColor: '#B8860B',
    what: 'Conformance report republish requested',
    session: 'FRG-0967',
    detail: '2 findings re-dispositioned after ARB feedback · republish to Confluence',
    sla: 'SLA 2h left',
    slaState: 'urgent',
    age: 'waiting 9h',
  },
];

// [when, gate, session, decision, sig]
const HISTORY: [string, string, string, string, string][] = [
  ['today 13:59', 'Ambiguity review', 'FRG-1042', 'APPROVED', 'p.sharma · #L-90412'],
  ['yesterday', 'Story set publication', 'FRG-1019', 'APPROVED', 'p.sharma · #L-90388'],
  ['yesterday', 'Story set publication', 'FRG-1011', 'REJECTED', 'p.sharma · #L-90371'],
  ['Mon', 'Handoff acceptance', 'FRG-0998', 'ACCEPTED', 'p.sharma · #L-90341'],
  ['Mon', 'Release notes review', 'FRG-0984', 'APPROVED', 'p.sharma · #L-90322'],
  ['last week', 'Story set publication', 'FRG-0961', 'APPROVED', 'p.sharma · #L-90257'],
];

export default function S24ApprovalQueue({ openInspector }: Props) {
  const [mod, setMod] = useState('all');
  const [sla, setSla] = useState('all');
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const visible = ITEMS.filter(
    (it) => (mod === 'all' || it.mod === mod) && (sla === 'all' || (sla === 'urgent' ? it.slaState === 'urgent' : it.slaState !== 'urgent')),
  );
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const chip = (label: string, val: string, cur: string, set: (v: string) => void) => (
    <span
      key={val}
      onClick={() => set(val)}
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '3px 11px',
        borderRadius: 999,
        cursor: 'pointer',
        border: `1px solid ${cur === val ? '#1E2761' : '#E4E9F2'}`,
        background: cur === val ? '#EAECF5' : '#FFFFFF',
        color: cur === val ? '#1E2761' : '#5B6472',
      }}
    >
      {label}
    </span>
  );

  return (
    <div data-screen-label="S24 · Approval Queue" style={{ padding: '22px 28px 48px', fontFamily: SANS, color: '#2A2F3A', maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#1E2761' }}>Approval Queue</h1>
        <span
          style={{
            background: '#FFF8E6',
            border: '1px solid #B8860B',
            color: '#8A6508',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 999,
            padding: '2px 8px',
          }}
        >
          {visible.length} PENDING
        </span>
        <div style={{ flex: 1 }} />
        <div
          onClick={() => checkedCount > 0 && openInspector()}
          className="hvr-bg-fog"
          style={{
            height: 32,
            padding: '0 14px',
            borderRadius: 7,
            border: '1px solid #E4E9F2',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: '#1E2761',
            cursor: 'pointer',
          }}
        >
          {checkedCount > 0 ? `Open ${checkedCount} review context${checkedCount > 1 ? 's' : ''}` : 'Bulk-open · select items'}
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#8A93A6', marginBottom: 16 }}>
        Each item opens its full review context — bulk <em>approval</em> is deliberately not provided.
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#8A93A6' }}>MODULE</span>
        {(
          [
            ['All', 'all'],
            ['SpecAI', 'SpecAI'],
            ['Architect Hub', 'Architect Hub'],
            ['IntelliQA', 'IntelliQA'],
            ['Handoff', 'Handoff'],
          ] as const
        ).map(([l, v]) => chip(l, v, mod, setMod))}
        <span style={{ width: 1, height: 18, background: '#E4E9F2', margin: '0 4px' }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#8A93A6' }}>SLA</span>
        {(
          [
            ['All', 'all'],
            ['Urgent <4h', 'urgent'],
            ['Comfortable', 'ok'],
          ] as const
        ).map(([l, v]) => chip(l, v, sla, setSla))}
      </div>

      {/* Pending items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        {visible.map((it) => (
          <div
            key={it.id}
            style={{
              background: '#FFF8E6',
              border: '1px solid #B8860B',
              borderRadius: 9,
              padding: '13px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 13,
            }}
          >
            <span
              onClick={() => setChecked((s) => ({ ...s, [it.id]: !s[it.id] }))}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: `1.5px solid ${checked[it.id] ? '#1E2761' : '#C9A86A'}`,
                background: checked[it.id] ? '#1E2761' : '#FFFFFF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 700,
                cursor: 'pointer',
                flex: 'none',
              }}
            >
              {checked[it.id] ? '✓' : ''}
            </span>
            <span style={{ width: 8, height: 8, borderRadius: 3, background: it.modColor, flex: 'none' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{it.what}</span>
                <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#8A6508' }}>{it.session}</span>
              </div>
              <div style={{ fontSize: 11, color: '#7A5E0E', marginTop: 2 }}>{it.detail}</div>
            </div>
            <div style={{ textAlign: 'right', flex: 'none' }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: 600,
                  color: it.slaState === 'urgent' ? '#C7131F' : it.slaState === 'soon' ? '#B8860B' : '#1B7F4D',
                }}
              >
                {it.sla}
              </div>
              <div style={{ fontSize: 9.5, color: '#8A93A6', marginTop: 1 }}>{it.age}</div>
            </div>
            <div
              onClick={openInspector}
              className="hvr-bg-navy"
              style={{
                height: 30,
                padding: '0 14px',
                borderRadius: 6,
                background: '#1E2761',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                flex: 'none',
              }}
            >
              Open review →
            </div>
          </div>
        ))}
      </div>

      {/* History */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#8A93A6', marginBottom: 10 }}>MY APPROVAL HISTORY · SIGNED</div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E4E9F2', borderRadius: 10, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 130px 110px 150px',
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
          <span>WHEN</span>
          <span>GATE</span>
          <span>SESSION</span>
          <span>DECISION</span>
          <span>SIGNATURE</span>
        </div>
        {HISTORY.map(([when, gate, session, decision, sig], i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 130px 110px 150px',
              gap: 8,
              padding: '9px 16px',
              borderBottom: '1px solid #F0F3F9',
              fontSize: 12,
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 11, color: '#8A93A6' }}>{when}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{gate}</span>
            <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#3D5AFE' }}>{session}</span>
            <span>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: decision === 'REJECTED' ? '#FDEEEF' : '#E7F4EC',
                  color: decision === 'REJECTED' ? '#C7131F' : '#1B7F4D',
                }}
              >
                {decision}
              </span>
            </span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A93A6' }}>{sig}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
