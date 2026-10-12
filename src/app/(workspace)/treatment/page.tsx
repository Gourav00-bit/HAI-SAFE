'use client';

import { useState } from 'react';
import { TREATMENT_PATTERNS, EVIDENCE_SOURCES } from '@/data/mockData';
import { TreatmentPattern } from '@/types';
import {
  Pill, ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle, BookOpen
} from 'lucide-react';
import Link from 'next/link';

function OutcomeBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--gray-600)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>
          {count} case{count !== 1 ? 's' : ''} ({pct}%)
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 3,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

function TreatmentCard({ pattern }: { pattern: TreatmentPattern }) {
  const [expanded, setExpanded] = useState(false);
  const totalCases = Object.values(pattern.outcomes).reduce((a, b) => a + b, 0);

  const categoryColors: Record<string, string> = {
    Surgery: '#059669',
    Chemotherapy: '#DC2626',
    Radiation: '#D97706',
    'Hormone Therapy': '#6366F1',
    'Targeted Therapy': '#0284C7',
    Immunotherapy: '#0EA898',
    Combined: 'var(--navy-700)',
  };
  const catColor = categoryColors[pattern.category] || 'var(--gray-500)';

  return (
    <div className="clinical-card" style={{ overflow: 'hidden' }}>
      <div
        style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 14 }}
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${catColor}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Pill size={18} color={catColor} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 5,
                background: `${catColor}18`,
                color: catColor,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {pattern.category}
            </span>
            <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
              {pattern.casesObserved} similar case{pattern.casesObserved !== 1 ? 's' : ''} observed
            </span>
          </div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--navy-800)',
              lineHeight: 1.4,
              marginBottom: 6,
            }}
          >
            {pattern.name}
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--gray-600)', lineHeight: 1.5 }}>
            {pattern.description}
          </p>
        </div>

        <div style={{ flexShrink: 0 }}>
          {expanded ? <ChevronUp size={16} color="var(--gray-400)" /> : <ChevronDown size={16} color="var(--gray-400)" />}
        </div>
      </div>

      {expanded && (
        <div
          style={{
            padding: '18px 20px',
            borderTop: '1px solid var(--clinical-border)',
            background: 'var(--gray-50)',
          }}
        >
          {/* Outcomes */}
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>
              Observed Outcomes ({totalCases} cases)
            </div>
            <OutcomeBar label="Complete Response" count={pattern.outcomes.complete} total={totalCases} color="#059669" />
            <OutcomeBar label="Partial Response" count={pattern.outcomes.partial} total={totalCases} color="#0284C7" />
            <OutcomeBar label="Stable Disease" count={pattern.outcomes.stable} total={totalCases} color="#6366F1" />
            <OutcomeBar label="Progressive Disease" count={pattern.outcomes.progressive} total={totalCases} color="#D97706" />
            <OutcomeBar label="Recurrence" count={pattern.outcomes.recurrence} total={totalCases} color="#DC2626" />
          </div>

          {/* Timeline */}
          <div
            style={{
              padding: '12px 14px',
              background: 'white',
              borderRadius: 8,
              border: '1px solid var(--clinical-border)',
              marginBottom: 14,
            }}
          >
            <div className="section-label" style={{ marginBottom: 6 }}>Typical Treatment Timeline</div>
            <p style={{ fontSize: 13, color: 'var(--navy-800)', lineHeight: 1.5 }}>{pattern.typicalTimeline}</p>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-500)' }}>
              Median follow-up: {pattern.medianFollowUpMonths} months
            </div>
          </div>

          {/* Evidence Notes */}
          <div
            style={{
              padding: '10px 12px',
              background: 'var(--teal-50)',
              border: '1px solid var(--teal-100)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--teal-700)',
              marginBottom: 14,
              lineHeight: 1.5,
            }}
          >
            <strong>Evidence context:</strong> {pattern.evidenceNotes}
          </div>

          {/* Common side effects */}
          {pattern.commonSideEffects && (
            <div style={{ marginBottom: 14 }}>
              <div className="section-label" style={{ marginBottom: 6 }}>Common Considerations</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {pattern.commonSideEffects.map((se) => (
                  <span
                    key={se}
                    style={{
                      padding: '3px 9px',
                      background: 'var(--gray-100)',
                      borderRadius: 6,
                      fontSize: 11.5,
                      color: 'var(--gray-700)',
                    }}
                  >
                    {se}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="clinical-disclaimer">
            Historical case patterns are contextual evidence and are not individual treatment instructions. Treatment selection requires oncology MDT review.
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Link href="/evidence" className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
              <BookOpen size={13} />
              View Evidence
            </Link>
            <Link href="/similar-cases" className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
              Compare Cases
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TreatmentPage() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 4, letterSpacing: '-0.01em' }}>
          Treatment Intelligence
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--gray-500)', maxWidth: 600 }}>
          Treatment approaches observed across historically similar cases. Patterns are contextual
          evidence — not individual treatment instructions.
        </p>
      </div>

      {/* Summary row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Patterns Analyzed', value: TREATMENT_PATTERNS.length, color: 'var(--navy-700)' },
          { label: 'Cases in Dataset', value: TREATMENT_PATTERNS.reduce((a, b) => a + b.casesObserved, 0), color: 'var(--teal-600)' },
          { label: 'Complete Responses', value: TREATMENT_PATTERNS.reduce((a, b) => a + b.outcomes.complete, 0), color: '#059669' },
          { label: 'Evidence Sources', value: EVIDENCE_SOURCES.filter((e) => e.relevance === 'High').length, color: 'var(--violet-600)' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="clinical-card"
            style={{ padding: '14px 16px', textAlign: 'center' }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--gray-500)', marginTop: 4, fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Important disclaimer */}
      <div
        style={{
          padding: '14px 16px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 10,
          marginBottom: 22,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          fontSize: 13,
          color: '#78350F',
          lineHeight: 1.6,
        }}
      >
        <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} color="#D97706" />
        <div>
          <strong>Important:</strong> HAI-SAFE displays historical treatment patterns as clinical
          context. This is NOT a prescribing interface. Treatment decisions must be made by the
          qualified clinical team after comprehensive patient evaluation and MDT discussion.
        </div>
      </div>

      {/* Treatment patterns */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TREATMENT_PATTERNS.map((pattern) => (
          <TreatmentCard key={pattern.id} pattern={pattern} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
        <Link href="/similar-cases" className="btn-secondary">
          Similar Patient Intelligence
        </Link>
        <Link href="/evidence" className="btn-secondary">
          Evidence & Guidelines
        </Link>
        <Link href="/reports" className="btn-primary">
          View Clinical Report
        </Link>
      </div>
    </div>
  );
}
