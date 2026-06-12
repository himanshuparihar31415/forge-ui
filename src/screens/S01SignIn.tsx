import { useState } from 'react';
import { MONO, SANS, SERIF } from '../ui';

interface Props {
  onSignIn: () => void;
}

export default function S01SignIn({ onSignIn }: Props) {
  const [error, setError] = useState(false);

  return (
    <div
      data-screen-label="S1 · Sign-in"
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
          width: 400,
          background: '#FFFFFF',
          border: '1px solid #E4E9F2',
          borderRadius: 14,
          padding: '38px 36px 30px',
          boxShadow: '0 18px 50px rgba(30,39,97,.08)',
          animation: 'siIn .3s ease',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: '#1E2761',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 20,
              color: '#FFFFFF',
            }}
          >
            F
          </div>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 27, color: '#1E2761' }}>Forge</span>
        </div>
        <div style={{ fontSize: 12.5, color: '#5B6472', marginBottom: 26 }}>
          AI-powered product development lifecycle
          <br />
          for LPL Financial
        </div>

        {!error && (
          <>
            <div
              onClick={onSignIn}
              className="hvr-bg-navy"
              style={{
                height: 42,
                borderRadius: 8,
                background: '#1E2761',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                L
              </span>
              Sign in with LPL SSO
            </div>
            <div style={{ fontSize: 10.5, color: '#8A93A6', marginTop: 12 }}>MFA handled by your identity provider · no local accounts</div>
          </>
        )}

        {error && (
          <div
            style={{
              background: '#FDEEEF',
              border: '1px solid #C7131F',
              borderRadius: 8,
              padding: '14px 16px',
              textAlign: 'left',
              animation: 'siIn .25s ease',
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#C7131F' }}>Your role has no Forge persona mapping</div>
            <div style={{ fontSize: 11.5, color: '#5B6472', marginTop: 5, lineHeight: 1.6 }}>
              Your IAM role (<span style={{ fontFamily: MONO, fontSize: 10.5 }}>LPL-OPS-TEMP</span>) is not mapped to a Forge persona. Contact your
              Forge admin or request access below.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
              <span
                className="hvr-bg-lblue"
                style={{ fontSize: 11, fontWeight: 600, color: '#3D5AFE', border: '1px solid #C9D6FF', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}
              >
                Request access
              </span>
              <span
                onClick={() => setError(false)}
                className="hvr-bg-grey"
                style={{ fontSize: 11, fontWeight: 600, color: '#5B6472', border: '1px solid #E4E9F2', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}
              >
                Back
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={{ width: 400, textAlign: 'center', marginTop: 18, fontSize: 10.5, color: '#8A93A6', lineHeight: 1.7 }}>
        All sessions are recorded to the audit ledger.
        <br />
        Access is governed by your LPL IAM role.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: '#A6AFC0' }}>v0.9.2-pilot</span>
        <span
          style={{
            background: '#FFF8E6',
            border: '1px solid #B8860B',
            color: '#8A6508',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '.08em',
            padding: '1px 7px',
            borderRadius: 4,
          }}
        >
          PILOT
        </span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: '#A6AFC0' }}>LPL AWS us-east-1</span>
        <span onClick={() => setError(true)} className="hvr-c-grey" style={{ fontSize: 10, color: '#C9D3E4', cursor: 'pointer' }}>
          demo: unmapped role
        </span>
      </div>
    </div>
  );
}
