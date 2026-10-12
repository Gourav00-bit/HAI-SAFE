'use client';

import { useState } from 'react';
import { SIMILAR_PATIENTS } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import {
  Users, Filter, ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle, X
} from 'lucide-react';
import Link from 'next/link';
import { SimilarPatient } from '@/types';
import { getSimilarityColor, getOutcomeColor } from '@/lib/utils';

type FilterType = 'all' | 'high-similarity' | 'same-stage' | 'biomarker-match';

function SimilarityBar({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            background: `linear-gradient(90deg, ${getSimilarityColor(score)}, ${getSimilarityColor(score)}cc)`,
            borderRadius: 3,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span
        style={{ fontSize: 13, fontWeight: 800, color: getSimilarityColor(score), minWidth: 36, textAlign: 'right' }}
      >
        {score}%
      </span>
    </div>
  );
}

function CaseDetailModal({ patient, onClose }: { patient: SimilarPatient; onClose: () => void }) {
  const outcomeColor = getOutcomeColor(patient.outcome);
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(13,27,46,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          padding: '28px 32px',
          maxWidth: 700,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(13,27,46,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'var(--gray-100)',
            border: 'none',
            borderRadius: 8,
            padding: 6,
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          <X size={16} color="var(--gray-600)" />
        </button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy-900)' }}>{patient.caseId}</span>
            <span className="badge-demo">Historical · Synthetic</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
            {patient.age}F · {patient.cancerSubtype} · {patient.clinicalStage} · {patient.year}
          </p>
        </div>

        {/* Similarity score */}
        <div
          style={{
            padding: '14px 16px',
            background: `${getSimilarityColor(patient.similarityScore)}10`,
            border: `1px solid ${getSimilarityColor(patient.similarityScore)}40`,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Similarity Score
          </div>
          <SimilarityBar score={patient.similarityScore} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Age', value: `${patient.age} years` },
            { label: 'Stage', value: patient.clinicalStage },
            { label: 'Subtype', value: patient.cancerSubtype },
            { label: 'Treatment', value: patient.treatmentUsed },
            { label: 'ER / PR / HER2', value: `${patient.biomarkers.er} / ${patient.biomarkers.pr} / ${patient.biomarkers.her2}` },
            { label: 'Follow-up', value: `${patient.followUpMonths} months` },
          ].map((item) => (
            <div
              key={item.label}
              style={{ padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--clinical-border-light)' }}
            >
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Outcome */}
        <div
          style={{
            padding: '12px 14px',
            background: outcomeColor.bg,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: outcomeColor.text, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Outcome
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: outcomeColor.text }}>{patient.outcome}</div>
          <p style={{ fontSize: 12.5, color: outcomeColor.text, opacity: 0.85, marginTop: 4, lineHeight: 1.5 }}>{patient.outcomeDetails}</p>
        </div>

        {/* Similarity factors */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy-700)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Matched Because Of
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {patient.similarityFactors.map((f) => (
              <span key={f} className="badge-evidence">{f}</span>
            ))}
          </div>
        </div>

        {/* Differences */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy-700)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Key Differences
          </div>
          {patient.keyDifferences.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gray-700)', marginBottom: 5 }}>
              <Info size={12} color="var(--status-warning)" style={{ marginTop: 2, flexShrink: 0 }} />
              {d}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="clinical-disclaimer">
          Historical context only. Treatment from this case does not automatically apply to the current patient. Requires clinician review.
        </div>

        {patient.notes && (
          <p style={{ fontSize: 12.5, color: 'var(--gray-600)', marginTop: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
            Notes: {patient.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SimilarCasesPage() {
  const { currentPatient } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCase, setSelectedCase] = useState<SimilarPatient | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allCases = [...SIMILAR_PATIENTS].sort((a, b) => b.similarityScore - a.similarityScore);
  const filtered = allCases.filter((c) => {
    if (filter === 'high-similarity') return c.similarityScore >= 85;
    if (filter === 'same-stage') return c.clinicalStage.includes('IIA');
    if (filter === 'biomarker-match') return c.biomarkers.er === 'Positive' && c.biomarkers.her2 === 'Negative';
    return true;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 4, letterSpacing: '-0.01em' }}>
          Similar Patient Intelligence
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--gray-500)', maxWidth: 600 }}>
          Clinically relevant historical cases to provide context for the current patient.
          Patterns are for reference only and require clinician review.
        </p>
      </div>

      {/* Context + Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="tab-nav">
          {([
            { key: 'all', label: `All Cases (${allCases.length})` },
            { key: 'high-similarity', label: 'High Similarity (≥85%)' },
            { key: 'same-stage', label: 'Same Stage' },
            { key: 'biomarker-match', label: 'Biomarker Match' },
          ] as const).map((f) => (
            <button
              key={f.key}
              className={`tab-item ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>
          Showing {filtered.length} of {allCases.length} cases
        </span>
      </div>

      {/* How similarity works */}
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--violet-50)',
          border: '1px solid var(--violet-100)',
          borderRadius: 10,
          marginBottom: 20,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          fontSize: 13,
          color: 'var(--violet-600)',
        }}
      >
        <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong>Similarity is computed on:</strong> cancer subtype, clinical stage, ER/PR/HER2 biomarkers, menopausal status, age group, and family history.
          Each match score reflects weighted clinical relevance, not direct treatment equivalence.
        </div>
      </div>

      {/* Case Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((c) => {
          const outcomeColor = getOutcomeColor(c.outcome);
          const isExpanded = expandedId === c.id;
          return (
            <div key={c.id} className="clinical-card" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                }}
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                {/* Rank */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--navy-900)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  #{allCases.findIndex((ac) => ac.id === c.id) + 1}
                </div>

                {/* Case ID */}
                <div style={{ minWidth: 130 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)' }}>{c.caseId}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--gray-500)' }}>{c.age}F · {c.year}</div>
                </div>

                {/* Similarity */}
                <div style={{ minWidth: 140, flex: 1 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
                    Match Score
                  </div>
                  <SimilarityBar score={c.similarityScore} />
                </div>

                {/* Clinical Profile */}
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy-700)' }}>{c.cancerSubtype.split(' ')[0]} {c.cancerSubtype.includes('ER+') ? '(ER+/PR+)' : ''}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--gray-500)', marginTop: 2 }}>{c.clinicalStage}</div>
                </div>

                {/* Treatment */}
                <div style={{ minWidth: 180, maxWidth: 220, display: 'none' }} className="md-show">
                  <div style={{ fontSize: 12, color: 'var(--navy-700)', lineHeight: 1.4 }}>
                    {c.treatmentUsed.length > 60 ? c.treatmentUsed.substring(0, 60) + '...' : c.treatmentUsed}
                  </div>
                </div>

                {/* Outcome */}
                <div style={{ flexShrink: 0 }}>
                  <span
                    style={{
                      padding: '4px 9px',
                      borderRadius: 7,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: outcomeColor.bg,
                      color: outcomeColor.text,
                    }}
                  >
                    {c.outcome}
                  </span>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 3, textAlign: 'center' }}>
                    {c.followUpMonths}mo follow-up
                  </div>
                </div>

                {/* Expand */}
                <div style={{ marginLeft: 'auto', flexShrink: 0, display: 'flex', gap: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedCase(c); }}
                    style={{
                      padding: '5px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      background: 'var(--teal-50)',
                      color: 'var(--teal-700)',
                      border: '1px solid var(--teal-100)',
                      borderRadius: 7,
                      cursor: 'pointer',
                    }}
                  >
                    Detail
                  </button>
                  {isExpanded ? <ChevronUp size={16} color="var(--gray-400)" /> : <ChevronDown size={16} color="var(--gray-400)" />}
                </div>
              </div>

              {/* Expanded row */}
              {isExpanded && (
                <div
                  style={{
                    padding: '14px 18px',
                    background: 'var(--gray-50)',
                    borderTop: '1px solid var(--clinical-border)',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 12 }}>
                    <div>
                      <div className="section-label" style={{ marginBottom: 6 }}>Full Treatment</div>
                      <p style={{ fontSize: 12.5, color: 'var(--navy-800)', lineHeight: 1.5 }}>{c.treatmentUsed}</p>
                    </div>
                    <div>
                      <div className="section-label" style={{ marginBottom: 6 }}>Outcome Details</div>
                      <p style={{ fontSize: 12.5, color: 'var(--navy-800)', lineHeight: 1.5 }}>{c.outcomeDetails}</p>
                    </div>
                    <div>
                      <div className="section-label" style={{ marginBottom: 6 }}>Similarity Factors</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {c.similarityFactors.slice(0, 4).map((f) => (
                          <span key={f} style={{ fontSize: 10.5, padding: '2px 7px', background: 'var(--teal-100)', color: 'var(--teal-700)', borderRadius: 5, fontWeight: 600 }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="clinical-disclaimer">
                    Historical context · Requires clinician review · Not a treatment prescription
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall disclaimer */}
      <div
        style={{
          marginTop: 24,
          padding: '14px 18px',
          background: 'var(--status-info-bg)',
          border: '1px solid #BAE6FD',
          borderRadius: 10,
          fontSize: 13,
          color: '#0C4A6E',
          lineHeight: 1.6,
        }}
      >
        <strong>Historical case patterns are contextual evidence and are not individual treatment instructions.</strong>{' '}
        All similar cases are synthetic demonstration data. Treatment selection for any patient must be made by the clinical team after comprehensive evaluation.
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <Link href="/treatment" className="btn-secondary">
          Treatment Intelligence
        </Link>
        <Link href="/evidence" className="btn-secondary">
          View Evidence
        </Link>
        <Link href="/review" className="btn-primary">
          Doctor Review
        </Link>
      </div>

      {/* Detail Modal */}
      {selectedCase && (
        <CaseDetailModal patient={selectedCase} onClose={() => setSelectedCase(null)} />
      )}
    </div>
  );
}
