'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DEMO_REPORT, DEMO_ANALYSIS } from '@/data/mockData';
import {
  Shield, CheckCircle, X, Edit3, Clock, AlertTriangle,
  AlertCircle, MessageSquare, User, Activity
} from 'lucide-react';
import Link from 'next/link';
import { DoctorReview, ReviewStatus } from '@/types';
import { reviewRepository, logAuditEvent } from '@/services/repositories';
import { generateId } from '@/lib/utils';

const REVIEW_OPTIONS: { value: ReviewStatus; label: string; color: string; icon: React.ElementType }[] = [
  { value: 'Approved', label: 'Approve Analysis', color: '#059669', icon: CheckCircle },
  { value: 'Edited', label: 'Approve with Edits', color: '#6366F1', icon: Edit3 },
  { value: 'Needs More Information', label: 'Needs More Information', color: '#D97706', icon: AlertCircle },
  { value: 'Rejected', label: 'Reject / Disagree', color: '#DC2626', icon: X },
];

export default function ReviewPage() {
  const { currentPatient, addNotification } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<ReviewStatus | null>(null);
  const [comment, setComment] = useState('');
  const [doctorOverride, setDoctorOverride] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const report = DEMO_REPORT;

  const handleSubmit = async () => {
    if (!selectedStatus) {
      addNotification({ type: 'warning', message: 'Please select a review decision before submitting.' });
      return;
    }
    setIsSubmitting(true);

    const review: DoctorReview = {
      id: generateId('review'),
      reportId: report.id,
      patientId: report.patientId,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'Dr. Priya Anand',
      role: 'Medical Oncologist',
      status: selectedStatus,
      comment,
      doctorOverride: doctorOverride || undefined,
    };

    await reviewRepository.create({
      reportId: review.reportId,
      patientId: review.patientId,
      reviewedBy: review.reviewedBy,
      role: review.role,
      status: review.status,
      comment: review.comment,
      doctorOverride: review.doctorOverride,
    });

    await logAuditEvent({
      eventType: 'doctor_review',
      patientId: currentPatient?.demographics.id,
      actor: 'Dr. Priya Anand',
      actorType: 'Doctor',
      action: `Doctor review submitted — Status: ${selectedStatus}`,
      status: 'Success',
    });

    addNotification({
      type: 'success',
      message: `Doctor review submitted: ${selectedStatus}`,
    });

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div
          className="clinical-card"
          style={{
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: selectedStatus === 'Approved' ? '#ECFDF5' : selectedStatus === 'Rejected' ? '#FEF2F2' : '#FFFBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            {selectedStatus === 'Approved' ? (
              <CheckCircle size={36} color="#059669" />
            ) : selectedStatus === 'Rejected' ? (
              <X size={36} color="#DC2626" />
            ) : (
              <AlertCircle size={36} color="#D97706" />
            )}
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8, letterSpacing: '-0.01em' }}>
            Review Submitted
          </h1>
          <p style={{ fontSize: 15, color: 'var(--gray-500)', marginBottom: 8 }}>
            Status: <strong style={{ color: 'var(--navy-800)' }}>{selectedStatus}</strong>
          </p>
          {comment && (
            <div
              style={{
                padding: '14px 16px',
                background: 'var(--gray-50)',
                borderRadius: 10,
                border: '1px solid var(--clinical-border)',
                fontSize: 13.5,
                color: 'var(--navy-800)',
                lineHeight: 1.6,
                marginBottom: 16,
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Doctor Comment
              </div>
              {comment}
            </div>
          )}
          {doctorOverride && (
            <div
              style={{
                padding: '14px 16px',
                background: '#FFF7ED',
                borderRadius: 10,
                border: '1px solid #FED7AA',
                fontSize: 13.5,
                color: '#92400E',
                lineHeight: 1.6,
                marginBottom: 16,
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Doctor Override / Correction
              </div>
              {doctorOverride}
            </div>
          )}

          <div
            style={{
              padding: '12px 16px',
              background: 'var(--status-info-bg)',
              border: '1px solid #BAE6FD',
              borderRadius: 8,
              fontSize: 12.5,
              color: '#0C4A6E',
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            This review has been logged in the audit trail. No changes take effect without clinician action.
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link href="/audit" className="btn-secondary">
              View Audit Trail
            </Link>
            <Link href="/workspace" className="btn-primary">
              Return to Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 4, letterSpacing: '-0.01em' }}>
          Doctor Review
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--gray-500)', maxWidth: 600 }}>
          The doctor reviews the AI-generated clinical analysis and provides the final clinical decision.
          This is a required step before any clinical action.
        </p>
      </div>

      {/* Human-in-the-loop banner */}
      <div
        style={{
          padding: '14px 18px',
          background: 'var(--navy-900)',
          borderRadius: 12,
          marginBottom: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Shield size={22} color="var(--teal-400)" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>
            Human-in-the-Loop Review Required
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            AI ASSISTS. EVIDENCE SUPPORTS. <span style={{ color: 'var(--teal-400)', fontWeight: 700 }}>DOCTOR DECIDES.</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}>
        {/* Left: Report Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 12 }}>
              Report Summary
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--navy-800)', lineHeight: 1.7 }}>
              {report.patientSummary}
            </p>
          </div>

          {/* Key Findings Snapshot */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 12 }}>
              Key Findings Summary ({report.keyFindings.length})
            </div>
            {report.keyFindings.slice(0, 4).map((f, i) => (
              <div key={f.id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--teal-100)',
                    color: 'var(--teal-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: 13, color: 'var(--navy-800)', lineHeight: 1.5 }}>{f.finding}</p>
              </div>
            ))}
          </div>

          {/* Confidence */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 12 }}>
              AI Confidence
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, color: 'var(--gray-600)' }}>Analysis confidence</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#0284C7' }}>{DEMO_ANALYSIS.confidenceLevel}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', width: `${DEMO_ANALYSIS.confidenceLevel}%`, background: 'linear-gradient(90deg, #0284C7, #0EA898)', borderRadius: 4 }} />
            </div>
            <div className="clinical-disclaimer">
              Moderate confidence. Missing information reduces certainty. Doctor judgement is essential.
            </div>
          </div>

          {/* Review Links */}
          <div className="clinical-card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-700)', marginBottom: 10 }}>
              Review Additional Information
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/reports', label: 'Full Clinical Report' },
                { href: '/analysis', label: 'Clinical Analysis Details' },
                { href: '/similar-cases', label: 'Similar Patient Cases' },
                { href: '/evidence', label: 'Evidence & Guidelines' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 13,
                    color: 'var(--teal-600)',
                    textDecoration: 'none',
                    padding: '6px 0',
                    fontWeight: 500,
                    borderBottom: '1px solid var(--clinical-border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {link.label}
                  <span style={{ color: 'var(--gray-400)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Review Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Doctor context */}
          <div className="clinical-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                PA
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-900)' }}>Dr. Priya Anand</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Medical Oncologist</div>
              </div>
              <span className="badge-demo" style={{ marginLeft: 'auto' }}>Demo Reviewer</span>
            </div>
          </div>

          {/* Review Decision */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14 }}>
              Review Decision *
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REVIEW_OPTIONS.map((opt) => {
                const OIcon = opt.icon;
                const isSelected = selectedStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedStatus(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: `2px solid ${isSelected ? opt.color : 'var(--clinical-border)'}`,
                      background: isSelected ? `${opt.color}10` : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s ease',
                    }}
                    aria-pressed={isSelected}
                  >
                    <OIcon size={18} color={isSelected ? opt.color : 'var(--gray-400)'} />
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: isSelected ? opt.color : 'var(--gray-700)',
                      }}
                    >
                      {opt.label}
                    </span>
                    {isSelected && (
                      <CheckCircle size={16} color={opt.color} style={{ marginLeft: 'auto' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <MessageSquare size={15} color="var(--gray-500)" />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)' }}>
                Comment
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--gray-400)' }}>(Optional)</span>
            </div>
            <textarea
              className="clinical-textarea"
              style={{ minHeight: 90 }}
              placeholder="Add clinical observations, reasoning, or notes..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Override */}
          <div className="clinical-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 4 }}>
              Doctor Override / Correction
            </div>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 10, lineHeight: 1.5 }}>
              If any part of the AI analysis is incorrect, document your correction here.
            </p>
            <textarea
              className="clinical-textarea"
              style={{ minHeight: 80 }}
              placeholder="Describe any corrections to the AI analysis..."
              value={doctorOverride}
              onChange={(e) => setDoctorOverride(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={!selectedStatus || isSubmitting}
            style={{
              padding: '14px 20px',
              fontSize: 15,
              fontWeight: 700,
              opacity: !selectedStatus ? 0.5 : 1,
              justifyContent: 'center',
            }}
          >
            <Shield size={18} />
            {isSubmitting ? 'Submitting Review...' : 'Submit Doctor Review'}
          </button>

          <div className="clinical-disclaimer">
            This review is logged in the immutable audit trail. The doctor's decision is final.
          </div>
        </div>
      </div>
    </div>
  );
}
