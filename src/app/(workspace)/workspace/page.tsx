'use client';

import { useApp } from '@/context/AppContext';
import { DEMO_ANALYSIS, DEMO_REPORT, SIMILAR_PATIENTS } from '@/data/mockData';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Users,
  Microscope,
  BookOpen,
  FileText,
  Shield,
  ChevronRight,
  AlertCircle,
  Info,
  TrendingUp,
  Pill,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, getRiskLevelColor, getSimilarityColor } from '@/lib/utils';

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'Pending Review': '#D97706',
    'Under Review': '#0284C7',
    Approved: '#059669',
    Edited: '#6366F1',
    Rejected: '#DC2626',
    'Needs More Information': '#D97706',
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 9px',
        background: `${colors[status] || '#94A3B8'}18`,
        color: colors[status] || '#94A3B8',
        borderRadius: 20,
        fontSize: 11.5,
        fontWeight: 600,
        border: `1px solid ${colors[status] || '#94A3B8'}30`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: colors[status] || '#94A3B8',
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href?: string;
}) {
  const content = (
    <div
      className="clinical-card"
      style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--gray-600)', fontWeight: 500, marginTop: 2 }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 4 }}>{sub}</div>
        )}
      </div>
      {href && (
        <ChevronRight size={16} color="var(--gray-400)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </Link>
    );
  }
  return content;
}

