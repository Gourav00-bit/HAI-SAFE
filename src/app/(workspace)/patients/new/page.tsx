'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  User, Stethoscope, History, Users, Beaker, Upload, FileText,
  ChevronLeft, ChevronRight, Save, Activity, Plus, X, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { Patient, Biomarkers } from '@/types';
import { patientRepository, logAuditEvent } from '@/services/repositories';

const sections = [
  { id: 'demographics', label: 'Patient Info', icon: User },
  { id: 'symptoms', label: 'Symptoms', icon: Stethoscope },
  { id: 'history', label: 'Medical History', icon: History },
  { id: 'family', label: 'Family History', icon: Users },
  { id: 'diagnostics', label: 'Diagnostics', icon: Beaker },
  { id: 'biomarkers', label: 'Biomarkers', icon: Activity },
  { id: 'documents', label: 'Documents', icon: Upload },
];

interface FormData {
  name: string;
  patientId: string;
  age: string;
  sex: 'Female' | 'Male' | 'Other';
  menopausalStatus: 'Premenopausal' | 'Perimenopausal' | 'Postmenopausal' | 'Unknown' | 'N/A';
  presentingComplaint: string;
  duration: string;
  associatedSymptoms: string;
  previousConditions: string;
  previousProcedures: string;
  medicationHistory: string;
  relevantRiskFactors: string;
  cancerHistory: string;
  relevantConditions: string;
  hereditaryRiskFactors: string;
  biopsy: string;
  histopathology: string;
  mammography: string;
  mri: string;
  ultrasound: string;
  otherInvestigations: string;
  er: 'Positive' | 'Negative' | 'Unknown';
  pr: 'Positive' | 'Negative' | 'Unknown';
  her2: 'Positive' | 'Negative' | 'Equivocal' | 'Unknown';
  ki67: string;
  otherMarkers: string;
  clinicalNotes: string;
}

const initialForm: FormData = {
  name: '',
  patientId: '',
  age: '',
  sex: 'Female',
  menopausalStatus: 'Unknown',
  presentingComplaint: '',
  duration: '',
  associatedSymptoms: '',
  previousConditions: '',
  previousProcedures: '',
  medicationHistory: '',
  relevantRiskFactors: '',
  cancerHistory: '',
  relevantConditions: '',
  hereditaryRiskFactors: '',
  biopsy: '',
  histopathology: '',
  mammography: '',
  mri: '',
  ultrasound: '',
  otherInvestigations: '',
  er: 'Unknown',
  pr: 'Unknown',
  her2: 'Unknown',
  ki67: '',
  otherMarkers: '',
  clinicalNotes: '',
};

const demoUploadFiles = [
  { name: 'Mammography_Report.pdf', type: 'ImagingReport' as const, size: '1.2 MB' },
  { name: 'Biopsy_Pathology.pdf', type: 'PathologyReport' as const, size: '0.8 MB' },
];

