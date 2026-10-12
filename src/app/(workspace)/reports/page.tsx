'use client';

import { useApp } from '@/context/AppContext';
import { DEMO_REPORT, DEMO_ANALYSIS, SIMILAR_PATIENTS, EVIDENCE_SOURCES } from '@/data/mockData';
import {
  FileText, Download, Printer, Share2, Shield, AlertTriangle,
  CheckCircle, Info, AlertCircle, Activity, Users, BookOpen
} from 'lucide-react';
import { formatDateTime, getRiskLevelColor } from '@/lib/utils';
import Link from 'next/link';

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="report-section">
      <h2
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: 'var(--gray-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 14,
          paddingBottom: 8,
          borderBottom: '2px solid var(--clinical-border)',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function ReportsPage() {
  const { currentPatient } = useApp();
  const report = DEMO_REPORT;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `HAI-SAFE CLINICAL INTELLIGENCE REPORT\n${'='.repeat(60)}\n\nPatient: ${currentPatient?.demographics.name}\nReport ID: ${report.id}\nGenerated: ${formatDateTime(report.generatedAt)}\n\nDISCLAIMER:\n${report.disclaimer}\n\n${'='.repeat(60)}\n\nPATIENT SUMMARY\n${report.patientSummary}\n\nCLINICAL CONTEXT\n${report.clinicalContext}\n\nKEY FINDINGS\n${report.keyFindings.map((f, i) => `${i + 1}. [${f.category}] ${f.finding}`).join('\n')}\n\nRISK FLAGS\n${report.riskFlags.map((r) => `[${r.level}] ${r.title}: ${r.description}`).join('\n')}\n\nMISSING INFORMATION\n${report.missingInformation.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nCLINICAL CONSIDERATIONS\n${report.clinicalConsiderations.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nAI MODEL: ${DEMO_ANALYSIS.aiModelVersion}\nCONFIDENCE: ${report.aiReasoning.confidenceLevel}%\n\n${'='.repeat(60)}\nThis report is NOT a clinical diagnosis and must not replace qualified medical professional judgment.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HAI-SAFE-Report-${report.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 4, letterSpacing: '-0.01em' }}>
            Clinical Reports
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--gray-500)' }}>
            AI-assisted clinical intelligence report · Requires doctor review
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handlePrint} className="btn-secondary" style={{ fontSize: 13 }}>
            <Printer size={15} />
            Print
          </button>
          <button onClick={handleDownload} className="btn-secondary" style={{ fontSize: 13 }}>
            <Download size={15} />
            Download
          </button>
          <Link href="/review" className="btn-primary" style={{ fontSize: 13 }}>
            <Shield size={15} />
            Doctor Review
          </Link>
        </div>
      </div>

      {/* Report Document */}
      <div
        className="clinical-card"
        style={{ padding: '32px 36px', maxWidth: 900, margin: '0 auto' }}
        id="clinical-report"
      >
        {/* Report Header */}
        <div
          style={{
            paddingBottom: 24,
            borderBottom: '3px solid var(--navy-900)',
            marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Activity size={22} color="var(--teal-600)" />
                <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--navy-900)', letterSpacing: '-0.02em' }}>
                  HAI-SAFE
                </span>
              </div>
              <h1
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--navy-800)',
                  letterSpacing: '-0.01em',
                  marginBottom: 4,
                }}
              >
                Clinical Intelligence Report
              </h1>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                  Report ID: {report.id}
                </span>
                <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                  Generated: {formatDateTime(report.generatedAt)}
                </span>
                <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                  Version: {report.reportVersion}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge-ai" style={{ marginBottom: 6, display: 'inline-flex' }}>
                AI-Assisted Analysis
              </span>
              <br />
              <span className="badge-demo" style={{ display: 'inline-flex' }}>
                Synthetic Demo Patient
              </span>
            </div>
          </div>
        </div>

        {/* Critical Disclaimer */}
        <div
          style={{
            padding: '14px 16px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 10,
            marginBottom: 28,
            fontSize: 13,
            color: '#7F1D1D',
            lineHeight: 1.6,
          }}
        >
          <strong>⚠ Important:</strong> {report.disclaimer}
        </div>

        {/* Patient Summary */}
        <ReportSection title="Patient Summary">
          {currentPatient && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                { label: 'Name', value: currentPatient.demographics.name },
                { label: 'Age', value: `${currentPatient.demographics.age} years` },
                { label: 'Sex', value: currentPatient.demographics.sex },
                { label: 'Menopausal Status', value: currentPatient.demographics.menopausalStatus },
                { label: 'Patient ID', value: currentPatient.demographics.patientId },
                { label: 'Review Status', value: currentPatient.reviewStatus },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--gray-50)',
                    borderRadius: 6,
                    border: '1px solid var(--clinical-border-light)',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy-800)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: 13.5, color: 'var(--navy-800)', lineHeight: 1.7 }}>{report.patientSummary}</p>
        </ReportSection>

        {/* Clinical Context */}
        <ReportSection title="Clinical Context">
          <p style={{ fontSize: 13.5, color: 'var(--navy-800)', lineHeight: 1.7 }}>{report.clinicalContext}</p>
        </ReportSection>

        {/* Key Findings */}
        <ReportSection title={`Key Findings (${report.keyFindings.length})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {report.keyFindings.map((finding, i) => (
              <div
                key={finding.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '12px 14px',
                  background: 'var(--gray-50)',
                  borderRadius: 8,
                  border: '1px solid var(--clinical-border)',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--navy-900)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                    {finding.category}
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--navy-800)', lineHeight: 1.5, fontWeight: 500, marginBottom: 8 }}>
                    {finding.finding}
                  </p>
                  <div
                    style={{
                      borderLeft: '3px solid var(--teal-400)',
                      paddingLeft: 10,
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--teal-600)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                      Why This Matters
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                      {finding.whyItMatters}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Risk Flags */}
        <ReportSection title={`Risk / Attention Flags (${report.riskFlags.length})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.riskFlags.map((flag) => {
              const colors = getRiskLevelColor(flag.level);
              return (
                <div
                  key={flag.id}
                  style={{
                    padding: '11px 14px',
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <AlertTriangle size={13} color={colors.text} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>
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
                      }}
                    >
                      {flag.level}
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: colors.text, opacity: 0.85, lineHeight: 1.4, marginBottom: flag.actionRequired ? 6 : 0 }}>
                    {flag.description}
                  </p>
                  {flag.actionRequired && (
                    <p style={{ fontSize: 12, color: colors.text, fontWeight: 600 }}>
                      → {flag.actionRequired}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </ReportSection>

        {/* Missing Information */}
        <ReportSection title={`Missing Information (${report.missingInformation.length})`}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {report.missingInformation.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: '8px 10px',
                  background: 'var(--gray-50)',
                  borderRadius: 6,
                  border: '1px solid var(--clinical-border)',
                  fontSize: 12.5,
                  color: 'var(--navy-800)',
                  alignItems: 'flex-start',
                }}
              >
                <Info size={12} color="var(--status-info)" style={{ marginTop: 2, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Similar Patient Evidence */}
        <ReportSection title="Similar Patient Evidence">
          <div
            style={{
              padding: '14px 16px',
              background: 'var(--teal-50)',
              border: '1px solid var(--teal-100)',
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Users size={15} color="var(--teal-600)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-800)' }}>
                {report.similarPatientEvidence.topCasesCount} similar historical cases retrieved
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--teal-700)', lineHeight: 1.6 }}>
              {report.similarPatientEvidence.summary}
            </p>
          </div>
          <div className="clinical-disclaimer">
            Historical case patterns are contextual. Individual outcomes vary. Not prescriptive.
          </div>
        </ReportSection>

        {/* Treatment Evidence */}
        <ReportSection title="Treatment Pattern Evidence">
          <p style={{ fontSize: 13.5, color: 'var(--navy-800)', lineHeight: 1.7 }}>
            {report.treatmentPatternEvidence.summary}
          </p>
        </ReportSection>

        {/* Evidence Summary */}
        <ReportSection title="Guideline & Research Evidence">
          <p style={{ fontSize: 13.5, color: 'var(--navy-800)', lineHeight: 1.7, marginBottom: 12 }}>
            {report.evidenceGuidelineSummary}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EVIDENCE_SOURCES.filter((ev) => ev.relevance === 'High').map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: '4px 10px',
                  background: 'var(--gray-100)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--navy-700)',
                }}
              >
                {ev.sourceAbbrev} {ev.year}
              </div>
            ))}
          </div>
        </ReportSection>

        {/* AI Reasoning */}
        <ReportSection title="AI Reasoning — Knowns & Unknowns">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#065F46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <CheckCircle size={13} /> Knowns
              </div>
              {report.aiReasoning.knowns.map((k, i) => (
                <div key={i} style={{ display: 'flex', gap: 7, fontSize: 13, color: 'var(--navy-800)', marginBottom: 5, lineHeight: 1.4 }}>
                  <CheckCircle size={12} color="var(--status-success)" style={{ marginTop: 2, flexShrink: 0 }} />
                  {k}
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#7F1D1D',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <AlertCircle size={13} /> Unknowns
              </div>
              {report.aiReasoning.unknowns.map((u, i) => (
                <div key={i} style={{ display: 'flex', gap: 7, fontSize: 13, color: 'var(--navy-800)', marginBottom: 5, lineHeight: 1.4 }}>
                  <AlertCircle size={12} color="var(--status-warning)" style={{ marginTop: 2, flexShrink: 0 }} />
                  {u}
                </div>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--gray-50)',
              border: '1px solid var(--clinical-border)',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--navy-700)' }}>
                AI Analysis Confidence
              </span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0284C7' }}>
                {report.aiReasoning.confidenceLevel}% (Moderate)
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${report.aiReasoning.confidenceLevel}%`, background: 'linear-gradient(90deg, #0284C7, #0EA898)', borderRadius: 3 }} />
            </div>
            {report.aiReasoning.uncertaintyNotes.map((note, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, fontSize: 12, color: 'var(--gray-600)', marginBottom: 4 }}>
                <AlertTriangle size={11} color="var(--status-warning)" style={{ marginTop: 2, flexShrink: 0 }} />
                {note}
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Clinical Considerations */}
        <ReportSection title="Clinical Considerations">
          <p style={{ fontSize: 12.5, color: 'var(--gray-500)', marginBottom: 12, lineHeight: 1.5 }}>
            The following considerations are surfaced for clinician review. They are not instructions — they require professional evaluation and MDT discussion.
          </p>
          {report.clinicalConsiderations.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                padding: '9px 12px',
                background: 'var(--gray-50)',
                borderRadius: 7,
                border: '1px solid var(--clinical-border)',
                marginBottom: 7,
                fontSize: 13,
                color: 'var(--navy-800)',
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'var(--teal-100)',
                  color: 'var(--teal-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              {c}
            </div>
          ))}
        </ReportSection>

        {/* Footer */}
        <div
          style={{
            paddingTop: 20,
            borderTop: '2px solid var(--navy-900)',
            marginTop: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--navy-700)', marginBottom: 2 }}>
              AI Model: {DEMO_ANALYSIS.aiModelVersion}
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>
              Generated: {formatDateTime(report.generatedAt)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy-700)' }}>
              Doctor Review Status
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#D97706',
                marginTop: 3,
              }}
            >
              ⏳ Pending Review
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <Link href="/review" className="btn-primary">
          <Shield size={16} />
          Start Doctor Review
        </Link>
        <button onClick={handlePrint} className="btn-secondary">
          <Printer size={15} />
          Print Report
        </button>
        <button onClick={handleDownload} className="btn-secondary">
          <Download size={15} />
          Download Report
        </button>
      </div>
    </div>
  );
}