export default function WorkspacePage() {
  const { currentPatient } = useApp();
  const patient = currentPatient;
  const analysis = DEMO_ANALYSIS;
  const report = DEMO_REPORT;

  if (!patient) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: 'var(--gray-500)', fontSize: 15 }}>No patient selected.</p>
        <Link href="/patients" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          Select Patient
        </Link>
      </div>
    );
  }

  const highRiskFlags = analysis.riskFlags.filter((f) => f.level === 'HIGH');
  const moderateRiskFlags = analysis.riskFlags.filter((f) => f.level === 'MODERATE');
  const topSimilarCases = [...SIMILAR_PATIENTS].sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 3);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Patient Context Bar */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--clinical-border)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 800,
              color: 'white',
              flexShrink: 0,
            }}
          >
            {patient.demographics.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{ fontSize: 17, fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.01em' }}
              >
                {patient.demographics.name}
              </span>
              <span className="badge-demo">Synthetic Demo</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--gray-500)', marginTop: 3 }}>
              {patient.demographics.age} years · {patient.demographics.sex} ·{' '}
              {patient.demographics.menopausalStatus} · ID: {patient.demographics.patientId}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginLeft: 'auto',
            alignItems: 'center',
          }}
        >
          {patient.cancerSubtype && (
            <div
              style={{
                padding: '4px 10px',
                background: 'var(--violet-50)',
                border: '1px solid var(--violet-100)',
                borderRadius: 7,
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--violet-600)',
              }}
            >
              {patient.cancerSubtype}
            </div>
          )}
          {patient.clinicalStage && (
            <div
              style={{
                padding: '4px 10px',
                background: 'var(--teal-50)',
                border: '1px solid var(--teal-100)',
                borderRadius: 7,
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--teal-600)',
              }}
            >
              {patient.clinicalStage}
            </div>
          )}
          <StatusDot status={patient.reviewStatus} />
          <Link href="/analysis" className="btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}>
            <Activity size={14} />
            View Analysis
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <MetricCard
          icon={AlertCircle}
          label="Risk Flags"
          value={analysis.riskFlags.length}
          sub={`${highRiskFlags.length} HIGH · ${moderateRiskFlags.length} MODERATE`}
          color="#DC2626"
          href="/analysis"
        />
        <MetricCard
          icon={Users}
          label="Similar Cases"
          value={SIMILAR_PATIENTS.length}
          sub="Top match 94% similarity"
          color="var(--teal-600)"
          href="/similar-cases"
        />
        <MetricCard
          icon={BookOpen}
          label="Evidence Sources"
          value={6}
          sub="NCCN · ESMO · ICMR"
          color="var(--violet-600)"
          href="/evidence"
        />
        <MetricCard
          icon={TrendingUp}
          label="AI Confidence"
          value={`${analysis.confidenceLevel}%`}
          sub="Moderate — review recommended"
          color="#0284C7"
          href="/analysis"
        />
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 20,
        }}
        className="workspace-grid"
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Patient Snapshot */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)' }}>
                Patient Snapshot
              </h2>
              <Link href="/patients" style={{ fontSize: 12, color: 'var(--teal-600)', textDecoration: 'none', fontWeight: 600 }}>
                Full record →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Presenting Complaint', value: patient.symptoms.presentingComplaint },
                { label: 'Duration', value: patient.symptoms.duration },
                { label: 'Menopausal Status', value: patient.demographics.menopausalStatus },
                { label: 'ER / PR / HER2', value: `${patient.biomarkers.er} / ${patient.biomarkers.pr} / ${patient.biomarkers.her2}` },
                { label: 'Ki67', value: patient.biomarkers.ki67 || 'Pending' },
                { label: 'Cancer Subtype', value: patient.cancerSubtype || 'Pending' },
                { label: 'Clinical Stage', value: patient.clinicalStage || 'Pending' },
                { label: 'Histopathology', value: 'IDC Grade 2 (Preliminary)' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--gray-50)',
                    borderRadius: 8,
                    border: '1px solid var(--clinical-border-light)',
                  }}
                >
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--gray-400)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy-800)', lineHeight: 1.3 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Flags */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)' }}>
                Key Risk Flags
              </h2>
              <Link href="/analysis" style={{ fontSize: 12, color: 'var(--teal-600)', textDecoration: 'none', fontWeight: 600 }}>
                View all {analysis.riskFlags.length} →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {analysis.riskFlags.slice(0, 4).map((flag) => {
                const colors = getRiskLevelColor(flag.level);
                return (
                  <div
                    key={flag.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 8,
                    }}
                  >
                    <AlertTriangle size={14} color={colors.text} style={{ marginTop: 1, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: colors.text, marginBottom: 2 }}>
                        {flag.title}
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '1px 5px',
                            background: `${colors.text}20`,
                            borderRadius: 4,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {flag.level}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: colors.text, opacity: 0.8, lineHeight: 1.4 }}>
                        {flag.description.substring(0, 100)}...
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Information */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)' }}>
                Missing Information ({analysis.missingInformation.length})
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {analysis.missingInformation.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 7,
                    padding: '8px 10px',
                    background: 'var(--gray-50)',
                    borderRadius: 7,
                    border: '1px solid var(--clinical-border-light)',
                  }}
                >
                  <Info size={12} color="var(--status-info)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--navy-700)', lineHeight: 1.3 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Analysis Status */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 16 }}>
              Analysis Status
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {analysis.processingSteps.map((step) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background:
                        step.status === 'complete' ? 'var(--status-success)' : 'var(--gray-200)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle size={13} color={step.status === 'complete' ? 'white' : 'var(--gray-400)'} />
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: step.status === 'complete' ? 'var(--navy-800)' : 'var(--gray-400)',
                      fontWeight: step.status === 'complete' ? 500 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Confidence */}
            <div
              style={{
                marginTop: 16,
                padding: '12px 14px',
                background: 'var(--gray-50)',
                borderRadius: 8,
                border: '1px solid var(--clinical-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy-700)' }}>
                  AI Confidence Level
                </span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0284C7' }}>
                  {analysis.confidenceLevel}%
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${analysis.confidenceLevel}%`,
                    background: 'linear-gradient(90deg, #0284C7, #0EA898)',
                    borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <p style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 5 }}>
                Moderate confidence — clinical review recommended
              </p>
            </div>
          </div>

          {/* Similar Cases Summary */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)' }}>
                Similar Cases
              </h2>
              <Link href="/similar-cases" style={{ fontSize: 12, color: 'var(--teal-600)', textDecoration: 'none', fontWeight: 600 }}>
                View all 5 →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topSimilarCases.map((sc) => (
                <div
                  key={sc.id}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--gray-50)',
                    borderRadius: 8,
                    border: '1px solid var(--clinical-border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--navy-800)' }}>
                      {sc.caseId}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--gray-500)', marginTop: 2 }}>
                      {sc.age}F · {sc.clinicalStage} · {sc.outcome}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: getSimilarityColor(sc.similarityScore),
                      }}
                    >
                      {sc.similarityScore}%
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 500 }}>match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Review State */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 16 }}>
              Doctor Review
            </h2>
            <div
              style={{
                padding: '16px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 10,
                textAlign: 'center',
              }}
            >
              <Clock size={28} color="#D97706" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#78350F', marginBottom: 4 }}>
                Pending Review
              </div>
              <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.4, marginBottom: 14 }}>
                Clinical analysis is complete. Doctor review and decision required.
              </div>
              <Link href="/review" className="btn-primary" style={{ fontSize: 12, padding: '7px 16px' }}>
                <Shield size={14} />
                Start Doctor Review
              </Link>
            </div>
            <div
              className="clinical-disclaimer"
              style={{ marginTop: 12 }}
            >
              AI DOES NOT MAKE FINAL CLINICAL DECISIONS. The doctor remains the final decision-maker.
            </div>
          </div>

          {/* Quick Actions */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14 }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/analysis', icon: Microscope, label: 'View Clinical Analysis', color: 'var(--violet-600)' },
                { href: '/similar-cases', icon: Users, label: 'Similar Patient Intelligence', color: 'var(--teal-600)' },
                { href: '/treatment', icon: Pill, label: 'Treatment Intelligence', color: '#0284C7' },
                { href: '/evidence', icon: BookOpen, label: 'Evidence & Guidelines', color: '#059669' },
                { href: '/reports', icon: FileText, label: 'Clinical Report', color: '#D97706' },
                { href: '/audit', icon: Shield, label: 'Audit Trail', color: 'var(--gray-500)' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--clinical-border)',
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--navy-800)',
                      transition: 'all 0.12s ease',
                      background: 'white',
                    }}
                  >
                    <Icon size={15} color={action.color} />
                    {action.label}
                    <ChevronRight size={13} color="var(--gray-400)" style={{ marginLeft: 'auto' }} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .workspace-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