export default function NewPatientPage() {
  const router = useRouter();
  const { setCurrentPatient, addNotification } = useApp();
  const [currentSection, setCurrentSection] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; size: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Patient name is required';
    if (!form.age.trim() || isNaN(Number(form.age))) newErrors.age = 'Valid age is required';
    if (!form.presentingComplaint.trim()) newErrors.presentingComplaint = 'Presenting complaint is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    addNotification({ type: 'success', message: 'Patient draft saved successfully.' });
    setIsSaving(false);
  };

  const handleAnalyze = async () => {
    if (!validate()) {
      setCurrentSection(0);
      return;
    }
    setIsAnalyzing(true);
    const newPatient = await patientRepository.create({
      demographics: {
        patientId: form.patientId || `HAI-${Date.now()}`,
        name: form.name,
        age: Number(form.age),
        sex: form.sex,
        menopausalStatus: form.menopausalStatus,
      },
      symptoms: {
        presentingComplaint: form.presentingComplaint,
        duration: form.duration,
        associatedSymptoms: form.associatedSymptoms.split(',').map((s) => s.trim()).filter(Boolean),
      },
      medicalHistory: {
        previousConditions: form.previousConditions.split('\n').filter(Boolean),
        previousProcedures: form.previousProcedures.split('\n').filter(Boolean),
        medicationHistory: form.medicationHistory.split('\n').filter(Boolean),
        relevantRiskFactors: form.relevantRiskFactors.split('\n').filter(Boolean),
      },
      familyHistory: {
        cancerHistory: form.cancerHistory.split('\n').filter(Boolean),
        relevantConditions: form.relevantConditions.split('\n').filter(Boolean),
        hereditaryRiskFactors: form.hereditaryRiskFactors,
      },
      diagnostics: {
        biopsy: form.biopsy,
        histopathology: form.histopathology,
        mammography: form.mammography,
        mri: form.mri,
        ultrasound: form.ultrasound,
        otherInvestigations: form.otherInvestigations,
      },
      biomarkers: {
        er: form.er,
        pr: form.pr,
        her2: form.her2,
        ki67: form.ki67,
        otherMarkers: form.otherMarkers,
      },
      clinicalNotes: form.clinicalNotes,
      documents: uploadedFiles.map((f, i) => ({
        id: `doc-new-${i}`,
        filename: f.name,
        type: (f.type as 'PDF' | 'Image' | 'PathologyReport' | 'ImagingReport' | 'Other') || 'Other',
        uploadedAt: new Date().toISOString(),
        status: 'Demo' as const,
        description: f.name,
      })),
      reviewStatus: 'Pending Review',
    });
    await logAuditEvent({
      eventType: 'patient_created',
      patientId: newPatient.demographics.id,
      actor: 'Dr. Priya Anand',
      actorType: 'Doctor',
      action: `Patient record created — ${newPatient.demographics.patientId} (${newPatient.demographics.name})`,
      status: 'Success',
    });
    setCurrentPatient(newPatient);
    addNotification({ type: 'success', message: `Patient ${form.name} created. Starting analysis...` });
    setIsAnalyzing(false);
    router.push('/analysis');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map((f) => ({
      name: f.name,
      type: 'PDF' as const,
      size: `${(f.size / 1024).toFixed(0)} KB`,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    addNotification({ type: 'success', message: `${files.length} file(s) added as demo records.` });
  };

  const section = sections[currentSection];
  const Icon = section.icon;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link
          href="/patients"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-500)', textDecoration: 'none' }}
        >
          <ChevronLeft size={16} />
          Patients
        </Link>
        <ChevronRight size={14} color="var(--gray-400)" />
        <span style={{ fontSize: 13, color: 'var(--navy-800)', fontWeight: 600 }}>New Patient</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Section Nav */}
        <div className="clinical-card" style={{ padding: '16px 12px', position: 'sticky', top: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>
            Sections
          </div>
          {sections.map((s, i) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentSection(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: currentSection === i ? 'var(--teal-50)' : 'transparent',
                  color: currentSection === i ? 'var(--teal-700)' : 'var(--gray-600)',
                  fontSize: 13,
                  fontWeight: currentSection === i ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.12s ease',
                }}
              >
                <SIcon size={14} />
                {s.label}
              </button>
            );
          })}

          <div style={{ padding: '12px 8px 0', borderTop: '1px solid var(--clinical-border)', marginTop: 12 }}>
            <button
              onClick={handleSaveDraft}
              className="btn-secondary"
              style={{ width: '100%', fontSize: 12, padding: '8px 12px', justifyContent: 'center' }}
              disabled={isSaving}
            >
              <Save size={13} />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>

        {/* Form Panel */}
        <div className="clinical-card" style={{ padding: '24px 28px' }}>
          <div className="form-section-heading">
            <Icon size={17} color="var(--teal-600)" />
            {section.label}
          </div>

          {/* Demographics */}
          {currentSection === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label" htmlFor="name">
                    Patient Name *
                  </label>
                  <input
                    id="name"
                    className={`clinical-input ${errors.name ? 'border-red-400' : ''}`}
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                  {errors.name && <p style={{ fontSize: 11.5, color: 'var(--status-error)', marginTop: 4 }}>{errors.name}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="patientId">
                    Patient ID
                  </label>
                  <input
                    id="patientId"
                    className="clinical-input"
                    placeholder="Auto-generated if blank"
                    value={form.patientId}
                    onChange={(e) => update('patientId', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="age">Age (years) *</label>
                  <input
                    id="age"
                    type="number"
                    className="clinical-input"
                    placeholder="e.g. 52"
                    value={form.age}
                    onChange={(e) => update('age', e.target.value)}
                    min={1}
                    max={120}
                  />
                  {errors.age && <p style={{ fontSize: 11.5, color: 'var(--status-error)', marginTop: 4 }}>{errors.age}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="sex">Sex *</label>
                  <select
                    id="sex"
                    className="clinical-select"
                    value={form.sex}
                    onChange={(e) => update('sex', e.target.value)}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="menopausalStatus">Menopausal Status</label>
                  <select
                    id="menopausalStatus"
                    className="clinical-select"
                    value={form.menopausalStatus}
                    onChange={(e) => update('menopausalStatus', e.target.value)}
                  >
                    <option value="Premenopausal">Premenopausal</option>
                    <option value="Perimenopausal">Perimenopausal</option>
                    <option value="Postmenopausal">Postmenopausal</option>
                    <option value="Unknown">Unknown</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Symptoms */}
          {currentSection === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label" htmlFor="presentingComplaint">Presenting Complaint *</label>
                <textarea
                  id="presentingComplaint"
                  className="clinical-textarea"
                  placeholder="Describe the primary reason for consultation..."
                  value={form.presentingComplaint}
                  onChange={(e) => update('presentingComplaint', e.target.value)}
                />
                {errors.presentingComplaint && (
                  <p style={{ fontSize: 11.5, color: 'var(--status-error)', marginTop: 4 }}>{errors.presentingComplaint}</p>
                )}
              </div>
              <div>
                <label className="form-label" htmlFor="duration">Duration</label>
                <input
                  id="duration"
                  className="clinical-input"
                  placeholder="e.g. 3 weeks"
                  value={form.duration}
                  onChange={(e) => update('duration', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="associatedSymptoms">Associated Symptoms</label>
                <textarea
                  id="associatedSymptoms"
                  className="clinical-textarea"
                  placeholder="List symptoms separated by commas (e.g. nipple retraction, skin dimpling)..."
                  value={form.associatedSymptoms}
                  onChange={(e) => update('associatedSymptoms', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Medical History */}
          {currentSection === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { field: 'previousConditions' as keyof FormData, label: 'Previous Conditions', placeholder: 'One per line (e.g. Type 2 Diabetes)' },
                { field: 'previousProcedures' as keyof FormData, label: 'Previous Procedures', placeholder: 'One per line' },
                { field: 'medicationHistory' as keyof FormData, label: 'Medication History', placeholder: 'One per line' },
                { field: 'relevantRiskFactors' as keyof FormData, label: 'Relevant Risk Factors', placeholder: 'One per line (e.g. Nulliparous, Late menopause)' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="form-label" htmlFor={field}>{label}</label>
                  <textarea
                    id={field}
                    className="clinical-textarea"
                    placeholder={placeholder}
                    value={form[field] as string}
                    onChange={(e) => update(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Family History */}
          {currentSection === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label" htmlFor="cancerHistory">Cancer History in Family</label>
                <textarea
                  id="cancerHistory"
                  className="clinical-textarea"
                  placeholder="One per line (e.g. Mother: Breast cancer at 58)"
                  value={form.cancerHistory}
                  onChange={(e) => update('cancerHistory', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="relevantConditions">Other Relevant Family Conditions</label>
                <textarea
                  id="relevantConditions"
                  className="clinical-textarea"
                  placeholder="One per line"
                  value={form.relevantConditions}
                  onChange={(e) => update('relevantConditions', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="hereditaryRiskFactors">Hereditary Risk Assessment Notes</label>
                <textarea
                  id="hereditaryRiskFactors"
                  className="clinical-textarea"
                  placeholder="Any known hereditary syndromes, BRCA status, genetic testing history..."
                  value={form.hereditaryRiskFactors}
                  onChange={(e) => update('hereditaryRiskFactors', e.target.value)}
                  style={{ minHeight: 100 }}
                />
              </div>
            </div>
          )}

          {/* Diagnostics */}
          {currentSection === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { field: 'biopsy' as keyof FormData, label: 'Biopsy', placeholder: 'Biopsy type and findings...' },
                { field: 'histopathology' as keyof FormData, label: 'Histopathology', placeholder: 'Histopathology findings...' },
                { field: 'mammography' as keyof FormData, label: 'Mammography', placeholder: 'BI-RADS category and findings...' },
                { field: 'mri' as keyof FormData, label: 'MRI', placeholder: 'MRI findings...' },
                { field: 'ultrasound' as keyof FormData, label: 'Ultrasound', placeholder: 'Ultrasound findings...' },
                { field: 'otherInvestigations' as keyof FormData, label: 'Other Investigations', placeholder: 'CBC, LFT, chest X-ray, bone scan...' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="form-label" htmlFor={field}>{label}</label>
                  <textarea
                    id={field}
                    className="clinical-textarea"
                    placeholder={placeholder}
                    value={form[field] as string}
                    onChange={(e) => update(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Biomarkers */}
          {currentSection === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[
                  { field: 'er' as keyof FormData, label: 'ER Status', options: ['Positive', 'Negative', 'Unknown'] },
                  { field: 'pr' as keyof FormData, label: 'PR Status', options: ['Positive', 'Negative', 'Unknown'] },
                  { field: 'her2' as keyof FormData, label: 'HER2 Status', options: ['Positive', 'Negative', 'Equivocal', 'Unknown'] },
                ].map(({ field, label, options }) => (
                  <div key={field}>
                    <label className="form-label" htmlFor={field}>{label}</label>
                    <select
                      id={field}
                      className="clinical-select"
                      value={form[field] as string}
                      onChange={(e) => update(field, e.target.value)}
                    >
                      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="form-label" htmlFor="ki67">Ki67 (%)</label>
                <input
                  id="ki67"
                  className="clinical-input"
                  placeholder="e.g. 18%"
                  value={form.ki67}
                  onChange={(e) => update('ki67', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="otherMarkers">Other Biomarkers</label>
                <textarea
                  id="otherMarkers"
                  className="clinical-textarea"
                  placeholder="p53, BRCA status, etc."
                  value={form.otherMarkers}
                  onChange={(e) => update('otherMarkers', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="clinicalNotes">Clinical Notes</label>
                <textarea
                  id="clinicalNotes"
                  className="clinical-textarea"
                  style={{ minHeight: 100 }}
                  placeholder="Additional clinician observations and notes..."
                  value={form.clinicalNotes}
                  onChange={(e) => update('clinicalNotes', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Documents */}
          {currentSection === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Upload Zone */}
              <div
                className="upload-zone"
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                style={{ borderColor: isDragOver ? 'var(--teal-400)' : undefined }}
                onClick={() => {
                  setUploadedFiles((prev) => [...prev, ...demoUploadFiles.slice(0, 1)]);
                  addNotification({ type: 'info', message: 'Demo file added as upload record.' });
                }}
              >
                <Upload size={32} color="var(--gray-400)" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy-700)', marginBottom: 6 }}>
                  Drop files here or click to upload
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                  PDF · Images · Pathology reports · Imaging reports
                </div>
                <div className="badge-demo" style={{ margin: '10px auto 0', display: 'inline-flex' }}>
                  Demo: Files are stored as records only
                </div>
              </div>

              {/* File list */}
              {uploadedFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="section-label">Uploaded Documents</div>
                  {uploadedFiles.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'var(--gray-50)',
                        borderRadius: 8,
                        border: '1px solid var(--clinical-border)',
                      }}
                    >
                      <FileText size={16} color="var(--teal-600)" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{f.type} · {f.size}</div>
                      </div>
                      <button
                        onClick={() => setUploadedFiles((prev) => prev.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                        aria-label="Remove file"
                      >
                        <X size={14} color="var(--gray-400)" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid var(--clinical-border)',
            }}
          >
            <button
              onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
              className="btn-secondary"
              disabled={currentSection === 0}
              style={{ opacity: currentSection === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
              {currentSection + 1} / {sections.length}
            </span>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={() => setCurrentSection((prev) => Math.min(sections.length - 1, prev + 1))}
                className="btn-primary"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleAnalyze}
                className="btn-primary"
                disabled={isAnalyzing}
                style={{ opacity: isAnalyzing ? 0.8 : 1 }}
              >
                <Activity size={16} />
                {isAnalyzing ? 'Creating Patient...' : 'Analyze Clinical Case'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
