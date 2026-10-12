// ============================================================
// HAI-SAFE Core Type Definitions
// ============================================================

// Patient Information
export interface PatientDemographics {
  id: string;
  patientId: string;
  name: string;
  age: number;
  sex: 'Female' | 'Male' | 'Other';
  menopausalStatus: 'Premenopausal' | 'Perimenopausal' | 'Postmenopausal' | 'Unknown' | 'N/A';
  dateCreated: string;
  lastUpdated: string;
  isDemo?: boolean;
}

export interface Symptoms {
  presentingComplaint: string;
  duration: string;
  associatedSymptoms: string[];
  otherNotes?: string;
}

export interface MedicalHistory {
  previousConditions: string[];
  previousProcedures: string[];
  medicationHistory: string[];
  relevantRiskFactors: string[];
}

export interface FamilyHistory {
  cancerHistory: string[];
  relevantConditions: string[];
  hereditaryRiskFactors?: string;
}

export interface Diagnostics {
  biopsy?: string;
  histopathology?: string;
  mammography?: string;
  mri?: string;
  ultrasound?: string;
  otherInvestigations?: string;
}

export interface Biomarkers {
  er: 'Positive' | 'Negative' | 'Unknown';
  pr: 'Positive' | 'Negative' | 'Unknown';
  her2: 'Positive' | 'Negative' | 'Equivocal' | 'Unknown';
  ki67?: string;
  otherMarkers?: string;
}

export interface DocumentUpload {
  id: string;
  filename: string;
  type: 'PDF' | 'Image' | 'PathologyReport' | 'ImagingReport' | 'Other';
  uploadedAt: string;
  status: 'Processing' | 'Ready' | 'Demo';
  description?: string;
}

export interface Patient {
  demographics: PatientDemographics;
  symptoms: Symptoms;
  medicalHistory: MedicalHistory;
  familyHistory: FamilyHistory;
  diagnostics: Diagnostics;
  biomarkers: Biomarkers;
  clinicalNotes?: string;
  documents: DocumentUpload[];
  cancerSubtype?: string;
  clinicalStage?: string;
  reviewStatus: ReviewStatus;
}

// Clinical Analysis
export type RiskLevel = 'HIGH' | 'MODERATE' | 'LOW' | 'INFORMATIONAL';

export interface RiskFlag {
  id: string;
  type: 'missing_data' | 'risk_factor' | 'inconsistency' | 'evidence_review' | 'clinical_attention';
  level: RiskLevel;
  title: string;
  description: string;
  clinicalImplication: string;
  actionRequired?: string;
}

export interface ClinicalFinding {
  id: string;
  category: string;
  finding: string;
  whyItMatters: string;
  evidenceBasis?: string;
  confidence: 'High' | 'Moderate' | 'Low';
}

export interface AnalysisStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  durationMs?: number;
}

export interface ClinicalAnalysis {
  id: string;
  patientId: string;
  analysisDate: string;
  analysisStatus: 'pending' | 'running' | 'complete' | 'error';
  clinicalSummary: string;
  keyFindings: ClinicalFinding[];
  riskFlags: RiskFlag[];
  missingInformation: string[];
  relevantClinicalFactors: string[];
  confidenceLevel: number; // 0-100
  uncertaintyNotes: string[];
  evidenceUsed: string[];
  aiModelVersion: string;
  processingSteps: AnalysisStep[];
}

// Similar Patients
export interface SimilarPatient {
  id: string;
  caseId: string;
  age: number;
  sex: 'Female' | 'Male';
  cancerSubtype: string;
  clinicalStage: string;
  biomarkers: {
    er: string;
    pr: string;
    her2: string;
  };
  treatmentUsed: string;
  outcome: 'Complete Response' | 'Partial Response' | 'Stable Disease' | 'Progressive Disease' | 'Recurrence' | 'Ongoing';
  outcomeDetails: string;
  followUpMonths: number;
  similarityScore: number; // 0-100
  similarityFactors: string[];
  keyDifferences: string[];
  year: number;
  institution?: string;
  notes?: string;
}

// Treatment Intelligence
export interface TreatmentOutcome {
  complete: number;
  partial: number;
  stable: number;
  progressive: number;
  recurrence: number;
}

export interface TreatmentPattern {
  id: string;
  name: string;
  category: 'Surgery' | 'Chemotherapy' | 'Radiation' | 'Hormone Therapy' | 'Targeted Therapy' | 'Immunotherapy' | 'Combined';
  description: string;
  casesObserved: number;
  outcomes: TreatmentOutcome;
  medianFollowUpMonths: number;
  typicalTimeline: string;
  evidenceNotes: string;
  relevantEvidenceIds: string[];
  commonSideEffects?: string[];
  contraindications?: string[];
}

// Evidence & Guidelines
export type EvidenceLevel = 'I' | 'II' | 'III' | 'IV' | 'Expert Opinion';

export interface EvidenceSource {
  id: string;
  source: string;
  sourceAbbrev: string;
  title: string;
  evidenceLevel: EvidenceLevel;
  year: number;
  version?: string;
  relevance: 'High' | 'Moderate' | 'Low';
  relevanceReason: string;
  summary: string;
  url?: string;
  doi?: string;
  category: 'Guideline' | 'Research' | 'Meta-Analysis' | 'Registry Data' | 'Clinical Trial';
  clinicalFactorsMatched: string[];
}

