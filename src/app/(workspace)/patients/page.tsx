'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DEMO_PATIENT } from '@/data/mockData';
import {
  User, FileText, History, Users, Beaker, Upload, Plus, ChevronRight,
  CheckCircle, AlertCircle, Clock, Search, Activity
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Patient } from '@/types';

function PatientCard({ patient, isSelected }: { patient: Patient; isSelected: boolean }) {
  const { setCurrentPatient } = useApp();
  return (
    <div
      onClick={() => setCurrentPatient(patient)}
      style={{
        padding: '14px 16px',
        border: `2px solid ${isSelected ? 'var(--teal-500)' : 'var(--clinical-border)'}`,
        borderRadius: 10,
        cursor: 'pointer',
        background: isSelected ? 'var(--teal-50)' : 'white',
        transition: 'all 0.12s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: isSelected
            ? 'linear-gradient(135deg, var(--teal-500), var(--teal-600))'
            : 'linear-gradient(135deg, #6366F1, #4F46E5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 800,
          color: 'white',
          flexShrink: 0,
        }}
      >
        {patient.demographics.name.charAt(0)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-900)' }}>
            {patient.demographics.name}
          </span>
          {patient.demographics.isDemo && <span className="badge-demo">Demo</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
          {patient.demographics.age}y · {patient.demographics.sex} ·{' '}
          {patient.demographics.menopausalStatus} · ID: {patient.demographics.patientId}
        </div>
        {patient.cancerSubtype && (
          <div style={{ fontSize: 11.5, color: 'var(--violet-600)', fontWeight: 600, marginTop: 4 }}>
            {patient.cancerSubtype}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 6,
            background:
              patient.reviewStatus === 'Pending Review'
                ? '#FFFBEB'
                : patient.reviewStatus === 'Approved'
                ? '#ECFDF5'
                : '#F0F9FF',
            color:
              patient.reviewStatus === 'Pending Review'
                ? '#78350F'
                : patient.reviewStatus === 'Approved'
                ? '#065F46'
                : '#0C4A6E',
          }}
        >
          {patient.reviewStatus}
        </div>
        <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>
          {formatDate(patient.demographics.lastUpdated)}
        </div>
      </div>
      {isSelected && (
        <CheckCircle size={18} color="var(--teal-600)" style={{ flexShrink: 0 }} />
      )}
    </div>
  );
}

export default function PatientsPage() {
  const { currentPatient, setCurrentPatient } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients] = useState<Patient[]>([DEMO_PATIENT]);

  const filtered = patients.filter(
    (p) =>
      p.demographics.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.demographics.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
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
            Patients
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--gray-500)' }}>
            {patients.length} patient record{patients.length !== 1 ? 's' : ''} · Breast Cancer Module
          </p>
        </div>
        <Link href="/patients/new" className="btn-primary">
          <Plus size={16} />
          New Patient
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Patient List */}
        <div className="clinical-card" style={{ padding: '20px' }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search
              size={14}
              color="var(--gray-400)"
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="clinical-input"
              style={{ paddingLeft: 32 }}
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search patients"
            />
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--gray-400)' }}>
                No patients found.
              </div>
            ) : (
              filtered.map((p) => (
                <PatientCard
                  key={p.demographics.id}
                  patient={p}
                  isSelected={currentPatient?.demographics.id === p.demographics.id}
                />
              ))
            )}
          </div>

          <div
            className="clinical-disclaimer"
            style={{ marginTop: 16 }}
          >
            All records displayed are synthetic demo data only. Not real patients.
          </div>
        </div>

        {/* Patient Detail */}
        {currentPatient ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header card */}
            <div className="clinical-card" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 13,
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                    color: 'white',
                  }}
                >
                  {currentPatient.demographics.name.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.01em' }}>
                      {currentPatient.demographics.name}
                    </span>
                    <span className="badge-demo">Synthetic Demo</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--gray-500)', marginTop: 3 }}>
                    ID: {currentPatient.demographics.patientId} · Created{' '}
                    {formatDate(currentPatient.demographics.dateCreated)}
                  </div>
                </div>
              </div>

              {/* Quick info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Age', value: `${currentPatient.demographics.age} years` },
                  { label: 'Sex', value: currentPatient.demographics.sex },
                  { label: 'Status', value: currentPatient.demographics.menopausalStatus },
                  { label: 'ER Status', value: currentPatient.biomarkers.er },
                  { label: 'PR Status', value: currentPatient.biomarkers.pr },
                  { label: 'HER2', value: currentPatient.biomarkers.her2 },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '9px 11px',
                      background: 'var(--gray-50)',
                      borderRadius: 8,
                      border: '1px solid var(--clinical-border-light)',
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--navy-800)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Symptoms */}
              <div style={{ marginBottom: 14 }}>
                <div className="section-label" style={{ marginBottom: 6 }}>Presenting Complaint</div>
                <p style={{ fontSize: 13, color: 'var(--navy-800)', lineHeight: 1.5 }}>
                  {currentPatient.symptoms.presentingComplaint}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/analysis" className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>
                  <Activity size={14} />
                  View Analysis
                </Link>
                <Link href="/workspace" className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
                  Clinical Workspace
                </Link>
                <Link href="/reports" className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
                  <FileText size={14} />
                  Reports
                </Link>
              </div>
            </div>

            {/* Documents */}
            <div className="clinical-card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 12 }}>
                Documents ({currentPatient.documents.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {currentPatient.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      background: 'var(--gray-50)',
                      borderRadius: 8,
                      border: '1px solid var(--clinical-border-light)',
                    }}
                  >
                    <FileText size={15} color="var(--teal-600)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.filename}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{doc.description}</div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 5,
                        background: doc.status === 'Demo' ? '#FEF3C7' : '#ECFDF5',
                        color: doc.status === 'Demo' ? '#92400E' : '#065F46',
                        flexShrink: 0,
                      }}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Family History */}
            <div className="clinical-card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 12 }}>
                Family History
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentPatient.familyHistory.cancerHistory.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--navy-800)' }}>
                    <AlertCircle size={13} color="var(--status-warning)" style={{ marginTop: 2, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
              {currentPatient.familyHistory.hereditaryRiskFactors && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '10px 12px',
                    background: 'var(--status-warning-bg)',
                    border: '1px solid #FDE68A',
                    borderRadius: 8,
                    fontSize: 12.5,
                    color: '#78350F',
                    lineHeight: 1.5,
                  }}
                >
                  {currentPatient.familyHistory.hereditaryRiskFactors}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="clinical-card"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: 'var(--gray-400)',
            }}
          >
            <User size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>Select a patient to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
