'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { DEMO_ANALYSIS } from '@/data/mockData';
import {
  CheckCircle, Circle, AlertTriangle, ChevronDown, ChevronUp,
  Shield, Info, AlertCircle, Activity, Loader2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { ClinicalAnalysis, ClinicalFinding, RiskFlag } from '@/types';
import { getRiskLevelColor, getConfidenceColor } from '@/lib/utils';
import { logAuditEvent } from '@/services/repositories';

const PROCESSING_STEPS = [
  'Validating patient information',
  'Structuring clinical data',
  'Performing clinical analysis',
  'Checking missing information',
  'Retrieving similar cases',
  'Retrieving evidence & guidelines',
  'Comparing treatment patterns',
  'Generating explainable report',
];

function FindingCard({ finding }: { finding: ClinicalFinding }) {
  const [expanded, setExpanded] = useState(false);
  const confidenceColors: Record<string, string> = {
    High: 'var(--status-success)',
    Moderate: 'var(--status-warning)',
    Low: 'var(--status-error)',
  };
  return (
    <div
      className="clinical-card"
      style={{ padding: 0, overflow: 'hidden', marginBottom: 10 }}
    >
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          cursor: 'pointer',
          background: 'white',
        }}
        onClick={() => setExpanded(!expanded)}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: confidenceColors[finding.confidence] || 'var(--gray-400)',
            flexShrink: 0,
            marginTop: 7,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--gray-400)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {finding.category}
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--navy-800)', lineHeight: 1.5, fontWeight: 500 }}>
            {finding.finding}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 5,
              background: `${confidenceColors[finding.confidence]}18`,
              color: confidenceColors[finding.confidence],
            }}
          >
            {finding.confidence} confidence
          </span>
          {expanded ? <ChevronUp size={14} color="var(--gray-400)" /> : <ChevronDown size={14} color="var(--gray-400)" />}
        </div>
      </div>
      {expanded && (
        <div
          style={{
            padding: '14px 16px',
            background: 'var(--gray-50)',
            borderTop: '1px solid var(--clinical-border)',
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: 'var(--teal-600)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              ▸ Why This Matters
            </span>
            <p style={{ fontSize: 13, color: 'var(--navy-700)', lineHeight: 1.6, marginTop: 5 }}>
              {finding.whyItMatters}
            </p>
          </div>
          {finding.evidenceBasis && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                background: 'var(--teal-50)',
                border: '1px solid var(--teal-100)',
                borderRadius: 6,
                fontSize: 11.5,
                color: 'var(--teal-700)',
              }}
            >
              <Shield size={11} />
              Evidence: {finding.evidenceBasis}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RiskFlagCard({ flag }: { flag: RiskFlag }) {
  const [expanded, setExpanded] = useState(false);
  const colors = getRiskLevelColor(flag.level);
  const icons: Record<string, React.ElementType> = {
    HIGH: AlertTriangle,
    MODERATE: AlertCircle,
    LOW: Info,
    INFORMATIONAL: Info,
  };
  const FlagIcon = icons[flag.level] || Info;

  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          padding: '12px 14px',
          background: colors.bg,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      >
        <FlagIcon size={15} color={colors.text} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: colors.text }}>
              {flag.title}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 4,
                background: `${colors.text}20`,
                color: colors.text,
                letterSpacing: '0.05em',
              }}
            >
              {flag.level}
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: colors.text, opacity: 0.85, lineHeight: 1.4, marginTop: 3 }}>
            {flag.description}
          </p>
        </div>
        {expanded ? <ChevronUp size={14} color={colors.text} /> : <ChevronDown size={14} color={colors.text} />}
      </div>
      {expanded && (
        <div
          style={{
            padding: '12px 14px',
            background: 'white',
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy-700)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Clinical Implication
            </span>
            <p style={{ fontSize: 13, color: 'var(--navy-700)', lineHeight: 1.5, marginTop: 4 }}>
              {flag.clinicalImplication}
            </p>
          </div>
          {flag.actionRequired && (
            <div
              style={{
                padding: '8px 12px',
                background: 'var(--status-info-bg)',
                border: '1px solid #BAE6FD',
                borderRadius: 7,
                fontSize: 12.5,
                color: '#0C4A6E',
                fontWeight: 600,
              }}
            >
              → Action: {flag.actionRequired}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  const { currentPatient, analysisStatus, setAnalysisStatus } = useApp();
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<ClinicalAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'findings' | 'risks' | 'missing' | 'reasoning'>('findings');

  const runAnalysis = async () => {
    setAnalysisStatus('running');
    setCompletedSteps([]);
    setAnalysis(null);

    await logAuditEvent({
      eventType: 'analysis_initiated',
      patientId: currentPatient?.demographics.id,
      actor: 'HAI-SAFE System',
      actorType: 'System',
      action: `Clinical analysis initiated`,
      status: 'Pending',
    });

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
      setCompletedSteps((prev) => [...prev, i]);
    }

    await logAuditEvent({
      eventType: 'analysis_complete',
      patientId: currentPatient?.demographics.id,
      actor: 'HAI-SAFE System',
      actorType: 'System',
      action: `Clinical analysis completed`,
      status: 'Success',
    });

    setAnalysis(DEMO_ANALYSIS);
    setAnalysisStatus('complete');
    setActiveStep(-1);
  };

  useEffect(() => {
    if (analysisStatus === 'complete') {
      setAnalysis(DEMO_ANALYSIS);
      setCompletedSteps(PROCESSING_STEPS.map((_, i) => i));
    }
  }, [analysisStatus]);

  if (!currentPatient) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: 'var(--gray-500)', fontSize: 15, marginBottom: 16 }}>
          No patient selected.
        </p>
        <Link href="/patients" className="btn-primary" style={{ display: 'inline-flex' }}>
          Select Patient
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 4, letterSpacing: '-0.01em' }}>
            Clinical Analysis
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--gray-500)' }}>
            AI-assisted clinical analysis · Evidence-backed · Doctor review required
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {analysisStatus !== 'running' && (
            <button onClick={runAnalysis} className="btn-primary">
              <Activity size={16} />
              {analysisStatus === 'idle' ? 'Analyze Clinical Case' : 'Re-analyze'}
            </button>
          )}
          {analysisStatus === 'complete' && (
            <Link href="/reports" className="btn-secondary">
              <ArrowRight size={15} />
              View Report
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: analysisStatus === 'complete' ? 'minmax(0,1fr) minmax(0,1.8fr)' : '1fr', gap: 24 }}>
        {/* Processing Panel */}
        <div>
          <div className="clinical-card" style={{ padding: '22px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              {analysisStatus === 'running' ? (
                <Loader2 size={20} color="var(--teal-500)" style={{ animation: 'spin 1s linear infinite' }} />
              ) : analysisStatus === 'complete' ? (
                <CheckCircle size={20} color="var(--status-success)" />
              ) : (
                <Circle size={20} color="var(--gray-400)" />
              )}
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-800)' }}>
                {analysisStatus === 'idle'
                  ? 'Ready to Analyze'
                  : analysisStatus === 'running'
                  ? 'Processing...'
                  : 'Analysis Complete'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PROCESSING_STEPS.map((step, i) => {
                const isDone = completedSteps.includes(i);
                const isActive = activeStep === i;
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: isDone
                          ? 'var(--status-success)'
                          : isActive
                          ? 'var(--teal-500)'
                          : 'var(--gray-200)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isDone ? (
                        <CheckCircle size={13} color="white" />
                      ) : isActive ? (
                        <Loader2 size={11} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <span style={{ fontSize: 10, color: 'var(--gray-500)', fontWeight: 600 }}>{i + 1}</span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        color: isDone
                          ? 'var(--navy-800)'
                          : isActive
                          ? 'var(--teal-700)'
                          : 'var(--gray-400)',
                        fontWeight: isDone || isActive ? 600 : 400,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {step}
                    </span>
                    {isActive && (
                      <div
                        style={{
                          marginLeft: 'auto',
                          fontSize: 10,
                          color: 'var(--teal-600)',
                          fontWeight: 600,
                          animation: 'pulse 1s ease infinite',
                        }}
                      >
                        Running...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            {analysisStatus === 'running' && (
              <div style={{ marginTop: 16 }}>
                <div style={{ height: 4, background: 'var(--gray-100)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(completedSteps.length / PROCESSING_STEPS.length) * 100}%`,
                      background: 'linear-gradient(90deg, var(--teal-500), var(--teal-400))',
                      borderRadius: 2,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 6, textAlign: 'right' }}>
                  {completedSteps.length} / {PROCESSING_STEPS.length} complete
                </p>
              </div>
            )}

            {analysisStatus === 'idle' && (
              <div className="clinical-disclaimer" style={{ marginTop: 16 }}>
                Analysis uses deterministic demo intelligence. No live AI inference. Results are for prototype demonstration only.
              </div>
            )}
          </div>

          {/* Confidence */}
          {analysis && (
            <div className="clinical-card" style={{ padding: '20px 22px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14 }}>
                AI Confidence & Uncertainty
              </div>
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: getConfidenceColor(analysis.confidenceLevel),
                    lineHeight: 1,
                  }}
                >
                  {analysis.confidenceLevel}%
                </div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                  Moderate Confidence
                </div>
              </div>
              <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${analysis.confidenceLevel}%`,
                    background: `linear-gradient(90deg, ${getConfidenceColor(analysis.confidenceLevel)}, ${getConfidenceColor(analysis.confidenceLevel)}aa)`,
                    borderRadius: 4,
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {analysis.uncertaintyNotes.slice(0, 3).map((note, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.4 }}>
                    <AlertTriangle size={11} color="var(--status-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                    {note}
                  </div>
                ))}
              </div>
              <div className="clinical-disclaimer" style={{ marginTop: 12 }}>
                Confidence score reflects data completeness and consistency. Does not guarantee clinical accuracy. Doctor review required.
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        {analysis && (
          <div>
            {/* Summary */}
            <div className="clinical-card" style={{ padding: '20px 22px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="badge-ai">AI-Assisted Analysis</span>
                <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                  {new Date(analysis.analysisDate).toLocaleString()}
                </span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--navy-800)', lineHeight: 1.7 }}>
                {analysis.clinicalSummary}
              </p>
              <div
                className="clinical-disclaimer"
                style={{ marginTop: 12 }}
              >
                This is an AI-assisted clinical analysis — NOT a final diagnosis or treatment prescription. All findings require clinical review.
              </div>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: 16 }}>
              <div className="tab-nav">
                {(['findings', 'risks', 'missing', 'reasoning'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'findings' && `Key Findings (${analysis.keyFindings.length})`}
                    {tab === 'risks' && `Risk Flags (${analysis.riskFlags.length})`}
                    {tab === 'missing' && `Missing Data (${analysis.missingInformation.length})`}
                    {tab === 'reasoning' && 'AI Reasoning'}
                  </button>
                ))}
              </div>
            </div>

            {/* Findings */}
            {activeTab === 'findings' && (
              <div>
                {analysis.keyFindings.map((f) => <FindingCard key={f.id} finding={f} />)}
              </div>
            )}

            {/* Risk Flags */}
            {activeTab === 'risks' && (
              <div>
                {analysis.riskFlags.map((f) => <RiskFlagCard key={f.id} flag={f} />)}
              </div>
            )}

            {/* Missing Info */}
            {activeTab === 'missing' && (
              <div className="clinical-card" style={{ padding: '20px 22px' }}>
                <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 14, lineHeight: 1.5 }}>
                  The following information is missing or pending, which limits the completeness of this analysis. Obtaining this information is recommended before finalizing treatment decisions.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {analysis.missingInformation.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'var(--gray-50)',
                        borderRadius: 8,
                        border: '1px solid var(--clinical-border)',
                      }}
                    >
                      <Info size={14} color="var(--status-info)" style={{ marginTop: 1, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--navy-800)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning */}
            {activeTab === 'reasoning' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="clinical-card" style={{ padding: '20px 22px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 12 }}>
                    Clinical Factors Considered
                  </div>
                  {analysis.relevantClinicalFactors.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--navy-700)', marginBottom: 6, lineHeight: 1.4 }}>
                      <CheckCircle size={13} color="var(--teal-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="clinical-card" style={{ padding: '20px 22px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 12 }}>
                    Evidence Sources Used
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {analysis.evidenceUsed.map((ev) => (
                      <span key={ev} className="badge-evidence">{ev}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <Link href="/similar-cases" className="btn-secondary" style={{ fontSize: 13 }}>
                Similar Patient Intelligence
              </Link>
              <Link href="/evidence" className="btn-secondary" style={{ fontSize: 13 }}>
                View Evidence
              </Link>
              <Link href="/review" className="btn-primary" style={{ fontSize: 13 }}>
                <Shield size={15} />
                Doctor Review
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