// Clinical Report
export interface ClinicalReport {
  id: string;
  patientId: string;
  generatedAt: string;
  reportVersion: string;
  patientSummary: string;
  clinicalContext: string;
  keyFindings: ClinicalFinding[];
  riskFlags: RiskFlag[];
  missingInformation: string[];
  similarPatientEvidence: {
    topCasesCount: number;
    summary: string;
  };
  treatmentPatternEvidence: {
    patternsAnalyzed: number;
    summary: string;
  };
  evidenceGuidelineSummary: string;
  aiReasoning: {
    knowns: string[];
    unknowns: string[];
    confidenceLevel: number;
    uncertaintyNotes: string[];
  };
  clinicalConsiderations: string[];
  disclaimer: string;
  doctorReview?: DoctorReview;
}

// Doctor Review
export type ReviewStatus = 'Pending Review' | 'Under Review' | 'Approved' | 'Edited' | 'Rejected' | 'Needs More Information';
export type DoctorDecision = 'Approved' | 'Edited' | 'Rejected' | 'NeedsMoreInfo';

export interface DoctorReview {
  id: string;
  reportId: string;
  patientId?: string;
  reviewedAt: string;
  reviewedBy: string;
  role: string;
  status: ReviewStatus;
  comment?: string;
  doctorOverride?: string;
}

// Audit Trail
export type AuditEventType =
  | 'patient_created'
  | 'patient_updated'
  | 'analysis_initiated'
  | 'analysis_complete'
  | 'evidence_retrieved'
  | 'similar_cases_retrieved'
  | 'report_generated'
  | 'report_viewed'
  | 'doctor_review'
  | 'doctor_review_initiated'
  | 'doctor_decision_recorded'
  | 'document_uploaded'
  | 'data_accessed'
  | 'system_event';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  patientId?: string;
  actor: string;
  actorType: 'Doctor' | 'System' | 'Analyst' | 'User';
  action: string;
  status: 'Success' | 'Pending' | 'Error';
  timestamp: string;
  details?: string;
}

// Repository interfaces for service layer abstraction
export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  findAll(): Promise<Patient[]>;
  create(patient: Omit<Patient, 'demographics'> & { demographics: Omit<PatientDemographics, 'id' | 'dateCreated' | 'lastUpdated'> }): Promise<Patient>;
  update(id: string, patient: Partial<Patient>): Promise<Patient>;
  search(query: string): Promise<Patient[]>;
}

export interface IClinicalAnalysisRepository {
  findByPatientId(patientId: string): Promise<ClinicalAnalysis | null>;
  create(analysis: Omit<ClinicalAnalysis, 'id' | 'analysisDate'>): Promise<ClinicalAnalysis>;
  update(id: string, analysis: Partial<ClinicalAnalysis>): Promise<ClinicalAnalysis>;
}

export interface ISimilarPatientRepository {
  findSimilarCases(patientId: string, limit?: number): Promise<SimilarPatient[]>;
  findById(id: string): Promise<SimilarPatient | null>;
  getAll(): Promise<SimilarPatient[]>;
}

export interface ITreatmentRepository {
  findPatterns(filters?: { subtype?: string; stage?: string }): Promise<TreatmentPattern[]>;
  findById(id: string): Promise<TreatmentPattern | null>;
}

export interface IEvidenceRepository {
  findForPatient(patientId: string): Promise<EvidenceSource[]>;
  findById(id: string): Promise<EvidenceSource | null>;
  getAll(): Promise<EvidenceSource[]>;
}

export interface IReportRepository {
  findByPatientId(patientId: string): Promise<ClinicalReport | null>;
  create(report: Omit<ClinicalReport, 'id' | 'generatedAt'>): Promise<ClinicalReport>;
  update(id: string, report: Partial<ClinicalReport>): Promise<ClinicalReport>;
}

export interface IReviewRepository {
  findByReportId(reportId: string): Promise<DoctorReview | null>;
  create(review: Omit<DoctorReview, 'id' | 'reviewedAt'>): Promise<DoctorReview>;
  update(id: string, review: Partial<DoctorReview>): Promise<DoctorReview>;
}

export interface IAuditRepository {
  findAll(): Promise<AuditEvent[]>;
  findByPatientId(patientId: string): Promise<AuditEvent[]>;
  create(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent>;
}

// API integration interfaces (for future AI services)
export interface IClinicalAnalysisAPI {
  analyze(patientData: Patient): Promise<ClinicalAnalysis>;
  getStatus(analysisId: string): Promise<{ status: string; progress: number }>;
}

export interface ISimilaritySearchAPI {
  search(patientData: Patient, limit?: number): Promise<SimilarPatient[]>;
}

export interface IEvidenceRetrievalAPI {
  retrieve(clinicalFactors: string[]): Promise<EvidenceSource[]>;
}

export interface IReportGenerationAPI {
  generate(analysisId: string): Promise<ClinicalReport>;
}

// UI State types
export interface AppState {
  currentPatient: Patient | null;
  sidebarOpen: boolean;
  analysisStatus: 'idle' | 'running' | 'complete';
  selectedCaseId: string | null;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}
