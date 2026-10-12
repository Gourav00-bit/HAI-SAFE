'use client';

import React, { useState } from 'react';
import { EVIDENCE_SOURCES } from '@/data/mockData';
import { EvidenceSource } from '@/types';
import {
  BookOpen, ExternalLink, ChevronDown, ChevronUp, Filter, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

type RelevanceFilter = 'all' | 'High' | 'Moderate' | 'Low';
type CategoryFilter = 'all' | string;

const EVIDENCE_LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  I: { bg: '#ECFDF5', text: '#065F46' },
  II: { bg: '#F0F9FF', text: '#0C4A6E' },
  III: { bg: '#FFFBEB', text: '#78350F' },
  IV: { bg: '#FEF2F2', text: '#991B1B' },
  'Expert Opinion': { bg: '#F5F3FF', text: '#3730A3' },
};

const RELEVANCE_COLORS: Record<string, { dot: string; badge: string; text: string }> = {
  High: { dot: '#059669', badge: '#ECFDF5', text: '#065F46' },
  Moderate: { dot: '#0284C7', badge: '#F0F9FF', text: '#0C4A6E' },
  Low: { dot: '#6B7280', badge: '#F8FAFC', text: '#374151' },
};

function EvidenceCard({ source }: { source: EvidenceSource }) {
  const [expanded, setExpanded] = useState(false);
  const levelColors = EVIDENCE_LEVEL_COLORS[source.evidenceLevel] || EVIDENCE_LEVEL_COLORS.IV;
  const relevanceColors = RELEVANCE_COLORS[source.relevance] || RELEVANCE_COLORS.Low;

  return (
    <div className="evidence-card" style={{ flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
      <div
        style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 14 }}
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      >
        {/* Source abbrev badge */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: 'var(--navy-900)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 9,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '0.04em',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {source.sourceAbbrev.split('-')[0]}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
            {/* Evidence level */}
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 5,
                fontSize: 10.5,
                fontWeight: 700,
                background: levelColors.bg,
                color: levelColors.text,
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}
            >
              Level {source.evidenceLevel}
            </span>
            {/* Relevance */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 5,
                fontSize: 10.5,
                fontWeight: 700,
                background: relevanceColors.badge,
                color: relevanceColors.text,
                flexShrink: 0,
              }}
            >
              <span
                style={{ width: 6, height: 6, borderRadius: '50%', background: relevanceColors.dot }}
              />
              {source.relevance} Relevance
            </span>
            {/* Category */}
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 5,
                fontSize: 10.5,
                fontWeight: 600,
                background: 'var(--gray-100)',
                color: 'var(--gray-600)',
                flexShrink: 0,
              }}
            >
              {source.category}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: 'var(--navy-800)',
              lineHeight: 1.4,
              marginBottom: 4,
            }}
          >
            {source.title}
          </h3>

          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
            {source.source} · {source.year}
            {source.version && ` · ${source.version}`}
          </div>
        </div>

        {expanded ? <ChevronUp size={16} color="var(--gray-400)" style={{ flexShrink: 0, marginTop: 4 }} /> : <ChevronDown size={16} color="var(--gray-400)" style={{ flexShrink: 0, marginTop: 4 }} />}
      </div>

      {expanded && (
        <div
          style={{
            padding: '16px 18px',
            borderTop: '1px solid var(--clinical-border)',
            background: 'var(--gray-50)',
          }}
        >
          {/* Relevance reason */}
          <div
            style={{
              padding: '10px 12px',
              background: relevanceColors.badge,
              border: `1px solid ${relevanceColors.dot}30`,
              borderRadius: 8,
              fontSize: 13,
              color: relevanceColors.text,
              lineHeight: 1.5,
              marginBottom: 14,
            }}
          >
            <strong>Relevance to current case:</strong> {source.relevanceReason}
          </div>

          {/* Summary */}
          <div style={{ marginBottom: 14 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Evidence Summary</div>
            <p style={{ fontSize: 13, color: 'var(--navy-800)', lineHeight: 1.7 }}>{source.summary}</p>
          </div>

          {/* Clinical factors matched */}
          <div style={{ marginBottom: 14 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Clinical Factors Matched</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {source.clinicalFactorsMatched.map((f) => (
                <span key={f} className="badge-evidence">{f}</span>
              ))}
            </div>
          </div>

          {/* Link */}
          {(source.url || source.doi) && (
            <a
              href={source.url || `https://doi.org/${source.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                color: 'var(--teal-600)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={12} />
              View Source
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function EvidencePage() {
  const [relevanceFilter, setRelevanceFilter] = useState<RelevanceFilter>('all');

  const filtered = EVIDENCE_SOURCES.filter((ev) =>
    relevanceFilter === 'all' ? true : ev.relevance === relevanceFilter
  ).sort((a, b) => {
    const order: Record<string, number> = { High: 0, Moderate: 1, Low: 2 };
    return (order[a.relevance] ?? 2) - (order[b.relevance] ?? 2);
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 4, letterSpacing: '-0.01em' }}>
          Evidence & Guidelines
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--gray-500)', maxWidth: 600 }}>
          Trusted clinical evidence and guidelines relevant to the current case.
          Evidence is matched to clinical factors — not reproduced in full.
        </p>
      </div>

      {/* Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12,
          marginBottom: 22,
        }}
      >
        {[
          { label: 'Total Sources', value: EVIDENCE_SOURCES.length, color: 'var(--navy-700)' },
          { label: 'High Relevance', value: EVIDENCE_SOURCES.filter((e) => e.relevance === 'High').length, color: '#059669' },
          { label: 'Level I Evidence', value: EVIDENCE_SOURCES.filter((e) => e.evidenceLevel === 'I').length, color: 'var(--teal-600)' },
          { label: 'Guidelines', value: EVIDENCE_SOURCES.filter((e) => e.category === 'Guideline').length, color: 'var(--violet-600)' },
        ].map((stat) => (
          <div key={stat.label} className="clinical-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--gray-500)', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sources used */}
      <div
        style={{
          padding: '10px 14px',
          background: 'var(--gray-50)',
          border: '1px solid var(--clinical-border)',
          borderRadius: 8,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          fontSize: 12,
          color: 'var(--gray-600)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-400)' }}>
          Sources:
        </span>
        {EVIDENCE_SOURCES.map((ev, i) => (
          <React.Fragment key={ev.id}>
            {i > 0 && <span style={{ color: 'var(--gray-300)' }}>·</span>}
            <span style={{ fontWeight: 600, color: 'var(--navy-700)' }}>
              {ev.sourceAbbrev}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div className="tab-nav">
          {(['all', 'High', 'Moderate', 'Low'] as const).map((f) => (
            <button
              key={f}
              className={`tab-item ${relevanceFilter === f ? 'active' : ''}`}
              onClick={() => setRelevanceFilter(f)}
            >
              {f === 'all' ? 'All Sources' : `${f} Relevance`}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
          {filtered.length} source{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Evidence cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((ev) => (
          <EvidenceCard key={ev.id} source={ev} />
        ))}
      </div>

      {/* Disclaimer */}
      <div
        style={{
          marginTop: 24,
          padding: '14px 16px',
          background: 'var(--status-info-bg)',
          border: '1px solid #BAE6FD',
          borderRadius: 10,
          fontSize: 13,
          color: '#0C4A6E',
          lineHeight: 1.6,
        }}
      >
        Evidence summaries are brief references to support clinical context. Full guideline texts should be consulted for clinical decisions. HAI-SAFE does not reproduce copyrighted guideline content.
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <Link href="/reports" className="btn-primary">
          View Clinical Report
        </Link>
        <Link href="/review" className="btn-secondary">
          Doctor Review
        </Link>
      </div>
    </div>
  );
}
